import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Headset,
  Megaphone,
  MonitorSmartphone,
  Send,
  Ticket,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { EVENT_SERVICES } from '../../data/eventsPageData';
import { SectionHeading } from '../home/SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  MonitorSmartphone,
  Ticket,
  CreditCard,
  Send,
  Users,
  Megaphone,
  Headset,
  BarChart3,
};

/**
 * What we do.
 *
 * Featured services get a wider cell on desktop so the grid has a rhythm rather
 * than eight identical boxes, and so the three strongest entry points for a new
 * organiser carry the most weight. Each card is a link into the contact page with
 * its own service preselected, which turns browsing straight into an enquiry.
 */
export const EventServices: React.FC = () => (
  <section id="event-services" className="relative bg-ink-soft py-20 lg:py-28">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />

    <div className="relative mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <SectionHeading
        eyebrow="What we do"
        lineOne="THE DIGITAL SIDE"
        lineTwo="OF YOUR EVENT."
        intro="Whether you are hosting a summit, seminar, workshop or business event, we bring the key digital touchpoints together — and you can take all of it or just the part you are missing."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {EVENT_SERVICES.map((service, i) => {
          const Icon = ICONS[service.iconName] ?? MonitorSmartphone;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            >
              <Link
                to="/contact"
                state={{ service: service.title }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft lg:p-7 ${
                  service.featured
                    ? 'border-lime/20 bg-lime/[0.035] hover:border-lime/45'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                }`}
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-lime/[0.09] opacity-0 blur-[55px] transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      service.featured
                        ? 'border-lime/30 bg-lime/10'
                        : 'border-white/10 bg-white/[0.04] group-hover:border-lime/25 group-hover:bg-lime/[0.07]'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        service.featured ? 'text-lime' : 'text-white/55 group-hover:text-lime'
                      }`}
                    />
                  </span>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime" />
                </div>

                <h3 className="relative mt-5 text-base font-bold leading-snug tracking-tight text-white">
                  {service.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-[1.7] text-white/50">
                  {service.body}
                </p>

                <span className="relative mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/25 transition-colors group-hover:text-lime">
                  Enquire about this
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
