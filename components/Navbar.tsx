'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Magnetic } from './Magnetic';

const NAV_LINKS = [
  { name: 'About',      href: '#about',      icon: AboutIcon },
  { name: 'Projects',   href: '#projects',   icon: ProjectsIcon },
  { name: 'Skills',     href: '#skills',     icon: SkillsIcon },
  { name: 'GitHub',     href: '#github',     icon: OpenSourceIcon },
  { name: 'Experience', href: '#experience', icon: ExpIcon },
  { name: 'Contact',    href: '#contact',    icon: ContactIcon },
];

const SECTION_IDS = ['about', 'projects', 'skills', 'github', 'experience', 'contact'];

/* ── SVG icons for the bottom nav ──────────────────── */
function OpenSourceIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
function AboutIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function ProjectsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function SkillsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
function ExpIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function ContactIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function MonogramLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Ali Abu Fadaleh">
      <path
        d="M16 4 L6 26 L11 26 L13.5 20 L18.5 20 L21 26 L26 26 L16 4Z M14.5 16 L16 11.5 L17.5 16Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

/* ── Mobile Bottom Navigation ───────────────────────── */
function MobileBottomNav({
  activeSection,
  prefersReducedMotion,
}: {
  activeSection: string;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.nav
      initial={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Mobile navigation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Frosted glass bar */}
      <div
        className="mx-3 mb-3 rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-base) 85%, transparent)',
          backdropFilter: 'blur(20px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
          borderColor: 'var(--border-hover)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12), 0 0 0 1px var(--border)',
        }}
      >
        <div className="flex items-center">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center justify-center flex-1 py-3 gap-0.5 transition-colors duration-200"
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                aria-label={link.name}
                data-cursor="pointer"
              >
                {/* Active pill indicator sliding beneath */}
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: 'var(--accent-glow)' }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 34 }
                    }
                  />
                )}
                <motion.span
                  className="relative z-10"
                  whileTap={prefersReducedMotion ? {} : { scale: 0.82 }}
                  animate={isActive ? { scale: 1, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon active={isActive} />
                </motion.span>
                <span
                  className="relative z-10 font-medium whitespace-nowrap"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

/* ── Main Navbar ────────────────────────────────────── */
export function Navbar({ resumeUrl = '/resume.pdf' }: { resumeUrl?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'border-b' : 'border-b border-transparent'}`}
        style={{
          backgroundColor: scrolled
            ? 'color-mix(in srgb, var(--bg-base) 92%, transparent)'
            : 'transparent',
          borderColor: scrolled ? 'var(--border)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.5)' : 'none',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between px-6 sm:px-8"
          style={{
            height: scrolled ? '56px' : '68px',
            maxWidth: '1280px',
            transition: 'height 0.3s ease',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            aria-label="Home"
            className="flex items-center gap-2 group"
            data-cursor="pointer"
          >
            <MonogramLogo />
            <span
              className="text-sm font-semibold tracking-widest uppercase hidden sm:block"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              AF
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <Magnetic key={link.href} range={45}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 block ${
                      isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    data-cursor="pointer"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-surface-2)' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                </Magnetic>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Resume — desktop only */}
            <a
              href={resumeUrl}
              download
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              data-cursor="pointer"
            >
              Resume
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation — replaces hamburger entirely */}
      <MobileBottomNav
        activeSection={activeSection}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  );
}
