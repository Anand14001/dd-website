import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_ITEMS, PortfolioItem } from '../../data/portfolioData';

const CATEGORIES: Array<PortfolioItem['category'] | 'All'> = [
  'All',
  'Website & App Development',
  'Graphic Designing',
  'Logo',
  'Package Design',
  'Business Cards',
  'Social Media Posters',
  'Corporate Needs',
];

export const PortfolioGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<PortfolioItem['category'] | 'All'>('All');

  const filteredItems = PORTFOLIO_ITEMS.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory,
  );

  return (
    <section id="portfolio" className="bg-ink py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                activeCategory === cat
                  ? 'bg-lime text-ink'
                  : 'border border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filteredItems.map((item, i) => {
            const card = (
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-soft transition-all duration-300 hover:-translate-y-1 hover:border-lime/30">
                <div className="aspect-[4/3] overflow-hidden bg-white/[0.02]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-lime">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  </div>
                  {item.link && (
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-lime" />
                  )}
                </div>
              </div>
            );

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              >
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {card}
                  </a>
                ) : (
                  card
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <p className="py-16 text-center text-sm text-white/40">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
};
