import React, { useEffect, useRef, useState } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  /** Rendered on two lines, the second in lime. */
  lineOne: string;
  lineTwo: string;
  intro?: string;
  align?: 'left' | 'center';
}

/**
 * Section heading with a wipe reveal: a clip-path opens the text while a bar
 * sweeps across in front of it. Fires once, when the block scrolls into view.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  lineOne,
  lineTwo,
  intro,
  align = 'left',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${revealed ? 'is-revealed' : ''} ${
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">{eyebrow}</span>

      <h2 className="relative mt-5 overflow-hidden text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
        <span className="dd-wipe-text block">
          {lineOne}
          <br />
          <span className="text-lime">{lineTwo}</span>
        </span>

        {/* The bar that sweeps across the reveal. */}
        <span
          aria-hidden
          className="dd-wipe-bar pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-lime/25 to-transparent"
        />
      </h2>

      {intro && (
        <p
          className={`mt-6 text-base leading-[1.75] text-white/60 sm:text-lg ${
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
};
