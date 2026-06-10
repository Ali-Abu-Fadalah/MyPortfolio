"use client";

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Profile } from '@/lib/sanity';
import { BackgroundNoise } from '@/components/3d/BackgroundNoise';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Lazy load the 3D scene (never SSR Three.js)
const LorenzScene = dynamic(() => import('@/components/3d/LorenzScene'), {
  ssr: false,
  loading: () => null
});

const PostProcessing = dynamic(() => import('@/components/3d/PostProcessing'), {
  ssr: false
});

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial reveal staggered
    if (!textRef.current) return;
    const elements = textRef.current.children;

    gsap.fromTo(elements,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.6 }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col justify-center min-h-screen w-full bg-transparent text-white overflow-hidden"
    >
      <BackgroundNoise />

      <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <LorenzScene />
          <PostProcessing />
        </Canvas>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex items-center h-full pt-16">

        <div ref={textRef} className="max-w-2xl flex flex-col items-start text-left pointer-events-none mt-12 md:mt-0">

          <div className="font-mono text-[11px] text-cyan-500 uppercase tracking-[0.15em] mb-6">
            {profile.specialty || "FULL-STACK DEVELOPER"}
          </div>

          <h1 className="text-5xl md:text-[80px] font-extrabold leading-[1.1] mb-8 text-white tracking-tight">
            {profile.name.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>

          <p className="text-base text-zinc-400 max-w-[380px] leading-[1.7] mb-10">
            {profile.bio || "Building tools that think. CS student, support engineer, and author of things that run in your browser."}
          </p>

          <div className="flex flex-wrap items-center gap-6 pointer-events-auto">
            <a
              href="#projects"
              className="px-6 py-3 bg-cyan-500 text-zinc-950 font-bold text-sm hover:bg-cyan-400 transition-colors"
            >
              View Projects →
            </a>
            <a
              href="/resume.pdf"
              className="px-6 py-3 border border-zinc-700 text-white font-bold text-sm hover:bg-white/5 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
