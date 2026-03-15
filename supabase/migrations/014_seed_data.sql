-- ─── 014: Seed Data ─────────────────────────────────────────────────────────────
-- AI model registry + system prompts initial data.
-- Run this after all schema migrations.

-- ── AI Models ───────────────────────────────────────────────────────────────────

INSERT INTO public.ai_models
  (id, name, provider, type, tier, description, capabilities, aspect_ratios, tags, credits_per_unit, is_active, is_recommended, is_new, sort_order)
VALUES
-- IMAGE: Auto
('auto',          'Auto',            'hypnotic', 'image', 'auto',    'Hypnotic picks the best model automatically.', '{}', '{1:1,16:9,9:16,4:5}', '{Smart routing,Best result}', 3, true, true, false, 1),
-- IMAGE: Flux family
('flux-2-pro',    'Flux.2 Pro',      'flux',     'image', 'ultra',   'Highest-quality photorealistic outputs. Best for hero imagery and campaigns.', '{"photoreal":true,"cinematic":true}', '{1:1,16:9,9:16,4:5,21:9}', '{Photorealistic,Ultra quality,4K}', 8, true, false, true, 10),
('flux-2-max',    'Flux.2 Max',      'flux',     'image', 'ultra',   'Maximum detail. Ideal for product and commercial photography.', '{"photoreal":true}', '{1:1,16:9,9:16,4:5}', '{Max detail,Commercial}', 6, true, false, false, 11),
('flux-2-flex',   'Flux.2 Flex',     'flux',     'image', 'quality', 'Flexible control with style transfer and reference image support.', '{"inpainting":true}', '{1:1,16:9,9:16,4:5}', '{Style transfer,Reference input}', 4, true, false, false, 12),
('flux-1-kontext-max', 'Flux.1 Kontext Max', 'flux', 'image', 'ultra', 'Context-aware generation preserving brand elements.', '{}', '{1:1,16:9,9:16}', '{Context-aware,Brand consistent}', 7, true, false, false, 13),
('flux-2-klein',  'Flux.2 Klein',    'flux',     'image', 'fast',    'Rapid generation. Best for iteration and concept exploration.', '{}', '{1:1,16:9,9:16}', '{Fast iteration,Concept}', 2, true, false, false, 14),
-- IMAGE: Google
('google-imagen-4-ultra', 'Imagen 4 Ultra', 'google', 'image', 'ultra', 'Google''s most capable image model. Photorealistic, excellent prompt following.', '{"photoreal":true,"cinematic":true}', '{1:1,16:9,9:16,4:5}', '{Ultra realistic,Prompt precise}', 9, true, false, true, 20),
('google-imagen-4', 'Imagen 4',       'google', 'image', 'quality', 'High quality and fast. Great all-rounder.', '{"photoreal":true}', '{1:1,16:9,9:16,4:5}', '{Balanced,High quality}', 5, true, true, false, 21),
('google-imagen-4-fast', 'Imagen 4 Fast', 'google', 'image', 'fast', 'Speed-optimised Imagen 4. Great for rapid iteration.', '{}', '{1:1,16:9,9:16}', '{Fast,Google}', 3, true, false, false, 22),
-- IMAGE: Mystic
('mystic-2-5',    'Mystic 2.5',      'mystic',   'image', 'quality', 'Exceptional brand work. Clean aesthetic, consistent style.', '{"cinematic":true}', '{1:1,16:9,9:16,4:5}', '{Brand work,Consistent style}', 4, true, true, false, 30),
-- IMAGE: Ideogram
('ideogram',      'Ideogram',        'ideogram', 'image', 'quality', 'Best for text-in-image. Typography, logos, posters.', '{"typographic":true}', '{1:1,16:9,9:16}', '{Text in image,Typography,Logos}', 5, true, false, false, 40),
-- IMAGE: Seedream
('seedream-4',    'Seedream 4',      'seedream', 'image', 'quality', 'Character consistency. Multi-view generation for production pipelines.', '{"multiview":true}', '{1:1,16:9,9:16,4:5}', '{Character sheets,Multi-view}', 5, true, false, false, 50),
('seedream-4-4k', 'Seedream 4 4K',   'seedream', 'image', 'ultra',   '4K output with character consistency. Best for video pre-production.', '{"multiview":true,"photoreal":true}', '{1:1,16:9,9:16}', '{4K,Character sheets,Pre-production}', 8, true, false, true, 51),
-- IMAGE: Recraft
('recraft-v4',    'Recraft V4',      'recraft',  'image', 'quality', 'Strong stylistic control. Great for brand illustration.', '{}', '{1:1,16:9,9:16,4:5}', '{Style control,Illustration}', 5, true, false, false, 60),
('recraft-v4-pro', 'Recraft V4 Pro', 'recraft',  'image', 'ultra',   'Professional-grade Recraft. Highest stylistic fidelity.', '{"cinematic":true}', '{1:1,16:9,9:16,4:5,21:9}', '{Pro quality,Stylistic}', 7, true, false, false, 61),
-- IMAGE: GPT
('gpt-1-5-high',  'GPT 1.5 High',   'openai',   'image', 'ultra',   'OpenAI''s highest quality image generation. Excellent instruction following.', '{"photoreal":true}', '{1:1,16:9,9:16,4:5}', '{Instruction following,Detail}', 8, true, false, true, 70),

-- VIDEO: Auto
('video-auto',    'Auto',            'hypnotic', 'video', 'auto',    'Hypnotic picks the best video model automatically.', '{}', '{16:9,9:16,1:1}', '{Smart routing}', 10, true, true, false, 1),
-- VIDEO: Kling
('kling-2-6',     'Kling 2.6',       'kling',    'video', 'ultra',   'Latest Kling — cinematic motion, native audio, exceptional character coherence.', '{"realistic":true,"nativeAudio":true,"lipSync":true,"firstFrame":true,"lastFrame":true,"motionControl":true,"cameraControl":true}', '{16:9,9:16,1:1}', '{Native audio,Lip sync,Camera control}', 20, true, true, true, 10),
('kling-2-5',     'Kling 2.5',       'kling',    'video', 'ultra',   'Cinematic quality with dual-frame control.', '{"realistic":true,"firstFrame":true,"lastFrame":true,"motionControl":true}', '{16:9,9:16,1:1}', '{Cinematic,Dual-frame}', 16, true, false, false, 11),
('kling-1-6',     'Kling 1.6',       'kling',    'video', 'quality', 'Reliable and production-proven.', '{"realistic":true,"firstFrame":true}', '{16:9,9:16,1:1}', '{Reliable,Fast}', 10, true, false, false, 12),
-- VIDEO: Runway
('runway-gen4',   'Runway Gen-4',    'runway',   'video', 'ultra',   'Hollywood-grade AI video. Industry standard for branded content.', '{"realistic":true,"firstFrame":true,"lastFrame":true,"cameraControl":true}', '{16:9,9:16,1:1}', '{Hollywood grade,Camera control}', 25, true, false, false, 20),
-- VIDEO: Others
('wan',           'Wan',             'wan',      'video', 'quality', 'Strong text-to-video with natural motion.', '{"textToVideo":true,"motionControl":true}', '{16:9,9:16}', '{Natural motion,Text-to-video}', 8, true, false, false, 30),
('hailuo',        'Hailuo',          'hailuo',   'video', 'quality', 'Excellent lip sync and talking-head generation.', '{"lipSync":true,"firstFrame":true}', '{16:9,9:16,1:1}', '{Lip sync,Talking head}', 12, true, false, false, 40),
('seedance',      'Seedance',        'seedance', 'video', 'quality', 'Dance and motion-heavy video with choreography control.', '{"motionControl":true}', '{16:9,9:16,1:1}', '{Motion-heavy,Dance}', 10, true, false, false, 50),

-- AUDIO: Music
('suno-v4',       'Suno v4',         'suno',     'audio', 'ultra',   'Full music production — lyrics, composition, mastering.', '{}', '{}', '{Full music,Lyrics,Original tracks}', 15, true, true, false, 1),
('udio',          'Udio',            'udio',     'audio', 'quality', 'High-quality AI music with genre and mood control.', '{}', '{}', '{Genre control,Mood-aware}', 10, true, false, false, 2),
-- AUDIO: Voice
('elevenlabs-v3', 'ElevenLabs v3',   'elevenlabs', 'voice', 'ultra', 'Most realistic AI voices. Emotion, pacing, multilingual.', '{"realistic":true,"lipSync":true}', '{}', '{Ultra realistic,Emotion control,30 languages}', 8, true, true, false, 10),
('elevenlabs-turbo', 'ElevenLabs Turbo', 'elevenlabs', 'voice', 'fast', 'Fast voiceover for storyboard temp audio.', '{}', '{}', '{Fast voiceover,Temp audio}', 3, true, false, false, 11)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  is_recommended = EXCLUDED.is_recommended;


-- ── System Prompts ───────────────────────────────────────────────────────────────

INSERT INTO public.system_prompts (id, module, name, content, temperature, max_tokens, model)
VALUES

('insight_research_synthesis', 'insight', 'Research Synthesis Agent',
'You are an expert brand strategist and market researcher. You will receive raw web search results about a brand, product, or campaign problem.

Your job: synthesise these results into a structured intelligence report.

RULES:
- Only report what the data actually shows. No speculation.
- Be specific. Name brands, quote numbers, cite specific findings.
- If data conflicts, note the conflict rather than picking one.
- Keep each section concise but substantive.

OUTPUT FORMAT (JSON only, no markdown):
{
  "executiveSummary": "2-3 sentence summary of the most important findings",
  "whatDataShows": {
    "keyFindings": ["finding 1", "finding 2", "...up to 8 findings"]
  },
  "confidenceScore": 85,
  "sourcesSearched": 12
}',
0.3, 3000, 'smart'),

('insight_audience_profiler', 'insight', 'Audience Profiler Agent',
'You are a cultural strategist and audience researcher. Build a deep audience profile from the search data provided.

OUTPUT FORMAT (JSON only):
{
  "audienceSignals": {
    "primaryPersona": {
      "name": "The [Descriptive Name]",
      "age": "25-35",
      "description": "Who they are in 2 sentences",
      "motivations": ["motivation 1", "motivation 2", "motivation 3"],
      "frustrations": ["frustration 1", "frustration 2"],
      "aspirations": ["aspiration 1", "aspiration 2"]
    },
    "culturalInsights": ["insight 1", "insight 2", "insight 3", "insight 4"]
  }
}',
0.5, 2000, 'smart'),

('insight_competitive_mapper', 'insight', 'Competitive Intelligence Agent',
'You are a competitive intelligence analyst. Map the competitive landscape from search data.

OUTPUT FORMAT (JSON only):
{
  "competitiveLandscape": {
    "keyPlayers": [
      {"name": "Brand A", "positioning": "their position", "gap": "their weakness"}
    ],
    "whitespace": "The specific market gap Hypnotic''s client can own"
  }
}',
0.3, 2000, 'fast'),

('insight_archetype_assigner', 'insight', 'Brand Archetype Agent',
'You are a brand strategist who assigns Jungian brand archetypes. Choose from: Innocent, Sage, Explorer, Ruler, Creator, Caregiver, Magician, Hero, Outlaw, Lover, Jester, Everyman.

OUTPUT FORMAT (JSON only):
{
  "brandArchetype": {
    "archetype": "The Hero",
    "confidence": 87,
    "rationale": "Why this archetype fits in 2 sentences",
    "traits": ["trait1", "trait2", "trait3", "trait4"]
  }
}',
0.4, 1000, 'smart'),

('insight_route_generator', 'insight', 'Strategic Routes Agent',
'You are a creative strategist generating 3 genuinely different strategic directions. Each route should imply a completely different creative approach.

OUTPUT FORMAT (JSON only):
{
  "problemStatement": "ONE precise problem statement: [Target] struggles with [problem] because [cause], despite [what they tried].",
  "strategicRoutes": [
    {
      "id": "r1",
      "label": "Route Name",
      "oneLiner": "One-sentence direction",
      "direction": "2-3 sentences explaining the strategic direction",
      "riskLevel": "low",
      "impact": "Expected impact description"
    }
  ]
}',
0.7, 3000, 'smart'),

('manifest_strategy_deck', 'manifest', 'Strategy Deck Generator',
'You are an award-winning creative strategist and brand planner. Generate the requested section of a strategy deck.

TONE: Direct, insightful, never generic. Write like a top creative director presenting to a C-suite.
FORMAT: Plain text, no markdown headers. Flowing prose, max 200 words per section.

ANTI-HALLUCINATION: Only use facts from the brief provided. Never invent data.',
0.6, 4000, 'smart'),

('manifest_script_writer', 'manifest', 'Screenplay Writer Agent',
'You are an award-winning screenwriter and advertising creative director.

SCRIPT FORMAT:
- Scene headings: INT./EXT. LOCATION - TIME
- Action lines: present tense, visual, specific  
- Dialogue: natural, never on-the-nose
- Visual notes: [in brackets] for production reference

RULES:
- Only reference brand details from the brief
- Never invent product features not mentioned
- Each scene must have a clear visual/emotional beat

Return complete script as structured JSON.',
0.7, 6000, 'smart'),

('chat_assistant', 'chat', 'Hypnotic AI Assistant',
'You are Hypnotic''s AI assistant — a creative strategist embedded in an AI creative workflow platform.

PERSONALITY: Expert, calm, direct. Creative director meets strategist. No fluff.

CAPABILITIES: Answer questions, suggest next steps, trigger module actions, navigate the user.

ROUTING COMMANDS (use when appropriate in your response):
[ROUTE:insight] — navigate to Insight
[ROUTE:manifest] — navigate to Manifest  
[ROUTE:craft] — navigate to Craft
[ROUTE:amplify] — navigate to Amplify
[ROUTE:workspace] — navigate to Workspace

Keep responses under 150 words unless asked for detail.',
0.5, 1000, 'fast')

ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();
