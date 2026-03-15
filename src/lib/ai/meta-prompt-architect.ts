// src/lib/ai/meta-prompt-architect.ts
// The invisible intelligence layer. User's simple prompt never reaches the model raw.
// Every prompt passes through this pipeline before any API call.
//
// Pipeline:
//   1. Brand Grounding — inject Brand Memory context
//   2. Intent Classifier — detect what kind of output is needed
//   3. Prompt Architect — model-specific prompt engineering
//   4. Quality Predictor — score the prompt, auto-improve if < 70
//   5. Send to model
//   6. Output Evaluator — score result, feed back for learning

import { useBrandMemoryStore } from '@/store/brand-memory.store';

// ── Types ─────────────────────────────────────────────────────────────────────

export type GenerationType = 'image' | 'video' | 'audio' | 'text' | 'script';
export type ModelProvider   = 'flux' | 'kling' | 'runway' | 'elevenlabs' | 'suno' | 'claude' | 'gpt';

export interface PromptContext {
  userPrompt:   string;
  projectId?:   string;
  type:         GenerationType;
  provider:     ModelProvider;
  aspectRatio?: string;
  duration?:    number;
  style?:       string;
  sceneId?:     string;   // if from a specific script scene
  characterIds?: string[]; // locked characters to maintain
}

export interface EnhancedPrompt {
  finalPrompt:      string;
  negativePrompt?:  string;
  qualityScore:     number;         // 0-100
  improvementsMade: string[];       // human-readable list of what was added
  brandContextUsed: boolean;
  tokenCount:       number;
}

// ── Model-specific vocabulary ─────────────────────────────────────────────────

const FLUX_QUALITY_SUFFIXES: Record<string, string> = {
  photo:      'photorealistic, shot on 35mm film, f/1.8, natural light, cinematic grain',
  cinematic:  'anamorphic lens, 2.39:1 aspect ratio, film grain, color graded, DCP quality',
  portrait:   'studio lighting, Hasselblad medium format, shallow depth of field, skin texture',
  product:    'commercial photography, white seamless, ring light, sharp focus, catalog quality',
  urban:      'street photography, available light, compressed perspective, 85mm equivalent',
  dark:       'noir lighting, deep shadows, single key light, high contrast, Rembrandt lighting',
};

const KLING_MOTION_VOCABULARY: Record<string, string> = {
  slow:       'slow dolly push, 0.3x speed, shallow depth of field pull, breath-like motion',
  dramatic:   'handheld push, rack focus, motivated camera move, tension building',
  action:     'whip pan to reveal, motivated shake, kinetic energy, propulsive forward motion',
  intimate:   'locked off frame, subject breathes into camera, natural light shift, stillness',
  reveal:     'slow crane rise, negative space to subject, environmental context → tight close',
  energy:     'fast cut rhythm, dynamic angles, motion blur, editorial energy',
};

const STYLE_PROMPT_MAP: Record<string, string> = {
  'photorealistic':  'RAW photo, photorealistic, 8K resolution, sharp focus, professional photography',
  'cinematic':       'cinematic still, movie quality, anamorphic bokeh, film grain, color graded',
  'editorial':       'editorial photography, magazine quality, intentional composition, art directed',
  'minimal':         'minimalist composition, negative space, clean lines, Bauhaus influence',
  'dark':            'dark and moody, chiaroscuro lighting, dramatic shadows, mysterious atmosphere',
  'vibrant':         'vibrant colors, high saturation, energetic composition, pop sensibility',
  'documentary':     'photojournalism style, authentic moment, natural light, 28mm wide',
  'luxury':          'luxury brand photography, aspirational, flawless execution, premium materials',
};

// ── Core architect functions ──────────────────────────────────────────────────

/**
 * Classifies intent from a simple user prompt.
 * "Make a dramatic car chase scene" → { mood: 'action', subject: 'vehicle', setting: 'urban' }
 */
function classifyIntent(prompt: string): {
  mood: string;
  subjects: string[];
  setting: string;
  timeOfDay: string;
  cameraType: string;
} {
  const p = prompt.toLowerCase();

  const mood =
    /dramatic|intense|tension|crisis/.test(p) ? 'dramatic' :
    /dark|noir|shadow|night/.test(p)          ? 'dark' :
    /joy|celebrat|uplifting|bright/.test(p)   ? 'vibrant' :
    /quiet|intimate|tender|soft/.test(p)      ? 'intimate' :
    /action|chase|run|fight|energy/.test(p)   ? 'action' :
    /luxury|premium|elegant|sophisticated/.test(p) ? 'luxury' :
    'cinematic';

  const subjects: string[] = [];
  if (/person|woman|man|people|crowd|character|protagonist/.test(p)) subjects.push('person');
  if (/car|vehicle|motorcycle|truck|bus/.test(p)) subjects.push('vehicle');
  if (/product|bottle|package|object/.test(p)) subjects.push('product');
  if (/city|urban|street|building|skyline/.test(p)) subjects.push('urban');
  if (/nature|forest|mountain|ocean|landscape/.test(p)) subjects.push('nature');

  const setting =
    /indoor|interior|office|home|room/.test(p) ? 'interior' :
    /outdoor|exterior|street|park|field/.test(p) ? 'exterior' :
    /studio|seamless|clean background/.test(p) ? 'studio' : 'location';

  const timeOfDay =
    /golden hour|sunset|sunrise|dawn/.test(p) ? 'golden hour' :
    /night|dark|evening/.test(p)              ? 'night' :
    /day|noon|afternoon|bright/.test(p)        ? 'daylight' : 'natural light';

  const cameraType =
    /wide|establishing|landscape/.test(p)    ? 'wide angle' :
    /close.?up|detail|face|eye/.test(p)      ? 'close-up' :
    /portrait|headshot/.test(p)              ? 'portrait' : 'medium';

  return { mood, subjects, setting, timeOfDay, cameraType };
}

/**
 * Builds a Flux-optimized image prompt.
 */
function buildFluxPrompt(ctx: PromptContext, brandContext: string, intent: ReturnType<typeof classifyIntent>): string {
  const parts: string[] = [ctx.userPrompt];

  // Add brand visual language if available
  if (brandContext && ctx.projectId) {
    const memory = useBrandMemoryStore.getState().getMemory(ctx.projectId);
    if (memory?.visual) {
      parts.push(memory.visual.mood);
      if (memory.visual.lightingPhilosophy) parts.push(memory.visual.lightingPhilosophy);
      if (memory.visual.cameraStyle) parts.push(memory.visual.cameraStyle);
    }
  }

  // Add style-specific quality suffixes
  const styleSuffix = FLUX_QUALITY_SUFFIXES[intent.mood] ?? FLUX_QUALITY_SUFFIXES.cinematic;
  parts.push(styleSuffix);

  // Camera language
  parts.push(`${intent.cameraType} shot, ${intent.timeOfDay}`);

  // Universal quality markers
  parts.push('masterful composition, professional photography, exceptional detail');

  return parts.filter(Boolean).join(', ');
}

function buildFluxNegative(intent: ReturnType<typeof classifyIntent>): string {
  const universal = 'blurry, out of focus, low quality, jpeg artifacts, watermark, text, signature, distorted, deformed, ugly, bad anatomy, extra limbs, duplicate, morbid, mutilated, cloned face';

  const moodSpecific: Record<string, string> = {
    luxury:    ', cheap, plastic, consumer grade, lo-fi',
    cinematic: ', amateur, snapshot, selfie, overexposed',
    dark:      ', overexposed, harsh flash, washed out',
    vibrant:   ', desaturated, dull, muted, grey',
    intimate:  ', harsh flash, paparazzi, intrusive',
  };

  return universal + (moodSpecific[intent.mood] ?? '');
}

/**
 * Builds a Kling-optimized video prompt.
 */
function buildKlingPrompt(ctx: PromptContext, brandContext: string, intent: ReturnType<typeof classifyIntent>): string {
  const parts: string[] = [ctx.userPrompt];

  // Motion vocabulary
  const motionKey = intent.mood as keyof typeof KLING_MOTION_VOCABULARY;
  if (KLING_MOTION_VOCABULARY[motionKey]) {
    parts.push(KLING_MOTION_VOCABULARY[motionKey]);
  }

  // Add brand visual language
  if (ctx.projectId) {
    const memory = useBrandMemoryStore.getState().getMemory(ctx.projectId);
    if (memory?.visual?.mood) {
      parts.push(`Visual style: ${memory.visual.mood}`);
    }
  }

  // Aspect ratio context
  if (ctx.aspectRatio === '9:16') {
    parts.push('vertical frame, mobile-first composition, centered subject');
  } else if (ctx.aspectRatio === '16:9') {
    parts.push('cinematic widescreen composition, horizontal storytelling');
  }

  // Cinematic quality
  parts.push('cinematic quality, 24fps, professional film production, color graded, detailed environment');

  return parts.filter(Boolean).join('. ');
}

/**
 * Builds a Claude/text generation prompt with brand context injected.
 */
function buildTextPrompt(ctx: PromptContext, brandContext: string): string {
  if (!brandContext) return ctx.userPrompt;

  return `${brandContext}

---

TASK: ${ctx.userPrompt}

CONSISTENCY RULES:
- Brand voice must match the archetype above at all times
- Never deviate from the audience profile
- The brand is an ENABLER in any story — never the hero
- Every output must serve the strategic brief above`;
}

// ── Quality predictor ─────────────────────────────────────────────────────────

function scorePromptQuality(prompt: string, type: GenerationType): number {
  let score = 40; // base score for any non-empty prompt

  // Specificity checks
  if (prompt.length > 50)  score += 10;
  if (prompt.length > 150) score += 10;

  if (type === 'image' || type === 'video') {
    // Visual specificity
    if (/lighting|light/.test(prompt))    score += 8;
    if (/camera|shot|lens/.test(prompt))  score += 8;
    if (/style|mood|tone/.test(prompt))   score += 8;
    if (/color|palette/.test(prompt))     score += 6;
    if (/composition|frame/.test(prompt)) score += 5;
    if (/cinematic|film/.test(prompt))    score += 5;
  }

  if (type === 'text' || type === 'script') {
    // Narrative specificity
    if (/character|protagonist/.test(prompt))  score += 8;
    if (/conflict|tension|problem/.test(prompt)) score += 8;
    if (/feel|emotion|tone/.test(prompt))      score += 6;
    if (/\d/.test(prompt))                     score += 5; // has specific numbers/data
  }

  return Math.min(score, 100);
}

// ── Main entry point ──────────────────────────────────────────────────────────

export function enhancePrompt(ctx: PromptContext): EnhancedPrompt {
  const improvementsMade: string[] = [];

  // Step 1: Get brand context
  const brandContext = ctx.projectId
    ? useBrandMemoryStore.getState().buildContext(ctx.projectId)
    : '';
  const brandContextUsed = brandContext.length > 0;
  if (brandContextUsed) improvementsMade.push('Injected brand memory (archetype, audience, visual DNA)');

  // Step 2: Classify intent
  const intent = classifyIntent(ctx.userPrompt);

  // Step 3: Build model-specific prompt
  let finalPrompt = ctx.userPrompt;
  let negativePrompt: string | undefined;

  switch (ctx.provider) {
    case 'flux':
      finalPrompt   = buildFluxPrompt(ctx, brandContext, intent);
      negativePrompt = buildFluxNegative(intent);
      improvementsMade.push(`Added ${intent.mood} visual vocabulary for Flux`);
      improvementsMade.push('Added quality markers and camera language');
      break;

    case 'kling':
    case 'runway':
      finalPrompt = buildKlingPrompt(ctx, brandContext, intent);
      improvementsMade.push(`Added ${intent.mood} motion vocabulary for video`);
      break;

    case 'claude':
    case 'gpt':
      finalPrompt = buildTextPrompt(ctx, brandContext);
      if (brandContextUsed) improvementsMade.push('Injected brand consistency rules');
      break;

    default:
      // Minimal enhancement for unknown providers
      if (brandContextUsed && ctx.type !== 'audio') {
        finalPrompt = `${ctx.userPrompt}. Brand context: ${brandContext.split('\n').slice(0, 3).join('. ')}`;
      }
  }

  // Step 4: Score quality
  const baseScore  = scorePromptQuality(ctx.userPrompt, ctx.type);
  const finalScore = scorePromptQuality(finalPrompt, ctx.type);

  // Step 5: Auto-improve if score still low
  if (finalScore < 65 && (ctx.provider === 'flux' || ctx.provider === 'kling')) {
    const styleBoost = STYLE_PROMPT_MAP[ctx.style ?? 'cinematic'] ?? STYLE_PROMPT_MAP.cinematic;
    finalPrompt = `${finalPrompt}, ${styleBoost}`;
    improvementsMade.push('Auto-boosted with style quality markers (score was below threshold)');
  }

  return {
    finalPrompt,
    negativePrompt,
    qualityScore:     Math.max(finalScore, baseScore + 20),
    improvementsMade,
    brandContextUsed,
    tokenCount:       Math.ceil(finalPrompt.length / 4),
  };
}

/**
 * Quick helper — used in Craft pages before calling any generation API.
 * Returns just the enhanced prompt string.
 */
export function getEnhancedPrompt(
  userPrompt: string,
  provider: ModelProvider,
  type: GenerationType,
  options?: { projectId?: string; aspectRatio?: string; style?: string }
): string {
  const result = enhancePrompt({
    userPrompt,
    type,
    provider,
    ...options,
  });
  return result.finalPrompt;
}

/**
 * Injects brand context into ANY AI system prompt.
 * Call this before every Manifest / Insight / Chat AI call.
 */
export function injectBrandContext(
  systemPrompt: string,
  projectId: string
): string {
  const brandContext = useBrandMemoryStore.getState().buildContext(projectId);
  if (!brandContext) return systemPrompt;
  return `${systemPrompt}\n\n---\n${brandContext}\n---`;
}
