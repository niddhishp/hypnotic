-- ─── 008: Workspace — Node Canvas Graphs & Versions ────────────────────────────

-- One graph per project (live state)
CREATE TABLE IF NOT EXISTS public.workspace_graphs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
  nodes       JSONB NOT NULL DEFAULT '[]',
  edges       JSONB NOT NULL DEFAULT '[]',
  viewport    JSONB NOT NULL DEFAULT '{"x":0,"y":0,"zoom":1}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspace_graphs_project_id ON public.workspace_graphs(project_id);

ALTER TABLE public.workspace_graphs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access workspace through projects"
  ON public.workspace_graphs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = workspace_graphs.project_id AND user_id = auth.uid()
    )
  );

CREATE TRIGGER update_workspace_graphs_updated_at
  BEFORE UPDATE ON public.workspace_graphs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- Version snapshots (named saves)
CREATE TABLE IF NOT EXISTS public.workspace_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  label           TEXT,
  snapshot        JSONB NOT NULL,     -- { nodes, edges, viewport }
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspace_versions_project_id ON public.workspace_versions(project_id);

ALTER TABLE public.workspace_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access versions through projects"
  ON public.workspace_versions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = workspace_versions.project_id AND user_id = auth.uid()
    )
  );
