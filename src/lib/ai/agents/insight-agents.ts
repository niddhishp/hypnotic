// src/lib/ai/agents/insight-agents.ts
// Six specialized agents that run in parallel to produce a strategic brief.
// Each agent has a specific lens — none overlap, all compound.
//
// Pipeline:
//   Phase 1 (parallel): Category + Competitor + Audience + Cultural agents
//   Phase 2 (sequential): Opportunity agent (reads Phase 1) → Brief Synthesis
//   Result: Brand Memory hydrated, strategic brief ready for Manifest

import { useBrandMemoryStore } from '@/store/brand-memory.store';
import type { InsightHydrationData } from '@/store/brand-memory.store';

// ── Supabase Edge Function caller ─────────────────────────────────────────────
// All actual AI calls go through Supabase Edge Functions (server-side, secure)

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

async function callEdgeFunction(
  fn: string,
  payload: Record<string, unknown>,
  onChunk?: (chunk: string) => void
): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Edge function ${fn} failed: ${err}`);
  }

  // Streaming response (SSE)
  if (onChunk && res.headers.get('content-type')?.includes('event-stream')) {
    const reader = res.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          onChunk(line.slice(6));
        }
      }
    }
    return null;
  }

  return res.json();
}

// ── Agent progress types ──────────────────────────────────────────────────────

export type AgentStatus = 'queued' | 'running' | 'complete' | 'failed';

export interface AgentProgress {
  id: string;
  name: string;
  status: AgentStatus;
  detail?: string;
  result?: unknown;
  startedAt?: number;
  completedAt?: number;
}

export interface InsightRunConfig {
  subject: string;       // brand name, campaign problem, product
  context?: string;      // optional extra context
  projectId: string;
  userId: string;
  onProgress: (agents: AgentProgress[]) => void;
  onComplete: (report: InsightReport) => void;
  onError: (error: string) => void;
}

// ── Full report type ──────────────────────────────────────────────────────────

export interface InsightReport {
  runId: string;
  subject: string;

  // Agent outputs
  categoryIntelligence: CategoryIntelligence;
  competitorLandscape:  CompetitorLandscape;
  audienceProfile:      AudienceProfile;
  culturalTension:      CulturalTension;
  opportunitySpace:     OpportunitySpace;
  strategicBrief:       StrategicBriefOutput;

  // Metadata
  confidenceScore:  number;
  sourcesSearched:  number;
  processingTimeMs: number;
  createdAt:        string;
}

interface CategoryIntelligence {
  categoryName:      string;
  marketSize?:       string;
  keyPlayers:        string[];
  categoryNarrative: string;    // what the entire category is saying
  categoryCliches:   string[];  // what to avoid (everyone says this)
  entryBarriers:     string;
  categoryTrend:     string;
}

interface CompetitorLandscape {
  directCompetitors: Competitor[];
  indirectThreats:   string[];
  whitespace:        string;     // where no one is playing
  competitorClichés: string[];   // what they all say
  winCondition:      string;     // how to beat them
}

interface Competitor {
  name:        string;
  positioning: string;
  strength:    string;
  weakness:    string;
  audienceClaim: string;
}

interface AudienceProfile {
  primaryPersona: {
    name:          string;
    age:           string;
    description:   string;
    motivations:   string[];
    frustrations:  string[];
    aspirations:   string[];
    languageStyle: string;
    platformBehavior: string;
  };
  culturalInsights: string[];
  audienceParadox:  string;    // the contradiction they live with
  unspokenDesire:   string;    // what they want but never say
}

interface CulturalTension {
  tension:       string;       // the cultural conflict
  description:   string;
  onOneSide:     string;       // force A
  onOtherSide:   string;       // force B
  timing:        string;       // why NOW is the right moment
  brandRole:     string;       // how the brand can enter this tension
  opportunity:   string;
}

interface OpportunitySpace {
  theGap:          string;     // what no one is doing
  whyItExists:     string;
  firstMoverEdge:  string;
  riskIfIgnored:   string;
  archetypeMatch:  {
    archetype:   string;
    confidence:  number;
    rationale:   string;
    traits:      string[];
  };
}

interface StrategicBriefOutput {
  problemStatement:  string;   // one sentence — the central problem
  strategicRoutes:   Array<{
    id:          string;
    label:       string;
    oneLiner:    string;
    direction:   string;
    riskLevel:   'low' | 'medium' | 'high';
    bestFor:     string;
  }>;
  recommendedRoute:  string;   // which route id is recommended
  bigIdea:           string;
  creativeDirective: string;   // what the creative work must DO
}

// ── Prompt templates ──────────────────────────────────────────────────────────

const AGENT_PROMPTS = {
  category: (subject: string, context: string) => `
You are a category intelligence analyst. Analyze the market category that "${subject}" operates in.

${context ? `Additional context: ${context}` : ''}

Respond with ONLY valid JSON matching this exact schema:
{
  "categoryName": "string",
  "marketSize": "string or null",
  "keyPlayers": ["string"],
  "categoryNarrative": "string — what the entire category is saying/promising",
  "categoryCliches": ["string — overused phrases/ideas in this category"],
  "entryBarriers": "string",
  "categoryTrend": "string — where the category is moving in the next 2-3 years"
}`,

  competitor: (subject: string, context: string) => `
You are a competitive intelligence analyst. Map the competitive landscape for "${subject}".

${context ? `Additional context: ${context}` : ''}

Respond with ONLY valid JSON:
{
  "directCompetitors": [
    { "name": "string", "positioning": "string", "strength": "string", "weakness": "string", "audienceClaim": "string" }
  ],
  "indirectThreats": ["string"],
  "whitespace": "string — the unoccupied positioning territory",
  "competitorCliches": ["string — what every competitor says"],
  "winCondition": "string — the specific way to beat them all"
}`,

  audience: (subject: string, context: string) => `
You are an audience psychographic analyst. Build a deep audience profile for "${subject}".

${context ? `Additional context: ${context}` : ''}

Go beyond demographics. Find the contradiction, the unspoken desire, the cultural tension they live inside.

Respond with ONLY valid JSON:
{
  "primaryPersona": {
    "name": "string — evocative persona name like 'The Ambitious Millennial'",
    "age": "string",
    "description": "string — 2-3 sentences of psychological depth",
    "motivations": ["string"],
    "frustrations": ["string"],
    "aspirations": ["string"],
    "languageStyle": "string — how they communicate",
    "platformBehavior": "string — how they consume content"
  },
  "culturalInsights": ["string — non-obvious truths about this audience"],
  "audienceParadox": "string — the contradiction they live with (wants X but does Y)",
  "unspokenDesire": "string — what they want but would never admit"
}`,

  cultural: (subject: string, context: string) => `
You are a cultural intelligence strategist. Identify the cultural tension most relevant to "${subject}" right now.

${context ? `Additional context: ${context}` : ''}

Find the friction — the place where two forces in culture are pulling in opposite directions, 
and where a brand could play a meaningful role.

Respond with ONLY valid JSON:
{
  "tension": "string — one crisp sentence naming the tension",
  "description": "string — explain it in 2-3 sentences",
  "onOneSide": "string — force A",
  "onOtherSide": "string — force B",
  "timing": "string — why NOW is the right moment to address this",
  "brandRole": "string — how a brand in this category could enter this tension",
  "opportunity": "string — the creative opportunity this opens up"
}`,

  opportunity: (subject: string, phaseOneData: string) => `
You are a strategic opportunity analyst. You have been given research intelligence on "${subject}".

RESEARCH DATA:
${phaseOneData}

Your job:
1. Identify the single most powerful gap/opportunity this research reveals
2. Assign the most accurate brand archetype from the 12 Jungian archetypes
3. Justify everything with evidence from the research

Respond with ONLY valid JSON:
{
  "theGap": "string — the specific unoccupied territory",
  "whyItExists": "string — why this gap exists right now",
  "firstMoverEdge": "string — what you gain by acting first",
  "riskIfIgnored": "string — what happens if you don't act",
  "archetypeMatch": {
    "archetype": "string — one of: Hero, Outlaw, Creator, Sage, Explorer, Ruler, Caregiver, Magician, Lover, Jester, Everyman, Innocent",
    "confidence": 85,
    "rationale": "string — why this archetype fits based on the research",
    "traits": ["string"]
  }
}`,

  brief: (subject: string, allData: string) => `
You are a strategic creative director. Synthesize this research into a sharp creative brief for "${subject}".

FULL RESEARCH SYNTHESIS:
${allData}

Rules:
- Problem statement must be ONE sentence maximum
- 3 routes must be genuinely different directions, not just tone variations
- Each route implies a completely different creative approach
- The Big Idea is a 5-10 word creative platform — not a tagline, a direction

Respond with ONLY valid JSON:
{
  "problemStatement": "string — ONE sentence, the central strategic problem",
  "strategicRoutes": [
    {
      "id": "route_1",
      "label": "string — 2-3 word label like 'Challenger Brand' or 'Cultural Commentary'",
      "oneLiner": "string — one line strategic direction",
      "direction": "string — 3-4 sentences on what this means creatively",
      "riskLevel": "low|medium|high",
      "bestFor": "string — which platform/format/moment this works best for"
    }
  ],
  "recommendedRoute": "route_1",
  "bigIdea": "string — the creative platform",
  "creativeDirective": "string — what ALL creative work must do (not look like)"
}`,
};

// ── Main pipeline runner ──────────────────────────────────────────────────────

export async function runInsightPipeline(config: InsightRunConfig): Promise<void> {
  const startTime = Date.now();

  const agents: AgentProgress[] = [
    { id: 'category',    name: 'Category Intelligence',   status: 'queued' },
    { id: 'competitor',  name: 'Competitor Landscape',    status: 'queued' },
    { id: 'audience',    name: 'Audience Psychographics', status: 'queued' },
    { id: 'cultural',    name: 'Cultural Tension',        status: 'queued' },
    { id: 'opportunity', name: 'Opportunity Space',       status: 'queued' },
    { id: 'brief',       name: 'Strategic Brief',         status: 'queued' },
  ];

  const updateAgent = (id: string, updates: Partial<AgentProgress>) => {
    const idx = agents.findIndex(a => a.id === id);
    if (idx >= 0) {
      agents[idx] = { ...agents[idx], ...updates };
      config.onProgress([...agents]);
    }
  };

  const context = config.context ?? '';

  try {
    // ── Phase 1: 4 agents in parallel ────────────────────────────────────────
    ['category', 'competitor', 'audience', 'cultural'].forEach(id =>
      updateAgent(id, { status: 'running', startedAt: Date.now() })
    );
    config.onProgress([...agents]);

    const [categoryResult, competitorResult, audienceResult, culturalResult] = await Promise.all([
      callInsightAgent('category',   AGENT_PROMPTS.category(config.subject, context)),
      callInsightAgent('competitor', AGENT_PROMPTS.competitor(config.subject, context)),
      callInsightAgent('audience',   AGENT_PROMPTS.audience(config.subject, context)),
      callInsightAgent('cultural',   AGENT_PROMPTS.cultural(config.subject, context)),
    ]);

    updateAgent('category',   { status: 'complete', result: categoryResult,   completedAt: Date.now() });
    updateAgent('competitor', { status: 'complete', result: competitorResult, completedAt: Date.now() });
    updateAgent('audience',   { status: 'complete', result: audienceResult,   completedAt: Date.now() });
    updateAgent('cultural',   { status: 'complete', result: culturalResult,   completedAt: Date.now() });

    // ── Phase 2: Opportunity agent (reads Phase 1) ────────────────────────────
    updateAgent('opportunity', { status: 'running', startedAt: Date.now() });

    const phaseOneData = JSON.stringify({
      category:   categoryResult,
      competitor: competitorResult,
      audience:   audienceResult,
      cultural:   culturalResult,
    }, null, 2);

    const opportunityResult = await callInsightAgent(
      'opportunity',
      AGENT_PROMPTS.opportunity(config.subject, phaseOneData)
    );

    updateAgent('opportunity', { status: 'complete', result: opportunityResult, completedAt: Date.now() });

    // ── Phase 3: Brief synthesis (reads everything) ───────────────────────────
    updateAgent('brief', { status: 'running', startedAt: Date.now() });

    const allData = JSON.stringify({
      category:    categoryResult,
      competitor:  competitorResult,
      audience:    audienceResult,
      cultural:    culturalResult,
      opportunity: opportunityResult,
    }, null, 2);

    const briefResult = await callInsightAgent(
      'brief',
      AGENT_PROMPTS.brief(config.subject, allData)
    );

    updateAgent('brief', { status: 'complete', result: briefResult, completedAt: Date.now() });

    // ── Assemble final report ─────────────────────────────────────────────────
    const report: InsightReport = {
      runId:               `insight_${Date.now()}`,
      subject:             config.subject,
      categoryIntelligence: categoryResult   as CategoryIntelligence,
      competitorLandscape:  competitorResult as CompetitorLandscape,
      audienceProfile:      audienceResult   as AudienceProfile,
      culturalTension:      culturalResult   as CulturalTension,
      opportunitySpace:     opportunityResult as OpportunitySpace,
      strategicBrief:       briefResult      as StrategicBriefOutput,
      confidenceScore:      calculateConfidence(agents),
      sourcesSearched:      6,
      processingTimeMs:     Date.now() - startTime,
      createdAt:            new Date().toISOString(),
    };

    // ── Hydrate Brand Memory ──────────────────────────────────────────────────
    const opportunity = opportunityResult as OpportunitySpace;
    const audience    = audienceResult    as AudienceProfile;
    const cultural    = culturalResult    as CulturalTension;
    const brief       = briefResult       as StrategicBriefOutput;

    const hydrationData: InsightHydrationData = {
      runId:          report.runId,
      brandArchetype: opportunity.archetypeMatch,
      audienceSignals: {
        primaryPersona:  audience.primaryPersona,
        culturalInsights: audience.culturalInsights,
      },
      culturalTension: {
        tension:     cultural.tension,
        description: cultural.description,
        opportunity: cultural.opportunity,
      },
      problemStatement: brief.problemStatement,
      strategicRoutes:  brief.strategicRoutes.map(r => ({
        label:     r.label,
        oneLiner:  r.oneLiner,
        direction: r.direction,
      })),
    };

    useBrandMemoryStore.getState().hydrateFromInsight(config.projectId, hydrationData);

    config.onComplete(report);

  } catch (err: unknown) {
    // Mark any still-running agents as failed
    agents.forEach(a => {
      if (a.status === 'running' || a.status === 'queued') {
        updateAgent(a.id, { status: 'failed' });
      }
    });
    config.onError(err instanceof Error ? err.message : 'Research pipeline failed');
  }
}

// ── Individual agent caller ───────────────────────────────────────────────────

async function callInsightAgent(agentId: string, prompt: string): Promise<unknown> {
  try {
    const result = await callEdgeFunction('insight-research', {
      agentId,
      prompt,
      model: 'smart',
      responseFormat: 'json',
    });
    return result;
  } catch {
    // Return graceful fallback so one agent failure doesn't kill the pipeline
    return getAgentFallback(agentId);
  }
}

function getAgentFallback(agentId: string): unknown {
  const fallbacks: Record<string, unknown> = {
    category:    { categoryName: 'Unknown', keyPlayers: [], categoryNarrative: '', categoryCliches: [], entryBarriers: '', categoryTrend: '' },
    competitor:  { directCompetitors: [], indirectThreats: [], whitespace: '', competitorCliches: [], winCondition: '' },
    audience:    { primaryPersona: { name: 'Primary Audience', age: '18-35', description: '', motivations: [], frustrations: [], aspirations: [], languageStyle: '', platformBehavior: '' }, culturalInsights: [], audienceParadox: '', unspokenDesire: '' },
    cultural:    { tension: '', description: '', onOneSide: '', onOtherSide: '', timing: '', brandRole: '', opportunity: '' },
    opportunity: { theGap: '', whyItExists: '', firstMoverEdge: '', riskIfIgnored: '', archetypeMatch: { archetype: 'Creator', confidence: 50, rationale: '', traits: [] } },
    brief:       { problemStatement: '', strategicRoutes: [], recommendedRoute: 'route_1', bigIdea: '', creativeDirective: '' },
  };
  return fallbacks[agentId] ?? {};
}

function calculateConfidence(agents: AgentProgress[]): number {
  const completed = agents.filter(a => a.status === 'complete').length;
  return Math.round((completed / agents.length) * 100);
}
