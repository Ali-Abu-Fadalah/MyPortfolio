'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  range?: number;
  className?: string;
}

export function Magnetic({ children, range = 60, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for cursor offset relative to target center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map raw mouse offsets within the trigger range to a dynamic translation of max [-15px, 15px]
  const x = useTransform(mouseX, [-range, range], [-15, 15], { clamp: true });
  const y = useTransform(mouseY, [-range, range], [-15, 15], { clamp: true });

  // Smooth springs to animate translate positioning and return to center on cursor release
  const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Center coordinates of target boundary box
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Vector distances between current cursor and element center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      // Pull element towards cursor relative coordinates
      mouseX.set(distanceX);
      mouseY.set(distanceY);
    } else {
      // Out of trigger range: reset position
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    // Reset positioning on cursor exit
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
}
