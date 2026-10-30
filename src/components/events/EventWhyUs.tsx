import React from 'react';
import { motion } from 'motion/react';
import {
  Blocks,
  CalendarCheck,
  PhoneCall,
  Repeat,
  Smartphone,
  Ticket,
  type LucideIcon,
} from 'lucide-react';
import { WHY_US } from '../../data/eventsPageData';
import { SectionHeading } from '../home/SectionHeading';

const ICONS: Record<string, LucideIcon> = {
  Blocks,
  CalendarCheck,
  Ticket,
  Smartphone,
  PhoneCall,
  Repeat,
};

/**
 * Why work with Digital Dude.
 *
 * Practical strengths only — the brief rules out "leading" claims and guaranteed
 * attendance or revenue, so every line here is either verifiable from this page
 * or a statement about how the team works. Each card carries its own accent so
 * the grid has colour without any one claim shouting over the others.
 */
export const EventWhyUs: React.FC = () => (
  <section className="bg-ink py-20 lg:py-28">
    <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <SectionHeading
        eyebrow="Why work with us"
        lineOne="WHAT YOU GET"
        lineTwo="THAT YOU DON'T ELSEWHERE."
        align="center"
        className="text-center"
        lineTwoClassName="text-transparent [-webkit-text-stroke:1.5px_#BFFF00] sm:[-webkit-text-stroke:2px_#BFFF00]"
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_US.map((item, i) => {
          const Icon = ICONS[item.iconName] ?? Blocks;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-soft p-7 transition-all duration-300 hover:-translate-y-1 lg:p-8"
            >
              {/* Per-card accent: a hover glow and a hairline top edge. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full opacity-0 blur-[65px] transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `${item.accent}1f` }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{
                  background: `linear-gradient(to right, transparent, ${item.accent}, transparent)`,
                }}
              />

              <span
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border"
                style={{
                  borderColor: `${item.accent}33`,
                  background: `${item.accent}12`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: item.accent }} />
              </span>

              <h3 className="relative mt-6 text-[1.0625rem] font-bold leading-snug tracking-tight text-white">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm leading-[1.75] text-white/55">{item.body}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
