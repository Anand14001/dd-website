import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Code2,
  Megaphone,
  PenTool,
  Clapperboard,
  Users,
  UserCircle2,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { SERVICES } from '../data/agencyData';
import { SectionHeading } from './home/SectionHeading';

const getIcon = (name: string) => {
  switch (name) {
    case 'Code2':
      return Code2;
    case 'Search':
      return Search;
    case 'Megaphone':
      return Megaphone;
    case 'PenTool':
      return PenTool;
    case 'Clapperboard':
      return Clapperboard;
    case 'Users':
      return Users;
    case 'UserCircle2':
      return UserCircle2;
    default:
      return Code2;
  }
};

export const WhatWeDoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-ink relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-lime/[0.05] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <SectionHeading
          eyebrow="About us"
          lineOne="ENGINEERED FOR"
          lineTwo="VISIBILITY, TRAFFIC & SALES."
          intro="Every business has unique growth bottlenecks. We craft custom-engineered solutions combining modern development, algorithmic marketing, and sales automation."
          className="mb-16"
        />

        {/* Flip Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, idx) => {
            const Icon = getIcon(service.iconName);
            return (
              <div
                key={service.id}
                className="transition-all duration-700 ease-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(28px)',
                  transitionDelay: visible ? `${idx * 90}ms` : '0ms',
                }}
              >
                <div className="group h-72 lg:h-80" style={{ perspective: '1200px' }}>
                  <div
                    className="relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                  >
                    {/* Front face */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-ink-soft border border-white/10 p-7 flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-lime/10 border border-lime/20 text-lime flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{service.title}</h3>
                      <span className="text-[11px] text-white/40 uppercase tracking-wider">
                        Hover to explore
                      </span>
                    </div>

                    {/* Back face */}
                    <div
                      className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-lime p-7 flex flex-col justify-between"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink/60 block mb-2">
                          {service.category}
                        </span>
                        <h3 className="text-base font-bold text-ink mb-2">{service.title}</h3>
                        <p className="text-xs text-ink/80 leading-relaxed line-clamp-4">
                          {service.shortDescription}
                        </p>
                      </div>
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-ink mt-4 hover:gap-2.5 transition-all"
                      >
                        <span>Explore Service</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div
          className="text-center mt-14 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: visible ? `${SERVICES.length * 90 + 100}ms` : '0ms',
          }}
        >
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold text-ink bg-lime hover:bg-lime-dim transition-all active:scale-[0.98]"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
