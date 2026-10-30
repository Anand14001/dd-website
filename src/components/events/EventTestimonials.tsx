import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Play, Quote, ShieldCheck, X } from 'lucide-react';
import { EVENT_TESTIMONIALS, EventTestimonial } from '../../data/eventsPageData';
import { SectionHeading } from '../home/SectionHeading';

/**
 * Video player, opened from a testimonial card.
 *
 * Nothing is mounted until a card is clicked, so no video bytes are fetched on
 * page load. `controls` is on and autoplay carries no sound implication the
 * visitor did not ask for, since the click is the request to play.
 */
const VideoModal: React.FC<{ testimonial: EventTestimonial; onClose: () => void }> = ({
  testimonial,
  onClose,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Video testimonial from ${testimonial.name}`}
    >
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-ink-soft shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-xl bg-ink/70 p-2 text-white/70 backdrop-blur-md transition-colors hover:bg-ink hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          aria-label="Close video"
        >
          <X className="h-5 w-5" />
        </button>

        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions ship with the recording as a <track> once the client supplies them */}
        <video
          src={testimonial.videoUrl}
          poster={testimonial.posterUrl}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full bg-black"
        />

        <div className="p-6">
          <p className="text-sm font-bold text-white">{testimonial.name}</p>
          <p className="mt-0.5 text-xs text-white/45">
            {testimonial.role ? `${testimonial.role}, ` : ''}
            {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Client testimonials.
 *
 * The brief is unambiguous that placeholder quotes must never be dressed up as
 * real testimonials, so this section renders only what is published and
 * attributed. Video testimonials are Phase 2: the moment an entry in
 * `EVENT_TESTIMONIALS` gains a `videoUrl`, it renders as a playable card with a
 * poster frame and the rest of the layout adapts around it. Until then the real
 * written testimonial leads, and the trust panel beside it offers the thing a
 * serious organiser actually wants — a reference call.
 */
export const EventTestimonials: React.FC = () => {
  const [playing, setPlaying] = useState<EventTestimonial | null>(null);

  const videos = EVENT_TESTIMONIALS.filter((t) => t.videoUrl);
  const written = EVENT_TESTIMONIALS.filter((t) => !t.videoUrl);

  if (EVENT_TESTIMONIALS.length === 0) return null;

  return (
    <section id="event-testimonials" className="scroll-mt-24 bg-ink py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <SectionHeading
          eyebrow="In their words"
          lineOne="HEAR IT FROM"
          lineTwo="THE ORGANISERS."
          align="center"
          className="text-center"
          intro="Hear directly from the people behind the events about their experience working with Digital Dude on event-related digital solutions."
        />

        {/* ---- Video testimonials, once recordings are approved ---- */}
        {videos.length > 0 && (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((testimonial, i) => (
              <motion.button
                key={testimonial.id}
                type="button"
                onClick={() => setPlaying(testimonial)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-soft text-left transition-all hover:-translate-y-1 hover:border-lime/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                aria-label={`Play video testimonial from ${testimonial.name}, ${testimonial.company}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                  {testimonial.posterUrl && (
                    <img
                      src={testimonial.posterUrl}
                      alt={`${testimonial.name}, ${testimonial.company}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent"
                  />

                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  </span>

                  {testimonial.duration && (
                    <span className="absolute bottom-3 right-3 rounded-md bg-ink/80 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white/70 backdrop-blur-sm">
                      {testimonial.duration}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-sm leading-[1.7] text-white/65">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-bold text-white">{testimonial.name}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {testimonial.role ? `${testimonial.role}, ` : ''}
                    {testimonial.company}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* ---- Written testimonials + reference offer ---- */}
        {written.length > 0 && (
          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            {written.map((testimonial, i) => (
              <motion.figure
                key={testimonial.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-ink-soft p-7 lg:p-10 ${
                  written.length === 1 ? 'lg:col-span-7' : 'lg:col-span-6'
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-lime/[0.07] blur-[70px]"
                />

                <Quote
                  className="relative h-8 w-8 fill-lime/15 text-lime/40"
                  aria-hidden
                />

                <blockquote className="relative mt-6 text-lg leading-[1.7] text-white/80 lg:text-xl lg:leading-[1.65]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <figcaption className="relative mt-7 flex items-center gap-3.5 border-t border-white/10 pt-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-lime/25 bg-lime/10 text-sm font-bold text-lime">
                    {testimonial.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">{testimonial.name}</span>
                    <span className="mt-0.5 block text-xs text-white/45">
                      {testimonial.role ? `${testimonial.role}, ` : ''}
                      {testimonial.company}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}

            {/* What a serious organiser actually wants: to talk to a past client. */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="flex flex-col justify-between rounded-2xl border border-lime/20 bg-lime/[0.04] p-7 lg:col-span-5 lg:p-10"
            >
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime/25 bg-lime/10">
                  <ShieldCheck className="h-5 w-5 text-lime" />
                </span>

                <h3 className="mt-6 text-xl font-bold leading-snug tracking-tight text-white lg:text-2xl">
                  Want to speak to an organiser we have worked with?
                </h3>

                <p className="mt-4 text-sm leading-[1.75] text-white/60">
                  We will put you in touch with a past client directly, and walk you
                  through exactly what we built for their event. Every project on this
                  page has a live link you can open and check for yourself first.
                </p>
              </div>

              <a
                href="tel:+919787097006"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-6 py-3.5 text-sm font-bold text-lime transition-colors hover:bg-lime hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <PhoneCall className="h-4 w-4" />
                Request a reference call
              </a>
            </motion.div>
          </div>
        )}
      </div>

      {playing && <VideoModal testimonial={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
};
