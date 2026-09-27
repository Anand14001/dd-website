import React from 'react';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { METHODOLOGY_STEPS } from '../data/agencyData';

interface MethodologySectionProps {
  onOpenConsultation: () => void;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ onOpenConsultation }) => {
  return (
    <section id="process" className="py-24 lg:py-32 bg-ink-soft relative border-t border-white/10">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto text-center space-y-5 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-xs font-semibold text-lime">
            <Compass className="w-3.5 h-3.5" />
            <span>Our 4-Step Strategic Framework</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
            How We Unlock Your True Potential
          </h2>

          <p className="text-white/60 text-sm sm:text-base leading-[1.7]">
            Predictable growth is not accidental. We follow an engineered process that eliminates
            guesswork and aligns technology directly with high-converting marketing.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METHODOLOGY_STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="relative rounded-2xl bg-ink border border-white/10 hover:border-lime/30 p-6 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Step Number & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl font-bold text-outline-accent group-hover:opacity-80 transition-opacity">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] text-lime px-2.5 py-0.5 rounded-full border border-white/10">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-lime transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{step.description}</p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                <span>Phase 0{idx + 1} of 04</span>
                <CheckCircle2 className="w-4 h-4 text-lime" />
              </div>
            </div>
          ))}
        </div>

        {/* Process Guarantee Banner */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 text-sm font-semibold text-lime hover:text-lime-dim hover:underline transition-colors"
          >
            <span>Ready to start Phase 01 with a free digital audit?</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
