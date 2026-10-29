/**
 * Shared dashboard primitives: surfaces, badges, stat tiles and the two chart
 * forms the dashboard needs.
 *
 * Colour roles are defined once in VIZ and referenced by role everywhere else.
 * The categorical slots and the status steps were validated against this
 * dashboard's own card surface (#0e0e13), not a default one — all clear 3:1, and
 * most clear 4.5:1. Brand lime is deliberately kept out of the data channel: it
 * marks interactive elements only, so a lime pixel never reads as a series.
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle, Check, Inbox, Loader2 } from 'lucide-react';

export const VIZ = {
  surface: '#0e0e13',
  plane: '#050507',
  textPrimary: '#ffffff',
  textSecondary: '#c3c2b7',
  muted: '#898781',
  grid: '#2c2c2a',
  baseline: '#383835',
  /** Categorical slots 1 and 2 — the only two-series chart here. */
  series1: '#3987e5',
  series2: '#d95926',
  /** Status steps, always shipped with a text label, never colour alone. */
  hot: '#e66767',
  warm: '#fab219',
  cold: '#898781',
  good: '#0ca30c',
  critical: '#d03b3b',
} as const;

export const TEMPERATURE_COLOR: Record<string, string> = {
  hot: VIZ.hot,
  warm: VIZ.warm,
  cold: VIZ.cold,
};

// ------------------------------------------------------------------ formatting

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(value: string | null | undefined): string {
  if (!value) return '—';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '—';

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDateTime(value);
}

/** wa.me deep link — opens WhatsApp with the number prefilled, no API needed. */
export function whatsappLink(phone: string | null, message?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  const suffix = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${withCountry}${suffix}`;
}

// -------------------------------------------------------------------- surfaces

export const Card: React.FC<{
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, actions, className = '', children }) => (
  <section
    className={`rounded-xl border border-white/10 bg-[#0e0e13] ${className}`}
  >
    {(title || actions) && (
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
        <div>
          {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
          {subtitle && <p className="mt-0.5 text-xs text-[#898781]">{subtitle}</p>}
        </div>
        {actions}
      </header>
    )}
    <div className="p-5">{children}</div>
  </section>
);

export const StatTile: React.FC<{
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'good' | 'warn' | 'critical';
}> = ({ label, value, hint, tone = 'default' }) => {
  const toneColor =
    tone === 'good' ? VIZ.good : tone === 'warn' ? VIZ.warm : tone === 'critical' ? VIZ.hot : VIZ.textPrimary;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0e0e13] px-5 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#898781]">{label}</p>
      <p className="mt-2 text-3xl leading-none font-semibold" style={{ color: toneColor }}>
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-[#c3c2b7]">{hint}</p>}
    </div>
  );
};

export const Badge: React.FC<{
  label: string;
  color?: string;
  icon?: React.ReactNode;
}> = ({ label, color = VIZ.muted, icon }) => (
  <span
    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"
    style={{ color, backgroundColor: `${color}1f`, boxShadow: `inset 0 0 0 1px ${color}40` }}
  >
    {icon}
    {label}
  </span>
);

export const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#898781]">
    <Loader2 size={16} className="animate-spin" />
    {label || 'Loading…'}
  </div>
);

export const EmptyState: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="flex flex-col items-center gap-2 py-12 text-center">
    <Inbox size={22} className="text-[#898781]" />
    <p className="text-sm font-medium text-white">{title}</p>
    {hint && <p className="max-w-sm text-xs text-[#898781]">{hint}</p>}
  </div>
);

export const Notice: React.FC<{
  tone: 'error' | 'warn' | 'success';
  children: React.ReactNode;
}> = ({ tone, children }) => {
  const color = tone === 'error' ? VIZ.hot : tone === 'warn' ? VIZ.warm : VIZ.good;
  const Icon = tone === 'success' ? Check : AlertTriangle;
  return (
    <div
      className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
      style={{ color, backgroundColor: `${color}14`, boxShadow: `inset 0 0 0 1px ${color}33` }}
    >
      <Icon size={14} className="mt-0.5 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
};

// ----------------------------------------------------------------- ranked bars

export interface RankedDatum {
  label: string;
  value: number;
  color?: string;
}

/**
 * Horizontal ranked bars. Length carries magnitude, so colour stays constant —
 * a per-bar hue would encode nothing. Values are direct-labelled, and hover adds
 * the share of total.
 */
export const RankedBars: React.FC<{
  data: RankedDatum[];
  total?: number;
  unit?: string;
  emptyLabel?: string;
}> = ({ data, total, unit = '', emptyLabel = 'No data yet' }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const sum = total ?? data.reduce((acc, d) => acc + d.value, 0);

  if (data.length === 0) {
    return <p className="py-6 text-center text-xs text-[#898781]">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.map((datum, index) => {
        const share = sum > 0 ? Math.round((datum.value / sum) * 100) : 0;
        const isHovered = hovered === index;
        return (
          <li
            key={datum.label}
            className="group"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-xs text-[#c3c2b7]">{datum.label}</span>
              <span className="shrink-0 text-xs tabular-nums text-white">
                {isHovered && sum > 0 ? `${datum.value}${unit} · ${share}%` : `${datum.value}${unit}`}
              </span>
            </div>
            {/* 6px track, 4px rounded data end, anchored to a zero baseline. */}
            <div className="mt-1 h-1.5 w-full rounded-full" style={{ backgroundColor: VIZ.grid }}>
              <div
                className="h-1.5 rounded-r-[4px] transition-[width,opacity] duration-200"
                style={{
                  width: `${Math.max(2, (datum.value / max) * 100)}%`,
                  backgroundColor: datum.color || VIZ.series1,
                  opacity: hovered === null || isHovered ? 1 : 0.55,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

// ----------------------------------------------------------------- trend chart

export interface TrendPoint {
  day: string;
  leads: number;
  conversations: number;
}

/**
 * Two-series daily trend with a crosshair tooltip.
 *
 * Both series share one y-axis — counts of the same kind, so a second scale
 * would invent a relationship that is not in the data.
 */
export const TrendChart: React.FC<{ data: TrendPoint[] }> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const width = 720;
  const height = 180;
  const padding = { top: 12, right: 16, bottom: 22, left: 30 };

  const geometry = useMemo(() => {
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const max = Math.max(1, ...data.flatMap((d) => [d.leads, d.conversations]));
    const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;

    const x = (index: number) => padding.left + index * step;
    const y = (value: number) => padding.top + innerHeight - (value / max) * innerHeight;

    const line = (key: 'leads' | 'conversations') =>
      data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');

    const area = (key: 'leads' | 'conversations') =>
      data.length > 0
        ? `${line(key)} L${x(data.length - 1).toFixed(1)},${padding.top + innerHeight} L${x(0).toFixed(1)},${
            padding.top + innerHeight
          } Z`
        : '';

    return { x, y, max, innerHeight, line, area };
  }, [data]);

  if (data.length === 0) {
    return <p className="py-8 text-center text-xs text-[#898781]">No activity recorded yet</p>;
  }

  const active = activeIndex !== null ? data[activeIndex] : null;

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const position = ratio * width - padding.left;
    const span = width - padding.left - padding.right;
    const index = Math.round((position / span) * (data.length - 1));
    setActiveIndex(Math.min(data.length - 1, Math.max(0, index)));
  };

  const ticks = [0, 0.5, 1].map((fraction) => Math.round(geometry.max * fraction));

  return (
    <div className="relative">
      {/* Legend is always present for two series, so identity never rests on colour alone. */}
      <div className="mb-3 flex flex-wrap items-center gap-4">
        {[
          { label: 'Leads captured', color: VIZ.series1 },
          { label: 'Conversations', color: VIZ.series2 },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-xs text-[#c3c2b7]">
            <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: 200 }}
        onMouseMove={handleMove}
        onMouseLeave={() => setActiveIndex(null)}
        role="img"
        aria-label="Leads and conversations per day over the last 30 days"
      >
        {/* Recessive gridlines and y ticks. */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={geometry.y(tick)}
              y2={geometry.y(tick)}
              stroke={VIZ.grid}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <text x={0} y={geometry.y(tick) + 3} fill={VIZ.muted} fontSize={9} className="tabular-nums">
              {tick}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VIZ.series1} stopOpacity={0.28} />
            <stop offset="100%" stopColor={VIZ.series1} stopOpacity={0} />
          </linearGradient>
        </defs>

        <path d={geometry.area('leads')} fill="url(#leadsFill)" />

        {/* Conversations sits behind leads: it is the larger, contextual series. */}
        <path
          d={geometry.line('conversations')}
          fill="none"
          stroke={VIZ.series2}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={geometry.line('leads')}
          fill="none"
          stroke={VIZ.series1}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {activeIndex !== null && (
          <g>
            <line
              x1={geometry.x(activeIndex)}
              x2={geometry.x(activeIndex)}
              y1={padding.top}
              y2={padding.top + geometry.innerHeight}
              stroke={VIZ.baseline}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            {(['conversations', 'leads'] as const).map((key) => (
              <circle
                key={key}
                cx={geometry.x(activeIndex)}
                cy={geometry.y(data[activeIndex][key])}
                r={4}
                fill={key === 'leads' ? VIZ.series1 : VIZ.series2}
                stroke={VIZ.surface}
                strokeWidth={2}
              />
            ))}
          </g>
        )}

        {/* First and last date only — a label per day would be unreadable. */}
        <text x={padding.left} y={height - 4} fill={VIZ.muted} fontSize={9}>
          {data[0].day.slice(5)}
        </text>
        <text x={width - padding.right} y={height - 4} fill={VIZ.muted} fontSize={9} textAnchor="end">
          {data[data.length - 1].day.slice(5)}
        </text>
      </svg>

      {active && (
        <div className="pointer-events-none absolute right-0 top-0 rounded-lg border border-white/10 bg-[#050507] px-3 py-2 text-xs shadow-lg">
          <p className="mb-1 font-medium text-white">{active.day}</p>
          <p className="flex items-center gap-1.5 text-[#c3c2b7]">
            <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: VIZ.series1 }} />
            {active.leads} leads
          </p>
          <p className="flex items-center gap-1.5 text-[#c3c2b7]">
            <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: VIZ.series2 }} />
            {active.conversations} conversations
          </p>
        </div>
      )}
    </div>
  );
};
