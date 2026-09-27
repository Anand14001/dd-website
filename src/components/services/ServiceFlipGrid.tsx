import React from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Search,
  Megaphone,
  PenTool,
  Clapperboard,
  Users,
  UserCircle2,
  ArrowRight,
  Check,
} from 'lucide-react';
import { SERVICES } from '../../data/agencyData';
import { ServiceItem } from '../../types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Search,
  Megaphone,
  PenTool,
  Clapperboard,
  Users,
  UserCircle2,
};

interface ServiceFlipGridProps {
  onOpenModal: (service: ServiceItem) => void;
}

/** Every service as a card that flips to its scope on hover or keyboard focus. */
export const ServiceFlipGrid: React.FC<ServiceFlipGridProps> = ({ onOpenModal }) => {
  return (
    <section id="all-services" className="bg-ink-soft py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
        >
          WHAT WE DO.
        </motion.h2>
        <p className="mt-4 max-w-xl text-white/50">
          Hover any card for the full scope. Every line below is delivered in-house.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.iconName] ?? Code2;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="flip-scene h-[22rem]"
              >
                <div className="flip-inner">
                  {/* Front */}
                  <div className="flip-face flex flex-col justify-between rounded-2xl border border-white/10 bg-ink p-7">
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-lime/20 bg-lime/10 text-lime">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-white">{service.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/50">
                        {service.shortDescription}
                      </p>
                    </div>

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                      {service.category}
                    </span>
                  </div>

                  {/* Back */}
                  <div className="flip-face flip-face-back flex flex-col justify-between rounded-2xl border border-lime/30 bg-lime/[0.06] p-7">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-lime">
                        Scope
                      </span>
                      <ul className="mt-4 space-y-2">
                        {service.deliverables.slice(0, 6).map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onOpenModal(service)}
                      className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-lime hover:text-white"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
