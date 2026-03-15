-- ─── 012: System Prompts ────────────────────────────────────────────────────────
-- DB-managed AI prompts. Admin edits take effect without code deploys.
-- App falls back to hardcoded prompts if DB row missing.

CREATE TABLE IF NOT EXISTS public.system_prompts (
  id            TEXT PRIMARY KEY,                 -- e.g. 'insight_research_agent'
  module        TEXT CHECK (module IN ('insight','manifest','craft','amplify','chat')),
  name          TEXT NOT NULL,                     -- Human-readable label
  description   TEXT,
  content       TEXT NOT NULL,                     -- The actual prompt
  temperature   NUMERIC(3,2) DEFAULT 0.7,
  max_tokens    INTEGER DEFAULT 4000,
  model         TEXT DEFAULT 'smart',              -- 'fast' | 'smart' | 'vision'
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  version       INTEGER NOT NULL DEFAULT 1,
  updated_by    UUID REFERENCES auth.users(id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active prompts (needed for Edge Functions)
CREATE POLICY "Prompts readable by authenticated"
  ON public.system_prompts FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Only admin / service role can write
CREATE POLICY "Admin can manage prompts"
  ON public.system_prompts FOR ALL
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin','superadmin')
    )
  );
