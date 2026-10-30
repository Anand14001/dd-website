import React from 'react';
import { ArrowUpRight, Building2, CalendarClock, MapPin } from 'lucide-react';
import { EventProject } from '../../data/eventsPageData';
import { EventVisual } from './EventVisual';
import { EventStatusPill } from './EventStatusPill';

interface EventProjectCardProps {
  project: EventProject;
  /** Opens the detail panel. The card's own click target stays the detail view, not the outbound link. */
  onOpen: (project: EventProject) => void;
}

/**
 * One event project.
 *
 * Reusable by design — a new event is a new entry in `EVENT_PROJECTS` and nothing
 * here changes. The card body opens the detail panel rather than navigating away,
 * because sending a prospective client off-site from the portfolio grid is how you
 * lose them; the outbound link is a deliberate, separate action.
 */
export const EventProjectCard: React.FC<EventProjectCardProps> = ({ project, onOpen }) => {
  const facts = [
    project.dateLabel && { icon: CalendarClock, text: project.dateLabel },
    project.venue
      ? { icon: MapPin, text: project.venue }
      : project.city && { icon: MapPin, text: project.city },
    project.organiser && { icon: Building2, text: project.organiser },
  ].filter(Boolean) as Array<{ icon: typeof MapPin; text: string }>;

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-soft transition-all duration-300 hover:-translate-y-1"
      style={{ ['--accent' as string]: project.accent }}
    >
      {/* Accent border on hover, driven by the project's own colour. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${project.accent}59` }}
      />

      {/* Visual — fixed ratio across every card so the grid never goes ragged. */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/[0.07]">
        <EventVisual
          project={project}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Top-right: the browser frame's address bar runs along the top-left. */}
        <div className="absolute right-3.5 top-3 z-10">
          <EventStatusPill status={project.status} className="backdrop-blur-md" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h3 className="text-[1.0625rem] font-bold leading-snug tracking-tight text-white">
          {project.name}
        </h3>

        {facts.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            {facts.map((fact) => (
              <span
                key={fact.text}
                className="inline-flex items-center gap-1.5 text-[11px] text-white/40"
              >
                <fact.icon className="h-3 w-3 shrink-0" style={{ color: project.accent }} />
                {fact.text}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3.5 text-sm leading-[1.7] text-white/55">{project.summary}</p>

        {/* Exactly what Digital Dude delivered. */}
        <div className="mt-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
            Our scope
          </span>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {project.scope.map((item) => (
              <li
                key={item}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-white/60"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions pinned to the bottom so cards of different heights still line up. */}
        <div className="mt-auto flex items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="flex-1 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white/80 transition-colors hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
            aria-label={`View project details for ${project.name}`}
          >
            Project details
          </button>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-ink transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
            style={{ background: project.accent }}
          >
            {project.linkLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
