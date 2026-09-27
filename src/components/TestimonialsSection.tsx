import React from 'react';
import { Star, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-ink relative border-t border-white/10">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto text-center space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-xs font-semibold text-lime">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Feedback &amp; Reviews</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
            Trusted By Business Leaders
          </h2>

          <p className="text-white/60 text-sm sm:text-base leading-[1.7]">
            See how our tailored technology and performance marketing have delivered quantifiable
            returns for executives, founders, and marketing directors.
          </p>
        </div>

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
