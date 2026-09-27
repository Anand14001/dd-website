import React, { useEffect, useRef, useState } from 'react';
import { AGENCY_INFO } from '../data/agencyData';

/** Splits "200+" into a numeric target (200) and a static suffix ("+"). */
const parseStatValue = (raw: string) => {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, suffix: raw, isNumeric: false };
  return { target: parseFloat(match[1]), suffix: match[2], isNumeric: true };
};

const AnimatedStat: React.FC<{ value: string; label: string; active: boolean }> = ({
  value,
  label,
  active,
}) => {
  const { target, suffix, isNumeric } = parseStatValue(value);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current || !isNumeric) return;
    startedRef.current = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, isNumeric]);

  return (
    <div className="flex flex-col items-center text-center space-y-1.5">
      <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-[-0.02em]">
        {isNumeric ? display : value}
        {suffix}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-ink/70 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
};

export const StatsBand: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-lime py-16 lg:py-20">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 2xl:gap-16">
          {AGENCY_INFO.stats.map((stat) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
};
