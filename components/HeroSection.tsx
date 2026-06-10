'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { Profile } from '@/lib/sanity';

const LorenzScene = dynamic(() => import('@/components/LorenzScene'), {
  ssr: false,
});

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen w-full bg-transparent overflow-hidden pt-16 transition-colors duration-300">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <LorenzScene />
      </div>

      {/* Foreground Overlay for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-zinc-50/30 to-zinc-50 dark:via-zinc-950/30 dark:to-zinc-950 pointer-events-none transition-colors duration-300" />

      {/* Dynamic Text Overlay */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto space-y-6 pointer-events-none">
        <div className="hero-text-content inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 border border-zinc-300/85 text-xs sm:text-sm font-medium text-zinc-800 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 backdrop-blur-md shadow-md transition-colors">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent-1)] animate-pulse" />
          Available for work
        </div>
        
        <h1 className="hero-text-content text-5xl font-extrabold tracking-tight sm:text-[80px] sm:leading-[85px] bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-600 text-transparent dark:from-white dark:to-zinc-400 font-sans">
          {profile.name}
        </h1>
        
        <p className="hero-text-content text-lg sm:text-2xl text-[var(--color-accent-1)] font-medium tracking-wide">
          {profile.specialty}
        </p>

        <p className="hero-text-content text-sm sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mt-4">
          {profile.bio}
        </p>

        <a 
          href="#projects" 
          className="hero-cta mt-8 px-8 py-4 rounded-full bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950 font-semibold shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all pointer-events-auto cursor-none"
        >
          View Projects
        </a>
      </div>
    </section>
  );
}
