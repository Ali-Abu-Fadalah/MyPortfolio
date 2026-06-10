"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCursor } from "@/app/providers/CursorProvider";

export function CustomCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { active } = useCursor();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const inner = innerRef.current;
    const outer = outerRef.current;
    const trails = trailRefs.current;

    if (!inner || !outer) return;

    // Quick setters for performance
    const setInnerX = gsap.quickSetter(inner, "x", "px");
    const setInnerY = gsap.quickSetter(inner, "y", "px");

    const setOuterX = gsap.quickSetter(outer, "x", "px");
    const setOuterY = gsap.quickSetter(outer, "y", "px");

    const trailSetters = trails.map(t => t ? {
      x: gsap.quickSetter(t, "x", "px"),
      y: gsap.quickSetter(t, "y", "px")
    } : null);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outerX = mouseX;
    let outerY = mouseY;

    const trailPositions = trails.map(() => ({ x: mouseX, y: mouseY }));

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      setInnerX(mouseX - 3);
      setInnerY(mouseY - 3);
    };

    window.addEventListener("mousemove", onMouseMove);

    const ticker = gsap.ticker.add(() => {
      // Lag outer ring
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;

      setOuterX(outerX - 16);
      setOuterY(outerY - 16);

      // Lag trails
      let prevX = mouseX;
      let prevY = mouseY;

      trailPositions.forEach((pos, i) => {
        pos.x += (prevX - pos.x) * 0.2;
        pos.y += (prevY - pos.y) * 0.2;

        const setter = trailSetters[i];
        if (setter) {
          setter.x(pos.x - 3);
          setter.y(pos.y - 3);
        }

        prevX = pos.x;
        prevY = pos.y;
      });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={outerRef}
        className={`fixed top-0 left-0 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-200 ease-out flex items-center justify-center
          ${active ? 'w-[48px] h-[48px] -ml-[24px] -mt-[24px] bg-white/10' : 'w-[32px] h-[32px]'}`}
      />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full pointer-events-none z-[9998] mix-blend-difference opacity-[0.08]"
        />
      ))}
    </>
  );
}
