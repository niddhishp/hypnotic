// supabase/functions/manifest-generate/index.ts
// Streams strategy deck / script generation section by section via SSE.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, err, sse, withTimeout, logUsage } from '../_shared/utils.ts';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENROUTER_KEY       = Deno.env.get('OPENROUTER_API_KEY')!;

const DECK_SECTIONS = [
  { id: 'brief_decode',        title: 'Brief Decode',                    required: true  },
  { id: 'audience_psychology', title: 'Audience Map & Psychology',       required: true  },
  { id: 'competitive_map',     title: 'Competitive Landscape',           required: true  },
  { id: 'cultural_tension',    title: 'Cultural Tension & Opportunity',  required: true  },
  { id: 'revelation',          title: 'The Revelation',                  required: true  },
  { id: 'manifesto',           title: 'Strategic Manifesto',             required: true  },
  { id: 'big_idea',            title: 'The Big Idea',                    required: true  },
  { id: 'creative_voice',      title: 'Creative Voice & Expression',     required: true  },
  { id: 'hero_concept',        title: 'Hero Content Concept',            required: true  },
  { id: 'content_system',      title: 'Content & Publishing System',     required: false },
  { id: 'executive_summary',   title: 'Executive Summary',               required: true  },
];

async function generateSection(
  sectionId: string,
  sectionTitle: string,
  context: string
): Promise<string> {
  const SYSTEM = `You are an award-winning creative strategist and brand planner writing a ${sectionTitle} section for a strategy deck.

TONE: Direct, insightful, never generic. Write like a top creative director presenting to a C-suite.
LENGTH: 150-250 words. Flowing prose, no markdown headers or bullet points.
ANTI-HALLUCINATION: Only reference facts from the brief and context provided.`;

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer':  'https://hypnotic.ai',
      'X-Title':       'Hypnotic',
    },
    body: JSON.stringify({
      model:       'anthropic/claude-sonnet-4-5',
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user',   content: `SECTION TO WRITE: ${sectionTitle}\n\nCONTEXT:\n${context}` },
      ],
      temperature: 0.6,
      max_tokens:  600,
    }),
  });

  if (!r.ok) throw new Error(`OpenRouter ${r.status}`);
  const d = await r.json();
  return d.choices?.[0]?.message?.content?.trim() ?? '';
}

Deno.serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const start = Date.now();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return err('Unauthorized', 401);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await createClient(
      SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    ).auth.getUser();
    if (authErr || !user) return err('Unauthorized', 401);

    const { runId, insightRunId, customBrief, outputType, projectId } = await req.json();
    if (!runId) return err('runId required');

    // Build context
    let context = customBrief ?? '';
    if (insightRunId) {
      const { data: report } = await db
        .from('insight_runs')
        .select('subject, executive_summary, problem_statement, brand_archetype, strategic_routes')
        .eq('id', insightRunId)
        .single();
      if (report) {
        context = `SUBJECT: ${report.subject}
EXECUTIVE SUMMARY: ${report.executive_summary}
PROBLEM STATEMENT: ${report.problem_statement}
BRAND ARCHETYPE: ${JSON.stringify(report.brand_archetype)}
TOP STRATEGIC ROUTE: ${JSON.stringify((report.strategic_routes as any)?.[0])}

CUSTOM ADDITIONS: ${customBrief ?? 'None'}`;
      }
    }

    // Select sections based on output type
    const sections = outputType === 'strategy_deck' ? DECK_SECTIONS : DECK_SECTIONS.filter(s => s.required);

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        const send = (data: unknown) => {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          const savedSections: Record<string, string> = {};

          for (const section of sections) {
            // Notify client: section starting
            send({ type: 'section_start', sectionId: section.id, title: section.title });

            try {
              const content = await withTimeout(
                generateSection(section.id, section.title, context),
                90000
              );
              savedSections[section.id] = content;

              // Notify client: section done
              send({ type: 'section_done', sectionId: section.id, title: section.title, content });

              // Save incrementally to DB (crash safety)
              await db.from('manifest_runs')
                .update({
                  sections: savedSections,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', runId);

            } catch (sectionErr) {
              console.error(`[manifest] section ${section.id} failed:`, sectionErr);
              send({ type: 'section_error', sectionId: section.id, title: section.title });
              savedSections[section.id] = '';
            }
          }

          // Mark complete
          await db.from('manifest_runs')
            .update({ status: 'complete', updated_at: new Date().toISOString() })
            .eq('id', runId);

          // Deduct credits
          await db.rpc('deduct_generation_credit', { p_user_id: user.id, p_amount: 5 });

          // Log usage
          await logUsage(db, {
            userId: user.id, projectId, module: 'manifest',
            operation: `manifest_${outputType}`,
            modelId: 'anthropic/claude-sonnet-4-5', provider: 'openrouter',
            creditsUsed: 5, latencyMs: Date.now() - start, status: 'success', requestId: runId,
          });

          send({ type: 'complete', runId });

        } catch (e) {
          await db.from('manifest_runs')
            .update({ status: 'failed', error_message: String(e) })
            .eq('id', runId);
          send({ type: 'error', message: 'Generation failed' });
        } finally {
          controller.close();
        }
      },
    });

    return sse(stream);

  } catch (e) {
    console.error('[manifest-generate]', e);
    return err('Generation failed. Please try again.', 500);
  }
});
