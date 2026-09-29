import React from 'react';

interface ShootingStarConfig {
  top: string;
  left: string;
  angle: string;
  duration: string;
  delay: string;
  streakWidth?: string;
  limeTint?: boolean;
}

const SHOOTING_STARS: ShootingStarConfig[] = [
  {
    top: '12%',
    left: '-8%',
    angle: '24deg',
    duration: '9.5s',
    delay: '1.2s',
    streakWidth: '150px',
    limeTint: false,
  },
  {
    top: '32%',
    left: '-10%',
    angle: '20deg',
    duration: '11.5s',
    delay: '5.6s',
    streakWidth: '160px',
    limeTint: true,
  },
  {
    top: '56%',
    left: '-8%',
    angle: '26deg',
    duration: '10.5s',
    delay: '10.8s',
    streakWidth: '135px',
    limeTint: false,
  },
];

// Pre-seeded background star positions for crisp, stable celestial background
const TWINKLE_STARS = [
  { top: '8%', left: '15%', size: 1.5, baseOpacity: 0.25, duration: '2.8s', delay: '0.2s' },
  { top: '14%', left: '42%', size: 2, baseOpacity: 0.35, duration: '3.4s', delay: '1.1s' },
  { top: '22%', left: '78%', size: 1.5, baseOpacity: 0.2, duration: '2.6s', delay: '0.7s' },
  { top: '18%', left: '88%', size: 2, baseOpacity: 0.4, duration: '4s', delay: '2.3s' },
  { top: '28%', left: '25%', size: 1, baseOpacity: 0.2, duration: '3.1s', delay: '1.5s' },
  { top: '38%', left: '10%', size: 2, baseOpacity: 0.3, duration: '3.6s', delay: '0.4s' },
  { top: '44%', left: '65%', size: 1.5, baseOpacity: 0.25, duration: '2.9s', delay: '1.8s' },
  { top: '52%', left: '92%', size: 1, baseOpacity: 0.15, duration: '3.2s', delay: '0.9s' },
  { top: '64%', left: '33%', size: 2, baseOpacity: 0.35, duration: '4.2s', delay: '1.4s' },
  { top: '70%', left: '80%', size: 1.5, baseOpacity: 0.2, duration: '2.7s', delay: '2.0s' },
  { top: '78%', left: '18%', size: 1.5, baseOpacity: 0.3, duration: '3.8s', delay: '0.6s' },
  { top: '85%', left: '55%', size: 2, baseOpacity: 0.4, duration: '3.3s', delay: '1.7s' },
  { top: '90%', left: '85%', size: 1, baseOpacity: 0.2, duration: '2.5s', delay: '0.8s' },
];

export const ShootingStars: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
    >
      {/* Background Twinkling Constellation Dots */}
      {TWINKLE_STARS.map((star, i) => (
        <div
          key={`twinkle-${i}`}
          className="hero-twinkle-dot absolute rounded-full bg-white"
          style={
            {
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--star-base-opacity': star.baseOpacity,
              '--twinkle-duration': star.duration,
              '--twinkle-delay': star.delay,
              boxShadow: star.size > 1 ? '0 0 4px rgba(255,255,255,0.7)' : 'none',
            } as React.CSSProperties
          }
        />
      ))}

      {/* Sweeping Shooting Stars */}
      {SHOOTING_STARS.map((star, index) => (
        <div
          key={`shooting-star-${index}`}
          className="hero-comet-particle absolute"
          style={
            {
              top: star.top,
              left: star.left,
              width: '3.5px',
              height: '3.5px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: star.limeTint
                ? '0 0 8px #ffffff, 0 0 20px rgba(191,255,0,0.85), 0 0 35px rgba(191,255,0,0.4)'
                : '0 0 8px #ffffff, 0 0 22px rgba(255,255,255,0.8), 0 0 36px rgba(191,255,0,0.3)',
              opacity: 0,
              '--star-angle': star.angle,
              '--star-duration': star.duration,
              '--star-delay': star.delay,
            } as React.CSSProperties
          }
        >
          {/* Tapered Streak Tail */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '100%',
              width: star.streakWidth || '140px',
              height: '1.6px',
              transform: 'translateY(-50%)',
              background: star.limeTint
                ? 'linear-gradient(to left, rgba(255,255,255,0.98) 0%, rgba(191,255,0,0.65) 25%, rgba(191,255,0,0.2) 65%, transparent 100%)'
                : 'linear-gradient(to left, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.5) 30%, rgba(191,255,0,0.2) 70%, transparent 100%)',
              filter: 'blur(0.35px)',
            }}
          />
        </div>
      ))}
    </div>
  );
};
