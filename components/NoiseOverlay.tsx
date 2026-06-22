interface NoiseOverlayProps {
  className?: string;
}

export function NoiseOverlay({ className = '' }: NoiseOverlayProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`noise-overlay z-0 ${className}`}
      />
      <div
        aria-hidden="true"
        className="blueprint-grid z-0"
      />
    </>
  );
}
