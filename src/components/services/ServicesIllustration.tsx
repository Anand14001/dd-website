import React from 'react';

/** One satellite per service, split across two counter-rotating orbits. */
const INNER_NODES = [
  { x: 317.8, y: 162.2, r: 9 },
  { x: 162.2, y: 162.2, r: 7 },
  { x: 162.2, y: 317.8, r: 8 },
  { x: 317.8, y: 317.8, r: 6.5 },
];

const OUTER_NODES = [
  { x: 240, y: 70, r: 8 },
  { x: 92.8, y: 325, r: 6.5 },
  { x: 387.2, y: 325, r: 7.5 },
];

/**
 * Original inline SVG for the services hero: seven service nodes orbiting a
 * single hub — the "one growth engine" idea drawn literally.
 *
 * Shares the animation classes defined in index.css with the contact hero.
 */
export const ServicesIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 480 480"
      className="w-full max-w-[420px]"
      fill="none"
      role="img"
      aria-label="Illustration of seven service nodes orbiting a central growth engine"
    >
      <defs>
        <radialGradient id="svc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#BFFF00" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="svc-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#BFFF00" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="svc-node" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFFF00" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#BFFF00" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Ambient wash */}
      <circle cx="240" cy="240" r="220" fill="url(#svc-glow)" />

      {/* Orbit paths — dashed so the rotation reads */}
      <circle
        cx="240"
        cy="240"
        r="110"
        stroke="#FFFFFF"
        strokeOpacity="0.1"
        strokeWidth="1"
        strokeDasharray="3 7"
        className="dd-orbit"
      />
      <circle
        cx="240"
        cy="240"
        r="170"
        stroke="#FFFFFF"
        strokeOpacity="0.08"
        strokeWidth="1"
        strokeDasharray="2 9"
        className="dd-orbit-reverse"
      />

      {/* Inner orbit: satellites plus their spokes back to the hub */}
      <g className="dd-orbit">
        {INNER_NODES.map((n, i) => (
          <g key={`inner-${i}`}>
            <line
              x1="240"
              y1="240"
              x2={n.x}
              y2={n.y}
              stroke="#BFFF00"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
            <circle cx={n.x} cy={n.y} r={n.r} fill="url(#svc-node)" />
            <circle
              cx={n.x}
              cy={n.y}
              r="7"
              className="dd-halo"
              fill="none"
              stroke="#BFFF00"
              strokeWidth="1"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          </g>
        ))}
      </g>

      {/* Outer orbit, turning the other way */}
      <g className="dd-orbit-reverse">
        {OUTER_NODES.map((n, i) => (
          <g key={`outer-${i}`}>
            <line
              x1="240"
              y1="240"
              x2={n.x}
              y2={n.y}
              stroke="#FFFFFF"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
            <circle cx={n.x} cy={n.y} r={n.r} fill="#BFFF00" fillOpacity="0.55" />
            <circle
              cx={n.x}
              cy={n.y}
              r="7"
              className="dd-halo-delay"
              fill="none"
              stroke="#BFFF00"
              strokeWidth="1"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          </g>
        ))}
      </g>

      {/* Hub — the engine everything reports into */}
      <g>
        <circle cx="240" cy="240" r="56" fill="url(#svc-hub-glow)" />
        <circle
          cx="240"
          cy="240"
          r="34"
          fill="#FFFFFF"
          fillOpacity="0.04"
          stroke="#FFFFFF"
          strokeOpacity="0.14"
        />
        <circle cx="240" cy="240" r="7" className="dd-halo" fill="none" stroke="#BFFF00" strokeWidth="1.5" />
        <circle cx="240" cy="240" r="11" className="dd-node" fill="#BFFF00" />
      </g>
    </svg>
  );
};
