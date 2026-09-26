import React from 'react';

/** Nodes sitting on the growth rings, each on its own halo delay. */
const RING_NODES = [
  { x: 240, y: 232, r: 6 },
  { x: 348, y: 288, r: 5 },
  { x: 136, y: 276, r: 5.5 },
  { x: 392, y: 196, r: 4.5 },
];

/**
 * Original inline SVG for the About hero: concentric growth rings radiating
 * from a core, with a trend line climbing across them.
 *
 * Shares the animation classes in index.css with the other hero illustrations.
 */
export const AboutIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 480 480"
      className="w-full max-w-[420px]"
      fill="none"
      role="img"
      aria-label="Illustration of concentric growth rings with a rising trend line"
    >
      <defs>
        <radialGradient id="ab-glow" cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#BFFF00" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="ab-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#BFFF00" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Ambient wash */}
      <ellipse cx="240" cy="330" rx="220" ry="200" fill="url(#ab-glow)" />

      {/* Growth rings — each year of the practice, drifting gently */}
      <g className="dd-float">
        {[70, 120, 170, 220].map((r, i) => (
          <path
            key={r}
            d={`M ${240 - r} 340 A ${r} ${r} 0 0 1 ${240 + r} 340`}
            stroke="url(#ab-ring)"
            strokeWidth={i === 0 ? 2 : 1.25}
            strokeDasharray={i % 2 === 0 ? undefined : '4 8'}
            fill="none"
          />
        ))}

        {/* Baseline the rings sit on */}
        <line x1="20" y1="340" x2="460" y2="340" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1.5" />

        {/* Core */}
        <circle cx="240" cy="340" r="26" fill="#BFFF00" fillOpacity="0.08" />
        <circle cx="240" cy="340" r="7" className="dd-halo" fill="none" stroke="#BFFF00" strokeWidth="1.5" />
        <circle cx="240" cy="340" r="10" className="dd-node" fill="#BFFF00" />

        {/* Milestone nodes on the rings */}
        {RING_NODES.map((n, i) => (
          <g key={`${n.x}-${n.y}`}>
            <circle cx={n.x} cy={n.y} r={n.r} fill="#BFFF00" fillOpacity="0.8" />
            <circle
              cx={n.x}
              cy={n.y}
              r="7"
              className="dd-halo"
              fill="none"
              stroke="#BFFF00"
              strokeWidth="1"
              style={{ animationDelay: `${i * 0.65}s` }}
            />
          </g>
        ))}

        {/* Trend line climbing across the rings */}
        <path
          d="M64 318 L136 276 L240 232 L348 288 L416 168"
          className="dd-draw"
          stroke="#BFFF00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.55"
        />
        <circle cx="416" cy="168" r="5.5" fill="#BFFF00" />
        <circle cx="416" cy="168" r="6" className="dd-halo-delay" fill="none" stroke="#BFFF00" strokeWidth="1.2" />
      </g>

      {/* Drifting accents */}
      <circle cx="58" cy="140" r="3.5" fill="#FFFFFF" fillOpacity="0.25" className="dd-float" style={{ animationDelay: '1.4s' }} />
      <circle cx="430" cy="98" r="4" fill="#BFFF00" fillOpacity="0.4" className="dd-float" style={{ animationDelay: '2.6s' }} />
      <circle cx="96" cy="424" r="4.5" fill="#BFFF00" fillOpacity="0.28" className="dd-float" style={{ animationDelay: '0.7s' }} />
    </svg>
  );
};
