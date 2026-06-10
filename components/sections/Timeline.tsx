"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Experience } from "@/lib/sanity";

export function Timeline({ experiences }: { experiences: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const entriesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !pathRef.current) return;

    const pathLength = pathRef.current.getTotalLength();

    gsap.set(pathRef.current, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1,
      }
    });

    entriesRef.current.forEach((entry, i) => {
      if (!entry) return;
      gsap.fromTo(entry,
        { opacity: 0, x: i % 2 === 0 ? -20 : 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );
    });

  }, []);

  return (
    <section id="about" className="w-full bg-transparent text-white py-32 border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6" ref={containerRef}>

        <h2 className="text-3xl md:text-4xl font-bold mb-24 text-center">Journey</h2>

        <div className="relative">
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[100px] pointer-events-none" preserveAspectRatio="none">
            <path
              ref={pathRef}
              d="M50,0 Q80,150 50,300 T50,600 T50,900 T50,1200 T50,1500 T50,1800"
              fill="none"
              stroke="url(#timeline-grad)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="timeline-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-32">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const isWork = exp.type === 'Work' || exp.type === 'work' as any;

              const annotations = [
                "f(x) = Σ aₙcos(nx) + bₙsin(nx)",
                "O(n log n)",
                "∂E/∂w = -2Σ(y - ŷ)xᵢ"
              ];
              const annotation = annotations[i % annotations.length];

              return (
                <div
                  key={exp._id}
                  ref={el => { entriesRef.current[i] = el; }}
                  className={`flex ${isLeft ? 'justify-start' : 'justify-end'} w-full relative group`}
                >
                  <div className={`w-[calc(50%-40px)] ${isLeft ? 'text-right' : 'text-left'}`}>

                    <div className="flex flex-col gap-1 mb-3">
                      <div className={`font-mono text-xs ${isWork ? 'text-cyan-500' : 'text-violet-500'}`}>
                        {exp.dateRange}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {exp.role} · {exp.organization}
                      </h3>
                      <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                        [{exp.type}]
                      </div>
                    </div>

                    <p className={`text-sm text-zinc-400 leading-[1.6] ${isLeft ? 'ml-auto' : ''} max-w-[300px]`}>
                      {exp.description}
                    </p>

                    <div className={`absolute top-0 ${isLeft ? '-left-20' : '-right-20'} font-mono text-[10px] text-zinc-600 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none select-none hidden md:block whitespace-nowrap`}>
                      {`// ${annotation}`}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
