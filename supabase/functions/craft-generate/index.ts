// supabase/functions/craft-generate/index.ts
// Routes generation requests to the correct fal.ai model.
// Handles: image, video, audio, voice generation.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCors, json, err, withTimeout, logUsage } from '../_shared/utils.ts';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FAL_API_KEY          = Deno.env.get('FAL_API_KEY')!;
const RUNWAY_API_KEY       = Deno.env.get('RUNWAY_API_KEY');
const ELEVENLABS_API_KEY   = Deno.env.get('ELEVENLABS_API_KEY');

// ── fal.ai call helper ───────────────────────────────────────────────────────

async function falRun(endpoint: string, input: Record<string, unknown>): Promise<any> {
  // Queue the request
  const queueRes = await fetch(`https://queue.fal.run/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${FAL_API_KEY}`,
    },
    body: JSON.stringify({ input }),
  });

  if (!queueRes.ok) {
    const text = await queueRes.text();
    throw new Error(`fal.ai queue failed ${queueRes.status}: ${text}`);
  }

  const { request_id } = await queueRes.json();

  // Poll for result (max 3 minutes)
  const maxPoll = 180;
  let waited = 0;
  while (waited < maxPoll) {
    await new Promise(r => setTimeout(r, 3000));
    waited += 3;

    const statusRes = await fetch(`https://queue.fal.run/${endpoint}/requests/${request_id}/status`, {
      headers: { 'Authorization': `Key ${FAL_API_KEY}` },
    });

    if (!statusRes.ok) continue;
    const status = await statusRes.json();

    if (status.status === 'COMPLETED') {
      const resultRes = await fetch(`https://queue.fal.run/${endpoint}/requests/${request_id}`, {
        headers: { 'Authorization': `Key ${FAL_API_KEY}` },
      });
      return await resultRes.json();
    }

    if (status.status === 'FAILED') {
      throw new Error(`fal.ai generation failed: ${JSON.stringify(status)}`);
    }
  }

  throw new Error('fal.ai generation timed out');
}

// ── fal.ai model ID mapping ──────────────────────────────────────────────────

const FAL_MODEL_MAP: Record<string, string> = {
  'auto':                'fal-ai/flux-pro/v1.1',
  'flux-2-pro':          'fal-ai/flux-pro/v1.1',
  'flux-2-max':          'fal-ai/flux-pro/v1.1-ultra',
  'flux-2-flex':         'fal-ai/flux/dev',
  'flux-1-kontext-max':  'fal-ai/flux-pro/v1.1',
  'flux-2-klein':        'fal-ai/flux/schnell',
  'google-imagen-4-ultra': 'fal-ai/imagen4/preview/ultra',
  'google-imagen-4':     'fal-ai/imagen4/preview/fast',
  'google-imagen-4-fast': 'fal-ai/imagen4/preview/fast',
  'mystic-2-5':          'fal-ai/mystic',
  'ideogram':            'fal-ai/ideogram/v3',
  'seedream-4':          'fal-ai/seedream/v3',
  'seedream-4-4k':       'fal-ai/seedream/v3',
  'recraft-v4':          'fal-ai/recraft-v3',
  'recraft-v4-pro':      'fal-ai/recraft-v3',
  'gpt-1-5-high':        'fal-ai/gpt-image-1',
  // Video
  'video-auto':          'fal-ai/kling-video/v2/standard/text-to-video',
  'kling-2-6':           'fal-ai/kling-video/v2.1/standard/text-to-video',
  'kling-2-5':           'fal-ai/kling-video/v2/standard/text-to-video',
  'kling-1-6':           'fal-ai/kling-video/v1.6/standard/text-to-video',
  'wan':                 'fal-ai/wan-pro',
  'hailuo':              'fal-ai/minimax/video-01',
  'seedance':            'fal-ai/bytedance/seedance-v1-lite',
  // Audio
  'suno-v4':             'fal-ai/suno/v4',
  'udio':                'fal-ai/udio-v1',
};

// ── Credit costs per model ───────────────────────────────────────────────────

const CREDIT_COSTS: Record<string, number> = {
  'auto': 3, 'flux-2-pro': 8, 'flux-2-max': 6, 'flux-2-flex': 4,
  'google-imagen-4-ultra': 9, 'google-imagen-4': 5, 'mystic-2-5': 4,
  'ideogram': 5, 'seedream-4': 5, 'seedream-4-4k': 8,
  'kling-2-6': 20, 'kling-2-5': 16, 'kling-1-6': 10, 'wan': 8,
  'hailuo': 12, 'seedance': 10, 'suno-v4': 15, 'udio': 10,
  'elevenlabs-v3': 8, 'elevenlabs-turbo': 3,
};

// ── Handlers ─────────────────────────────────────────────────────────────────

async function generateImage(params: any, falEndpoint: string): Promise<any> {
  const aspectMap: Record<string, string> = {
    '1:1': 'square_hd', '16:9': 'landscape_16_9', '9:16': 'portrait_16_9',
    '4:5': 'portrait_4_5', '3:4': '3:4', '21:9': '21:9',
  };

  return falRun(falEndpoint, {
    prompt:           params.prompt,
    negative_prompt:  params.negativePrompt,
    image_size:       aspectMap[params.aspectRatio ?? '1:1'] ?? 'square_hd',
    num_images:       params.quantity ?? 1,
    num_inference_steps: 28,
    ...(params.referenceImage && { image_url: params.referenceImage }),
  });
}

async function generateVideo(params: any, falEndpoint: string): Promise<any> {
  return falRun(falEndpoint, {
    prompt:        params.prompt,
    duration:      params.duration ?? 5,
    aspect_ratio:  params.aspectRatio ?? '16:9',
    ...(params.firstFrame && { image_url: params.firstFrame }),
  });
}

async function generateAudio(params: any): Promise<any> {
  const { musicConfig } = params;
  return falRun('fal-ai/suno/v4', {
    prompt:      `${musicConfig.genre} ${musicConfig.mood} ${musicConfig.prompt}`,
    duration:    musicConfig.duration ?? 30,
    make_instrumental: musicConfig.instrumentalOnly ?? false,
  });
}

async function generateVoice(params: any): Promise<any> {
  if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY not configured');

  const { voiceConfig } = params;
  const voiceId = voiceConfig.voiceId ?? 'nova'; // ElevenLabs voice ID

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: voiceConfig.script,
      model_id: 'eleven_multilingual_v3',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!r.ok) throw new Error(`ElevenLabs ${r.status}`);

  // Return audio as base64
  const buffer = await r.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return { audio: { url: `data:audio/mpeg;base64,${base64}` } };
}

// ── Main handler ──────────────────────────────────────────────────────────────

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

    const { type, modelId, projectId, assetId, quantity = 1, ...params } = await req.json();
    if (!type || !modelId) return err('type and modelId required');

    const credits = (CREDIT_COSTS[modelId] ?? 5) * (type === 'image' ? quantity : 1);

    // Check credits
    const { data: hasCredits } = await db.rpc('deduct_generation_credit', {
      p_user_id: user.id,
      p_amount: credits,
    });
    if (!hasCredits) return err('Insufficient credits', 402);

    // Update asset status to generating
    if (assetId) {
      await db.from('craft_assets').update({ status: 'generating' }).eq('id', assetId);
    }

    let result: any;
    const falEndpoint = FAL_MODEL_MAP[modelId];

    if (type === 'image') {
      if (!falEndpoint) return err(`Unknown model: ${modelId}`);
      result = await withTimeout(generateImage({ ...params, quantity }, falEndpoint), 180000);
    } else if (type === 'video') {
      if (!falEndpoint) return err(`Unknown model: ${modelId}`);
      result = await withTimeout(generateVideo(params, falEndpoint), 300000);
    } else if (type === 'audio') {
      result = await withTimeout(generateAudio(params), 180000);
    } else if (type === 'voice') {
      result = await withTimeout(generateVoice(params), 120000);
    } else {
      return err(`Unknown type: ${type}`);
    }

    // Extract URL from result
    const url = result?.images?.[0]?.url
      ?? result?.video?.url
      ?? result?.audio?.url
      ?? result?.output?.[0]
      ?? null;

    // Save asset to DB
    if (assetId && url) {
      await db.from('craft_assets').update({
        url,
        status: 'draft',
        generation_params: params,
      }).eq('id', assetId);
    }

    await logUsage(db, {
      userId: user.id, projectId, module: 'craft',
      operation: `${type}_generation`, modelId, provider: 'fal',
      creditsUsed: credits, latencyMs: Date.now() - start,
      status: 'success', requestId: assetId,
    });

    return json({ success: true, url, result });

  } catch (e: any) {
    console.error('[craft-generate]', e);

    // Refund credits on failure
    try {
      const { quantity = 1, modelId } = await req.clone().json().catch(() => ({}));
      const credits = (CREDIT_COSTS[modelId ?? ''] ?? 5) * quantity;
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const { data: { user } } = await createClient(
          SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!,
          { global: { headers: { Authorization: authHeader } } }
        ).auth.getUser();
        if (user) await db.rpc('add_generation_credits', { p_user_id: user.id, p_amount: credits });
      }
    } catch { /* non-critical */ }

    return err(e.message ?? 'Generation failed', 500);
  }
});
