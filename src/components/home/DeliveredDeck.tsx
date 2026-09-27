import React, { useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { PORTFOLIO_ITEMS, PortfolioItem } from '../../data/portfolioData';
import { SectionHeading } from './SectionHeading';

interface DeckCard {
  category: string;
  value: string;
  metric: string;
  caption: string;
  /** Scatter position on the stage, as percentages. */
  left: string;
  top: string;
  rotate: number;
}

/** Categories to surface, in deck order, with the wording for each card. */
const DECK_SPEC: Array<{
  category: PortfolioItem['category'];
  metric: string;
  caption: string;
  left: string;
  top: string;
  rotate: number;
}> = [
  {
    category: 'Website & App Development',
    metric: 'Sites shipped',
    caption: 'Live client builds',
    left: '1.5rem',
    top: '6%',
    rotate: -7,
  },
  {
    category: 'Package Design',
    metric: 'Packs designed',
    caption: 'Retail-ready artwork',
    left: 'calc(50% - 9rem)',
    top: '0%',
    rotate: 4,
  },
  {
    category: 'Logo',
    metric: 'Identities built',
    caption: 'Marks and brand systems',
    left: 'calc(100% - 17.5rem)',
    top: '8%',
    rotate: -3,
  },
  {
    category: 'Social Media Posters',
    metric: 'Campaign creatives',
    caption: 'Built for the feed',
    left: '3.5rem',
    top: '48%',
    rotate: 6,
  },
  {
    category: 'Corporate Needs',
    metric: 'Corporate collateral',
    caption: 'Decks, profiles, print',
    left: 'calc(50% - 3rem)',
    top: '54%',
    rotate: -5,
  },
  {
    category: 'Business Cards',
    metric: 'Card systems',
    caption: 'Print-ready sets',
    left: 'calc(100% - 18.5rem)',
    top: '46%',
    rotate: 8,
  },
];

/** Three palettes cycling through the stack. */
const VARIANTS = [
  { card: 'bg-ink border-white/10', label: 'text-lime/60', value: 'text-lime', body: 'text-lime' },
  { card: 'bg-lime border-transparent', label: 'text-ink/60', value: 'text-ink', body: 'text-ink' },
  { card: 'bg-white border-black/10', label: 'text-ink/50', value: 'text-ink', body: 'text-ink' },
];

export const DeliveredDeck: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  // Counts come straight from the portfolio, so the deck can never drift from the work.
  const cards: DeckCard[] = useMemo(
    () =>
      DECK_SPEC.map((spec) => ({
        category: spec.category,
        value: String(PORTFOLIO_ITEMS.filter((i) => i.category === spec.category).length),
        metric: spec.metric,
        caption: spec.caption,
        left: spec.left,
        top: spec.top,
        rotate: spec.rotate,
      })),
    [],
  );

  return (
    <section className="relative overflow-hidden bg-ink-soft py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 70% 50%, rgba(191,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <SectionHeading
          eyebrow="Our output"
          lineOne="WHAT WE'VE"
          lineTwo="DELIVERED."
          intro="Every number below is a piece of work in our portfolio — not a projection. Drag the cards around."
        />

        {/* Scattered, draggable deck (md and up) */}
        <div
          ref={stageRef}
          className="relative mt-16 hidden h-[28rem] lg:h-[30rem] md:block"
        >
          {cards.map((card, i) => {
            const v = VARIANTS[i % VARIANTS.length];

            return (
              <motion.article
                key={card.category}
                drag
                dragConstraints={stageRef}
                dragMomentum={false}
                dragElastic={0.12}
                whileDrag={{ scale: 1.06, zIndex: 50 }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                initial={{ opacity: 0, y: 30, rotate: card.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ left: card.left, top: card.top }}
                className={`absolute w-52 cursor-grab rounded-3xl border p-6 shadow-2xl active:cursor-grabbing lg:w-56 ${v.card}`}
              >
                <span
                  className={`mb-4 block text-[0.6rem] font-bold uppercase tracking-widest ${v.label}`}
                >
                  {card.category}
                </span>
                <span className={`mb-2 block text-5xl font-black leading-none ${v.value}`}>
                  {card.value}
                </span>
                <span className={`block text-base font-bold ${v.body}`}>{card.metric}</span>
                <span className={`mt-1.5 block text-sm opacity-50 ${v.body}`}>{card.caption}</span>
              </motion.article>
            );
          })}
        </div>

        {/* Plain grid on small screens, where a drag surface would fight the page scroll. */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:hidden">
          {cards.map((card, i) => {
            const v = VARIANTS[i % VARIANTS.length];

            return (
              <div key={card.category} className={`rounded-2xl border p-5 ${v.card}`}>
                <span
                  className={`mb-3 block text-[0.6rem] font-bold uppercase tracking-widest ${v.label}`}
                >
                  {card.category}
                </span>
                <span className={`mb-1.5 block text-4xl font-black leading-none ${v.value}`}>
                  {card.value}
                </span>
                <span className={`block text-sm font-bold ${v.body}`}>{card.metric}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
