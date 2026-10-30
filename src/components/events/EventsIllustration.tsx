import React from 'react';

/**
 * Hero illustration: the attendee journey as a single connected system.
 *
 * A browser window holding an event page feeds a registration card, which issues
 * a ticket, which fans out into notification pulses and finally a results bar
 * chart. Inline SVG rather than an image so it is sharp at any size, themed from
 * the brand palette, and costs no extra request.
 *
 * Motion reuses the existing `dd-*` keyframes in index.css, all of which are
 * already neutralised by the global prefers-reduced-motion rule.
 */
export const EventsIllustration: React.FC = () => (
  <svg
    viewBox="0 0 480 440"
    role="img"
    aria-label="Diagram of an event's digital journey: event website, registration, ticket, attendee notifications and post-event reporting"
    className="h-auto w-full max-w-[520px]"
  >
    <defs>
      <linearGradient id="ev-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="ev-lime" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bfff00" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#bfff00" stopOpacity="0.35" />
      </linearGradient>
      <radialGradient id="ev-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#bfff00" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#bfff00" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient glow behind the whole system. */}
    <circle cx="240" cy="210" r="195" fill="url(#ev-glow)" />

    <g className="dd-float">
      {/* ---- Event website window ---- */}
      <g>
        <rect
          x="58"
          y="40"
          width="250"
          height="150"
          rx="14"
          fill="url(#ev-glass)"
          stroke="rgba(255,255,255,0.14)"
        />
        {/* Title bar */}
        <path
          d="M58 54a14 14 0 0 1 14-14h222a14 14 0 0 1 14 14v16H58z"
          fill="rgba(255,255,255,0.05)"
        />
        <circle cx="76" cy="55" r="3.5" fill="rgba(255,255,255,0.22)" />
        <circle cx="88" cy="55" r="3.5" fill="rgba(255,255,255,0.22)" />
        <circle cx="100" cy="55" r="3.5" fill="rgba(255,255,255,0.22)" />
        <rect x="116" y="50" width="92" height="10" rx="5" fill="rgba(255,255,255,0.07)" />

        {/* Hero block of the event page */}
        <rect x="76" y="86" width="104" height="9" rx="4.5" fill="url(#ev-lime)" />
        <rect x="76" y="103" width="150" height="7" rx="3.5" fill="rgba(255,255,255,0.14)" />
        <rect x="76" y="117" width="118" height="7" rx="3.5" fill="rgba(255,255,255,0.09)" />

        {/* Register button on the page */}
        <rect x="76" y="140" width="76" height="24" rx="12" fill="#bfff00" />
        <rect x="90" y="149" width="48" height="6" rx="3" fill="#050507" opacity="0.75" />

        {/* Date chip */}
        <rect
          x="228"
          y="86"
          width="62"
          height="48"
          rx="10"
          fill="rgba(191,255,0,0.08)"
          stroke="rgba(191,255,0,0.28)"
        />
        <rect x="240" y="97" width="38" height="8" rx="4" fill="rgba(191,255,0,0.75)" />
        <rect x="240" y="112" width="26" height="6" rx="3" fill="rgba(255,255,255,0.22)" />
      </g>

      {/* ---- Flow: website to registration ---- */}
      <path
        d="M183 190v22h-46v24"
        fill="none"
        stroke="rgba(191,255,0,0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />

      {/* ---- Registration card ---- */}
      <g>
        <rect
          x="46"
          y="236"
          width="182"
          height="124"
          rx="14"
          fill="url(#ev-glass)"
          stroke="rgba(255,255,255,0.14)"
        />
        <rect x="64" y="256" width="68" height="7" rx="3.5" fill="rgba(191,255,0,0.8)" />

        {/* Three form fields */}
        <rect
          x="64"
          y="276"
          width="146"
          height="20"
          rx="7"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.1)"
        />
        <rect x="74" y="283" width="52" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
        <rect
          x="64"
          y="302"
          width="146"
          height="20"
          rx="7"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.1)"
        />
        <rect x="74" y="309" width="72" height="6" rx="3" fill="rgba(255,255,255,0.18)" />

        {/* Confirm row with a tick */}
        <circle
          cx="74"
          cy="340"
          r="9"
          fill="rgba(191,255,0,0.14)"
          stroke="rgba(191,255,0,0.5)"
        />
        <path
          d="M70 340l3 3 5.5-6"
          fill="none"
          stroke="#bfff00"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="92" y="336" width="80" height="7" rx="3.5" fill="rgba(255,255,255,0.14)" />
      </g>

      {/* ---- Flow: registration to ticket ---- */}
      <path
        d="M228 298h34"
        fill="none"
        stroke="rgba(191,255,0,0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />

      {/* ---- Ticket ---- */}
      <g transform="rotate(-6 332 290)">
        <path
          d="M268 256h116a10 10 0 0 1 10 10v8a10 10 0 0 0 0 20v8a10 10 0 0 1-10 10H268a10 10 0 0 1-10-10v-8a10 10 0 0 0 0-20v-8a10 10 0 0 1 10-10z"
          fill="rgba(191,255,0,0.09)"
          stroke="rgba(191,255,0,0.4)"
        />
        <rect x="274" y="270" width="54" height="7" rx="3.5" fill="rgba(191,255,0,0.85)" />
        <rect x="274" y="285" width="34" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
        {/* Barcode */}
        <g fill="rgba(255,255,255,0.3)">
          <rect x="344" y="268" width="2.5" height="26" rx="1" />
          <rect x="350" y="268" width="1.5" height="26" rx="0.75" />
          <rect x="355" y="268" width="3" height="26" rx="1" />
          <rect x="362" y="268" width="1.5" height="26" rx="0.75" />
          <rect x="367" y="268" width="2.5" height="26" rx="1" />
          <rect x="374" y="268" width="1.5" height="26" rx="0.75" />
        </g>
      </g>

      {/* ---- Notification broadcast ---- */}
      <g>
        <circle className="dd-halo" cx="398" cy="150" r="7" fill="none" stroke="rgba(191,255,0,0.45)" />
        <circle
          className="dd-halo-delay"
          cx="398"
          cy="150"
          r="7"
          fill="none"
          stroke="rgba(191,255,0,0.3)"
        />
        <circle className="dd-node" cx="398" cy="150" r="7" fill="#bfff00" />

        {/* Two message bubbles leaving the emitter */}
        <g>
          <rect
            x="326"
            y="92"
            width="70"
            height="34"
            rx="11"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.14)"
          />
          <rect x="338" y="103" width="38" height="5" rx="2.5" fill="rgba(191,255,0,0.65)" />
          <rect x="338" y="113" width="26" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
        </g>
        <g>
          <rect
            x="352"
            y="186"
            width="70"
            height="34"
            rx="11"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.14)"
          />
          <rect x="364" y="197" width="30" height="5" rx="2.5" fill="rgba(191,255,0,0.65)" />
          <rect x="364" y="207" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
        </g>
      </g>

      {/* ---- Post-event report ---- */}
      <g>
        <rect
          x="258"
          y="344"
          width="166"
          height="76"
          rx="14"
          fill="url(#ev-glass)"
          stroke="rgba(255,255,255,0.14)"
        />
        {/* Baseline */}
        <path d="M274 404h134" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Bars, each with its own rhythm */}
        <g fill="url(#ev-lime)">
          <rect className="dd-bar" x="280" y="382" width="12" height="22" rx="3" style={{ animationDelay: '0s' }} />
          <rect className="dd-bar" x="300" y="372" width="12" height="32" rx="3" style={{ animationDelay: '0.3s' }} />
          <rect className="dd-bar" x="320" y="378" width="12" height="26" rx="3" style={{ animationDelay: '0.6s' }} />
          <rect className="dd-bar" x="340" y="362" width="12" height="42" rx="3" style={{ animationDelay: '0.9s' }} />
          <rect className="dd-bar" x="360" y="368" width="12" height="36" rx="3" style={{ animationDelay: '1.2s' }} />
          <rect className="dd-bar" x="380" y="356" width="12" height="48" rx="3" style={{ animationDelay: '1.5s' }} />
        </g>
        {/* Trend line drawing itself across the bars */}
        <path
          className="dd-draw"
          d="M286 384l20-12 20 6 20-18 20 6 20-12"
          fill="none"
          stroke="#bfff00"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </g>
    </g>
  </svg>
);
