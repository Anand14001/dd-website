import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { CLIENT_STORIES, SATISFACTION_STAT } from '../../data/portfolioPageData';

export const ClientStories: React.FC = () => {
  return (
    <section className="bg-ink py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl 2xl:max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
            <Star className="h-3.5 w-3.5" />
            <span>Testimonials</span>
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            Success Stories From Those Who Know Us Best
          </h2>

          <p className="mt-6 text-base leading-[1.75] text-white/60 sm:text-lg">
            Hear directly from our delighted clients who have experienced significant growth and
            transformation with Digital Dude. Our proven strategies have consistently delivered
            remarkable results, helping businesses achieve their goals and exceed expectations.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Satisfaction stat */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="group relative min-h-[22rem] overflow-hidden rounded-2xl border border-lime/25 lg:col-span-4"
          >
            <img
              src={SATISFACTION_STAT.image}
              alt={SATISFACTION_STAT.imageAlt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Scrim keeps the figures legible whatever the photo is doing underneath. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30"
            />

            <div className="relative flex h-full flex-col justify-end p-8">
              <span className="text-6xl font-bold tracking-[-0.03em] text-lime lg:text-7xl">
                {SATISFACTION_STAT.value}
              </span>
              <span className="mt-3 text-lg font-bold text-white">{SATISFACTION_STAT.label}</span>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {SATISFACTION_STAT.detail}
              </p>
            </div>
          </motion.div>

          {/* Stories */}
          <div className="grid grid-cols-1 gap-5 lg:col-span-8">
            {CLIENT_STORIES.map((story, i) => (
              <motion.figure
                key={story.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-ink-soft p-7 transition-colors hover:border-lime/25"
              >
                <Quote className="h-6 w-6 text-lime/50" />

                <blockquote className="mt-4 text-sm leading-[1.75] text-white/70">
                  {story.quote}
                </blockquote>

                <figcaption className="mt-5 border-t border-white/10 pt-4">
                  <span className="block text-sm font-bold text-white">{story.name}</span>
                  <span className="mt-0.5 block text-xs text-white/40">{story.company}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
