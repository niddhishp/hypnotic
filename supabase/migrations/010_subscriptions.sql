-- ─── 010: Subscriptions & Billing ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Stripe identifiers
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,

  -- Plan details
  plan                    TEXT NOT NULL DEFAULT 'free'
                            CHECK (plan IN ('free','starter','pro','agency','enterprise')),
  status                  TEXT NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','trialing','past_due','canceled','paused')),

  -- Billing period
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  trial_ends_at           TIMESTAMPTZ,
  canceled_at             TIMESTAMPTZ,

  -- Credits
  generation_credits      INTEGER NOT NULL DEFAULT 50,
  credits_reset_at        TIMESTAMPTZ,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_subscriptions_user_id            ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON public.user_subscriptions(stripe_customer_id);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can see their own subscription
CREATE POLICY "Users see own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can write (Stripe webhook handler)
CREATE POLICY "Service role manages subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create free subscription on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan, status, generation_credits)
  VALUES (NEW.id, 'free', 'active', 50)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_profile_created_subscription
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();


-- Atomic credit deduction function (prevents race conditions)
CREATE OR REPLACE FUNCTION public.deduct_generation_credit(
  p_user_id UUID,
  p_amount  INTEGER DEFAULT 1
)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  SELECT generation_credits INTO v_credits
  FROM public.user_subscriptions
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_credits IS NULL OR v_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE public.user_subscriptions
  SET generation_credits = generation_credits - p_amount
  WHERE user_id = p_user_id;

  RETURN TRUE;
END;
$$;

-- Add credits function (for purchases and monthly resets)
CREATE OR REPLACE FUNCTION public.add_generation_credits(
  p_user_id UUID,
  p_amount  INTEGER
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_new_credits INTEGER;
BEGIN
  UPDATE public.user_subscriptions
  SET generation_credits = generation_credits + p_amount
  WHERE user_id = p_user_id
  RETURNING generation_credits INTO v_new_credits;

  RETURN v_new_credits;
END;
$$;
