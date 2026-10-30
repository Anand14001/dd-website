import React from 'react';
import { motion } from 'motion/react';
import { Compass, Hammer, LifeBuoy, Map, type LucideIcon } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/eventsPageData';
import { SectionHeading } from '../home/SectionHeading';

const ICONS: Record<string, LucideIcon> = { Compass, Map, Hammer, LifeBuoy };

/**
 * How we work.
 *
 * Four steps, numbered, on a single connected line — the point is to show an
 * organiser that there is a method and that it ends after the event rather than at
 * handover. The oversized step numeral does the visual work so the cards stay
 * light on decoration.
 */
export const EventProcess: React.FC = () => (
  <section className="relative overflow-hidden bg-ink-soft py-20 lg:py-28">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />

    <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <SectionHeading
        eyebrow="How we work"
        lineOne="FOUR STEPS,"
        lineTwo="NO SURPRISES."
        intro="The same sequence on every event, so you always know what is happening and what is needed from you next."
      />

      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step, i) => {
          const Icon = ICONS[step.iconName] ?? Compass;

          return (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-6 transition-colors hover:border-lime/25 lg:p-7"
            >
              {/* Oversized step numeral, bled into the top-right corner. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-1 -top-4 select-none text-[5rem] font-bold leading-none tracking-tighter text-white/[0.04] transition-colors duration-300 group-hover:text-lime/[0.09]"
              >
                {step.step}
              </span>

              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-lime/25 group-hover:bg-lime/[0.07]">
                <Icon className="h-5 w-5 text-white/55 transition-colors group-hover:text-lime" />
              </span>

              <h3 className="relative mt-5 text-base font-bold leading-snug tracking-tight text-white">
                {step.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-[1.7] text-white/50">{step.body}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  </section>
);
