import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardCheck,
  Globe,
  MessagesSquare,
  Server,
  type LucideIcon,
} from 'lucide-react';
import { EVENTS_INFINITE, EVENT_PROJECTS } from '../../data/eventsPageData';
import { EventStatusPill } from './EventStatusPill';

const ICONS: Record<string, LucideIcon> = {
  Globe,
  ClipboardCheck,
  CalendarClock,
  MessagesSquare,
};

/**
 * The Events Infinite section.
 *
 * Featured apart from the event clients, because it is the platform rather than a
 * customer. Copy is deliberately limited to capabilities observable on the live
 * project subdomains — the brief says to show only confirmed features, and the
 * platform's own marketing site does not currently advertise organiser ticketing
 * or payments. See the `verify` notes in the data file before widening these claims.
 */
export const EventsInfinite: React.FC = () => {
  const hosted = EVENT_PROJECTS.filter(
    (p) => EVENTS_INFINITE.hostedProjectIds.includes(p.id) && !p.pendingApproval,
  );

  return (
    <section
      id="events-infinite"
      className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-ink-soft py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.06] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ---- Left: the platform ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
              Event technology
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl">
              The platform
              <br />
              <span className="text-lime">behind the pages.</span>
            </h2>

            <p className="mt-6 text-base leading-[1.75] text-white/60">
              {EVENTS_INFINITE.summary}
            </p>

            <a
              href={EVENTS_INFINITE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-lime-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
            >
              Explore {EVENTS_INFINITE.name}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Events running on the platform. */}
            {hosted.length > 0 && (
              <div className="mt-11 rounded-2xl border border-white/10 bg-ink p-5">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  <Server className="h-3.5 w-3.5 text-lime/70" />
                  Events running on it
                </span>

                <ul className="mt-4 space-y-2.5">
                  {hosted.map((project) => (
                    <li key={project.id}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-colors hover:border-lime/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white/85 group-hover:text-white">
                            {project.name}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-white/35">
                            {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <EventStatusPill status={project.status} />
                          <ArrowUpRight className="h-3.5 w-3.5 text-white/25 transition-colors group-hover:text-lime" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* ---- Right: confirmed capabilities ---- */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {EVENTS_INFINITE.confirmed.map((feature, i) => {
                const Icon = ICONS[feature.iconName] ?? Globe;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-lime/25 lg:p-7"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-lime/25 group-hover:bg-lime/[0.07]">
                      <Icon className="h-5 w-5 text-white/55 transition-colors group-hover:text-lime" />
                    </span>

                    <h3 className="mt-5 text-base font-bold leading-snug tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-[1.7] text-white/50">{feature.body}</p>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/30">
              Capabilities listed here are the ones used on the event pages linked
              above. Ticketing, payment and reporting options vary by event — tell us
              what your event needs and we will confirm exactly what we can set up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
