interface GlowOrbProps {
  className?: string;
  size?: number;          // diameter in px
  color?: string;         // CSS color
  blur?: number;          // blur radius in px
  opacity?: number;       // 0–1
  animationClass?: string; // e.g. 'animate-orb-1' or 'animate-orb-2'
}

export function GlowOrb({
  className = '',
  size = 400,
  color = 'var(--accent)',
  blur = 120,
  opacity = 0.12,
  animationClass = 'animate-orb-1',
}: GlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${animationClass} ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}
