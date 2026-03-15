-- ─── 009: +Human Marketplace ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.experts (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID REFERENCES auth.users(id) UNIQUE,
  name                    TEXT NOT NULL,
  title                   TEXT,
  bio                     TEXT,
  avatar_url              TEXT,
  portfolio_urls          TEXT[],
  minimum_budget          NUMERIC DEFAULT 0,
  response_time_hours     INTEGER DEFAULT 24,
  is_available            BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
  total_projects          INTEGER NOT NULL DEFAULT 0,
  average_rating          NUMERIC(3,2) DEFAULT 0,
  stripe_account_id       TEXT,           -- Stripe Connect account for payouts
  stripe_onboarding_done  BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experts_is_available ON public.experts(is_available);
CREATE INDEX idx_experts_average_rating ON public.experts(average_rating DESC);

ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

-- Experts are publicly discoverable by any authenticated user
CREATE POLICY "Experts are publicly discoverable"
  ON public.experts FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Experts can update their own profile"
  ON public.experts FOR UPDATE
  USING (auth.uid() = user_id);


-- Expert skills junction
CREATE TABLE IF NOT EXISTS public.expert_skills (
  expert_id   UUID NOT NULL REFERENCES public.experts(id) ON DELETE CASCADE,
  skill_id    TEXT NOT NULL,
  proficiency INTEGER DEFAULT 3 CHECK (proficiency BETWEEN 1 AND 5),
  PRIMARY KEY (expert_id, skill_id)
);

CREATE INDEX idx_expert_skills_skill_id ON public.expert_skills(skill_id);

ALTER TABLE public.expert_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expert skills publicly readable"
  ON public.expert_skills FOR SELECT
  TO authenticated
  USING (TRUE);


-- Hire requests
CREATE TABLE IF NOT EXISTS public.hire_requests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES auth.users(id),
  expert_id             UUID NOT NULL REFERENCES public.experts(id),
  project_id            UUID REFERENCES public.projects(id),
  module                TEXT CHECK (module IN ('insight','manifest','craft','amplify')),
  task_description      TEXT,
  attached_output_id    UUID,         -- insight_run_id, manifest_run_id, or craft_asset_id
  deliverable           TEXT,
  deadline              TIMESTAMPTZ,
  budget_credits        INTEGER NOT NULL DEFAULT 0,

  -- Stripe payment
  stripe_payment_intent TEXT,
  stripe_transfer_id    TEXT,

  -- Status workflow
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','accepted','in_progress','delivered','completed','disputed','cancelled')),

  -- Delivery
  delivery_notes        TEXT,
  delivery_urls         TEXT[],

  -- Review
  rating                INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text           TEXT,
  reviewed_at           TIMESTAMPTZ,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hire_requests_client_id ON public.hire_requests(client_id);
CREATE INDEX idx_hire_requests_expert_id ON public.hire_requests(expert_id);
CREATE INDEX idx_hire_requests_status    ON public.hire_requests(status);

ALTER TABLE public.hire_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see their hire requests"
  ON public.hire_requests FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients create hire requests"
  ON public.hire_requests FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Experts see requests assigned to them"
  ON public.hire_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.experts WHERE id = hire_requests.expert_id AND user_id = auth.uid())
  );

CREATE POLICY "Both parties can update hire requests"
  ON public.hire_requests FOR UPDATE
  USING (
    auth.uid() = client_id OR
    EXISTS (SELECT 1 FROM public.experts WHERE id = hire_requests.expert_id AND user_id = auth.uid())
  );

CREATE TRIGGER update_hire_requests_updated_at
  BEFORE UPDATE ON public.hire_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
