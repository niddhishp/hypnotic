// supabase/functions/insight-research/index.ts
// Runs the full Insight research pipeline:
//   1. Parallel web search across 8 categories (Exa API)
//   2. Multi-agent AI synthesis (Claude Sonnet via OpenRouter)
//   3. Saves structured report to insight_runs table

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, json, err, withTimeout, logUsage } from '../_shared/utils.ts';

const SUPABASE_URL        = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENROUTER_KEY      = Deno.env.get('OPENROUTER_API_KEY')!;
const EXA_KEY             = Deno.env.get('EXA_API_KEY');
const SERPAPI_KEY         = Deno.env.get('SERPAPI_KEY');
const BRAVE_KEY           = Deno.env.get('BRAVE_SEARCH_API_KEY');

// ── Search providers ─────────────────────────────────────────────────────────

interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  publishedDate?: string;
}

async function searchExa(query: string, numResults = 8): Promise<SearchResult[]> {
  if (!EXA_KEY) throw new Error('EXA_API_KEY not set');
  const r = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': EXA_KEY },
    body: JSON.stringify({ query, numResults, useAutoprompt: true, type: 'neural' }),
  });
  if (!r.ok) throw new Error(`Exa ${r.status}`);
  const d = await r.json();
  return (d.results ?? []).map((x: any) => ({
    url: x.url, title: x.title ?? '', snippet: x.text ?? '',
    publishedDate: x.publishedDate,
  }));
}

async function searchSerpApi(query: string, num = 8): Promise<SearchResult[]> {
  if (!SERPAPI_KEY) throw new Error('SERPAPI_KEY not set');
  const u = `https://serpapi.com/search?q=${encodeURIComponent(query)}&num=${num}&api_key=${SERPAPI_KEY}`;
  const r = await fetch(u);
  if (!r.ok) throw new Error(`SerpAPI ${r.status}`);
  const d = await r.json();
  return (d.organic_results ?? []).map((x: any) => ({
    url: x.link ?? '', title: x.title ?? '', snippet: x.snippet ?? '',
  }));
}

async function searchBrave(query: string, count = 8): Promise<SearchResult[]> {
  if (!BRAVE_KEY) throw new Error('BRAVE_SEARCH_API_KEY not set');
  const u = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
  const r = await fetch(u, { headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_KEY } });
  if (!r.ok) throw new Error(`Brave ${r.status}`);
  const d = await r.json();
  return (d.web?.results ?? []).map((x: any) => ({
    url: x.url ?? '', title: x.title ?? '', snippet: x.description ?? '',
  }));
}

function isQuotaError(err: unknown) {
  const m = String(err).toLowerCase();
  return m.includes('quota') || m.includes('rate limit') || m.includes('429') || m.includes('credits');
}

async function webSearch(query: string): Promise<SearchResult[]> {
  const providers = [
    EXA_KEY    ? () => searchExa(query)      : null,
    SERPAPI_KEY ? () => searchSerpApi(query) : null,
    BRAVE_KEY  ? () => searchBrave(query)    : null,
  ].filter(Boolean) as Array<() => Promise<SearchResult[]>>;

  for (const provider of providers) {
    try {
      const results = await withTimeout(provider(), 8000);
      if (results.length > 0) return results;
    } catch (e) {
      if (isQuotaError(e)) continue;
      console.warn('[search] provider error:', e);
    }
  }
  return [];
}

// ── AI call via OpenRouter ────────────────────────────────────────────────────

async function callAI(systemPrompt: string, userContent: string, model = 'anthropic/claude-sonnet-4-5'): Promise<string> {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer': 'https://hypnotic.ai',
      'X-Title': 'Hypnotic',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userContent  },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`OpenRouter ${r.status}: ${text}`);
  }

  const d = await r.json();
  return d.choices?.[0]?.message?.content ?? '{}';
}

// ── System prompts (hardcoded fallback) ───────────────────────────────────────

const PROMPTS = {
  synthesis: `You are an expert brand strategist. Synthesise raw web search results about a brand, product, or campaign problem into structured intelligence.
RULES: Only report what data shows. Be specific. Name brands, quote numbers. If data conflicts, note it.
Respond JSON only: { "executiveSummary": "string", "whatDataShows": { "keyFindings": ["..."] }, "confidenceScore": 85, "sourcesSearched": 12 }`,

  audience: `You are a cultural strategist. Build a deep audience profile from search data.
Respond JSON only: { "audienceSignals": { "primaryPersona": { "name": "The X", "age": "25-35", "description": "string", "motivations": [], "frustrations": [], "aspirations": [] }, "culturalInsights": [] } }`,

  competitive: `You are a competitive intelligence analyst. Map the competitive landscape.
Respond JSON only: { "competitiveLandscape": { "keyPlayers": [{ "name": "string", "positioning": "string", "gap": "string" }], "whitespace": "string" } }`,

  archetype: `You are a brand strategist assigning Jungian archetypes. Choose from: Innocent, Sage, Explorer, Ruler, Creator, Caregiver, Magician, Hero, Outlaw, Lover, Jester, Everyman.
Respond JSON only: { "brandArchetype": { "archetype": "The Hero", "confidence": 87, "rationale": "string", "traits": [] } }`,

  culturalTension: `You are a cultural strategist. Identify the key cultural tension and opportunity.
Respond JSON only: { "culturalTension": { "tension": "string", "description": "string", "opportunity": "string" } }`,

  routes: `You are a creative strategist generating 3 genuinely different strategic routes. Each must imply a different creative approach.
Respond JSON only: { "problemStatement": "string", "strategicRoutes": [{ "id": "r1", "label": "string", "oneLiner": "string", "direction": "string", "riskLevel": "low", "impact": "string" }] }`,
};

// ── Search categories ─────────────────────────────────────────────────────────

function buildQueries(subject: string) {
  return [
    { id: 'brand',       query: `${subject} brand positioning market share 2024 2025`         },
    { id: 'news',        query: `${subject} news coverage media mentions recent`               },
    { id: 'audience',    query: `${subject} target audience consumer insights demographics`    },
    { id: 'competitive', query: `${subject} competitors competitive landscape alternatives`    },
    { id: 'culture',     query: `${subject} cultural trends zeitgeist cultural moment`         },
    { id: 'category',    query: `${subject} industry category analysis market trends`          },
    { id: 'sentiment',   query: `${subject} customer reviews sentiment opinion reddit twitter` },
    { id: 'digital',     query: `${subject} digital presence social media marketing strategy` },
  ];
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const start = Date.now();

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return err('Unauthorized', 401);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await createClient(
      SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    ).auth.getUser();
    if (authErr || !user) return err('Unauthorized', 401);

    // Parse input
    const { subject, context, projectId, runId } = await req.json();
    if (!subject || !runId) return err('subject and runId required');

    // Update status: researching
    await db.from('insight_runs').update({ status: 'researching' }).eq('id', runId);

    // Phase 1: Parallel web search (4 at a time)
    const queries = buildQueries(subject);
    const allResults: Record<string, SearchResult[]> = {};
    let totalResults = 0;

    for (let i = 0; i < queries.length; i += 4) {
      const batch = queries.slice(i, i + 4);
      const results = await Promise.allSettled(
        batch.map(q => webSearch(q.query))
      );
      results.forEach((r, idx) => {
        const qr = r.status === 'fulfilled' ? r.value : [];
        allResults[batch[idx].id] = qr;
        totalResults += qr.length;
      });
    }

    // Build context for AI synthesis
    const contextText = Object.entries(allResults)
      .map(([cat, results]) => {
        const snippets = results.slice(0, 5).map(r => `- ${r.title}: ${r.snippet}`).join('\n');
        return `### ${cat.toUpperCase()}\n${snippets}`;
      })
      .join('\n\n');

    const fullContext = `SUBJECT: ${subject}${context ? `\nCONTEXT: ${context}` : ''}\n\n${contextText}`;

    // Phase 2: Run AI synthesis agents in parallel (3 at a time)
    const [synthResult, audienceResult, compResult] = await Promise.allSettled([
      withTimeout(callAI(PROMPTS.synthesis, fullContext), 60000),
      withTimeout(callAI(PROMPTS.audience, fullContext), 60000),
      withTimeout(callAI(PROMPTS.competitive, fullContext), 60000),
    ]);

    const [archetypeResult, tensionResult, routesResult] = await Promise.allSettled([
      withTimeout(callAI(PROMPTS.archetype, fullContext), 45000),
      withTimeout(callAI(PROMPTS.culturalTension, fullContext), 45000),
      withTimeout(callAI(PROMPTS.routes, fullContext), 90000),
    ]);

    const parse = (r: PromiseSettledResult<string>) => {
      if (r.status === 'rejected') return {};
      try { return JSON.parse(r.value); } catch { return {}; }
    };

    const synth    = parse(synthResult);
    const audience = parse(audienceResult);
    const comp     = parse(compResult);
    const archetype = parse(archetypeResult);
    const tension  = parse(tensionResult);
    const routes   = parse(routesResult);

    // Phase 3: Save complete report
    await db.from('insight_runs').update({
      executive_summary:    synth.executiveSummary ?? '',
      what_data_shows:      synth.whatDataShows ?? {},
      audience_signals:     audience.audienceSignals ?? {},
      competitive_landscape: comp.competitiveLandscape ?? {},
      cultural_tension:     tension.culturalTension ?? {},
      brand_archetype:      archetype.brandArchetype ?? {},
      problem_statement:    routes.problemStatement ?? '',
      strategic_routes:     routes.strategicRoutes ?? [],
      confidence_score:     synth.confidenceScore ?? 70,
      sources_searched:     queries.length,
      total_results:        totalResults,
      status:               'complete',
      completed_at:         new Date().toISOString(),
    }).eq('id', runId);

    // Log usage
    await logUsage(db, {
      userId: user.id,
      projectId,
      module: 'insight',
      operation: 'insight_research',
      modelId: 'anthropic/claude-sonnet-4-5',
      provider: 'openrouter',
      creditsUsed: 10,
      latencyMs: Date.now() - start,
      status: 'success',
      requestId: runId,
    });

    // Deduct credits
    await db.rpc('deduct_generation_credit', { p_user_id: user.id, p_amount: 10 });

    return json({ success: true, runId, totalResults });

  } catch (e) {
    console.error('[insight-research]', e);
    return err('Research pipeline failed. Please try again.', 500);
  }
});
