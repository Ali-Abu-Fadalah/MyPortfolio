'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCard } from './ProjectCard';
import { PortfolioProject } from '@/lib/sanity';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  projects: PortfolioProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !scrollTrackRef.current) return;

    const getScrollAmount = () => {
      const scrollWidth = scrollTrackRef.current?.scrollWidth || 0;
      return -(scrollWidth - window.innerWidth);
    };

    const tween = gsap.to(scrollTrackRef.current, {
      x: getScrollAmount,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
    });

    gsap.from('.project-card-entry', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      opacity: 0,
      scale: 0.88,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.2)'
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="h-[300vh] relative w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900 transition-colors duration-300">
      {/* Sticky container that stays in view while outer section scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        <div className="absolute top-12 md:top-24 left-4 sm:left-12 md:left-24 z-10 space-y-4 pointer-events-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-400 text-transparent">
            Featured Projects
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A showcase of recent developer tools, applications, and blockchain solutions engineered for performance and reliability.
          </p>
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2" />
        </div>

        {/* The horizontal track */}
        <div 
          ref={scrollTrackRef} 
          className="flex gap-8 px-4 sm:px-12 md:px-24 items-center w-max mt-24"
        >
          {projects.map((project) => (
            <div key={project._id} className="project-card-entry shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
          {/* Spacer block at the end so last card isn't cramped */}
          <div className="w-[15vw] shrink-0" />
        </div>
      </div>
    </section>
  );
}
