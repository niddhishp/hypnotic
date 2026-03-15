-- ─── 003: Insight Runs ──────────────────────────────────────────────────────────
-- One row per research pipeline execution. Stores entire report as JSONB.

CREATE TABLE IF NOT EXISTS public.insight_runs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES auth.users(id),

  -- Input
  subject               TEXT NOT NULL,
  context               TEXT,

  -- Report sections (populated as pipeline completes)
  executive_summary     TEXT,
  what_data_shows       JSONB,     -- { keyFindings: string[] }
  audience_signals      JSONB,     -- { primaryPersona, culturalInsights }
  competitive_landscape JSONB,     -- { keyPlayers, whitespace }
  cultural_tension      JSONB,     -- { tension, description, opportunity }
  brand_archetype       JSONB,     -- { archetype, confidence, rationale, traits }
  problem_statement     TEXT,
  strategic_routes      JSONB,     -- StrategicRoute[]
  recommended_brief     JSONB,

  -- Metadata
  confidence_score      INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  sources_searched      INTEGER DEFAULT 0,
  total_results         INTEGER DEFAULT 0,

  -- Status
  status                TEXT NOT NULL DEFAULT 'researching'
                          CHECK (status IN ('researching', 'complete', 'failed')),
  error_message         TEXT,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at          TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_insight_runs_project_id ON public.insight_runs(project_id);
CREATE INDEX idx_insight_runs_user_id    ON public.insight_runs(user_id);
CREATE INDEX idx_insight_runs_status     ON public.insight_runs(status);

-- RLS
ALTER TABLE public.insight_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access insight runs through projects"
  ON public.insight_runs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = insight_runs.project_id AND user_id = auth.uid()
    )
  );
