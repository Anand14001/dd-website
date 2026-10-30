import React from 'react';
import { CalendarClock, CircleDot, CircleCheck } from 'lucide-react';
import { EventStatus } from '../../data/eventsPageData';

/**
 * Status styling, kept in one place.
 *
 * The brief forbids an upcoming event reading as a delivered one, so status is
 * carried by three signals at once — colour, icon and wording — rather than
 * colour alone. That also keeps it legible to anyone who cannot distinguish the
 * hues, and it survives a greyscale print-out in a meeting.
 */
export const STATUS_STYLES: Record<
  EventStatus,
  { label: string; className: string; dot: string; icon: typeof CircleCheck }
> = {
  completed: {
    label: 'Completed',
    className: 'border-lime/30 bg-lime/10 text-lime',
    dot: '#BFFF00',
    icon: CircleCheck,
  },
  upcoming: {
    label: 'Upcoming',
    className: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
    dot: '#38BDF8',
    icon: CalendarClock,
  },
  ongoing: {
    label: 'Ongoing',
    className: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
    dot: '#A78BFA',
    icon: CircleDot,
  },
};

export const EventStatusPill: React.FC<{ status: EventStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const style = STATUS_STYLES[status];
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${style.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
};
