import React from 'react';
import { TRUSTED_BY } from '../../data/servicesPageData';

/** Client band. The list is duplicated once so the marquee loops seamlessly. */
export const TrustBand: React.FC = () => {
  const loop = [...TRUSTED_BY, ...TRUSTED_BY];

  return (
    <section className="border-y border-white/10 bg-ink-soft py-14">
      <h2 className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
        Trusted by
      </h2>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="trust-marquee flex w-max items-center gap-14 px-7">
          {loop.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= TRUSTED_BY.length}
              className="whitespace-nowrap text-lg font-semibold text-white/30 transition-colors hover:text-lime"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
