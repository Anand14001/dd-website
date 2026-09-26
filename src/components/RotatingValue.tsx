import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** The outcomes a client gets, drawn from the seven service lines. */
export const VALUE_PHRASES = [
  'enhance visibility',
  'attract the right audience',
  'drive measurable sales',
  'rank higher on search',
  'turn scrolls into enquiries',
];

const DWELL_MS = 2600;

/**
 * Highlighted slot that cycles through the value phrases, with an underline
 * that redraws on every swap.
 *
 * The rotating text is aria-hidden and a static sentence carries all the
 * phrases for assistive tech, so nothing is read as a flickering fragment.
 */
export const RotatingValue: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Respect the reduced-motion preference by freezing on the first phrase.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % VALUE_PHRASES.length);
    }, DWELL_MS);

    return () => window.clearInterval(timer);
  }, []);

  const phrase = VALUE_PHRASES[index];

  return (
    <>
      {/* Full sentence for screen readers, since the visual slot only ever shows one phrase. */}
      <span className="sr-only">
        {VALUE_PHRASES.slice(0, -1).join(', ')}, and {VALUE_PHRASES[VALUE_PHRASES.length - 1]}.
      </span>

      <motion.span
        aria-hidden
        layout
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative inline-flex max-w-full flex-col align-bottom"
      >
        <span className="relative inline-flex overflow-hidden pb-0.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phrase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="whitespace-nowrap font-semibold text-lime"
            >
              {phrase}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* Underline redrawing on each swap. */}
        <motion.span
          key={`${phrase}-bar`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
          className="h-[2px] w-full rounded-full bg-lime/70"
        />
      </motion.span>
    </>
  );
};
