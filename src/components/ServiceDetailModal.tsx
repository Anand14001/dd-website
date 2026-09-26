import React from 'react';
import { X, CheckCircle2, Clock, BarChart2, Layers, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectService: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectService,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        id="service-modal-card"
        className="relative w-full max-w-2xl bg-ink-soft border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-xs font-semibold text-lime uppercase tracking-wider">
            {service.category === 'technology'
              ? 'Website & App Development'
              : service.category === 'creative'
              ? 'Creative & Content'
              : 'Marketing & Advertising'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">
            {service.title}
          </h3>
          <p className="text-sm text-white/50 leading-relaxed">{service.fullDescription}</p>
        </div>

        {/* Quick Meta Badges */}
        {(service.timeline || service.metrics) && (
          <div className="grid grid-cols-2 gap-3 my-6 p-4 rounded-xl bg-ink border border-white/10">
            {service.timeline && (
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-lime shrink-0" />
                <div>
                  <span className="text-[11px] text-white/50 block font-medium">Typical Timeline</span>
                  <span className="text-xs font-bold text-white/90">{service.timeline}</span>
                </div>
              </div>
            )}
            {service.metrics && (
              <div className="flex items-center gap-2.5">
                <BarChart2 className="w-4 h-4 text-lime shrink-0" />
                <div>
                  <span className="text-[11px] text-white/50 block font-medium">Expected Benchmark</span>
                  <span className="text-xs font-bold text-lime">{service.metrics}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Deliverables List */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">
            Key Deliverables &amp; Scope:
          </h4>
          <ul className="space-y-2.5">
            {service.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-lime shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies / Tools Used */}
        {service.technologies && service.technologies.length > 0 && (
          <div className="space-y-2 mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
              Technologies &amp; Frameworks:
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/70 border border-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              onSelectService(service.title);
              onClose();
            }}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl font-semibold text-sm text-ink bg-lime hover:bg-lime-dim flex items-center justify-center gap-2 transition-all"
          >
            <span>Inquire About {service.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-sm text-white/50 hover:text-white/80 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
