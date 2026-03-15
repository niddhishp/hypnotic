-- ─── 004: Manifest Runs ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.manifest_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id),

  -- Source context
  insight_run_id    UUID REFERENCES public.insight_runs(id),
  input_type        TEXT CHECK (input_type IN ('insight', 'brief_upload', 'custom_prompt')),
  custom_brief      TEXT,

  -- Output configuration
  output_type       TEXT CHECK (output_type IN (
    'strategy_deck', 'film_script', 'social_system',
    'campaign_narrative', 'character_doc'
  )),

  -- Generated content
  title             TEXT,
  sections          JSONB DEFAULT '{}',   -- { [sectionId]: { title, content } }
  scripts           JSONB,                -- FilmScript[]
  storyboard        JSONB,                -- StoryboardFrame[]
  characters        JSONB,                -- Character[]
  world_bible       JSONB,

  -- Status
  status            TEXT NOT NULL DEFAULT 'generating'
                      CHECK (status IN ('generating', 'complete', 'failed')),
  error_message     TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_manifest_runs_project_id ON public.manifest_runs(project_id);
CREATE INDEX idx_manifest_runs_insight_id ON public.manifest_runs(insight_run_id);
CREATE INDEX idx_manifest_runs_status     ON public.manifest_runs(status);

-- RLS
ALTER TABLE public.manifest_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access manifest runs through projects"
  ON public.manifest_runs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = manifest_runs.project_id AND user_id = auth.uid()
    )
  );

CREATE TRIGGER update_manifest_runs_updated_at
  BEFORE UPDATE ON public.manifest_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
