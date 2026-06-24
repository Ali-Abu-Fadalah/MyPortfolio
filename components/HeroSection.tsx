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

/* ── Mobile stat card (snap-scroll item) ─────────────── */
function MobileStatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div
      className="snap-item shimmer-hint flex-shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl border mx-2 first:ml-0"
      style={{
        width: '120px',
        height: '90px',
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-hover)',
        animationDelay: `${delay}ms`,
      }}
    >
      <span
        className="text-2xl font-bold"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {value}
      </span>
      <span
        className="text-[10px] text-center leading-tight px-2"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Mobile wave scroll indicator ───────────────────── */
function MobileScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-[10px] font-medium tracking-widest uppercase"
        style={{ color: 'var(--text-muted)' }}
      >
        Scroll
      </span>
      <div className="flex items-end gap-[3px] h-5">
        {[3, 5, 7, 5, 3].map((h, i) => (
          <span
            key={i}
            className="wave-bar block rounded-full"
            style={{
              width: '3px',
              height: `${h * 2}px`,
              backgroundColor: 'var(--accent)',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
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

  // Desktop: fade-up animation
  const fadeUp = (delay = 0): Record<string, unknown> =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
        };

  // Mobile: card-deal animation
  const cardDeal = (delay = 0): Record<string, unknown> =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 40, rotate: -1.5, scale: 0.96 },
          animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
          transition: {
            type: 'spring',
            stiffness: 120,
            damping: 16,
            delay,
          },
        };

  const getAnim = (delay = 0) => (isMobile ? cardDeal(delay) : fadeUp(delay));

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden pt-16"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* ── DESKTOP: Dot-grid background ─────────────── */}
      {mounted && !isMobile && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.6,
          }}
        />
      )}

      {/* ── MOBILE: Animated diagonal streak background ─ */}
      {mounted && isMobile && (
        <div
          aria-hidden="true"
          className="mobile-streak-bg absolute inset-0 z-0 pointer-events-none"
        />
      )}

      {/* Glow orbs */}
      <GlowOrb
        size={isMobile ? 220 : 500}
        color="var(--accent)"
        blur={isMobile ? 70 : 140}
        opacity={isMobile ? 0.13 : 0.10}
        animationClass="animate-orb-1"
        className="top-[10%] left-[5%]"
      />
      <GlowOrb
        size={isMobile ? 180 : 400}
        color="var(--accent-dim)"
        blur={isMobile ? 50 : 120}
        opacity={isMobile ? 0.10 : 0.08}
        animationClass="animate-orb-2"
        className="bottom-[15%] right-[5%]"
      />

      {/* ── MOBILE: Morphing blob behind name ──────────── */}
      {mounted && isMobile && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="mobile-blob absolute z-[1] pointer-events-none"
          style={{
            width: '280px',
            height: '280px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -52%)',
            backgroundColor: 'var(--accent)',
            opacity: 0.07,
            filter: 'blur(40px)',
          }}
        />
      )}

      {/* Noise texture */}
      <NoiseOverlay />

      {/* Particle canvas — desktop only */}
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

      {/* ── Content ──────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 sm:px-8 max-w-4xl mx-auto w-full">

        {/* Available badge */}
        <motion.div {...getAnim(0.1)} className="mb-6">
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
          {...getAnim(0.2)}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {profile.name}
        </motion.h1>

        {/* Specialty Static Badge */}
        {profile.specialty && (
          <motion.div {...getAnim(0.28)} className="mb-4">
            <span
              className="inline-block px-3 py-1.5 rounded-md text-xs font-semibold border"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {profile.specialty}
            </span>
          </motion.div>
        )}

        {/* Typewriter specialty */}
        <motion.p {...getAnim(0.35)} className="mb-6 overflow-hidden whitespace-nowrap min-h-[2.5rem] w-full flex items-center justify-center bg-transparent">
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            <TypewriterText
              texts={profile.heroRoles && profile.heroRoles.length > 0 ? profile.heroRoles : ['Developer']}
              speed={55}
              pauseDuration={2000}
              className="text-lg sm:text-2xl font-medium"
            />
          </span>
        </motion.p>

        {/* Bio */}
        <motion.p
          {...getAnim(0.45)}
          className="text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.bio}
        </motion.p>

        {/* ── DESKTOP: Stats row pill ─────────────────── */}
        {mounted && !isMobile && (
          <motion.div
            {...fadeUp(0.55)}
            className="flex items-center justify-center gap-8 sm:gap-12 mb-10 py-5 px-8 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            {profile.heroStats?.map((stat, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12">
                <StatItem value={stat.value} label={stat.label} />
                {i < profile.heroStats.length - 1 && (
                  <div className="w-px h-8" style={{ backgroundColor: 'var(--border)' }} />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* ── MOBILE: Stats snap-scroll strip ─────────── */}
        {mounted && isMobile && profile.heroStats && profile.heroStats.length > 0 && (
          <motion.div
            {...cardDeal(0.55)}
            className="w-full mb-8"
          >
            <div className="snap-scroll-x -mx-6 px-6 pb-2 pt-2">
              {profile.heroStats.map((stat, i) => (
                <MobileStatCard
                  key={i}
                  value={stat.value}
                  label={stat.label}
                  delay={i * 80}
                />
              ))}
            </div>
            {/* Swipe hint label */}
            <p
              className="text-center mt-2 text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              swipe →
            </p>
          </motion.div>
        )}

        {/* ── DESKTOP: CTA row ─────────────────────────── */}
        {mounted && !isMobile && (
          <motion.div
            {...fadeUp(0.65)}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              data-cursor="pointer"
            >
              View My Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={profile.resumeUrl || '#'}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </motion.div>
        )}

        {/* ── MOBILE: Full-width stacked CTAs ─────────── */}
        {mounted && isMobile && (
          <motion.div
            {...cardDeal(0.65)}
            className="w-full flex flex-col gap-3"
          >
            <motion.a
              href="#projects"
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold rounded-2xl transition-colors duration-200"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
                height: '56px',
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              View My Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
            <motion.a
              href={profile.resumeUrl || '#'}
              download
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold rounded-2xl border transition-colors duration-200"
              style={{
                borderColor: 'var(--border-hover)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)',
                height: '56px',
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              Download CV
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.a>
          </motion.div>
        )}

        {/* SSR placeholder (avoids layout shift before hydration) */}
        {!mounted && (
          <>
            <div className="flex items-center justify-center gap-8 sm:gap-12 mb-10 py-5 px-8 rounded-2xl border"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              {profile.heroStats?.map((stat, i) => (
                <div key={i} className="flex items-center gap-8 sm:gap-12">
                  <StatItem value={stat.value} label={stat.label} />
                  {i < profile.heroStats.length - 1 && (
                    <div className="w-px h-8" style={{ backgroundColor: 'var(--border)' }} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#projects" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl"
                style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}>View My Work</a>
            </div>
          </>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...(prefersReducedMotion ? {} : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 1.0, duration: 0.6 },
        })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        {/* Mobile: wave bars | Desktop: arrow */}
        {mounted && isMobile ? (
          <MobileScrollIndicator />
        ) : (
          <>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Scroll
            </span>
            <div className="animate-scroll-bounce">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
