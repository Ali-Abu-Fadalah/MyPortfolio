"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { PortfolioProject } from "@/lib/sanity";
import { ProjectCard } from "./ProjectCard";
import { useGSAP } from "@gsap/react";

export function ProjectsSection({ projects }: { projects: PortfolioProject[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !trackRef.current) return;

    const cards = gsap.utils.toArray('.project-card-wrapper') as HTMLElement[];

    // We want the section to be pinned for a while to allow horizontal scrolling
    // Let's say 300vh total scroll distance.
    const getScrollAmount = () => {
      // The track width minus the viewport width
      const trackWidth = trackRef.current?.scrollWidth || 0;
      return -(trackWidth - window.innerWidth + 100); // 100px padding
    };

    const tween = gsap.to(trackRef.current, {
      x: getScrollAmount,
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true
    });

    // Cards entrance animation
    cards.forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.88,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: "left 85%",
          toggleActions: "play none none none"
        }
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="work" className="relative h-screen w-full bg-transparent text-white overflow-hidden flex flex-col justify-center">
      <div className="absolute top-16 left-6 md:left-12 z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Featured Work</h2>
        <div className="font-mono text-cyan-500 mt-2 text-lg">({String(projects.length).padStart(2, '0')})</div>
      </div>

      <div className="flex items-center h-full pt-32 pb-16 pl-6 md:pl-12 w-full">
        <div ref={trackRef} className="flex gap-8 md:gap-16 w-max items-center">
          {projects.map((project, index) => (
            <div key={project._id} className="project-card-wrapper shrink-0">
              <ProjectCard project={project} index={index} total={projects.length} />
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-white/10 hidden md:block">
        <div className="h-full bg-cyan-500 w-1/3 rounded-full animate-pulse mx-auto" />
      </div>
    </section>
  );
}
