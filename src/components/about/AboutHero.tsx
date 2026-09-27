import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Users } from 'lucide-react';
import { TRAFFIC_STAT } from '../../data/aboutPageData';
import { AboutIllustration } from './AboutIllustration';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
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

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center text-[22vw] font-bold leading-none tracking-[-0.04em] lg:top-16"
        style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}
      >
        ABOUT
      </span>

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'transform' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              <Users className="h-3.5 w-3.5" />
              <span>About Us</span>
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              WHO ARE
              <br />
              <span className="text-lime">WE.!</span>
            </h1>

            <div className="mt-7 max-w-xl space-y-4 text-lg leading-[1.7] text-white/60">
              <p>
                At <strong className="font-semibold text-white">Digital Dude</strong>, we empower
                businesses to grow with the right blend of technology and marketing.
              </p>
              <p>
                We craft tailored digital solutions that enhance visibility, attract the right
                audience, and drive measurable sales.
              </p>
              <p className="border-l-2 border-lime/60 pl-4 text-base text-white/50">
                Our mission is simple — to transform businesses with smart strategies and unlock
                their true growth potential.
              </p>
            </div>

            <Link
              to="/services"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-lime-dim"
            >
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Illustration with the traffic stat pinned to it */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
            style={{ willChange: 'transform' }}
          >
            <AboutIllustration />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-2 left-0 rounded-2xl border border-white/10 bg-ink-soft/90 p-5 backdrop-blur-sm lg:left-4"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                {TRAFFIC_STAT.label}
              </span>
              <div className="mt-1.5 flex items-baseline gap-2.5">
                <span className="text-3xl font-bold tracking-[-0.02em] text-white">
                  {TRAFFIC_STAT.value}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-lime">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {TRAFFIC_STAT.delta}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
