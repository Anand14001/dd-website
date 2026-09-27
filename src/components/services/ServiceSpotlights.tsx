import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SERVICE_SPOTLIGHTS } from '../../data/servicesPageData';
import { SERVICES } from '../../data/agencyData';
import { ServiceItem } from '../../types';

interface ServiceSpotlightsProps {
  onOpenModal: (service: ServiceItem) => void;
}

/** Long-form proof blocks. Image and copy swap sides on every other row. */
export const ServiceSpotlights: React.FC<ServiceSpotlightsProps> = ({ onOpenModal }) => {
  return (
    <section className="bg-ink py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1720px] space-y-24 px-4 sm:px-6 lg:space-y-32 lg:px-8 xl:px-12 2xl:px-16">
        {SERVICE_SPOTLIGHTS.map((spot, i) => {
          const service = SERVICES.find((s) => s.id === spot.serviceId);
          const flipped = i % 2 === 1;

          return (
            <motion.article
              key={spot.serviceId}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
            >
              {/* Visual */}
              <div className={flipped ? 'lg:order-2' : ''}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-ink/60 to-transparent" />
                </div>
              </div>

              {/* Copy */}
              <div className={flipped ? 'lg:order-1' : ''}>
                <div className="flex flex-wrap items-center gap-2">
                  {spot.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-lime"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="mt-5 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                  {spot.title}
                </h3>

                <p className="mt-5 text-base leading-[1.75] text-white/60">{spot.blurb}</p>

                {/* Metric row */}
                <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                  {spot.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="sr-only">{m.label}</dt>
                      <dd>
                        <span className="block text-2xl font-bold text-lime">{m.value}</span>
                        <span className="mt-1 block text-xs leading-snug text-white/40">
                          {m.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  {spot.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/60"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {service && (
                  <button
                    onClick={() => onOpenModal(service)}
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-lime hover:text-white"
                  >
                    View full scope
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
