import React from 'react';
import { Target, Cpu, Eye, Users, DollarSign, Sparkles, Check, Layers } from 'lucide-react';
import { AGENCY_INFO } from '../data/agencyData';

export const MissionVision: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'Enhance Visibility',
      description:
        'Cutting through the digital noise with high-authority technical SEO and high-intent paid distribution that puts your brand in front of ready-to-buy prospects.',
      tag: 'Step 1 &bull; Reach',
    },
    {
      icon: Users,
      title: 'Attract The Right Audience',
      description:
        'Attracting traffic is useless if it is the wrong audience. We develop bespoke messaging matrices and audience segmentation to draw high-lifetime-value decision makers.',
      tag: 'Step 2 &bull; Quality',
    },
    {
      icon: DollarSign,
      title: 'Drive Measurable Sales',
      description:
        'Engineered conversion funnels, lightning-fast codebases, and relentless conversion optimization ensure your traffic converts into verified bottom-line revenue.',
      tag: 'Step 3 &bull; Revenue',
    },
  ];

  return (
    <section id="mission" className="py-24 lg:py-32 bg-ink-soft relative border-y border-white/10">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Header */}
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-xs font-semibold text-lime">
            <Target className="w-3.5 h-3.5" />
            <span>The Digital Dude Philosophy</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05]">
            Our Mission Is Simple
          </h2>

          <p className="text-xl sm:text-2xl text-white font-semibold leading-snug">
            &ldquo;<span className="text-outline-accent">{AGENCY_INFO.mission}</span>&rdquo;
          </p>

          <p className="text-white/50 text-sm sm:text-base leading-[1.7] pt-2 max-w-2xl mx-auto">
            Founded in 2022, Digital Dude rejected the traditional model of siloed agencies where tech
            developers never speak to marketers. We build integrated growth engines where every piece of
            software is engineered to sell, and every marketing campaign is backed by robust digital
            infrastructure.
          </p>
        </div>

        {/* The 3 Pillars of Measurable Sales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="relative rounded-2xl bg-ink border border-white/10 p-8 hover:border-lime/30 transition-all group hover:-translate-y-1 duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/20 text-lime flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className="text-[11px] font-semibold text-white/40 uppercase tracking-wider"
                      dangerouslySetInnerHTML={{ __html: pillar.tag }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-lime transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed">{pillar.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-white/50">
                  <Check className="w-4 h-4 text-lime" />
                  <span>Tailored specifically to your business</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Technology + Marketing Blend matters */}
        <div className="mt-16 rounded-2xl bg-ink border border-white/10 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-lime">
                The Core Strategic Advantage
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">
                Why Technology &amp; Marketing Must Work As One
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-[1.7]">
                A gorgeous, fast website generates zero revenue without targeted traffic. Conversely,
                expensive marketing traffic is wasted if sent to a slow, confusing, or unoptimized
                digital platform. Digital Dude synchronizes both disciplines to achieve maximum
                conversion rates and sustainable customer acquisition.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-ink-soft border border-white/10 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-lime shrink-0" />
                <div className="text-xs">
                  <span className="text-white font-semibold block">53% of Mobile Visitors</span>
                  <span className="text-white/50">Abandon sites taking longer than 3 seconds to load</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-soft border border-white/10 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-lime shrink-0" />
                <div className="text-xs">
                  <span className="text-white font-semibold block">Up to 400% Higher Conversions</span>
                  <span className="text-white/50">When tech UX directly mirrors marketing intent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
