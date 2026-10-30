import React from 'react';
import { motion } from 'motion/react';
import { Check, Handshake, Minus } from 'lucide-react';
import { POSITIONING } from '../../data/eventsPageData';

/**
 * The positioning band.
 *
 * The brief's hardest requirement is that an organiser must not mistake this for
 * an event management offer. Rather than hinting at it, the page states the
 * boundary outright — which reads as confidence, not as a limitation, and saves
 * the sales conversation that would otherwise start on the wrong footing.
 */
export const EventPositioning: React.FC = () => (
  <section className="relative border-y border-white/10 bg-ink-soft py-16 lg:py-20">
    <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
          Where we fit
        </span>
        <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl">
          We&apos;re your technology partner —{' '}
          <span className="text-white/40">not your event manager.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.75] text-white/55">
          Every event creates a journey for its audience — from discovering the event and
          registering to receiving updates and arriving on the day. We build that journey.
          Being clear about the line saves everyone time.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {/* What we handle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-lime/20 bg-lime/[0.04] p-7"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-lime">
            {POSITIONING.weDo.title}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {POSITIONING.weDo.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime/15">
                  <Check className="h-2.5 w-2.5 text-lime" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* What we don't */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-7"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/40">
            {POSITIONING.weDont.title}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {POSITIONING.weDont.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/45">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                  <Minus className="h-2.5 w-2.5 text-white/40" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* How we fit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-lime/[0.07] blur-[70px]"
          />
          <div className="relative">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime/25 bg-lime/10">
              <Handshake className="h-5 w-5 text-lime" />
            </span>
            <h3 className="mt-5 text-sm font-bold uppercase tracking-wider text-white">
              {POSITIONING.fit.title}
            </h3>
            <p className="mt-4 text-sm leading-[1.75] text-white/60">{POSITIONING.fit.body}</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
