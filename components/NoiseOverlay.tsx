interface NoiseOverlayProps {
  className?: string;
}

export function NoiseOverlay({ className = '' }: NoiseOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={`noise-overlay z-0 ${className}`}
    />
  );
}
