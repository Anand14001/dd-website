/**
 * Bot quality.
 *
 * The fallback rate is the headline for a reason: when the Gemini key is missing
 * or the model errors, the chatbot keeps answering from canned text. It looks
 * healthy from outside while giving vague answers that cost leads. This number is
 * the only place that shows it.
 */
import React, { useEffect, useState } from 'react';
import { adminApi } from './adminApi';
import type { BotHealth } from './types';
import { Card, EmptyState, Notice, RankedBars, Spinner, StatTile, VIZ, relativeTime } from './ui';

export const BotHealthTab: React.FC = () => {
  const [health, setHealth] = useState<BotHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .botHealth()
      .then(setHealth)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load bot health.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading bot health…" />;
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!health) return <EmptyState title="No data yet" />;

  const { modeSplit } = health;
  const answered = modeSplit.gemini + modeSplit.fallback;

  const fallbackTone =
    modeSplit.fallbackRate >= 50 ? 'critical' : modeSplit.fallbackRate >= 15 ? 'warn' : 'good';

  return (
    <div className="flex flex-col gap-5">
      {answered === 0 ? (
        <Notice tone="warn">
          No assistant replies recorded yet. Once visitors start chatting, this page shows how
          often the AI answered versus falling back to canned text.
        </Notice>
      ) : (
        modeSplit.fallbackRate >= 50 && (
          <Notice tone="error">
            More than half of all replies are canned fallbacks. That almost always means
            GEMINI_API_KEY is missing or invalid in the Vercel environment — check Settings.
          </Notice>
        )
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Fallback rate"
          value={`${modeSplit.fallbackRate}%`}
          hint={`${modeSplit.fallback} of ${answered} replies were canned`}
          tone={fallbackTone as 'good' | 'warn' | 'critical'}
        />
        <StatTile
          label="AI replies"
          value={modeSplit.gemini}
          hint="Answered by Gemini"
        />
        <StatTile
          label="Avg messages / chat"
          value={health.avgMessagesPerConversation || '—'}
          hint="Higher means deeper engagement"
        />
        <StatTile
          label="Avg reply time"
          value={health.avgLatencyMs ? `${(health.avgLatencyMs / 1000).toFixed(1)}s` : '—'}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card
          title="Knowledge gaps"
          subtitle="Questions the assistant could not answer confidently"
        >
          {health.unanswered.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#898781]">
              Nothing unanswered. Good sign.
            </p>
          ) : (
            <>
              <p className="mb-3 text-xs text-[#c3c2b7]">
                Each of these is a candidate for the knowledge base. Adding them directly raises
                the quality of future answers.
              </p>
              <ul className="flex flex-col gap-2">
                {health.unanswered.slice(0, 15).map((item, index) => (
                  <li key={index} className="border-l-2 border-white/10 pl-3">
                    <p className="text-xs text-white">{item.question}</p>
                    <p className="mt-0.5 text-[11px] text-[#898781]">
                      {relativeTime(item.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card title="Most asked questions" subtitle="Repeated by more than one visitor">
          <RankedBars
            data={health.topQuestions.slice(0, 10).map((row) => ({
              label: row.question,
              value: row.count,
            }))}
            emptyLabel="No repeated questions yet"
          />
        </Card>

        <Card title="Knowledge used" subtitle="Which part of the knowledge base gets retrieved">
          <RankedBars
            data={health.categoryHits.map((row) => ({
              label: row.category,
              value: row.count,
              color: row.category === 'missing_info' ? VIZ.warm : VIZ.series1,
            }))}
            emptyLabel="No retrievals recorded yet"
          />
        </Card>

        <Card title="Conversation depth" subtitle="How many messages before people stop">
          <RankedBars
            data={health.dropOff.slice(0, 12).map((row) => ({
              label: `${row.messages} message${row.messages === 1 ? '' : 's'}`,
              value: row.conversations,
            }))}
            unit=" chats"
            emptyLabel="No conversations yet"
          />
        </Card>
      </div>
    </div>
  );
};
