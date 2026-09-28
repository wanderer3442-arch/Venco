export interface Env {
  GEMINI_API_KEY: string;
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const DEFAULT_MODEL = 'gemini-3.6-flash';

// Keep below Gemini free-tier 15 RPM. Window is per isolate (best-effort).
const RPM_LIMIT = 12;
let windowStart = 0;
let windowCount = 0;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: 'Server misconfigured: GEMINI_API_KEY missing' }, 500);
    }

    const now = Date.now();
    if (now - windowStart >= 60_000) {
      windowStart = now;
      windowCount = 0;
    }
    windowCount += 1;
    if (windowCount > RPM_LIMIT) {
      return json({ error: 'V is resting right now. Try again in a minute.' }, 429);
    }

    const body = (await request.json().catch(() => null)) as {
      model?: string;
      messages?: unknown;
      max_tokens?: number;
      temperature?: number;
    } | null;

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return json({ error: 'Invalid request: messages required' }, 400);
    }

    const upstream = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: body.messages,
        max_tokens: typeof body.max_tokens === 'number' ? Math.min(Math.max(body.max_tokens, 1), 2048) : 768,
        temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
      }),
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  },
} satisfies {
  fetch(request: Request, env: Env, ctx: unknown): Promise<Response>;
};
