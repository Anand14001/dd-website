import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { EVENT_PROJECTS, EventProject, EventStatus } from '../../data/eventsPageData';
import { SectionHeading } from '../home/SectionHeading';
import { EventProjectCard } from './EventProjectCard';
import { EventProjectModal } from './EventProjectModal';

type Filter = 'all' | EventStatus;

/**
 * Selected event projects.
 *
 * Filters are generated from the data and a tab only appears when it has entries,
 * so the page can never offer an empty "Ongoing" view just because the type
 * exists. Projects held back pending organiser approval are excluded here, which
 * makes `pendingApproval` a single safe switch rather than a note someone has to
 * remember to act on.
 */
export const EventProjects: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<EventProject | null>(null);

  const publishable = useMemo(
    () => EVENT_PROJECTS.filter((p) => !p.pendingApproval),
    [],
  );

  const filters = useMemo(() => {
    const counts = publishable.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {});

    return [
      { key: 'all' as Filter, label: 'All projects', count: publishable.length },
      { key: 'completed' as Filter, label: 'Completed', count: counts.completed ?? 0 },
      { key: 'upcoming' as Filter, label: 'Upcoming', count: counts.upcoming ?? 0 },
      { key: 'ongoing' as Filter, label: 'Ongoing', count: counts.ongoing ?? 0 },
    ].filter((f) => f.count > 0);
  }, [publishable]);

  const visible =
    filter === 'all' ? publishable : publishable.filter((p) => p.status === filter);

  return (
    <section id="event-projects" className="scroll-mt-24 bg-ink py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <SectionHeading
          eyebrow="Selected event projects"
          lineOne="REAL EVENTS."
          lineTwo="LIVE LINKS."
          intro="Explore selected event projects and platforms we have worked on. Each one highlights a different part of the digital experience, from event websites to registration and ticketing — and the scope shown is specific to the work delivered."
        />

        {/* Filters */}
        <div
          className="mt-11 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter projects by status"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:text-sm ${
                filter === f.key
                  ? 'bg-lime text-ink'
                  : 'border border-white/10 bg-white/[0.03] text-white/50 hover:text-white/85'
              }`}
            >
              {f.label}
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  filter === f.key ? 'text-ink/55' : 'text-white/30'
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
            >
              <EventProjectCard project={project} onOpen={setSelected} />
            </motion.div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-white/40">
            No projects with this status yet.
          </p>
        )}

        <p className="mt-9 text-xs leading-relaxed text-white/30">
          Project scope reflects the digital work delivered by Digital Dude. Event
          organisation, venue and programming remain with the respective organisers.
        </p>
      </div>

      <EventProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};
