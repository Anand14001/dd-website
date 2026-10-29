/**
 * Overview: the numbers worth looking at before anything else.
 *
 * Capture rate is the one to watch — leads divided by conversations tells you
 * whether the chatbot is converting interest into contactable people, which no
 * raw lead count will show.
 */
import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { DashboardStats, FilterOptions } from './types';
import { STAGE_LABELS, STAGE_ORDER } from './types';
import { Card, RankedBars, StatTile, TEMPERATURE_COLOR, TrendChart, VIZ } from './ui';

export const OverviewTab: React.FC<{
  stats: DashboardStats;
  options: FilterOptions | null;
  onJumpToLeads: (query: { needsAttention?: boolean; temperature?: string }) => void;
}> = ({ stats, options, onJumpToLeads }) => {
  const serviceLabel = (id: string) =>
    options?.services.find((service) => service.id === id)?.label ?? id;

  const stageData = STAGE_ORDER.map((stage) => ({
    label: STAGE_LABELS[stage],
    value: stats.byStage.find((row) => row.stage === stage)?.count ?? 0,
  })).filter((row) => row.value > 0);

  const serviceData = stats.byService
    .slice(0, 8)
    .map((row) => ({ label: serviceLabel(row.service), value: row.count }));

  const temperatureData = ['hot', 'warm', 'cold'].map((temperature) => ({
    label: temperature[0].toUpperCase() + temperature.slice(1),
    value: stats.byTemperature.find((row) => row.temperature === temperature)?.count ?? 0,
    color: TEMPERATURE_COLOR[temperature],
  }));

  const sourceData = stats.bySource.map((row) => ({
    label: row.source === 'contact_form' ? 'Contact form' : 'Chatbot',
    value: row.count,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="New leads today"
          value={stats.leads.today}
          hint={`${stats.leads.last7} in the last 7 days`}
        />
        <StatTile
          label="Leads (30 days)"
          value={stats.leads.last30}
          hint={`${stats.leads.total} all time`}
        />
        <StatTile
          label="Capture rate"
          value={`${stats.captureRate}%`}
          hint={`${stats.leads.last30} leads from ${stats.conversations.last30} chats`}
          tone={stats.captureRate >= 20 ? 'good' : stats.captureRate >= 10 ? 'warn' : 'critical'}
        />
        <StatTile
          label="Won this month"
          value={stats.wonThisMonth}
          tone={stats.wonThisMonth > 0 ? 'good' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => onJumpToLeads({ temperature: 'hot' })}
          className="rounded-xl border border-white/10 bg-[#0e0e13] px-5 py-4 text-left transition hover:border-white/20"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#898781]">
            Hot leads open
          </p>
          <p className="mt-2 text-3xl leading-none font-semibold" style={{ color: VIZ.hot }}>
            {stats.openHot}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-[#c3c2b7]">
            Call these first <ArrowRight size={12} />
          </p>
        </button>

        <button
          type="button"
          onClick={() => onJumpToLeads({ needsAttention: true })}
          className="rounded-xl border border-white/10 bg-[#0e0e13] px-5 py-4 text-left transition hover:border-white/20"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#898781]">
            Needs attention
          </p>
          <p
            className="mt-2 text-3xl leading-none font-semibold"
            style={{ color: stats.needsAttention > 0 ? VIZ.warm : VIZ.textPrimary }}
          >
            {stats.needsAttention}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-[#c3c2b7]">
            No next action set, or overdue <ArrowRight size={12} />
          </p>
        </button>

        <StatTile
          label="Conversations (30 days)"
          value={stats.conversations.last30}
          hint={`${stats.conversations.today} today · ${stats.conversations.total} all time`}
        />
      </div>

      <Card title="Daily activity" subtitle="Last 30 days">
        <TrendChart data={stats.daily} />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Pipeline" subtitle="Leads by stage">
          <RankedBars data={stageData} emptyLabel="No leads in the pipeline yet" />
        </Card>

        <Card title="Service interest" subtitle="What people are asking about">
          <RankedBars data={serviceData} emptyLabel="No service interest detected yet" />
        </Card>

        <Card title="Lead temperature" subtitle="Scored from intent signals">
          <RankedBars data={temperatureData} />
        </Card>

        <Card title="Where leads come from">
          <RankedBars data={sourceData} emptyLabel="No leads yet" />
        </Card>
      </div>
    </div>
  );
};
