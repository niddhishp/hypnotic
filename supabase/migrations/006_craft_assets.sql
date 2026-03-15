-- ─── 006: Craft Assets ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.craft_assets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id),

  -- Source context
  manifest_run_id   UUID REFERENCES public.manifest_runs(id),
  scene_id          TEXT,
  input_mode        TEXT CHECK (input_mode IN ('manifest_flow', 'custom_script', 'quick_prompt')),

  -- Asset details
  type              TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'voice')),
  url               TEXT,
  thumbnail_url     TEXT,
  file_size         BIGINT,
  duration_seconds  NUMERIC,
  dimensions        JSONB,          -- { width, height }
  storage_path      TEXT,           -- Supabase Storage path

  -- Generation metadata
  model_id          TEXT REFERENCES public.ai_models(id),
  prompt            TEXT,
  negative_prompt   TEXT,
  generation_params JSONB,          -- seed, steps, aspect_ratio, etc.
  fal_request_id    TEXT,           -- fal.ai request ID for polling

  -- Workflow status
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'generating', 'in_review', 'approved', 'rejected', 'archived')),
  review_notes      TEXT,
  approved_by       UUID REFERENCES auth.users(id),
  approved_at       TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_craft_assets_project_id    ON public.craft_assets(project_id);
CREATE INDEX idx_craft_assets_user_id       ON public.craft_assets(user_id);
CREATE INDEX idx_craft_assets_status        ON public.craft_assets(status);
CREATE INDEX idx_craft_assets_type          ON public.craft_assets(type);
CREATE INDEX idx_craft_assets_project_status ON public.craft_assets(project_id, status);

-- RLS
ALTER TABLE public.craft_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their craft assets"
  ON public.craft_assets FOR ALL
  USING (auth.uid() = user_id);
