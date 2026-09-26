import React, { useState } from 'react';
import {
  Code2,
  Search,
  Megaphone,
  PenTool,
  Clapperboard,
  Users,
  UserCircle2,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { SERVICES } from '../data/agencyData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
  onOpenModal: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
  onOpenModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'technology' | 'marketing' | 'creative'>('all');

  const filteredServices = SERVICES.filter((service) => {
    if (activeTab === 'all') return true;
    return service.category === activeTab;
  });

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

  return (
    <section id="solutions" className="py-24 lg:py-32 bg-ink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-xs font-semibold text-lime">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tailored Digital Solutions</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
            Engineered For Visibility, Traffic &amp; Sales
          </h2>

          <p className="text-white/60 text-base sm:text-lg leading-[1.7]">
            Every business has unique growth bottlenecks. We craft custom-engineered solutions combining
            modern development, algorithmic marketing, and sales automation.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {(
              [
                { id: 'all', label: 'All Solutions' },
                { id: 'technology', label: 'Website & App Development' },
                { id: 'marketing', label: 'Marketing & Advertising' },
                { id: 'creative', label: 'Creative & Content' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-lime text-ink'
                    : 'bg-white/[0.03] text-white/50 hover:text-white/80 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => {
            const Icon = getIcon(service.iconName);
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative rounded-2xl bg-ink-soft border border-white/10 hover:border-lime/30 p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill + Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/20 text-lime flex items-center justify-center group-hover:scale-105 group-hover:bg-lime/15 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/[0.04] text-white/50 border border-white/10">
                      {service.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  {/* Deliverables snippet */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
                      Core Scope Highlights:
                    </span>
                    {service.deliverables.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs text-white/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Metrics & Details trigger */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  {service.metrics && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Impact Metric</span>
                      <span className="font-semibold text-lime">{service.metrics}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenModal(service)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white/70 hover:text-white transition-colors text-center"
                    >
                      View Full Scope
                    </button>
                    <button
                      onClick={() => onSelectServiceForInquiry(service.title)}
                      className="py-2 px-3 rounded-lg bg-lime/10 hover:bg-lime/20 text-lime hover:text-lime border border-lime/30 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
