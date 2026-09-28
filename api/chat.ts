import { answerCustomerQuery, type ChatMessage } from '../server/chatbotEngine';

export const config = {
  maxDuration: 30,
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const query = (body.message || body.prompt || '').trim();
    if (!query) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Question or message is required.' }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const result = await answerCustomerQuery(query, history);

    return new Response(
      JSON.stringify({
        ok: true,
        reply: result.reply,
        retrievedChunks: result.retrievedChunks,
        mode: result.mode,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Digital Dude Assistant API error]', errorMessage);

    // Fall back gracefully with 200 OK so the chat UI doesn't crash or display 500
    return new Response(
      JSON.stringify({
        ok: true,
        reply:
          "I don't have enough confirmed information about that in my current Digital Dude knowledge base. Please contact Digital Dude directly for the exact details.",
        retrievedChunks: [],
        mode: 'rule_fallback',
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return OPTIONS();
  }
  if (req.method === 'POST') {
    return POST(req);
  }
  return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
