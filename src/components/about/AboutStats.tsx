import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { AGENCY_INFO } from '../../data/agencyData';
import { RATING_STAT } from '../../data/aboutPageData';

export const AboutStats: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(191,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Four headline figures */}
          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:col-span-8"
          >
            {AGENCY_INFO.stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="bg-ink-soft px-6 py-9"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-4xl font-bold tracking-[-0.02em] text-lime lg:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-sm text-white/50">{stat.label}</span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          {/* Client rating */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center rounded-2xl border border-lime/25 bg-lime/[0.06] p-8 lg:col-span-4"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold tracking-[-0.03em] text-lime">
                {RATING_STAT.value}
              </span>
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-lime text-lime" />
                ))}
              </span>
            </div>

            <span className="mt-3 text-lg font-bold text-white">{RATING_STAT.label}</span>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{RATING_STAT.detail}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
