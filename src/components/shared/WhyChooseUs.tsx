import React from 'react';
import { motion } from 'motion/react';
import { Award, Lightbulb, Layers, LifeBuoy, ShieldCheck } from 'lucide-react';
import { WHY_CHOOSE_US } from '../../data/portfolioPageData';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Lightbulb,
  Layers,
  LifeBuoy,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="bg-ink-soft py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Why Choose Us</span>
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            Empowering Your Business to Achieve Unmatched Success
          </h2>

          <p className="mt-6 text-base leading-[1.75] text-white/60 sm:text-lg">
            Our team leverages cutting-edge strategies and personalized solutions to help your
            business grow and succeed in the digital world. With our expertise and dedication, we
            ensure your brand thrives in a competitive marketplace.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {WHY_CHOOSE_US.map((pillar, i) => {
            const Icon = ICONS[pillar.iconName] ?? Award;

            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group rounded-2xl border border-white/10 bg-ink p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lime/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-lime/20 bg-lime/10 text-lime transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{pillar.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
