// src/lib/ai/agents/manifest-planner.ts
// The Manifest Planner sits between Insight and the Creative Director.
// It reads the Brand Memory (hydrated by Insight) and generates a CONTENT PLAN —
// a prioritised list of recommended outputs across every format Hypnotic supports.
//
// Every recommended output maps to:
//   - A template from the prompt library
//   - A specific craft route (image / video / audio / document / avatar)
//   - A creative brief the Creative Director can execute immediately

import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { ALL_TEMPLATES, MANIFEST_OUTPUT_CATEGORIES } from '@/lib/craft/prompt-library';

// ── Types ─────────────────────────────────────────────────────────────────────

export type OutputFormat =
  | 'brand_film'
  | 'commercial_30s'
  | 'commercial_60s'
  | 'social_reel'
  | 'social_post'
  | 'social_carousel'
  | 'campaign_visual'
  | 'hero_shot'
  | 'product_shot'
  | 'strategy_deck'
  | 'campaign_brief'
  | 'research_report'
  | 'content_calendar'
  | 'press_release'
  | 'brand_music'
  | 'voiceover'
  | 'explainer_video'
  | 'documentary'
  | 'ai_ambassador'
  | 'mascot'
  | 'digital_presenter'
  | 'data_viz'
  | 'email_sequence'
  | 'pr_angle'
  | 'ugc_brief';

export type CraftRoute = 'video' | 'image' | 'audio' | 'document' | 'avatar' | 'social';
export type Priority   = 'must_do' | 'should_do' | 'nice_to_have';
export type Urgency    = 'immediate' | 'this_week' | 'this_month';

export interface ContentRecommendation {
  id:            string;
  format:        OutputFormat;
  craftRoute:    CraftRoute;
  priority:      Priority;
  urgency:       Urgency;

  // What and why
  title:         string;               // "Nike Gen Z Brand Film"
  rationale:     string;               // WHY this output, linked to Insight findings
  objective:     string;               // What it must achieve
  insightBacking: string;              // Which specific Insight finding justifies this

  // Creative direction (populated by Creative Director agent)
  creativeBrief?: CreativeBrief;

  // Template mapping
  templateId?:   string;              // from prompt-library
  templateLabel?: string;
  isCustom:      boolean;             // true if no template matches — needs new prompt

  // Craft handoff data
  craftPayload?: CraftPayload;        // pre-populated data for Craft pages

  // State
  status: 'recommended' | 'selected' | 'briefed' | 'in_craft' | 'done';
}

export interface CreativeBrief {
  headline:          string;           // the big idea for this piece
  direction:         string;           // what to make, specifically
  tone:              string;
  mandatories:       string[];         // what must appear
  avoidances:        string[];         // what must never appear
  platformContext?:  string;           // Instagram, LinkedIn, etc.
  referenceStyle?:   string;           // visual/editorial reference
  script?:           string;           // for video/audio outputs
  imagePrompts?:     string[];         // for image outputs
  copy?:             string;           // for social/document outputs
}

export interface CraftPayload {
  // For video
  script?:       string;
  genre?:        string;
  duration?:     string;
  aspectRatio?:  string;
  style?:        string;
  tone?:         string;

  // For image
  prompt?:       string;
  negativePrompt?: string;
  styleId?:      string;

  // For audio
  musicPrompt?:  string;
  voiceScript?:  string;
  duration_sec?: number;

  // For document
  documentBrief?: string;
  sections?:      string[];
}

export interface ContentPlan {
  projectId:       string;
  brandName:       string;
  insightRunId?:   string;
  
  strategicThesis: string;            // the one overarching strategic direction
  contentMission:  string;            // what all content must achieve together
  
  recommendations: ContentRecommendation[];
  
  // Grouped for UI
  mustDo:      ContentRecommendation[];
  shouldDo:    ContentRecommendation[];
  niceToDo:    ContentRecommendation[];

  generatedAt: string;
}

// ── Format metadata ───────────────────────────────────────────────────────────

export const FORMAT_META: Record<OutputFormat, {
  label: string;
  craftRoute: CraftRoute;
  icon: string;
  color: string;
  creditCost: number;
  timeToComplete: string;
}> = {
  brand_film:        { label: 'Brand Film',         craftRoute: 'video',    icon: 'Film',      color: '#C9A96E', creditCost: 20, timeToComplete: '45 min' },
  commercial_30s:    { label: '30s Commercial',      craftRoute: 'video',    icon: 'Play',      color: '#C9A96E', creditCost: 12, timeToComplete: '20 min' },
  commercial_60s:    { label: '60s Commercial',      craftRoute: 'video',    icon: 'Play',      color: '#C9A96E', creditCost: 15, timeToComplete: '25 min' },
  social_reel:       { label: 'Social Reel',         craftRoute: 'video',    icon: 'Zap',       color: '#a07ae0', creditCost: 8,  timeToComplete: '15 min' },
  social_post:       { label: 'Social Post',         craftRoute: 'image',    icon: 'Image',     color: '#7aaee0', creditCost: 2,  timeToComplete: '3 min'  },
  social_carousel:   { label: 'Carousel',            craftRoute: 'image',    icon: 'Layers',    color: '#7aaee0', creditCost: 6,  timeToComplete: '10 min' },
  campaign_visual:   { label: 'Campaign Visual',     craftRoute: 'image',    icon: 'Star',      color: '#7aaee0', creditCost: 3,  timeToComplete: '5 min'  },
  hero_shot:         { label: 'Hero Product Shot',   craftRoute: 'image',    icon: 'Target',    color: '#7aaee0', creditCost: 3,  timeToComplete: '5 min'  },
  product_shot:      { label: 'Product Shot',        craftRoute: 'image',    icon: 'Package',   color: '#7aaee0', creditCost: 2,  timeToComplete: '3 min'  },
  strategy_deck:     { label: 'Strategy Deck',       craftRoute: 'document', icon: 'FileText',  color: '#7abf8e', creditCost: 10, timeToComplete: '10 min' },
  campaign_brief:    { label: 'Campaign Brief',      craftRoute: 'document', icon: 'Clipboard', color: '#7abf8e', creditCost: 5,  timeToComplete: '5 min'  },
  research_report:   { label: 'Research Report',     craftRoute: 'document', icon: 'BarChart3', color: '#7abf8e', creditCost: 8,  timeToComplete: '8 min'  },
  content_calendar:  { label: 'Content Calendar',    craftRoute: 'document', icon: 'Calendar',  color: '#7abf8e', creditCost: 8,  timeToComplete: '8 min'  },
  press_release:     { label: 'Press Release',       craftRoute: 'document', icon: 'Newspaper', color: '#7abf8e', creditCost: 4,  timeToComplete: '5 min'  },
  brand_music:       { label: 'Brand Music',         craftRoute: 'audio',    icon: 'Music',     color: '#a07ae0', creditCost: 5,  timeToComplete: '8 min'  },
  voiceover:         { label: 'Voiceover',           craftRoute: 'audio',    icon: 'Mic',       color: '#a07ae0', creditCost: 3,  timeToComplete: '5 min'  },
  explainer_video:   { label: 'Explainer Video',     craftRoute: 'video',    icon: 'PlayCircle',color: '#C9A96E', creditCost: 15, timeToComplete: '25 min' },
  documentary:       { label: 'Documentary',         craftRoute: 'video',    icon: 'Camera',    color: '#C9A96E', creditCost: 18, timeToComplete: '35 min' },
  ai_ambassador:     { label: 'AI Ambassador',       craftRoute: 'avatar',   icon: 'Users',     color: '#e07aa0', creditCost: 10, timeToComplete: '12 min' },
  mascot:            { label: 'Brand Mascot',        craftRoute: 'avatar',   icon: 'Smile',     color: '#e07aa0', creditCost: 8,  timeToComplete: '10 min' },
  digital_presenter: { label: 'Digital Presenter',  craftRoute: 'avatar',   icon: 'Monitor',   color: '#e07aa0', creditCost: 10, timeToComplete: '12 min' },
  data_viz:          { label: 'Data Visualisation',  craftRoute: 'document', icon: 'TrendingUp',color: '#7abf8e', creditCost: 5,  timeToComplete: '6 min'  },
  email_sequence:    { label: 'Email Sequence',      craftRoute: 'document', icon: 'Mail',      color: '#7abf8e', creditCost: 5,  timeToComplete: '6 min'  },
  pr_angle:          { label: 'PR Angle + Pitch',    craftRoute: 'document', icon: 'Megaphone', color: '#7abf8e', creditCost: 3,  timeToComplete: '4 min'  },
  ugc_brief:         { label: 'UGC Creator Brief',   craftRoute: 'video',    icon: 'Video',     color: '#C9A96E', creditCost: 4,  timeToComplete: '5 min'  },
};

// ── Planner: generates content plan from Brand Memory ─────────────────────────

export function generateContentPlan(projectId: string): ContentPlan {
  const memory = useBrandMemoryStore.getState().getMemory(projectId);
  if (!memory) throw new Error('No Brand Memory found for this project');

  const recommendations: ContentRecommendation[] = [];

  // ── Must Do: based on archetype and brief ──────────────────────────────────

  if (memory.brief?.bigIdea) {
    // Always: a campaign visual anchor
    recommendations.push({
      id:             `rec_${Date.now()}_1`,
      format:         'campaign_visual',
      craftRoute:     'image',
      priority:       'must_do',
      urgency:        'immediate',
      title:          `${memory.brandName} Campaign Visual`,
      rationale:      `The Big Idea "${memory.brief.bigIdea}" needs a single anchor image that communicates the campaign before any copy is read.`,
      objective:      'One image that anchors the entire campaign — poster, social, billboard.',
      insightBacking: memory.brief.problemStatement,
      templateId:     'campaign-visual',
      templateLabel:  'Campaign Visual',
      isCustom:       false,
      status:         'recommended',
    });

    // Always: a strategy deck
    recommendations.push({
      id:             `rec_${Date.now()}_2`,
      format:         'strategy_deck',
      craftRoute:     'document',
      priority:       'must_do',
      urgency:        'immediate',
      title:          `${memory.brandName} Strategy Deck`,
      rationale:      'Research findings and strategic direction need to be presentable to stakeholders.',
      objective:      'A board-ready strategy deck that sells the direction internally before execution begins.',
      insightBacking: 'Full Insight report synthesis',
      templateId:     'strategy-deck',
      templateLabel:  'Strategy Deck',
      isCustom:       false,
      status:         'recommended',
    });
  }

  if (memory.brief?.chosenRoute) {
    // Brand film if archetype is Hero, Creator, Magician, Outlaw
    const filmArchetypes = ['Hero', 'Creator', 'Magician', 'Outlaw', 'Explorer'];
    if (filmArchetypes.some(a => memory.persona?.archetype?.includes(a))) {
      recommendations.push({
        id:             `rec_${Date.now()}_3`,
        format:         'brand_film',
        craftRoute:     'video',
        priority:       'must_do',
        urgency:        'this_week',
        title:          `${memory.brandName} Brand Film`,
        rationale:      `The ${memory.persona?.archetype} archetype demands an emotional long-form film — this is the format that builds the brand's emotional equity over time.`,
        objective:      'The emotional centrepiece — character-led, brand as enabler, designed to travel organically.',
        insightBacking: memory?.audience?.culturalTension ?? memory.brief.bigIdea,
        templateId:     'brand-film',
        templateLabel:  'Brand Film',
        isCustom:       false,
        status:         'recommended',
      });
    }
  }

  // ── Should Do: format recommendations based on audience ───────────────────

  if (memory.audience) {
    // Social content is always relevant
    recommendations.push({
      id:             `rec_${Date.now()}_4`,
      format:         'social_reel',
      craftRoute:     'video',
      priority:       'should_do',
      urgency:        'this_week',
      title:          `${memory.brandName} Platform Reels (×5)`,
      rationale:      `Your audience (${memory.audience.name}) lives on short-form video. Five reels with distinct hooks cover the algorithm and give real performance data within days.`,
      objective:      'Algorithmic reach, community growth, and early performance signal on brand messaging.',
      insightBacking: memory.audience.platformBehavior || 'Audience social behavior from research',
      templateId:     'social-reel',
      templateLabel:  'Platform Reel',
      isCustom:       false,
      status:         'recommended',
    });

    recommendations.push({
      id:             `rec_${Date.now()}_5`,
      format:         'content_calendar',
      craftRoute:     'document',
      priority:       'should_do',
      urgency:        'this_week',
      title:          '30-Day Content Calendar',
      rationale:      'A content plan prevents last-minute scrambling and ensures the brand voice stays consistent across platforms.',
      objective:      '30 days of social content mapped to platforms, pillars, and audience moments.',
      insightBacking: 'Audience platform behavior and cultural tension timing from Insight',
      templateId:     'content-calendar',
      templateLabel:  'Content Calendar',
      isCustom:       false,
      status:         'recommended',
    });
  }

  if (memory.brief?.problemStatement) {
    // Commercial formats for problem-led brands
    recommendations.push({
      id:             `rec_${Date.now()}_6`,
      format:         'commercial_30s',
      craftRoute:     'video',
      priority:       'should_do',
      urgency:        'this_week',
      title:          `${memory.brandName} 30s TVC`,
      rationale:      'A tight 30-second commercial tests the core message with maximum creative discipline — if the idea doesn\'t work in 30 seconds, it needs rethinking.',
      objective:      'Broadcast-ready commercial that works on TV, pre-roll, and social.',
      insightBacking: memory.brief.problemStatement,
      templateId:     'commercial_30s',
      templateLabel:  '30s Commercial',
      isCustom:       false,
      status:         'recommended',
    });

    recommendations.push({
      id:             `rec_${Date.now()}_7`,
      format:         'campaign_brief',
      craftRoute:     'document',
      priority:       'should_do',
      urgency:        'immediate',
      title:          'Campaign Brief (for internal team / agency)',
      rationale:      'Before anything gets made, the team needs a single-page brief that is impossible to misread.',
      objective:      'One-page brief: problem, audience truth, proposition, mandatories, success metrics.',
      insightBacking: memory.brief.problemStatement,
      templateId:     'campaign-brief',
      templateLabel:  'Campaign Brief',
      isCustom:       false,
      status:         'recommended',
    });
  }

  // ── Nice to Have: enhancement layer ───────────────────────────────────────

  recommendations.push({
    id:             `rec_${Date.now()}_8`,
    format:         'brand_music',
    craftRoute:     'audio',
    priority:       'nice_to_have',
    urgency:        'this_month',
    title:          `${memory.brandName} Brand Music`,
    rationale:      'A brand music identity ensures all video content sounds consistent and ownable.',
    objective:      'A signature brand track that can be used across all video content.',
    insightBacking: memory.persona?.voice ?? 'Brand archetype audio direction',
    templateId:     'brand-narrative',
    templateLabel:  'Brand Story Music',
    isCustom:       false,
    status:         'recommended',
  });

  recommendations.push({
    id:             `rec_${Date.now()}_9`,
    format:         'hero_shot',
    craftRoute:     'image',
    priority:       'nice_to_have',
    urgency:        'this_week',
    title:          'Hero Product Photography',
    rationale:      'A definitive hero shot elevates all digital surfaces — website, pitch decks, PR.',
    objective:      'The single best image of the product/brand that becomes the reference standard.',
    insightBacking: memory.visual?.mood ?? 'Visual language from Brand Memory',
    templateId:     'hero-shot',
    templateLabel:  'Hero Shot',
    isCustom:       false,
    status:         'recommended',
  });

  if (memory.audience?.age?.includes('18') || memory.audience?.age?.includes('25')) {
    recommendations.push({
      id:             `rec_${Date.now()}_10`,
      format:         'ugc_brief',
      craftRoute:     'video',
      priority:       'nice_to_have',
      urgency:        'this_month',
      title:          'UGC Creator Brief',
      rationale:      'Young audiences trust creators over brands. A well-briefed UGC campaign generates social proof at scale.',
      objective:      'Brief for 5-10 micro-creators to produce authentic-feeling product content.',
      insightBacking: memory.audience?.culturalTension ?? 'Audience trust patterns from research',
      templateId:     'ugc-style',
      templateLabel:  'UGC Creator Style',
      isCustom:       false,
      status:         'recommended',
    });
  }

  recommendations.push({
    id:             `rec_${Date.now()}_11`,
    format:         'pr_angle',
    craftRoute:     'document',
    priority:       'nice_to_have',
    urgency:        'this_month',
    title:          'PR Angles + Media Pitch',
    rationale:      'Earned media from the cultural tension angle can generate awareness without paid spend.',
    objective:      'Three distinct PR angles with media targets and headline-ready hooks.',
    insightBacking: memory?.audience?.culturalTension ?? 'Cultural tension from research',
    isCustom:       true,
    status:         'recommended',
  });

  const mustDo      = recommendations.filter(r => r.priority === 'must_do');
  const shouldDo    = recommendations.filter(r => r.priority === 'should_do');
  const niceToDo    = recommendations.filter(r => r.priority === 'nice_to_have');

  return {
    projectId,
    brandName:       memory.brandName,
    insightRunId:    memory.insightRunId ?? undefined,
    strategicThesis: memory.brief?.bigIdea ?? 'Build brand equity through consistent creative expression',
    contentMission:  `Every piece of content must ${memory.brief?.creativeDirective ?? 'build emotional connection and brand recognition'}`,
    recommendations,
    mustDo,
    shouldDo,
    niceToDo,
    generatedAt: new Date().toISOString(),
  };
}

// ── Creative Director: writes the creative brief per recommendation ────────────

const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export async function writeCreativeBrief(
  recommendation: ContentRecommendation,
  projectId: string
): Promise<CreativeBrief> {
  const memory = useBrandMemoryStore.getState().getMemory(projectId);
  const brandContext = useBrandMemoryStore.getState().buildContext(projectId);

  const format = FORMAT_META[recommendation.format];

  const prompt = `${brandContext}

You are a Creative Director. Write a precise creative brief for this specific output.

OUTPUT: ${format.label} — "${recommendation.title}"
STRATEGIC RATIONALE: ${recommendation.rationale}
OBJECTIVE: ${recommendation.objective}
INSIGHT BACKING: ${recommendation.insightBacking}

Return ONLY valid JSON:
{
  "headline": "The big creative idea for this specific piece (5-10 words)",
  "direction": "Exactly what to make — specific, visual, actionable (3-5 sentences)",
  "tone": "Tone of voice for this piece",
  "mandatories": ["what must appear", "what must be included"],
  "avoidances": ["what must never appear", "what to avoid"],
  "platformContext": "Which platform/surface this is for",
  "referenceStyle": "Visual or editorial reference point",
  ${recommendation.craftRoute === 'video' ? '"script": "The full script or scene description",' : ''}
  ${recommendation.craftRoute === 'image' ? '"imagePrompts": ["prompt for image 1", "prompt for image 2"],' : ''}
  ${['document', 'social'].includes(recommendation.craftRoute) ? '"copy": "The actual copy/content for this output",' : ''}
  "_placeholder": null
}`;

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/manifest-generate`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      body:    JSON.stringify({ prompt, model: 'smart', responseFormat: 'json' }),
    });
    if (!res.ok) throw new Error('Edge function failed');
    const data = await res.json() as CreativeBrief;
    return data;
  } catch {
    // Fallback brief
    return {
      headline:    recommendation.title,
      direction:   recommendation.rationale,
      tone:        memory?.persona?.voice ?? 'Direct and confident',
      mandatories: [`Brand: ${memory?.brandName ?? 'brand'}`],
      avoidances:  memory?.persona?.bannedWords ?? [],
    };
  }
}

// ── Build Craft payload from creative brief ────────────────────────────────────

export function buildCraftPayload(
  recommendation: ContentRecommendation,
  brief: CreativeBrief
): CraftPayload {
  const format = FORMAT_META[recommendation.format];

  if (recommendation.craftRoute === 'video') {
    return {
      script:      brief.script ?? brief.direction,
      genre:       recommendation.format === 'brand_film' ? 'brand_film' :
                   recommendation.format === 'commercial_30s' ? 'commercial_30s' : 'social_reel',
      duration:    recommendation.format === 'brand_film'    ? '2-5 minutes' :
                   recommendation.format === 'commercial_30s' ? '30 seconds' : '30-60 seconds',
      aspectRatio: ['social_reel', 'ugc_brief'].includes(recommendation.format) ? '9:16' : '16:9',
      style:       brief.referenceStyle ?? 'cinematic',
      tone:        brief.tone,
    };
  }

  if (recommendation.craftRoute === 'image') {
    const prompts = brief.imagePrompts ?? [brief.direction];
    return {
      prompt:        prompts[0],
      negativePrompt: 'blurry, low quality, watermark',
      styleId:       'cinematic',
    };
  }

  if (recommendation.craftRoute === 'audio') {
    return {
      musicPrompt:  brief.direction,
      voiceScript:  brief.copy,
      duration_sec: 60,
    };
  }

  if (recommendation.craftRoute === 'document') {
    return {
      documentBrief: brief.direction,
      sections:      brief.mandatories,
    };
  }

  return { prompt: brief.direction };
}
