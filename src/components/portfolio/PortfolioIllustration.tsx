import React from 'react';

/** Grid positions for the gallery wall — the centre tile is the highlighted one. */
const TILES = [
  { x: 60, y: 96, delay: '0s' },
  { x: 185, y: 96, delay: '0.5s' },
  { x: 310, y: 96, delay: '1s' },
  { x: 60, y: 197, delay: '0.8s' },
  { x: 310, y: 197, delay: '1.4s' },
  { x: 60, y: 298, delay: '1.8s' },
  { x: 185, y: 298, delay: '0.3s' },
  { x: 310, y: 298, delay: '2.2s' },
];

/**
 * Original inline SVG for the portfolio hero: a wall of work tiles drifting
 * out of phase, with the centre piece lifted and pulsing.
 *
 * Shares the animation classes in index.css with the other hero illustrations.
 */
export const PortfolioIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 480 480"
      className="w-full max-w-[420px]"
      fill="none"
      role="img"
      aria-label="Illustration of a gallery wall of project tiles"
    >
      <defs>
        <radialGradient id="pf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#BFFF00" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="pf-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
        </linearGradient>

        <linearGradient id="pf-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#BFFF00" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Ambient wash */}
      <circle cx="240" cy="240" r="215" fill="url(#pf-glow)" />

      {/* Surrounding tiles, each drifting on its own offset */}
      {TILES.map((tile) => (
        <g key={`${tile.x}-${tile.y}`} className="dd-float" style={{ animationDelay: tile.delay }}>
          <rect
            x={tile.x}
            y={tile.y}
            width="110"
            height="86"
            rx="12"
            fill="url(#pf-tile)"
            stroke="#FFFFFF"
            strokeOpacity="0.1"
          />
          {/* Suggestion of content inside each frame */}
          <rect
            x={tile.x + 14}
            y={tile.y + 56}
            width="46"
            height="6"
            rx="3"
            fill="#FFFFFF"
            fillOpacity="0.14"
          />
          <circle cx={tile.x + 24} cy={tile.y + 32} r="9" fill="#FFFFFF" fillOpacity="0.08" />
          <rect
            x={tile.x + 42}
            y={tile.y + 26}
            width="52"
            height="6"
            rx="3"
            fill="#FFFFFF"
            fillOpacity="0.07"
          />
        </g>
      ))}

      {/* Centre tile — lifted, tinted and pulsing */}
      <g className="dd-float" style={{ animationDelay: '0.15s' }}>
        <rect
          x="185"
          y="197"
          width="110"
          height="86"
          rx="12"
          fill="url(#pf-active)"
          stroke="#BFFF00"
          strokeOpacity="0.45"
        />
        {/* Miniature rising bars, echoing the growth motif */}
        <rect x="203" y="248" width="12" height="20" rx="3" fill="#BFFF00" fillOpacity="0.75" className="dd-bar" style={{ animationDelay: '0s' }} />
        <rect x="221" y="236" width="12" height="32" rx="3" fill="#BFFF00" fillOpacity="0.75" className="dd-bar" style={{ animationDelay: '0.25s' }} />
        <rect x="239" y="224" width="12" height="44" rx="3" fill="#BFFF00" fillOpacity="0.75" className="dd-bar" style={{ animationDelay: '0.5s' }} />
        <rect x="257" y="214" width="12" height="54" rx="3" fill="#BFFF00" fillOpacity="0.75" className="dd-bar" style={{ animationDelay: '0.75s' }} />

        {/* Emitter on the corner of the active tile */}
        <circle cx="295" cy="197" r="7" className="dd-halo" fill="none" stroke="#BFFF00" strokeWidth="1.5" />
        <circle cx="295" cy="197" r="6" className="dd-node" fill="#BFFF00" />
      </g>

      {/* Drifting accents */}
      <circle cx="36" cy="240" r="4" fill="#BFFF00" fillOpacity="0.45" className="dd-float" style={{ animationDelay: '1.2s' }} />
      <circle cx="444" cy="150" r="3.5" fill="#FFFFFF" fillOpacity="0.25" className="dd-float" style={{ animationDelay: '2.4s' }} />
      <circle cx="430" cy="410" r="5" fill="#BFFF00" fillOpacity="0.3" className="dd-float" style={{ animationDelay: '0.9s' }} />
    </svg>
  );
};
