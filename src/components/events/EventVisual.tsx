import React from 'react';
import { EventProject } from '../../data/eventsPageData';

/** Strips the protocol so the frame shows the domain the way a browser bar would. */
const displayHost = (url: string): string =>
  url.replace(/^https?:\/\//, '').replace(/\/$/, '');

interface EventVisualProps {
  project: EventProject;
  className?: string;
}

/**
 * The project card visual.
 *
 * Normally a screenshot of the project's live site, from `project.image`. The
 * browser frame below is the fallback for a project that has no usable capture
 * yet: it wraps the project's real domain and monogram, so it reads as a graphic
 * rather than pretending to be a photo, and it crops identically to a screenshot
 * so a mixed grid stays even.
 *
 * Stock photography is deliberately not an option here — the brief forbids
 * presenting imagery as event photos it is not.
 */
export const EventVisual: React.FC<EventVisualProps> = ({ project, className = '' }) => {
  const { accent, monogram, url, name, image } = project;

  if (image) {
    return (
      <img
        src={image}
        alt={`${name} website`}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`relative h-full w-full overflow-hidden bg-ink ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, ${accent}1f 0%, transparent 60%), #08080c`,
      }}
    >
      {/* Grid floor, masked so it fades into the card. */}
      <div
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      />

      {/* Browser chrome: three dots and the real domain. */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-3.5 py-2.5 backdrop-blur-sm">
        <span className="flex gap-1.5">
          <span className="h-[7px] w-[7px] rounded-full bg-white/20" />
          <span className="h-[7px] w-[7px] rounded-full bg-white/20" />
          <span className="h-[7px] w-[7px] rounded-full bg-white/20" />
        </span>
        <span className="truncate rounded-md bg-ink/60 px-2 py-0.5 text-[10px] font-medium tracking-tight text-white/45">
          {displayHost(url)}
        </span>
      </div>

      {/* Monogram tile, sitting over a suggestion of page content. */}
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="flex flex-col items-center gap-3.5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border text-base font-bold tracking-tight"
            style={{
              borderColor: `${accent}40`,
              background: `${accent}14`,
              color: accent,
            }}
          >
            {monogram}
          </div>

          {/* Content skeleton: a heading line and two body lines. */}
          <div className="flex w-32 flex-col items-center gap-2">
            <span
              className="h-1.5 w-full rounded-full"
              style={{ background: `${accent}59` }}
            />
            <span className="h-1.5 w-3/4 rounded-full bg-white/[0.09]" />
            <span className="h-1.5 w-1/2 rounded-full bg-white/[0.07]" />
          </div>
        </div>
      </div>

      {/* Accent wash along the bottom edge, so the card reads as lit from below. */}
      <div
        className="absolute inset-x-0 bottom-0 h-20"
        style={{ background: `linear-gradient(to top, ${accent}1a, transparent)` }}
      />
    </div>
  );
};
