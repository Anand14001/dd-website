import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../../data/portfolioData';
import { PortfolioIllustration } from './PortfolioIllustration';

export const PortfolioHero: React.FC = () => {
  const projectCount = PORTFOLIO_ITEMS.length;
  const categoryCount = new Set(PORTFOLIO_ITEMS.map((i) => i.category)).size;
  const liveSites = PORTFOLIO_ITEMS.filter((i) => i.link).length;

  const stats = [
    { value: `${projectCount}`, label: 'Projects shown' },
    { value: `${categoryCount}`, label: 'Disciplines' },
    { value: `${liveSites}`, label: 'Live links' },
    { value: '99%', label: 'Client satisfaction' },
  ];

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
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center text-[19vw] font-bold leading-none tracking-[-0.04em] lg:top-16"
        style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}
      >
        PORTFOLIO
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'transform' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Our Work</span>
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              THE WORK
              <br />
              <span className="text-lime">SPEAKS FIRST.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-[1.7] text-white/60">
              Websites, brand identities and creative work delivered for businesses across Chennai
              and beyond. Browse by discipline below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
            style={{ willChange: 'transform' }}
          >
            <PortfolioIllustration />
          </motion.div>
        </div>

        <motion.dl
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-ink-soft px-6 py-7"
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
      </div>
    </section>
  );
};
