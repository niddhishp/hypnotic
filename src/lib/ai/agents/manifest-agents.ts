// src/lib/ai/agents/manifest-agents.ts
// Multi-agent screenplay/strategy pipeline.
// Each agent runs sequentially, each building on the last.
// The Character Consistency Agent locks character DNA before Scene Writer runs.
// The Brand Alignment Agent runs last — ensures brand is enabler, never hero.

import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { injectBrandContext } from '@/lib/ai/meta-prompt-architect';
import type { CharacterDNA } from '@/store/brand-memory.store';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ScriptGenre = 'commercial_30s' | 'commercial_60s' | 'short_film' | 'brand_film' | 'social_reel' | 'documentary' | 'explainer';

export interface ScriptConfig {
  brief:       string;           // user's input or Insight brief
  genre:       ScriptGenre;
  duration:    string;           // "30 seconds" | "5 minutes"
  projectId:   string;
  insightRunId?: string;         // if coming from Insight
  onAgentUpdate: (update: ScriptAgentUpdate) => void;
}

export interface ScriptAgentUpdate {
  agentId:  string;
  agentName: string;
  status:   'running' | 'complete' | 'failed';
  output?:  string | Record<string, unknown>;
}

export interface GeneratedScript {
  id:        string;
  title:     string;
  genre:     ScriptGenre;
  duration:  string;

  // Structure
  structure: NarrativeStructure;
  characters: CharacterBible;
  worldBible: WorldBible;
  scenes:     ScriptScene[];

  // Quality
  alignmentScore:   number;   // how well it serves the brief (0-100)
  brandEnablerScore: number;  // is brand enabler (not hero)? (0-100)
  emotionalScore:   number;   // emotional resonance (0-100)

  // Meta
  createdAt: string;
}

interface NarrativeStructure {
  logline:        string;   // one sentence
  threeActSketch: string;
  centralConflict: string;
  emotionalJourney: string;
  resolution:     string;
  brandMoment:    string;   // specific moment the brand enters — must be earned
}

interface CharacterBible {
  protagonist: CharacterProfile;
  supporting:  CharacterProfile[];
  worldRole:   string;   // the social/cultural role each character plays
}

interface CharacterProfile {
  name:        string;
  archetype:   string;
  fear:        string;
  ambition:    string;
  talent:      string;
  contradiction: string;   // what makes them human
  voicePattern:  string;
  physicalSignature: string;  // one visual detail that always identifies them
  transformationArc: string;  // how they change
}

interface WorldBible {
  setting:           string;
  timePeriod:        string;
  aestheticDirection: string;
  colorPalette:      string;
  soundscape:        string;
  lightingPhilosophy: string;
  productionNotes:   string;
}

export interface ScriptScene {
  sceneNumber:  number;
  heading:      string;    // INT. LOCATION - DAY
  action:       string;    // what we see
  dialogue?:    Array<{ character: string; line: string; direction?: string }>;
  visualNote:   string;    // production direction for Craft
  emotionalBeat: string;   // what audience feels here
  brandMoment:  boolean;   // does the brand appear?
  duration:     string;    // estimated screen time
}

// ── Agent prompt templates ────────────────────────────────────────────────────

const MANIFEST_PROMPTS = {
  structure: (brief: string, brandContext: string, genre: string, duration: string) => `
${brandContext}

You are an award-winning creative director and screenwriter.

BRIEF: ${brief}
GENRE: ${genre}
DURATION: ${duration}

Design the narrative structure for this creative piece.

Brand film rules:
- The brand is an ENABLER in the story, never the hero
- The audience's emotional journey IS the product
- The insight must be true to the audience's life, not the brand's self-image
- End on the brand's role — not on a product feature

Respond with ONLY valid JSON:
{
  "logline": "string — one sentence",
  "threeActSketch": "string — what happens in each act",
  "centralConflict": "string — the internal and external tension",
  "emotionalJourney": "string — how the audience feels at each stage",
  "resolution": "string — what changes, what is won",
  "brandMoment": "string — the precise moment the brand enters and why it's earned"
}`,

  characters: (structure: string, brandContext: string) => `
${brandContext}

You are a character development specialist.

Based on this narrative structure:
${structure}

Create character profiles. Every character needs:
- A contradiction (what makes them human, not a type)
- A fear that drives them without them knowing
- A transformation arc (even in 30 seconds, something must shift)

Respond with ONLY valid JSON:
{
  "protagonist": {
    "name": "string",
    "archetype": "string",
    "fear": "string",
    "ambition": "string",
    "talent": "string",
    "contradiction": "string",
    "voicePattern": "string — how they speak (clipped/verbose/poetic/direct)",
    "physicalSignature": "string — one visual detail (worn hands, red jacket, specific gait)",
    "transformationArc": "string"
  },
  "supporting": [],
  "worldRole": "string — the social role each character represents"
}`,

  world: (structure: string, characters: string, brandContext: string) => `
${brandContext}

You are a production designer and visual director.

Based on:
STRUCTURE: ${structure}
CHARACTERS: ${characters}

Design the visual world. Be specific enough for a creative director to brief a team.

Respond with ONLY valid JSON:
{
  "setting": "string — specific named location",
  "timePeriod": "string",
  "aestheticDirection": "string — 2-3 visual reference points",
  "colorPalette": "string — describe the color world",
  "soundscape": "string — what we hear",
  "lightingPhilosophy": "string — 1-2 sentences on the light",
  "productionNotes": "string — key production design elements that support the story"
}`,

  scenes: (structure: string, characters: string, world: string, brandContext: string, genre: string, duration: string) => `
${brandContext}

You are writing in proper screenplay format. You are an expert in ${genre} content.

NARRATIVE STRUCTURE:
${structure}

CHARACTER BIBLE:
${characters}

WORLD:
${world}

Write the complete scene-by-scene script for a ${duration} ${genre}.
Each scene must be more intense, revealing, or consequential than the previous scene of the same type.
No two scenes on the same emotional plateau.

CRITICAL: Visual notes in each scene become the prompts for the Craft (AI generation) module.
Make them precise — lighting direction, composition, character position, motion quality.

Respond with ONLY valid JSON:
{
  "title": "string",
  "scenes": [
    {
      "sceneNumber": 1,
      "heading": "INT./EXT. LOCATION - DAY/NIGHT",
      "action": "string — present tense, visual, specific",
      "dialogue": [{ "character": "NAME", "line": "string", "direction": "(beat) or (quietly)" }],
      "visualNote": "string — detailed production direction for AI generation",
      "emotionalBeat": "string — what the audience feels in this moment",
      "brandMoment": false,
      "duration": "string — e.g. '8 seconds'"
    }
  ]
}`,

  qualityCheck: (script: string, brief: string, brandContext: string) => `
${brandContext}

You are a script doctor and brand strategist. Evaluate this script against the brief.

ORIGINAL BRIEF: ${brief}

SCRIPT:
${script}

Score and evaluate:
1. Does it serve the brief without being a slave to it?
2. Is the brand an enabler (not the hero)?
3. Does the audience's emotional journey drive the narrative?
4. Is the insight true to the audience's life?
5. Does each scene escalate from the last?

Respond with ONLY valid JSON:
{
  "alignmentScore": 85,
  "brandEnablerScore": 90,
  "emotionalScore": 80,
  "strengths": ["string"],
  "issues": ["string — specific, actionable"],
  "recommendation": "approve|revise",
  "revisionNotes": "string — only if recommend revise"
}`,
};

// ── Pipeline runner ───────────────────────────────────────────────────────────

export async function runManifestPipeline(config: ScriptConfig): Promise<GeneratedScript> {
  const brandContext = config.projectId
    ? injectBrandContext('', config.projectId)
    : '';

  const update = (id: string, name: string, status: ScriptAgentUpdate['status'], output?: unknown) => {
    config.onAgentUpdate({
      agentId: id,
      agentName: name,
      status,
      output: output as string | Record<string, unknown>,
    });
  };

  // ── Agent 1: Narrative Structure ────────────────────────────────────────────
  update('structure', 'Narrative Architect', 'running');
  const structure = await callManifestAgent(
    MANIFEST_PROMPTS.structure(config.brief, brandContext, config.genre, config.duration)
  ) as NarrativeStructure;
  update('structure', 'Narrative Architect', 'complete', structure);

  // ── Agent 2: Character Development ─────────────────────────────────────────
  update('characters', 'Character Builder', 'running');
  const characters = await callManifestAgent(
    MANIFEST_PROMPTS.characters(JSON.stringify(structure), brandContext)
  ) as CharacterBible;
  update('characters', 'Character Builder', 'complete', characters);

  // ── Agent 3: Lock characters into Brand Memory ──────────────────────────────
  if (config.projectId && characters.protagonist) {
    const characterDNA: CharacterDNA = {
      id:                 `char_${Date.now()}`,
      name:               characters.protagonist.name,
      role:               'protagonist',
      physicalDescription: characters.protagonist.physicalSignature,
      clothingSignature:  '',
      facialFeatures:     '',
      bodyLanguage:       '',
      voicePattern:       characters.protagonist.voicePattern,
    };
    useBrandMemoryStore.getState().addCharacter(config.projectId, characterDNA);
    update('character_lock', 'Character Consistency Lock', 'complete', { locked: characters.protagonist.name });
  }

  // ── Agent 4: World Bible ────────────────────────────────────────────────────
  update('world', 'World Builder', 'running');
  const world = await callManifestAgent(
    MANIFEST_PROMPTS.world(JSON.stringify(structure), JSON.stringify(characters), brandContext)
  ) as WorldBible;
  update('world', 'World Builder', 'complete', world);

  // ── Lock visual language into Brand Memory ───────────────────────────────────
  if (config.projectId && world.colorPalette) {
    useBrandMemoryStore.getState().setVisual(config.projectId, {
      colorPalette:       [world.colorPalette],
      mood:               world.aestheticDirection,
      lightingPhilosophy: world.lightingPhilosophy,
      cameraStyle:        '',
      referenceDPs:       [],
      avoidAesthetics:    [],
      motifs:             [],
    });
  }

  // ── Agent 5: Scene Writing ──────────────────────────────────────────────────
  update('scenes', 'Scene Writer', 'running');
  const sceneOutput = await callManifestAgent(
    MANIFEST_PROMPTS.scenes(
      JSON.stringify(structure),
      JSON.stringify(characters),
      JSON.stringify(world),
      brandContext,
      config.genre,
      config.duration
    )
  ) as { title: string; scenes: ScriptScene[] };
  update('scenes', 'Scene Writer', 'complete', { sceneCount: sceneOutput.scenes?.length });

  // ── Agent 6: Quality Check + Brand Alignment ────────────────────────────────
  update('quality', 'Brand Alignment Auditor', 'running');
  const quality = await callManifestAgent(
    MANIFEST_PROMPTS.qualityCheck(JSON.stringify(sceneOutput), config.brief, brandContext)
  ) as { alignmentScore: number; brandEnablerScore: number; emotionalScore: number; recommendation: string };
  update('quality', 'Brand Alignment Auditor', 'complete', quality);

  // ── Assemble final script ────────────────────────────────────────────────────
  return {
    id:           `script_${Date.now()}`,
    title:        sceneOutput.title ?? config.brief.slice(0, 40),
    genre:        config.genre,
    duration:     config.duration,
    structure,
    characters,
    worldBible:   world,
    scenes:       sceneOutput.scenes ?? [],
    alignmentScore:   quality.alignmentScore   ?? 0,
    brandEnablerScore: quality.brandEnablerScore ?? 0,
    emotionalScore:   quality.emotionalScore   ?? 0,
    createdAt:    new Date().toISOString(),
  };
}

// ── Edge function caller ──────────────────────────────────────────────────────

async function callManifestAgent(prompt: string): Promise<unknown> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/manifest-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ prompt, model: 'smart', responseFormat: 'json' }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (err) {
    console.error('[manifest-agent] failed:', err);
    return {};
  }
}
