'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      setIsMobile(!hasFinePointer);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    if (isMobile || !cursorRef.current || !ringRef.current) return;

    // Set initial centering offsets
    gsap.set([cursorRef.current, ringRef.current], { xPercent: -50, yPercent: -50 });

    const xSetterDot = gsap.quickSetter(cursorRef.current, 'x', 'px');
    const ySetterDot = gsap.quickSetter(cursorRef.current, 'y', 'px');
    
    const xSetterRing = gsap.quickSetter(ringRef.current, 'x', 'px');
    const ySetterRing = gsap.quickSetter(ringRef.current, 'y', 'px');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Instant update for dot
      xSetterDot(mouse.x);
      ySetterDot(mouse.y);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Render loop for ring with ~120ms lag
    const dt = 0.14; // Approx lerp factor for 120ms at 60fps
    const tickerUpdate = () => {
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      
      xSetterRing(pos.x);
      ySetterRing(pos.y);
    };

    gsap.ticker.add(tickerUpdate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerUpdate);
    };
  }, [isMobile]);

  return (
    <>
      {children}
      {!isMobile && (
        <>
          <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
          />
          <div
            ref={ringRef}
            className="fixed top-0 left-0 w-[32px] h-[32px] border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
          />
        </>
      )}
    </>
  );
}
