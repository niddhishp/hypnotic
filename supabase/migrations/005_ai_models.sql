-- ─── 005: AI Model Registry ──────────────────────────────────────────────────────
-- Dynamic registry — admin-editable without code deploys.
-- Seeded in 014_seed_models.sql

CREATE TABLE IF NOT EXISTS public.ai_models (
  id            TEXT PRIMARY KEY,              -- e.g. 'fal-ai/flux-pro/v1.1'
  name          TEXT NOT NULL,                 -- 'Flux.2 Pro'
  provider      TEXT NOT NULL,                 -- 'flux' | 'kling' | 'runway' | ...
  type          TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'voice')),
  tier          TEXT NOT NULL DEFAULT 'quality'
                  CHECK (tier IN ('auto', 'fast', 'quality', 'ultra')),
  description   TEXT,
  api_endpoint  TEXT,                          -- provider-specific endpoint
  input_schema  JSONB,
  capabilities  JSONB DEFAULT '{}',            -- { realistic, nativeAudio, lipSync, ... }
  max_duration  INTEGER,                       -- seconds (video/audio only)
  resolutions   TEXT[],
  aspect_ratios TEXT[],
  tags          TEXT[],
  pricing       JSONB,                         -- { unit, cost_usd }
  credits_per_unit INTEGER NOT NULL DEFAULT 5,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
  is_new        BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 100,
  last_verified TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_models_type      ON public.ai_models(type);
CREATE INDEX idx_ai_models_is_active ON public.ai_models(is_active);
CREATE INDEX idx_ai_models_tier      ON public.ai_models(tier);

-- RLS
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI models readable by authenticated users"
  ON public.ai_models FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Only service role can write models"
  ON public.ai_models FOR ALL
  USING (auth.role() = 'service_role');
