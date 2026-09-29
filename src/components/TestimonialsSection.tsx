import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';
import { SectionHeading } from './home/SectionHeading';

/** Deterministic star positions — seeded generator keeps positions stable across renders. */
const TESTIMONIAL_STARS = (() => {
  let seed = 20260929;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 58 }, () => ({
    top: `${(rand() * 100).toFixed(2)}%`,
    left: `${(rand() * 100).toFixed(2)}%`,
    size: rand() < 0.78 ? 1.5 : 2.5,
    delay: `${(rand() * 3.2).toFixed(2)}s`,
    lime: rand() < 0.2,
  }));
})();

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-ink relative border-t border-white/10 overflow-hidden">
      {/* Ambient cosmic nebula glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-lime/[0.04] blur-[150px] rounded-full"
      />

      {/* Starfield matching Why Digital Dude section */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {TESTIMONIAL_STARS.map((star, i) => (
          <span
            key={i}
            className="dd-star absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              background: star.lime ? '#BFFF00' : '#FFFFFF',
              boxShadow: star.lime
                ? '0 0 6px rgba(191,255,0,0.6)'
                : star.size > 2
                ? '0 0 5px rgba(255,255,255,0.7)'
                : 'none',
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Header */}
        <SectionHeading
          eyebrow="Client Reviews"
          lineOne="TRUSTED BY"
          lineTwo="BUSINESS LEADERS."
          lineTwoClassName="text-transparent [-webkit-text-stroke:1.5px_#BFFF00] sm:[-webkit-text-stroke:2px_#BFFF00]"
          align="center"
          className="mb-16 text-center"
          intro="See how our tailored technology and performance marketing have delivered quantifiable returns for executives, founders, and marketing directors."
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl bg-ink-soft border border-white/10 p-7 flex flex-col justify-between shadow-xl relative"
            >
              <div>
                {/* Rating stars & Highlight pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-lime/10 text-lime border border-lime/20 px-2.5 py-0.5 rounded-full">
                    {testimonial.highlight}
                  </span>
                </div>

                <p className="text-sm text-white/70 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-white/50">{testimonial.role}</p>
                  <p className="text-[11px] text-lime font-medium">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
