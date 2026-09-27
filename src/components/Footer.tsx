import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { AGENCY_INFO, SERVICES } from '../data/agencyData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink border-t border-white/10 text-white/50 text-xs pt-16 pb-12">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo_white.png"
                alt="Digital Dude"
                width={350}
                height={95}
                className="h-9 w-auto"
              />
            </Link>

            <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-md">
              At Digital Dude, We empower businesses to grow with the right blend of technology and
              marketing. We craft tailored digital solutions that enhance visibility, attract the right
              audience, and drive measurable sales.
            </p>
          </div>

          {/* Col 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tailored Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link to="/services" className="hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Growth Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Growth Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/portfolio" className="hover:text-white transition-colors">
                  Our Portfolio
                </Link>
              </li>
              <li>
                <Link to="/about#process" className="hover:text-white transition-colors">
                  The 4-Step Methodology
                </Link>
              </li>
              <li>
                <Link to="/about#mission" className="hover:text-white transition-colors">
                  Our Core Mission
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Direct */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Headquarters</h4>
            <div className="space-y-2 text-xs text-white/50">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-lime shrink-0 mt-0.5" />
                <span>{AGENCY_INFO.contact.office}</span>
              </p>
              {AGENCY_INFO.contact.emails.map((email) => (
                <p key={email} className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-lime shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </p>
              ))}
              {AGENCY_INFO.contact.phones.map((phone) => (
                <p key={phone} className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-lime shrink-0" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                    {phone}
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Digital Dude. All rights reserved. Empowering businesses
            since 2022.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-white/30">Privacy Policy</span>
            <span className="text-white/20">&bull;</span>
            <span className="text-white/30">Terms of Service</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
