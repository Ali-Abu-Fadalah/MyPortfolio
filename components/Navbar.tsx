'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Magnetic } from './Magnetic';

const NAV_LINKS = [
  { name: 'About',      href: '#about' },
  { name: 'Projects',   href: '#projects' },
  { name: 'Skills',     href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact',    href: '#contact' },
];

const SECTION_IDS = ['about', 'projects', 'skills', 'experience', 'contact'];

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

export function Navbar({ resumeUrl = '/resume.pdf' }: { resumeUrl?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
          onClick={() => setIsOpen(false)}
          aria-label="Home"
          className="flex items-center gap-2 group"
          data-cursor="pointer"
        >
          <MonogramLogo />
          <span
            className="text-sm font-semibold tracking-widest uppercase hidden sm:block"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            AAF
          </span>
        </Link>

        {/* Desktop nav */}
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

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { y: '7px', rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className="block h-[1.5px] rounded-full origin-center"
                style={{ backgroundColor: 'var(--text-primary)' }}
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                className="block h-[1.5px] rounded-full"
                style={{ backgroundColor: 'var(--text-primary)' }}
              />
              <motion.span
                animate={isOpen ? { y: '-7px', rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                className="block h-[1.5px] rounded-full origin-center"
                style={{ backgroundColor: 'var(--text-primary)' }}
              />
            </div>
          </button>
        </div>
      </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
            }
            className="fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
            style={{ backgroundColor: 'var(--bg-base)' }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : i * 0.07 + 0.15,
                  duration: 0.3,
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-bold tracking-tight transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : NAV_LINKS.length * 0.07 + 0.15,
                duration: 0.3,
              }}
            >
              <a
                href={resumeUrl}
                download
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 text-base font-semibold rounded-xl border"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
