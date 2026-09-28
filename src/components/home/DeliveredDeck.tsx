import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';

interface DeliveredCard {
  id: string;
  category: string;
  value: string;
  metric: string;
  caption: string;
  transformClass: string;
  baseZIndex: number;
  style: {
    card: string;
    label: string;
    value: string;
    body: string;
    sub: string;
    shadow: string;
  };
}

const CARDS_DATA: DeliveredCard[] = [
  {
    id: 'social-media',
    category: 'SOCIAL MEDIA',
    value: '200K+',
    metric: 'Audience Reach',
    caption: 'Across organic & paid campaigns',
    transformClass:
      'origin-bottom -rotate-[8deg] translate-y-[10px] min-[360px]:-rotate-[9deg] min-[360px]:translate-y-[12px] sm:-rotate-[11deg] sm:translate-y-[22px]',
    baseZIndex: 10,
    style: {
      card: 'bg-ink border border-white/10',
      label: 'text-lime',
      value: 'text-lime',
      body: 'text-white',
      sub: 'text-white/60',
      shadow: 'shadow-[0_22px_45px_-12px_rgba(0,0,0,0.85)]',
    },
  },
  {
    id: 'web-apps',
    category: 'WEB & APPS',
    value: '25+',
    metric: 'Platforms Shipped',
    caption: 'High-converting custom architecture',
    transformClass:
      'origin-bottom -rotate-[4deg] translate-y-[3px] min-[360px]:-rotate-[4deg] min-[360px]:translate-y-[4px] sm:-rotate-[5deg] sm:translate-y-[8px]',
    baseZIndex: 20,
    style: {
      card: 'bg-lime border border-lime/40',
      label: 'text-ink/80',
      value: 'text-ink',
      body: 'text-ink font-bold',
      sub: 'text-ink/75',
      shadow: 'shadow-[0_22px_45px_-12px_rgba(0,0,0,0.45)]',
    },
  },
  {
    id: 'paid-roi',
    category: 'GROWTH & ROI',
    value: '300%',
    metric: 'Average ROI',
    caption: 'Measurable commercial sales impact',
    transformClass:
      'origin-bottom rotate-0 -translate-y-[5px] min-[360px]:-translate-y-[6px] sm:-translate-y-[10px]',
    baseZIndex: 30,
    style: {
      card: 'bg-white border border-black/10',
      label: 'text-ink/60',
      value: 'text-ink',
      body: 'text-ink font-bold',
      sub: 'text-ink/65',
      shadow: 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]',
    },
  },
  {
    id: 'packaging-design',
    category: 'BRAND & PACKAGING',
    value: '80+',
    metric: 'Designs Delivered',
    caption: 'Retail-ready packs & brand systems',
    transformClass:
      'origin-bottom rotate-[4deg] translate-y-[3px] min-[360px]:rotate-[4deg] min-[360px]:translate-y-[4px] sm:rotate-[5deg] sm:translate-y-[8px]',
    baseZIndex: 20,
    style: {
      card: 'bg-ink border border-white/10',
      label: 'text-lime',
      value: 'text-lime',
      body: 'text-white',
      sub: 'text-white/60',
      shadow: 'shadow-[0_22px_45px_-12px_rgba(0,0,0,0.85)]',
    },
  },
  {
    id: 'reputation-reviews',
    category: 'REPUTATION',
    value: '100+',
    metric: 'Trusted Clients',
    caption: '5-Star verified client satisfaction',
    transformClass:
      'origin-bottom rotate-[8deg] translate-y-[10px] min-[360px]:rotate-[9deg] min-[360px]:translate-y-[12px] sm:rotate-[11deg] sm:translate-y-[22px]',
    baseZIndex: 10,
    style: {
      card: 'bg-lime border border-lime/40',
      label: 'text-ink/80',
      value: 'text-ink',
      body: 'text-ink font-bold',
      sub: 'text-ink/75',
      shadow: 'shadow-[0_22px_45px_-12px_rgba(0,0,0,0.45)]',
    },
  },
];

export const DeliveredDeck: React.FC = () => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // Close the expanded card when user taps or clicks somewhere outside the deck
  useEffect(() => {
    if (!activeCardId) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (deckRef.current && !deckRef.current.contains(event.target as Node)) {
        setActiveCardId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [activeCardId]);

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative overflow-hidden bg-ink-soft py-20 sm:py-24 lg:py-32">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(191,255,0,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Heading matching reference layout */}
        <SectionHeading
          eyebrow="Real Results"
          lineOne="WHAT WE'VE"
          lineTwo="DELIVERED."
          lineTwoClassName="text-transparent [-webkit-text-stroke:1.5px_#BFFF00] sm:[-webkit-text-stroke:2px_#BFFF00]"
          align="center"
          className="text-center"
          intro="Every number below is a real result shipped for our clients — engineered for visibility, engagement, and sales."
        />

        {/* Fanned Overlapping Cards Deck (Desktop & Mobile) */}
        <div
          ref={deckRef}
          className="relative mt-12 sm:mt-16 lg:mt-20 flex justify-center items-center py-6 sm:py-10"
        >
          <div className="flex items-center justify-center select-none max-w-full">
            {CARDS_DATA.map((card, index) => {
              const isActive = activeCardId === card.id;

              return (
                <motion.article
                  key={card.id}
                  onClick={(e) => handleCardClick(e, card.id)}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    zIndex: isActive ? 50 : card.baseZIndex,
                  }}
                  className={`group relative cursor-pointer transition-all duration-300 ease-out
                    /* Responsive Dimensions */
                    w-[100px] min-[360px]:w-[110px] min-[400px]:w-[124px] sm:w-[160px] md:w-[200px] lg:w-[245px] xl:w-[265px]
                    h-[165px] min-[360px]:h-[180px] min-[400px]:h-[195px] sm:h-[245px] md:h-[295px] lg:h-[330px] xl:h-[350px]
                    rounded-2xl sm:rounded-3xl p-3 min-[360px]:p-3.5 sm:p-5 md:p-6 lg:p-7
                    flex flex-col justify-between
                    ${card.style.card}
                    ${card.style.shadow}
                    /* Overlap Margins */
                    ${
                      index > 0
                        ? '-ml-[44px] min-[360px]:-ml-[48px] min-[400px]:-ml-[54px] sm:-ml-[68px] md:-ml-[80px] lg:-ml-[90px] xl:-ml-[95px]'
                        : ''
                    }
                    /* Transform on Mobile / Default state */
                    ${
                      isActive
                        ? '!scale-110 !-translate-y-5 !rotate-0 ring-2 ring-lime/60 shadow-2xl'
                        : card.transformClass
                    }
                    /* Hover Elevate on Desktop */
                    lg:hover:!scale-105 lg:hover:!-translate-y-6 lg:hover:!rotate-0 lg:hover:!z-50
                  `}
                >
                  {/* Top Category Tag */}
                  <div>
                    <span
                      className={`block text-[8px] min-[360px]:text-[9px] sm:text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider md:tracking-widest ${card.style.label}`}
                    >
                      {card.category}
                    </span>
                  </div>

                  {/* Main Metric & Value */}
                  <div className="my-auto py-1">
                    <span
                      className={`block text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-black leading-none tracking-tight ${card.style.value}`}
                    >
                      {card.value}
                    </span>
                    <span
                      className={`mt-1 sm:mt-1.5 md:mt-2 block text-[11px] min-[360px]:text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-snug ${card.style.body}`}
                    >
                      {card.metric}
                    </span>
                  </div>

                  {/* Subtitle / Caption */}
                  <div className="pt-1">
                    <span
                      className={`block text-[8px] min-[360px]:text-[9px] sm:text-xs md:text-xs lg:text-sm leading-tight ${card.style.sub}`}
                    >
                      {card.caption}
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
