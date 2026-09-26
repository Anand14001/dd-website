import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { WHY_CHOOSE_US } from '../../data/portfolioPageData';

/** Deterministic star positions — a seeded generator keeps them stable across renders. */
const STARS = (() => {
  let seed = 20260918;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 54 }, () => ({
    top: `${(rand() * 100).toFixed(2)}%`,
    left: `${(rand() * 100).toFixed(2)}%`,
    size: rand() < 0.8 ? 1.5 : 2.5,
    delay: `${(rand() * 3.2).toFixed(2)}s`,
    lime: rand() < 0.18,
  }));
})();

export const Differentiators: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-24 lg:py-32">
      {/* Starfield */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="dd-star absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              background: star.lime ? '#BFFF00' : '#FFFFFF',
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={headingRef} className={`text-center ${revealed ? 'is-revealed' : ''}`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-lime">
            Why Digital Dude
          </span>

          <h2 className="relative mt-4 overflow-hidden text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            <span className="dd-wipe-text block">
              <span className="block text-white">WHAT MAKES</span>
              <span className="dd-outline-heading block">US DIFFERENT?</span>
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mt-20">
          {/* Spine: left rail on mobile, centred on desktop. */}
          <div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-14 md:space-y-20">
            {WHY_CHOOSE_US.map((pillar, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={pillar.title}
                  className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:items-center"
                >
                  {/* Node on the spine */}
                  <div className="absolute left-4 top-6 -translate-x-1/2 md:static md:col-start-2 md:row-start-1 md:translate-x-0">
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="block h-3.5 w-3.5 rounded-full"
                      style={{
                        background: pillar.accent,
                        boxShadow: `0 0 0 4px ${pillar.accent}22, 0 0 18px 2px ${pillar.accent}66`,
                      }}
                    />
                  </div>

                  {/* Card */}
                  <motion.article
                    initial={{ opacity: 0.25, y: 24, x: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-90px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`ml-12 rounded-2xl border p-6 backdrop-blur-sm md:row-start-1 md:ml-0 md:max-w-md ${
                      isLeft ? 'md:col-start-1 md:mr-12 md:justify-self-end' : 'md:col-start-3 md:ml-12'
                    }`}
                    style={{
                      background: `linear-gradient(160deg, ${pillar.accent}0d, rgba(10,10,15,0.9))`,
                      borderColor: `${pillar.accent}33`,
                      boxShadow: `0 0 34px -12px ${pillar.accent}44`,
                    }}
                  >
                    <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      {pillar.description}
                    </p>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
