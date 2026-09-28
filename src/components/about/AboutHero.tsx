import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../home/SectionHeading';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(191,255,0,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 select-none text-center text-[22vw] font-bold leading-none tracking-[-0.04em] lg:top-16"
        style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}
      >
        ABOUT
      </span>

      <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="About Us"
            lineOne="WHO WE"
            lineTwo="REALLY ARE."
            lineTwoClassName="text-transparent [-webkit-text-stroke:1.5px_#BFFF00] sm:[-webkit-text-stroke:2px_#BFFF00]"
            align="center"
            className="text-center"
            intro="At Digital Dude, we empower businesses to grow with the right blend of technology and marketing. We craft tailored digital solutions that enhance visibility, attract the right audience, and drive measurable sales."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-xl bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-all hover:bg-lime-dim active:scale-95"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <span>Get in Touch</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
