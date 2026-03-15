// supabase/functions/manifest-generate/index.ts
// Unified caller for Manifest agent pipeline.
// Same interface as insight-research — { prompt, model, responseFormat }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { prompt, model = "smart", responseFormat = "json" } = await req.json();
    
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

    const system = responseFormat === "json"
      ? "You are an award-winning screenwriter and creative director. Respond ONLY with valid JSON. No markdown, no preamble, no backticks. Just the JSON object."
      : "You are an award-winning screenwriter and creative director. Be creative, precise, and craft exceptional narrative.";

    let result: string;
    
    if (openRouterKey) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer":  "https://hypnotic.live",
          "X-Title":       "Hypnotic",
        },
        body: JSON.stringify({
          model: model === "smart" ? "anthropic/claude-sonnet-4-6" : "anthropic/claude-haiku-4-5-20251001",
          messages: [
            { role: "system", content: system },
            { role: "user",   content: prompt },
          ],
          temperature:  0.8,
          max_tokens:   6000,
          response_format: responseFormat === "json" ? { type: "json_object" } : undefined,
        }),
      });
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = await res.json();
      result = data.choices?.[0]?.message?.content ?? "";
    } else {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": anthropicKey!, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 6000, system, messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = await res.json();
      result = data.content?.[0]?.text ?? "";
    }

    if (responseFormat === "json") {
      try {
        const cleaned = result.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "").trim();
        return new Response(JSON.stringify(JSON.parse(cleaned)), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      } catch {
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
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
