'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

type CursorState = 'default' | 'pointer' | 'text' | 'hidden';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inner dot — fast
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 35, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 35, mass: 0.1 });

  // Outer ring — laggy
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.15 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.15 });

  useEffect(() => {
    setMounted(true);
    // Detect touch device
    const isTouch = window.matchMedia('(hover: none)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-cursor]') as HTMLElement | null;
      if (el) {
        setCursorState(el.dataset.cursor as CursorState);
      } else if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setCursorState('pointer');
      } else if (
        target.tagName === 'P' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'SPAN'
      ) {
        setCursorState('text');
      } else if (target.tagName === 'CANVAS') {
        setCursorState('hidden');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted || isTouchDevice || prefersReducedMotion) return null;

  const isHidden = cursorState === 'hidden';
  const isPointer = cursorState === 'pointer';

  return (
    <>
      {/* Outer ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        animate={{
          width: isHidden ? 0 : isPointer ? 48 : 36,
          height: isHidden ? 0 : isPointer ? 48 : 36,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-full h-full rounded-full border mix-blend-difference"
          style={{ borderColor: 'var(--accent)' }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        animate={{
          width: isHidden ? 0 : isPointer ? 6 : 8,
          height: isHidden ? 0 : isPointer ? 6 : 8,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="w-full h-full rounded-full mix-blend-difference"
          style={{ backgroundColor: 'var(--accent)' }}
        />
      </motion.div>
    </>
  );
}
