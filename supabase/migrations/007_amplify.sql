-- ─── 007: Amplify — Scheduled Posts & Platform Connections ─────────────────────

-- Platform OAuth connections
CREATE TABLE IF NOT EXISTS public.platform_connections (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform            TEXT NOT NULL CHECK (platform IN ('instagram','x','linkedin','youtube','tiktok','facebook','pinterest')),
  access_token        TEXT,           -- encrypted in application layer
  refresh_token       TEXT,           -- encrypted
  token_expires_at    TIMESTAMPTZ,
  platform_user_id    TEXT,
  platform_username   TEXT,
  platform_page_id    TEXT,           -- for Facebook pages / LinkedIn pages
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  scopes              TEXT[],         -- granted OAuth scopes
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, platform)
);

ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their platform connections"
  ON public.platform_connections FOR ALL
  USING (auth.uid() = user_id);

CREATE TRIGGER update_platform_connections_updated_at
  BEFORE UPDATE ON public.platform_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- Scheduled posts
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id              UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id                 UUID NOT NULL REFERENCES auth.users(id),

  -- Asset reference
  asset_id                UUID REFERENCES public.craft_assets(id),
  platform                TEXT NOT NULL,

  -- Content
  caption                 TEXT,
  hashtags                TEXT[],
  mentions                TEXT[],
  platform_package        JSONB,        -- adapted dimensions, format

  -- SEO / YouTube
  seo_title               TEXT,
  seo_description         TEXT,
  seo_tags                TEXT[],

  -- Schedule
  scheduled_at            TIMESTAMPTZ,
  published_at            TIMESTAMPTZ,

  -- Analytics
  performance_prediction  JSONB,        -- { reach: {min,max}, engagement: {min,max} }
  actual_metrics          JSONB,        -- { impressions, likes, comments, shares }
  metrics_pulled_at       TIMESTAMPTZ,

  -- A/B testing
  ab_test_id              UUID,
  ab_variant              TEXT,

  -- Status
  status                  TEXT NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','scheduled','published','failed')),
  error_message           TEXT,
  retry_count             INTEGER DEFAULT 0,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scheduled_posts_user_id     ON public.scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_project_id  ON public.scheduled_posts(project_id);
CREATE INDEX idx_scheduled_posts_status      ON public.scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_scheduled   ON public.scheduled_posts(scheduled_at);
CREATE INDEX idx_scheduled_posts_platform    ON public.scheduled_posts(platform, status);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their scheduled posts"
  ON public.scheduled_posts FOR ALL
  USING (auth.uid() = user_id);

CREATE TRIGGER update_scheduled_posts_updated_at
  BEFORE UPDATE ON public.scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
