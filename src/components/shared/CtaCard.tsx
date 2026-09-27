import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  eyebrow?: string;
  heading: React.ReactNode;
  body: string;
  ctaLabel?: string;
  to?: string;
}

/** Contained CTA panel, for pages that end on a card rather than a full-bleed band. */
export const CtaCard: React.FC<CtaCardProps> = ({
  eyebrow = 'Start a project',
  heading,
  body,
  ctaLabel = 'Get in touch',
  to = '/contact',
}) => {
  return (
    <section className="bg-ink pt-20 pb-24 lg:pt-24 lg:pb-32">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-soft px-7 py-14 text-center sm:px-12 lg:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.08] blur-[120px]"
          />

          <div className="relative">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
              {eyebrow}
            </span>

            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl">
              {heading}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">{body}</p>

            <Link
              to={to}
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-lime-dim"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
