import { KNOWLEDGE_CHUNKS } from '../../server/knowledgeBase';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      assistantName: 'Digital Dude Assistant',
      agency: 'Digital Dude',
      location: 'Chennai, Tamil Nadu, India',
      operatingSince: 2022,
      workingHours: '9:30 AM to 5:30 PM',
      supportedLanguages: ['English', 'Tanglish (Tamil in Latin script)'],
      knowledgeChunkCount: KNOWLEDGE_CHUNKS.length,
      chunks: KNOWLEDGE_CHUNKS.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
      })),
    }),
    {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    }
  );
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return OPTIONS();
  }
  if (req.method === 'GET') {
    return GET();
  }
  return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
