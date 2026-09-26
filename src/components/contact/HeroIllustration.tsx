import React from 'react';

/**
 * Original inline SVG for the contact hero: a reporting panel with growth bars,
 * a trend line that redraws itself, and a broadcast node emitting halo rings.
 *
 * Inline rather than an asset file so it costs no extra request, inherits the
 * page palette, and can be animated node-by-node from index.css.
 */
export const HeroIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 480 520"
      className="w-full max-w-[420px]"
      fill="none"
      role="img"
      aria-label="Illustration of a growth dashboard broadcasting a signal"
    >
      <defs>
        <radialGradient id="dd-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#BFFF00" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="dd-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
        </linearGradient>

        <linearGradient id="dd-bar-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#BFFF00" stopOpacity="0.25" />
        </linearGradient>

        <radialGradient id="dd-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#BFFF00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient wash behind everything */}
      <ellipse cx="240" cy="250" rx="230" ry="230" fill="url(#dd-glow)" />

      <g className="dd-float">
        {/* Broadcast node + halo rings */}
        <g>
          <circle cx="240" cy="74" r="34" fill="url(#dd-node-glow)" />
          <circle cx="240" cy="74" r="7" className="dd-halo" fill="none" stroke="#BFFF00" strokeWidth="1.5" />
          <circle
            cx="240"
            cy="74"
            r="7"
            className="dd-halo-delay"
            fill="none"
            stroke="#BFFF00"
            strokeWidth="1.5"
          />
          <circle cx="240" cy="74" r="6" className="dd-node" fill="#BFFF00" />
        </g>

        {/* Mast connecting node to panel */}
        <line x1="240" y1="82" x2="240" y2="132" stroke="#BFFF00" strokeOpacity="0.28" strokeWidth="1.5" />

        {/* Main panel */}
        <rect
          x="60"
          y="132"
          width="360"
          height="268"
          rx="22"
          fill="url(#dd-panel)"
          stroke="#FFFFFF"
          strokeOpacity="0.12"
        />

        {/* Panel title bar */}
        <circle cx="90" cy="162" r="4" fill="#BFFF00" fillOpacity="0.8" />
        <circle cx="104" cy="162" r="4" fill="#FFFFFF" fillOpacity="0.18" />
        <circle cx="118" cy="162" r="4" fill="#FFFFFF" fillOpacity="0.18" />
        <rect x="140" y="157" width="96" height="9" rx="4.5" fill="#FFFFFF" fillOpacity="0.1" />
        <line x1="60" y1="184" x2="420" y2="184" stroke="#FFFFFF" strokeOpacity="0.09" strokeWidth="1" />

        {/* Baseline */}
        <line x1="96" y1="352" x2="384" y2="352" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1.5" />

        {/* Growth bars, staggered so they ripple rather than pulse in unison */}
        <rect x="108" y="290" width="30" height="62" rx="6" fill="url(#dd-bar-fill)" className="dd-bar" style={{ animationDelay: '0s' }} />
        <rect x="158" y="264" width="30" height="88" rx="6" fill="url(#dd-bar-fill)" className="dd-bar" style={{ animationDelay: '0.2s' }} />
        <rect x="208" y="238" width="30" height="114" rx="6" fill="url(#dd-bar-fill)" className="dd-bar" style={{ animationDelay: '0.4s' }} />
        <rect x="258" y="286" width="30" height="66" rx="6" fill="url(#dd-bar-fill)" className="dd-bar" style={{ animationDelay: '0.6s' }} />
        <rect x="308" y="212" width="30" height="140" rx="6" fill="url(#dd-bar-fill)" className="dd-bar" style={{ animationDelay: '0.8s' }} />

        {/* Trend line, redrawing on a loop */}
        <path
          d="M108 306 L173 282 L223 250 L273 268 L323 218 L376 204"
          className="dd-draw"
          stroke="#BFFF00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="376" cy="204" r="5" fill="#BFFF00" />
        <circle cx="376" cy="204" r="5" className="dd-halo" fill="none" stroke="#BFFF00" strokeWidth="1.2" />

        {/* Caption rows under the chart */}
        <rect x="96" y="372" width="120" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.09" />
        <rect x="228" y="372" width="72" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.06" />
      </g>

      {/* Orbiting accents, drifting out of phase with the panel */}
      <circle cx="74" cy="430" r="4" fill="#BFFF00" fillOpacity="0.5" className="dd-float" style={{ animationDelay: '1.5s' }} />
      <circle cx="412" cy="452" r="5" fill="#BFFF00" fillOpacity="0.32" className="dd-float" style={{ animationDelay: '0.8s' }} />
      <circle cx="398" cy="108" r="3.5" fill="#FFFFFF" fillOpacity="0.28" className="dd-float" style={{ animationDelay: '2.2s' }} />
      <circle cx="82" cy="150" r="3" fill="#FFFFFF" fillOpacity="0.2" className="dd-float" style={{ animationDelay: '3s' }} />
    </svg>
  );
};
