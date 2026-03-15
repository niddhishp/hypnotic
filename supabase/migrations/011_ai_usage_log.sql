-- ─── 011: AI Usage Log ──────────────────────────────────────────────────────────
-- Every AI call logged for billing, debugging, and admin analytics.

CREATE TABLE IF NOT EXISTS public.ai_usage_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id),
  project_id    UUID REFERENCES public.projects(id),
  module        TEXT CHECK (module IN ('insight','manifest','craft','amplify','chat','workspace')),
  operation     TEXT NOT NULL,         -- e.g. 'insight_research', 'image_generation'
  model_id      TEXT,
  provider      TEXT,

  -- Token usage (text models)
  tokens_in     INTEGER DEFAULT 0,
  tokens_out    INTEGER DEFAULT 0,

  -- Credits charged
  credits_used  INTEGER DEFAULT 0,

  -- Cost tracking
  cost_usd      NUMERIC(10,6),

  -- Performance
  latency_ms    INTEGER,
  status        TEXT CHECK (status IN ('success','error','timeout')),
  error_message TEXT,

  -- Request context
  request_id    TEXT,                  -- fal.ai / OpenRouter request ID
  metadata      JSONB,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partitioned by month for performance at scale
CREATE INDEX idx_ai_usage_log_user_id    ON public.ai_usage_log(user_id);
CREATE INDEX idx_ai_usage_log_created_at ON public.ai_usage_log(created_at DESC);
CREATE INDEX idx_ai_usage_log_module     ON public.ai_usage_log(module);

-- Only service role writes (Edge Functions), users can read their own
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own usage"
  ON public.ai_usage_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access"
  ON public.ai_usage_log FOR ALL
  USING (auth.role() = 'service_role');
