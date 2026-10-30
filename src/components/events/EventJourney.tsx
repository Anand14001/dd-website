import React from 'react';
import { motion } from 'motion/react';
import {
  BellRing,
  ClipboardCheck,
  DoorOpen,
  LineChart,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { EVENT_JOURNEY } from '../../data/eventsPageData';
import { SectionHeading } from '../home/SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  Search,
  ClipboardCheck,
  BellRing,
  DoorOpen,
  LineChart,
};

/**
 * The attendee journey, before / during / after.
 *
 * This is the page's comprehension anchor: an organiser already pictures their
 * event as a sequence, so the five touchpoints are laid out along one connected
 * rail with the phase labelled above each. On mobile the rail becomes vertical so
 * the order still reads top to bottom — the page is opened on a phone in meetings.
 */
export const EventJourney: React.FC = () => (
  <section className="bg-ink py-20 lg:py-28">
    <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <SectionHeading
        eyebrow="The attendee journey"
        lineOne="FIVE MOMENTS THAT"
        lineTwo="DECIDE YOUR TURNOUT."
        align="center"
        className="text-center"
        intro="Attendance is not won on the day. It is won at each of these points — and every one of them is digital."
      />

      <div className="relative mt-16 lg:mt-20">
        {/* The rail. Horizontal from lg, vertical below it. */}
        <div
          aria-hidden
          className="absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-lime/25 to-transparent lg:inset-x-0 lg:left-0 lg:top-[27px] lg:bottom-auto lg:h-px lg:w-full lg:bg-gradient-to-r lg:from-transparent lg:via-lime/25 lg:to-transparent"
        />

        <ol className="relative grid gap-9 lg:grid-cols-5 lg:gap-6">
          {EVENT_JOURNEY.map((stage, i) => {
            const Icon = ICONS[stage.iconName] ?? Search;

            return (
              <motion.li
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-5 lg:flex-col lg:gap-0"
              >
                {/* Node */}
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-lime/25 bg-ink shadow-[0_0_0_6px_rgba(5,5,7,1)]">
                  <Icon className="h-5 w-5 text-lime" />
                </span>

                <div className="lg:mt-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {stage.phase}
                  </span>
                  <h3 className="mt-1.5 text-base font-bold tracking-tight text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.7] text-white/50 lg:pr-4">{stage.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  </section>
);
