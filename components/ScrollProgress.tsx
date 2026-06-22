'use client';

import { useScroll, useSpring, motion, useReducedMotion } from 'framer-motion';

export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[100]"
      aria-hidden="true"
    >
      <div
        className="w-full h-full"
        style={{ background: 'linear-gradient(90deg, var(--accent-dim), var(--accent), var(--accent-bright))' }}
      />
    </motion.div>
  );
}
