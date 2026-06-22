'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { Profile } from '@/lib/sanity';
import { GlowOrb } from './GlowOrb';
import { NoiseOverlay } from './NoiseOverlay';
import { TypewriterText } from './TypewriterText';

// Dynamically import R3F canvas — avoids SSR, reduces initial bundle
const ParticleCanvas = dynamic(
  () => import('./ParticleCanvas').then((m) => m.ParticleCanvas),
  { ssr: false, loading: () => null }
);

const ROLES = [
  'Enterprise Systems Specialist',
  'Full-Stack Engineer',
  'AI Integration Builder',
  '3D Web Developer',
];

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center sm:items-start gap-0.5">
      <span
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {value}
      </span>
      <span className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Helper: returns Framer Motion animate props or empty obj if reduced motion
  const fadeUp = (delay = 0): Record<string, unknown> =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
        };

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-16"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />

      {/* Glow orbs */}
      <GlowOrb
        size={isMobile ? 250 : 500}
        color="var(--accent)"
        blur={isMobile ? 80 : 140}
        opacity={0.10}
        animationClass="animate-orb-1"
        className="top-[10%] left-[5%]"
      />
      <GlowOrb
        size={isMobile ? 200 : 400}
        color="var(--accent-dim)"
        blur={isMobile ? 60 : 120}
        opacity={0.08}
        animationClass="animate-orb-2"
        className="bottom-[15%] right-[5%]"
      />

      {/* Noise texture */}
      <NoiseOverlay />

      {/* Particle canvas — desktop only, skipped on reduced motion */}
      {mounted && !isMobile && !prefersReducedMotion && (
        <div className="absolute inset-0 z-[1] opacity-40" aria-hidden="true">
          <ParticleCanvas />
        </div>
      )}

      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-base))' }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 sm:px-8 max-w-4xl mx-auto w-full">
        {/* Available badge */}
        <motion.div {...fadeUp(0.1)} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            Available for work
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {profile.name}
        </motion.h1>

        {/* Typewriter specialty */}
        <motion.p {...fadeUp(0.35)} className="mb-6">
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            <TypewriterText
              texts={ROLES}
              speed={55}
              pauseDuration={2000}
              className="text-lg sm:text-2xl font-medium"
            />
          </span>
        </motion.p>

        {/* Bio */}
        <motion.p
          {...fadeUp(0.45)}
          className="text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.bio}
        </motion.p>

        {/* Stats row */}
        <motion.div
          {...fadeUp(0.55)}
          className="flex items-center justify-center gap-8 sm:gap-12 mb-10 py-5 px-8 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <StatItem value="3+" label="Years exp." />
          <div className="w-px h-8" style={{ backgroundColor: 'var(--border)' }} />
          <StatItem value="20+" label="Projects" />
          <div className="w-px h-8" style={{ backgroundColor: 'var(--border)' }} />
          <StatItem value="10+" label="Technologies" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.65)}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            data-cursor="pointer"
          >
            View My Work
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl border transition-all duration-200 hover:scale-105"
            style={{
              borderColor: 'var(--border-hover)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface)',
            }}
            data-cursor="pointer"
          >
            Download CV
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeUp(1.0)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="text-[10px] font-medium tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Scroll
        </span>
        <div className="animate-scroll-bounce">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--text-muted)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
