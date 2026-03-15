// supabase/functions/insight-research/index.ts
// Unified AI caller for all Insight and Manifest agents.
// Accepts: { agentId, prompt, model, responseFormat }
// Returns: parsed JSON or text depending on responseFormat

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Model routing
const MODELS: Record<string, string> = {
  smart:  "anthropic/claude-sonnet-4-6",
  fast:   "anthropic/claude-haiku-4-5-20251001",
  vision: "openai/gpt-4o",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { agentId, prompt, model = "smart", responseFormat = "json" } = await req.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "prompt required" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    const anthropicKey  = Deno.env.get("ANTHROPIC_API_KEY");

    if (!openRouterKey && !anthropicKey) {
      return new Response(JSON.stringify({ error: "No AI API key configured" }), {
        status: 500, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const modelId = MODELS[model] ?? MODELS.smart;
    const systemPrompt = responseFormat === "json"
      ? "You are a strategic intelligence assistant. Respond ONLY with valid JSON. No markdown, no preamble, no explanation. Just the JSON object."
      : "You are a strategic intelligence assistant. Be precise and expert in your analysis.";

    // Try OpenRouter first, fall back to Anthropic direct
    let result: string;

    if (openRouterKey) {
      result = await callOpenRouter(openRouterKey, modelId, systemPrompt, prompt);
    } else {
      result = await callAnthropic(anthropicKey!, systemPrompt, prompt);
    }

    // Parse JSON if required
    if (responseFormat === "json") {
      try {
        // Strip potential markdown code fences
        const cleaned = result.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
        const parsed = JSON.parse(cleaned);
        return new Response(JSON.stringify(parsed), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      } catch {
        // Return as text if JSON parse fails — client will handle
        return new Response(JSON.stringify({ raw: result, parseError: true }), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ text: result }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[insight-research] ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});

// ── OpenRouter ────────────────────────────────────────────────────────────────

async function callOpenRouter(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer":  "https://hypnotic.live",
      "X-Title":       "Hypnotic",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system",    content: system },
        { role: "user",      content: user   },
      ],
      temperature:      0.7,
      max_tokens:       4000,
      response_format:  system.includes("JSON") ? { type: "json_object" } : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Anthropic direct ──────────────────────────────────────────────────────────

async function callAnthropic(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-6",
      max_tokens: 4000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}
