// supabase/functions/_shared/utils.ts
// Shared utilities used across all Edge Functions

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Standard CORS preflight handler
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

// JSON response helper
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Error response helper
export function err(message: string, status = 400): Response {
  return json({ error: message }, status);
}

// Streaming SSE response helper
export function sse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Timeout wrapper
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Log AI usage to database
export async function logUsage(supabaseClient: any, params: {
  userId: string;
  projectId?: string;
  module: string;
  operation: string;
  modelId?: string;
  provider?: string;
  tokensIn?: number;
  tokensOut?: number;
  creditsUsed?: number;
  costUsd?: number;
  latencyMs?: number;
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
  requestId?: string;
}) {
  try {
    await supabaseClient.from('ai_usage_log').insert({
      user_id:       params.userId,
      project_id:    params.projectId,
      module:        params.module,
      operation:     params.operation,
      model_id:      params.modelId,
      provider:      params.provider,
      tokens_in:     params.tokensIn ?? 0,
      tokens_out:    params.tokensOut ?? 0,
      credits_used:  params.creditsUsed ?? 0,
      cost_usd:      params.costUsd,
      latency_ms:    params.latencyMs,
      status:        params.status,
      error_message: params.errorMessage,
      request_id:    params.requestId,
    });
  } catch {
    // Non-critical — don't throw
  }
}
