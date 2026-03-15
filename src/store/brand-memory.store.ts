// src/store/brand-memory.store.ts
// The Brand Memory is the consistency engine of Hypnotic.
// Every module reads from and writes to this store.
// When you run Insight on Nike, that brand knowledge is automatically
// injected into Manifest, Craft, and Amplify — nothing deviates.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Core brand DNA types ──────────────────────────────────────────────────────

export interface BrandPersona {
  name: string;                    // "The Hero"
  archetype: string;               // "Hero"
  traits: string[];                // ["brave", "determined", "skilled"]
  voice: string;                   // "powerful, direct, earned confidence"
  antiVoice: string[];             // words/tones to never use
  bannedWords: string[];           // ["empower", "journey", "holistic"]
}

export interface AudienceProfile {
  name: string;                    // "Urban Ambitionists"
  age: string;                     // "18-28"
  psychographic: string;           // 2-sentence character summary
  motivations: string[];
  frustrations: string[];
  culturalTension: string;         // the conflict they're living inside
  platformBehavior: string;        // how they consume content
  languageStyle: string;           // "clipped, direct, meme-native"
}

export interface VisualLanguage {
  colorPalette: string[];          // hex codes
  mood: string;                    // "raw, film-grain, asymmetric"
  lightingPhilosophy: string;      // "harsh practical light, no fills"
  cameraStyle: string;             // "handheld, compressed telephoto"
  referenceDPs: string[];          // cinematographer references
  avoidAesthetics: string[];       // what to never generate
  motifs: string[];                // "broken objects, sidewalk level"
}

export interface CharacterDNA {
  id: string;
  name: string;
  role: string;                    // "protagonist" | "antagonist" | "supporting"
  physicalDescription: string;
  clothingSignature: string;       // locked for visual consistency
  facialFeatures: string;          // for image generation consistency
  bodyLanguage: string;
  voicePattern: string;
  referenceImageUrl?: string;      // locked reference image
  falCharacterId?: string;         // fal.ai character consistency ID
}

export interface StrategicBrief {
  problemStatement: string;        // "ONE crisp sentence — the central problem"
  culturalTension: string;         // the friction the brand can resolve
  chosenRoute: string;             // which strategic direction was approved
  bigIdea: string;                 // the creative platform
  creativeDirective: string;       // what the creative work must DO (not look like)
  measurableGoal: string;          // what success looks like
}

export interface BrandMemory {
  projectId: string;
  brandName: string;
  category: string;

  // Core brand DNA
  persona: BrandPersona | null;
  audience: AudienceProfile | null;
  visual: VisualLanguage | null;
  brief: StrategicBrief | null;

  // Production assets — locked for consistency
  characters: CharacterDNA[];

  // Cross-module context
  insightRunId: string | null;     // which Insight report generated this
  manifestRunId: string | null;    // which Manifest deck elaborated this
  lastUpdated: string;

  // Quality & confidence
  completeness: number;            // 0-100: how much brand DNA is populated
}

// ── Store interface ───────────────────────────────────────────────────────────

interface BrandMemoryState {
  memories: Record<string, BrandMemory>;   // keyed by projectId
  activeMemory: BrandMemory | null;

  // CRUD
  initMemory:      (projectId: string, brandName: string) => BrandMemory;
  updateMemory:    (projectId: string, updates: Partial<BrandMemory>) => void;
  setActiveMemory: (projectId: string) => void;
  getMemory:       (projectId: string) => BrandMemory | null;

  // Module-specific setters
  setPersona:     (projectId: string, persona: BrandPersona) => void;
  setAudience:    (projectId: string, audience: AudienceProfile) => void;
  setVisual:      (projectId: string, visual: VisualLanguage) => void;
  setBrief:       (projectId: string, brief: StrategicBrief) => void;
  addCharacter:   (projectId: string, character: CharacterDNA) => void;
  updateCharacter:(projectId: string, characterId: string, updates: Partial<CharacterDNA>) => void;

  // Called by Insight pipeline after completion
  hydrateFromInsight: (projectId: string, insightData: InsightHydrationData) => void;

  // Completeness calculator
  calculateCompleteness: (memory: BrandMemory) => number;

  // Context builder — called by every module before any AI call
  buildContext:    (projectId: string) => string;
}

export interface InsightHydrationData {
  runId: string;
  brandArchetype?: { archetype: string; confidence: number; traits: string[]; rationale: string };
  audienceSignals?: {
    primaryPersona?: {
      name: string; age: string; description: string;
      motivations: string[]; frustrations: string[];
    };
    culturalInsights?: string[];
  };
  culturalTension?: { tension: string; description: string; opportunity: string };
  problemStatement?: string;
  strategicRoutes?: Array<{ label: string; oneLiner: string; direction: string }>;
}

// ── Store implementation ──────────────────────────────────────────────────────

function emptyMemory(projectId: string, brandName: string): BrandMemory {
  return {
    projectId,
    brandName,
    category: '',
    persona:    null,
    audience:   null,
    visual:     null,
    brief:      null,
    characters: [],
    insightRunId:  null,
    manifestRunId: null,
    lastUpdated: new Date().toISOString(),
    completeness: 0,
  };
}

export const useBrandMemoryStore = create<BrandMemoryState>()(
  persist(
    (set, get) => ({
      memories:      {},
      activeMemory:  null,

      initMemory: (projectId, brandName) => {
        const existing = get().memories[projectId];
        if (existing) return existing;
        const memory = emptyMemory(projectId, brandName);
        set(s => ({ memories: { ...s.memories, [projectId]: memory } }));
        return memory;
      },

      updateMemory: (projectId, updates) => {
        set(s => {
          const current = s.memories[projectId] ?? emptyMemory(projectId, updates.brandName ?? '');
          const updated = { ...current, ...updates, lastUpdated: new Date().toISOString() };
          updated.completeness = get().calculateCompleteness(updated);
          return {
            memories: { ...s.memories, [projectId]: updated },
            activeMemory: s.activeMemory?.projectId === projectId ? updated : s.activeMemory,
          };
        });
      },

      setActiveMemory: (projectId) => {
        const memory = get().memories[projectId] ?? null;
        set({ activeMemory: memory });
      },

      getMemory: (projectId) => get().memories[projectId] ?? null,

      setPersona: (projectId, persona) =>
        get().updateMemory(projectId, { persona }),

      setAudience: (projectId, audience) =>
        get().updateMemory(projectId, { audience }),

      setVisual: (projectId, visual) =>
        get().updateMemory(projectId, { visual }),

      setBrief: (projectId, brief) =>
        get().updateMemory(projectId, { brief }),

      addCharacter: (projectId, character) => {
        const memory = get().memories[projectId];
        if (!memory) return;
        const exists = memory.characters.find(c => c.id === character.id);
        if (exists) return;
        get().updateMemory(projectId, { characters: [...memory.characters, character] });
      },

      updateCharacter: (projectId, characterId, updates) => {
        const memory = get().memories[projectId];
        if (!memory) return;
        get().updateMemory(projectId, {
          characters: memory.characters.map(c =>
            c.id === characterId ? { ...c, ...updates } : c
          ),
        });
      },

      // ── Called by Insight pipeline after research completes ──────────────
      hydrateFromInsight: (projectId, data) => {
        const memory = get().memories[projectId] ?? emptyMemory(projectId, '');

        const updates: Partial<BrandMemory> = {
          insightRunId: data.runId,
        };

        // Map archetype → persona
        if (data.brandArchetype) {
          const archetypeVoiceMap: Record<string, { voice: string; antiVoice: string[] }> = {
            'Hero':     { voice: 'powerful, direct, earned confidence',     antiVoice: ['humble', 'soft', 'tentative'] },
            'Outlaw':   { voice: 'provocative, unconventional, raw',         antiVoice: ['corporate', 'polished', 'safe'] },
            'Creator':  { voice: 'visionary, aesthetic, original',           antiVoice: ['generic', 'templated', 'mass'] },
            'Sage':     { voice: 'authoritative, thoughtful, precise',       antiVoice: ['vague', 'simplistic', 'hype'] },
            'Explorer': { voice: 'bold, inspiring, discovery-driven',        antiVoice: ['safe', 'comfortable', 'domestic'] },
            'Magician': { voice: 'inspiring, transformative, mysterious',    antiVoice: ['literal', 'mechanical', 'expected'] },
            'Everyman': { voice: 'conversational, honest, relatable',        antiVoice: ['elite', 'exclusive', 'jargon'] },
            'Lover':    { voice: 'emotive, sensory, intimate',               antiVoice: ['cold', 'clinical', 'distant'] },
            'Jester':   { voice: 'humorous, light, spontaneous',             antiVoice: ['serious', 'formal', 'weighty'] },
            'Caregiver':{ voice: 'warm, protective, nurturing',              antiVoice: ['cold', 'aggressive', 'self-focused'] },
            'Ruler':    { voice: 'confident, decisive, commanding',          antiVoice: ['uncertain', 'casual', 'democratic'] },
            'Innocent': { voice: 'warm, optimistic, simple, trustworthy',    antiVoice: ['cynical', 'complex', 'dark'] },
          };

          const archName = data.brandArchetype.archetype.replace('The ', '');
          const voiceInfo = archetypeVoiceMap[archName] ?? { voice: 'clear and direct', antiVoice: [] };

          updates.persona = {
            name:        data.brandArchetype.archetype,
            archetype:   archName,
            traits:      data.brandArchetype.traits ?? [],
            voice:       voiceInfo.voice,
            antiVoice:   voiceInfo.antiVoice,
            bannedWords: [],
          };
        }

        // Map audience signals
        if (data.audienceSignals?.primaryPersona) {
          const p = data.audienceSignals.primaryPersona;
          updates.audience = {
            name:            p.name,
            age:             p.age,
            psychographic:   p.description,
            motivations:     p.motivations ?? [],
            frustrations:    p.frustrations ?? [],
            culturalTension: data.culturalTension?.tension ?? '',
            platformBehavior:'',
            languageStyle:   '',
          };
        }

        // Map strategic brief
        if (data.problemStatement) {
          const topRoute = data.strategicRoutes?.[0];
          updates.brief = {
            problemStatement: data.problemStatement,
            culturalTension:  data.culturalTension?.tension ?? '',
            chosenRoute:      topRoute?.label ?? '',
            bigIdea:          topRoute?.oneLiner ?? '',
            creativeDirective:'',
            measurableGoal:   '',
          };
        }

        get().updateMemory(projectId, updates);
      },

      // ── Completeness score (0–100) ─────────────────────────────────────────
      calculateCompleteness: (memory) => {
        let score = 0;
        if (memory.persona)          score += 25;
        if (memory.audience)         score += 20;
        if (memory.visual)           score += 15;
        if (memory.brief?.bigIdea)   score += 25;
        if (memory.characters.length > 0) score += 15;
        return score;
      },

      // ── Context builder — called by every module before AI calls ──────────
      // This is the single source of truth injected into every prompt
      buildContext: (projectId) => {
        const memory = get().memories[projectId];
        if (!memory) return '';

        const parts: string[] = [`BRAND MEMORY — ${memory.brandName.toUpperCase()}`];

        if (memory.persona) {
          parts.push(`
BRAND ARCHETYPE: ${memory.persona.name}
Voice: ${memory.persona.voice}
Traits: ${memory.persona.traits.join(', ')}
Never sound: ${memory.persona.antiVoice.join(', ')}
${memory.persona.bannedWords.length ? `Banned words: ${memory.persona.bannedWords.join(', ')}` : ''}`);
        }

        if (memory.audience) {
          parts.push(`
TARGET AUDIENCE: ${memory.audience.name} (${memory.audience.age})
${memory.audience.psychographic}
Motivations: ${memory.audience.motivations.slice(0, 3).join(' | ')}
Cultural tension they live inside: ${memory.audience.culturalTension}`);
        }

        if (memory.brief?.problemStatement) {
          parts.push(`
STRATEGIC BRIEF:
Problem: ${memory.brief.problemStatement}
Creative direction: ${memory.brief.chosenRoute} — ${memory.brief.bigIdea}
${memory.brief.creativeDirective ? `The work must: ${memory.brief.creativeDirective}` : ''}`);
        }

        if (memory.visual) {
          parts.push(`
VISUAL LANGUAGE:
Mood: ${memory.visual.mood}
Color: ${memory.visual.colorPalette.join(', ')}
Camera: ${memory.visual.cameraStyle}
Never generate: ${memory.visual.avoidAesthetics.join(', ')}`);
        }

        if (memory.characters.length > 0) {
          parts.push(`
LOCKED CHARACTERS (maintain visual consistency):
${memory.characters.map(c =>
  `${c.name} (${c.role}): ${c.physicalDescription}. Wearing: ${c.clothingSignature}`
).join('\n')}`);
        }

        return parts.join('\n');
      },
    }),
    {
      name: 'hypnotic-brand-memory',
      partialize: (s) => ({ memories: s.memories }),
    }
  )
);
