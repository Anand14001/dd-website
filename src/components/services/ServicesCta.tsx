import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const ServicesCta: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-ink py-28 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.08] blur-[130px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          NEED A TEAM THAT
          <br />
          <span className="text-lime">DOES ALL OF IT?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          Tell us what you're trying to grow. The first consultation is free — no commitment either
          way.
        </p>

        <Link
          to="/contact"
          className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-lime-dim"
        >
          Start a conversation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};
