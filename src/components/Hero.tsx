import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { RotatingValue } from './RotatingValue';

interface HeroProps {
  onOpenConsultation: () => void;
  onExploreSolutions: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation, onExploreSolutions }) => {
  return (
    /* Sized to the viewport and vertically centred so the CTAs stay above the fold.
       svh rather than vh: mobile browser chrome doesn't then push the buttons under. */
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pb-14 pt-24 lg:pb-16 lg:pt-28"
    >
      {/* Faint single-colour ambient glow -- restrained, not decorative noise */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-lime/[0.06] blur-[160px] rounded-full pointer-events-none" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #050507 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Centered, full-bleed headline block */}
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-[2.25rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] 2xl:text-[4.75rem] font-bold text-white tracking-[-0.02em] leading-[1.05]">
            Grow Your Business With The{' '}
            <span className="text-outline-accent">Right Blend Of Technology &amp; Marketing</span>
          </h1>

          <div className="space-y-3 max-w-2xl 2xl:max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-white/70 font-normal leading-[1.6]">
              At <strong className="text-white font-semibold">Digital Dude</strong>, we empower
              businesses to grow with the right blend of technology and marketing. We craft tailored
              digital solutions that <RotatingValue />.
            </p>
            <p className="text-sm text-white/50 leading-[1.6] border-l-2 border-lime/60 pl-3.5 py-0.5 text-left inline-block">
              Our mission is simple which is to{' '}
              <span className="text-lime/90 font-medium">
                transform businesses with smart strategies and unlock their true growth potential.
              </span>
            </p>
          </div>

          {/* Call to actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-cta-audit"
              onClick={onOpenConsultation}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-ink bg-lime hover:bg-lime-dim transition-all active:scale-[0.98]"
            >
              <span>Request Free Growth Audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-cta-explore"
              onClick={onExploreSolutions}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white/80 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
            >
              <span>Explore Solutions</span>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Guarantee / trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-5 border-t border-white/10 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
              <span className="text-xs font-medium text-white/60">Custom Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
              <span className="text-xs font-medium text-white/60">No Cookie-Cutter Fluff</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
              <span className="text-xs font-medium text-white/60">Measurable Sales Focus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
