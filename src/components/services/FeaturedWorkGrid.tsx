import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FEATURED_WORK } from '../../data/servicesPageData';
import { PORTFOLIO_ITEMS } from '../../data/portfolioData';

/** Three-up image grid. Detail slides up from the bottom edge on hover. */
export const FeaturedWorkGrid: React.FC = () => {
  const remaining = PORTFOLIO_ITEMS.length - FEATURED_WORK.length;

  return (
    <section className="bg-ink pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURED_WORK.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90"
              />

              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-lime">
                  {item.category}
                </span>
                <h3 className="mt-1.5 text-xl font-bold text-white">{item.title}</h3>

                {/* Revealed on hover; stays readable without it on touch devices. */}
                <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-lime"
                    >
                      Visit site
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition-colors hover:text-lime"
          >
            <span className="text-lime">+</span>
            {remaining} more projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
