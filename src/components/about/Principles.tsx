import React from 'react';
import { motion } from 'motion/react';
import { PRINCIPLES } from '../../data/aboutPageData';

/** Philosophy, vision and mission as three numbered panels. */
export const Principles: React.FC = () => {
  return (
    <section className="bg-ink-soft py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <motion.article
              key={principle.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-8 transition-all duration-300 hover:-translate-y-1 hover:border-lime/30"
            >
              {/* Oversized index sitting behind the copy */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none text-[6rem] font-bold leading-none text-white/[0.04]"
              >
                {principle.label}
              </span>

              <div className="relative">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
                  {principle.label}
                </span>

                <h2 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-white">
                  {principle.title}
                </h2>

                <p className="mt-4 text-sm leading-[1.75] text-white/55">{principle.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
