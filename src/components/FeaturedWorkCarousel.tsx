import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MousePointer2 } from 'lucide-react';
import { PortfolioItem } from '../data/portfolioData';

interface FeaturedWorkCarouselProps {
  items: PortfolioItem[];
}

export const FeaturedWorkCarousel: React.FC<FeaturedWorkCarouselProps> = ({ items }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    setIsPointerDown(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!isDragging.current || !el) return;
    const delta = e.clientX - startX.current;
    dragDistance.current = Math.abs(delta);
    el.scrollLeft = startScrollLeft.current - delta;
  };

  const endDrag = () => {
    isDragging.current = false;
    setIsPointerDown(false);
  };

  // Suppress the click-through to a card's link if the pointer actually dragged.
  const onCardClick = (e: React.MouseEvent) => {
    if (dragDistance.current > 6) {
      e.preventDefault();
    }
  };

  const scrollByAmount = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
          <MousePointer2 className="w-3.5 h-3.5 text-lime" />
          Drag To Explore
        </span>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`flex gap-6 overflow-x-auto pb-4 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isPointerDown ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollSnapType: isPointerDown ? 'none' : 'x mandatory' }}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCardClick}
            className="snap-start shrink-0 w-[260px] sm:w-[320px] group"
          >
            <div className="rounded-2xl bg-ink-soft border border-white/10 group-hover:border-lime/30 overflow-hidden transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden bg-white/[0.02] pointer-events-none">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-lime block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-lime transition-colors shrink-0" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
