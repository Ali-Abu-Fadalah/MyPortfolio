'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Experience } from '@/lib/sanity';

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  experiences: Experience[];
}

const MATH_ANNOTATIONS = [
  "f(x) = Σ aₙcos(nx) + bₙsin(nx)",
  "∇ × E = -∂B/∂t",
  "e^(iπ) + 1 = 0",
  "F = G(m₁m₂)/r²",
  "∮ B·dl = μ₀I",
  "E = mc²",
  "iħ(∂Ψ/∂t) = HΨ"
];

export function Timeline({ experiences }: TimelineProps) {
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
  });

  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    if (!pathRef.current || !sectionRef.current) return;
    
    const path = pathRef.current;
    const length = path.getTotalLength();
    
    // Set initial dash offset to hide the line
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    // Draw the line as we scroll
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom 80%",
        scrub: 1.5,
      }
    });

    // Animate the row entries
    gsap.utils.toArray('.timeline-row').forEach((row: any) => {
      gsap.from(row, {
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: row,
          start: "top 85%",
        }
      });
    });

  }, { scope: sectionRef });

  const generateCurve = (itemCount: number) => {
    const rowHeight = 250;
    let d = `M 20 0 `;
    let y = 0;
    let x = 20;
    for(let i = 0; i < itemCount; i++) {
      const nextY = y + rowHeight;
      const nextX = x === 20 ? 80 : 20;
      // Cubic bezier to curve back and forth
      d += `C ${x} ${y + rowHeight/2}, ${nextX} ${nextY - rowHeight/2}, ${nextX} ${nextY} `;
      y = nextY;
      x = nextX;
    }
    return d;
  };

  const dynamicPath = generateCurve(sortedExperiences.length + 1);

  return (
    <section ref={sectionRef} id="experience" className="relative py-24 px-4 sm:px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900 transition-colors duration-300 overflow-hidden font-sans">
      
      <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Left Side: Header and SVG Curve */}
        <div className="md:w-1/3 relative flex-shrink-0">
          <div className="sticky top-32">
            <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 text-transparent mb-6">
              Timeline Integration
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Tracing professional and educational evolution over the continuum.
            </p>
          </div>

          {/* SVG S-Curve */}
          <div className="hidden md:block absolute top-48 left-8 bottom-0 w-[100px] pointer-events-none z-0 overflow-visible" style={{ minHeight: '1000px' }}>
            <svg width="100%" height="100%" className="overflow-visible" fill="none">
              {/* Faint dashed track behind the solid line */}
              <path
                d={dynamicPath}
                strokeWidth="2"
                strokeDasharray="4 8"
                strokeLinecap="round"
                className="stroke-zinc-300 dark:stroke-zinc-800"
              />
              {/* Animated solid line */}
              <path
                ref={pathRef}
                d={dynamicPath}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="stroke-zinc-800 dark:stroke-zinc-300"
              />
            </svg>
          </div>
        </div>

        {/* Right Side: Minimal Text Rows */}
        <div className="md:w-2/3 space-y-24 mt-16 md:mt-48 relative z-10 pb-32">
          {sortedExperiences.map((exp, index) => {
            const annotation = MATH_ANNOTATIONS[index % MATH_ANNOTATIONS.length];
            return (
              <div key={exp._id} className="timeline-row relative flex flex-col items-start group">
                
                {/* Floating Math Annotation */}
                <div className="absolute -left-4 -top-8 md:-left-24 md:-top-6 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none transform -rotate-6 md:-rotate-12 opacity-40 group-hover:opacity-80 transition-opacity duration-500 whitespace-nowrap">
                  {annotation}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 w-full mb-3">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {exp.role}
                  </h3>
                  <span className="text-zinc-300 dark:text-zinc-700 font-mono text-sm hidden sm:block">/</span>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
                    {exp.organization}
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-5 font-mono text-xs sm:text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    [{exp.dateRange}]
                  </span>
                  <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                    :: {exp.type}
                  </span>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl font-serif text-base sm:text-lg">
                  {exp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
