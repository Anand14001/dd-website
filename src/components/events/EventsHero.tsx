import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarClock, MapPin, Ticket } from 'lucide-react';
import { EVENT_PROJECTS } from '../../data/eventsPageData';
import { EventsIllustration } from './EventsIllustration';

/**
 * First screen. Three jobs, in order: say what this is (event technology, not
 * event management), prove it is live, and give two ways forward.
 *
 * The "next event" strip is derived from the project data rather than written in,
 * so it can never contradict the cards further down the page.
 */
export const EventsHero: React.FC = () => {
  const upcoming = EVENT_PROJECTS.filter((p) => p.status === 'upcoming');
  const completed = EVENT_PROJECTS.filter((p) => p.status === 'completed');
  const nextEvent = upcoming[0];

  const cities = Array.from(
    new Set(EVENT_PROJECTS.map((p) => p.city?.split(',')[0]).filter(Boolean)),
  ) as string[];

  const proofPoints = [
    { value: `${EVENT_PROJECTS.length}`, label: 'Event projects' },
    { value: `${upcoming.length}`, label: 'Live & upcoming' },
    { value: `${cities.length}`, label: 'Cities' },
    { value: '2022', label: 'Building since' },
  ];

  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Ambient wash + grid, matching the other page heroes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 70% 20%, rgba(191,255,0,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center text-[19vw] font-bold leading-none tracking-[-0.04em] lg:top-14"
        style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}
      >
        EVENTS
      </span>

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ---- Copy column ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
              <Ticket className="h-3.5 w-3.5" />
              Event Technology &amp; Digital Solutions
            </span>

            <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.25rem] 2xl:text-[4.75rem]">
              We power events with{' '}
              <span className="text-lime">better digital experiences.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-[1.75] text-white/60 sm:text-lg 2xl:text-xl">
              From event websites and ticket booking to attendee communication and
              post-event insights, Digital Dude helps event organisers build a smoother
              digital journey before, during and after their event.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                state={{ service: 'Event Technology & Digital Solutions' }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-lime-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Plan your event with us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#event-projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Explore our event work
              </a>
            </div>

            {/* Derived proof row — never out of step with the cards below. */}
            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {proofPoints.map((point) => (
                <div key={point.label} className="bg-ink-soft px-4 py-5 text-center">
                  <dt className="sr-only">{point.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold tracking-[-0.02em] text-lime sm:text-[1.75rem]">
                      {point.value}
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-snug text-white/45">
                      {point.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* ---- Illustration column ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex justify-center lg:justify-end">
              <EventsIllustration />
            </div>

            {/* Next event up, read straight off the project data. */}
            {nextEvent && (
              <div className="mx-auto mt-4 max-w-[520px] rounded-2xl border border-white/10 bg-ink-soft/80 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
                    Next event live on our stack
                  </span>
                </div>

                <p className="mt-2.5 text-sm font-bold text-white">{nextEvent.name}</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/45">
                  {nextEvent.dateLabel && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="h-3 w-3 text-lime/70" />
                      {nextEvent.dateLabel}
                    </span>
                  )}
                  {nextEvent.city && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-lime/70" />
                      {nextEvent.city}
                    </span>
                  )}
                  <span className="text-white/30">
                    {completed.length} completed {completed.length === 1 ? 'event' : 'events'} before it
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
