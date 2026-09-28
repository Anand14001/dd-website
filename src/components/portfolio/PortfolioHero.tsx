import React from 'react';
import { motion } from 'motion/react';
import { PORTFOLIO_ITEMS } from '../../data/portfolioData';
import { SectionHeading } from '../home/SectionHeading';

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
            'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(191,255,0,0.07) 0%, transparent 70%)',
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

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="Our Work"
            lineOne="THE WORK"
            lineTwo="SPEAKS FIRST."
            lineTwoClassName="text-transparent [-webkit-text-stroke:1.5px_#BFFF00] sm:[-webkit-text-stroke:2px_#BFFF00]"
            align="center"
            className="text-center"
            intro="Websites, brand identities and creative work delivered for businesses across Chennai and beyond. Browse by discipline below."
          />
        </div>

        <motion.dl
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4 max-w-5xl mx-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-ink-soft px-6 py-7 text-center"
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
