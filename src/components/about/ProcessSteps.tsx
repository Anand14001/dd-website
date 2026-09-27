import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/aboutPageData';

export const ProcessSteps: React.FC = () => {
  return (
    <section id="process" className="bg-ink-soft py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl 2xl:max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
            <Compass className="h-3.5 w-3.5" />
            <span>Our Process</span>
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            A Proven Step-by-Step Approach to Achieving Your Business Goals
          </h2>
        </motion.div>

        <div className="relative mt-16">
          {/* Rail the steps sit on, desktop only. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-lime/30 bg-ink text-lg font-bold text-lime">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-[1.75] text-white/55">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
