import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { AGENCY_INFO } from '../../data/agencyData';
import { dialable } from './utils';
import { HeroIllustration } from './HeroIllustration';

export const ContactHero: React.FC = () => {
  const primaryPhone = AGENCY_INFO.contact.phones[0];

  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 lg:pt-40 lg:pb-24">
      {/* Off-centre wash sitting behind the illustration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 72% 45%, rgba(191,255,0,0.07) 0%, transparent 70%)',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      {/* Oversized outlined watermark behind the copy. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center text-[22vw] font-bold leading-none tracking-[-0.04em] lg:top-16"
        style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}
      >
        CONTACT
      </span>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'transform' }}
        >
          <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            LET&apos;S TALK ABOUT
            <br />
            <span className="text-lime">WHAT YOU&apos;RE BUILDING.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-[1.7] text-white/60">
            Tell us where you want to grow and we&apos;ll tell you honestly what it takes. The first
            consultation is free.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#enquiry"
              className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-lime-dim"
            >
              Start your project
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>

            <a
              href={`sms:${dialable(primaryPhone)}`}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white/80 transition-colors hover:border-lime/40 hover:text-lime"
            >
              {/* Pinging dot, signalling the line is live. */}
              <span aria-hidden className="dd-ping h-2 w-2 rounded-full bg-lime" />
              <MessageSquare className="h-4 w-4" />
              Text us
            </a>
          </div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center lg:justify-end"
          style={{ willChange: 'transform' }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
};
