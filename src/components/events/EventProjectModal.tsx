import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  Check,
  MapPin,
  X,
} from 'lucide-react';
import { EventProject } from '../../data/eventsPageData';
import { EventVisual } from './EventVisual';
import { EventStatusPill } from './EventStatusPill';

interface EventProjectModalProps {
  project: EventProject | null;
  onClose: () => void;
}

/**
 * Project detail panel.
 *
 * The brief requires keyboard-accessible, visibly focusable controls, so this
 * closes on Escape, locks the page behind it, moves focus in on open and returns
 * it to the trigger on close. Content is strictly the facts recorded for the
 * project — nothing is inferred to fill the layout out.
 */
export const EventProjectModal: React.FC<EventProjectModalProps> = ({ project, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Keep the page from scrolling behind the panel.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  const facts = [
    project.dateLabel && { icon: CalendarClock, label: 'When', value: project.dateLabel },
    (project.venue || project.city) && {
      icon: MapPin,
      label: 'Where',
      value: project.venue ?? project.city!,
    },
    project.organiser && { icon: Building2, label: 'Organiser', value: project.organiser },
  ].filter(Boolean) as Array<{ icon: typeof MapPin; label: string; value: string }>;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-ink-soft shadow-2xl sm:my-0">
        {/* Header visual */}
        <div className="relative aspect-[16/7] overflow-hidden border-b border-white/[0.07]">
          <EventVisual project={project} />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/20 to-transparent"
          />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl bg-ink/70 p-2 text-white/70 backdrop-blur-md transition-colors hover:bg-ink hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            aria-label="Close project details"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <EventStatusPill status={project.status} />
            <h3
              id="event-modal-title"
              className="mt-2.5 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl"
            >
              {project.name}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Verified facts */}
          {facts.length > 0 && (
            <dl
              className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 ${
                // Sized to the facts actually recorded, so a project with no
                // organiser never leaves an empty cell in the row.
                facts.length === 3 ? 'sm:grid-cols-3' : facts.length === 2 ? 'sm:grid-cols-2' : ''
              }`}
            >
              {facts.map((fact) => (
                <div key={fact.label} className="bg-ink px-4 py-3.5">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                    <fact.icon className="h-3 w-3" style={{ color: project.accent }} />
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium leading-snug text-white/85">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Narrative */}
          <div className="mt-7 space-y-3.5">
            {project.detail.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-[1.8] text-white/60">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Scope delivered */}
          <div className="mt-8">
            {/* Tense follows the status: an upcoming event has not been delivered yet. */}
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
              {project.status === 'completed'
                ? 'What Digital Dude delivered'
                : 'What Digital Dude is delivering'}
            </h4>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {project.scope.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/75"
                >
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${project.accent}26` }}
                  >
                    <Check
                      className="h-2.5 w-2.5"
                      strokeWidth={3}
                      style={{ color: project.accent }}
                    />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-ink transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
              style={{ background: project.accent }}
            >
              {project.linkLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <Link
              to="/contact"
              state={{ service: 'Event Technology & Digital Solutions' }}
              onClick={onClose}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
            >
              Plan something similar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
