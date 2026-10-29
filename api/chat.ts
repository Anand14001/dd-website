/**
 * POST /api/chat
 *
 * Answers the visitor and records the conversation. The reply is computed and
 * returned first; persistence, lead extraction and the WhatsApp alert run after
 * the response so none of them sit in the visitor's latency path.
 *
 * A database or notification failure must never change what the visitor sees.
 */
import { answerCustomerQuery, type ChatMessage } from './_lib/chatbotEngine.js';
import { afterResponse, fail, ok, preflight, send, toApiRequest, type ApiRequest } from './_lib/http.js';
import { ensureConversation, recordMessage, syncLeadFromConversation } from './_lib/repository.js';
import { shouldRequestContact, type ChatTurn } from './_lib/leadIntelligence.js';
import { notifyNewLead } from './_lib/whatsapp.js';

export const config = {
  maxDuration: 30,
};

const FALLBACK_REPLY =
  "I don't have enough confirmed information about that in my current Digital Dude knowledge base. " +
  'Please contact Digital Dude directly for the exact details.';

/** Attribution details the widget sends alongside the first message. */
function conversationContext(request: ApiRequest) {
  const context = (request.body.context ?? {}) as Record<string, unknown>;
  const asString = (value: unknown) =>
    typeof value === 'string' && value.trim() ? value.trim().slice(0, 500) : undefined;

  return {
    landingPage: asString(context.landingPage),
    referrer: asString(context.referrer),
    utmSource: asString(context.utmSource),
    utmMedium: asString(context.utmMedium),
    utmCampaign: asString(context.utmCampaign),
    userAgent: request.headers['user-agent']?.slice(0, 500),
    ip: request.ip,
  };
}

/**
 * Stores both sides of the exchange, re-derives the lead from the full stored
 * transcript, and alerts the team if it is worth chasing.
 */
async function persistExchange(params: {
  sessionId: string;
  request: ApiRequest;
  userMessage: string;
  reply: string;
  mode: string;
  retrievedChunks: unknown[];
  latencyMs: number;
}): Promise<void> {
  const conversationId = await ensureConversation(params.sessionId, conversationContext(params.request));
  if (!conversationId) return;

  await recordMessage({
    conversationId,
    role: 'user',
    content: params.userMessage,
  });

  await recordMessage({
    conversationId,
    role: 'assistant',
    content: params.reply,
    mode: params.mode,
    retrievedChunks: params.retrievedChunks,
    latencyMs: params.latencyMs,
  });

  const result = await syncLeadFromConversation(conversationId);
  if (result?.isNew) {
    await notifyNewLead(result.lead);
  }
}

export default async function handler(req: any, res?: any) {
  const request = await toApiRequest(req);

  if (request.method === 'OPTIONS') return preflight(res);
  if (request.method !== 'POST') return send(fail(405, 'Method Not Allowed'), res);

  const userMessage = String(request.body.message || request.body.prompt || '').trim();
  if (!userMessage) {
    return send(fail(400, 'Question or message is required.'), res);
  }

  const history: ChatMessage[] = Array.isArray(request.body.history) ? request.body.history : [];
  const sessionId = typeof request.body.sessionId === 'string' ? request.body.sessionId.slice(0, 64) : '';

  let reply = FALLBACK_REPLY;
  let mode = 'rule_fallback';
  let retrievedChunks: unknown[] = [];

  const startedAt = Date.now();
  try {
    const result = await answerCustomerQuery(userMessage, history);
    reply = result.reply;
    mode = result.mode;
    retrievedChunks = result.retrievedChunks;
  } catch (err) {
    // The widget still gets a usable answer; only the mode tells us it degraded.
    console.error('[chat] engine failed', err instanceof Error ? err.message : err);
  }
  const latencyMs = Date.now() - startedAt;

  // Whether the widget should now ask for contact details, based on the full
  // exchange including the message we just received.
  const turns: ChatTurn[] = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];

  if (sessionId) {
    await afterResponse(
      persistExchange({
        sessionId,
        request,
        userMessage,
        reply,
        mode,
        retrievedChunks,
        latencyMs,
      }),
    );
  }

  return send(
    ok({
      reply,
      retrievedChunks,
      mode,
      requestContact: shouldRequestContact(turns),
    }),
    res,
  );
}

export async function OPTIONS(req?: any, res?: any) {
  return handler(req || { method: 'OPTIONS' }, res);
}

export async function POST(req: any, res?: any) {
  if (req && !req.method) req.method = 'POST';
  return handler(req, res);
}
