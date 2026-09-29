import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../../data/portfolioData';
import { SectionHeading } from './SectionHeading';

/** Live client builds lead the rail, deduplicated by project title so no brand appears twice. */
const ITEMS = (() => {
  const candidates = [
    ...PORTFOLIO_ITEMS.filter((i) => i.link && i.category === 'Website & App Development'),
    ...PORTFOLIO_ITEMS.filter((i) => i.link && i.category !== 'Website & App Development'),
  ];
  const seenTitles = new Set<string>();
  const uniqueItems: typeof PORTFOLIO_ITEMS = [];

  for (const item of candidates) {
    const key = item.title.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueItems.push(item);
    }
  }

  return uniqueItems.slice(0, 10);
})();

export const WorkCarousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // One card plus its gap, so the rail lands cleanly rather than mid-card.
    const amount = Math.min(el.clientWidth * 0.8, 380);
    el.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  return (
    <section className="bg-ink py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="Portfolio"
            lineOne="CHECK OUT"
            lineTwo="OUR RECENT WORK."
            lineTwoClassName="text-transparent [-webkit-text-stroke:1.5px_#BFFF00] sm:[-webkit-text-stroke:2px_#BFFF00]"
            align="center"
            className="text-center"
            intro="Explore live platforms, packaging systems, and digital brands built to perform."
          />

          {/* Rail controls */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous projects"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-lime/40 hover:text-lime disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white/70"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Drag or Navigate
            </span>
            <button
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next projects"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-lime/40 hover:text-lime disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white/70"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed rail so cards run off the right edge. */}
      <div
        ref={trackRef}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ITEMS.map((item) => {
          const inner = (
            <>
              <div className="aspect-[4/3] overflow-hidden bg-white/[0.02]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-5">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-lime">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white">{item.title}</h3>

                {item.link && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 transition-all group-hover:gap-3 group-hover:text-lime">
                    Visit site
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </>
          );

          const cardClass =
            'group relative block w-[17rem] flex-shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-ink-soft transition-colors hover:border-lime/30 sm:w-[20rem]';

          return item.link ? (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              {inner}
            </a>
          ) : (
            <div key={item.id} className={cardClass}>
              {inner}
            </div>
          );
        })}

        {/* Tail card into the full portfolio. */}
        <Link
          to="/portfolio"
          className="group flex w-[17rem] flex-shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 text-center transition-colors hover:border-lime/40 sm:w-[20rem]"
        >
          <span className="text-3xl font-bold text-lime">+{PORTFOLIO_ITEMS.length - ITEMS.length}</span>
          <span className="text-sm font-semibold text-white/60 transition-colors group-hover:text-lime">
            more projects
          </span>
          <ArrowUpRight className="h-5 w-5 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
        </Link>
      </div>
    </section>
  );
};
