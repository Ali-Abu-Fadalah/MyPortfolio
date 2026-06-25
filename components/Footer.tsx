'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GlowOrb } from './GlowOrb';
import { Profile } from '@/lib/sanity';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, mounted } = useMobileDetect();
  const [copied, setCopied] = useState(false);

  const fadeUp = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            delay,
          },
        };

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  /* ── Social link component (used in both layouts) ─── */
  const SocialLinks = () => (
    <>
      {/* GitHub */}
      <a
        href={`https://github.com/${profile.githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Profile"
        className="p-3 rounded-xl border transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }}
        data-cursor="pointer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={profile.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn Profile"
        className="p-3 rounded-xl border transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }}
        data-cursor="pointer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </a>

      {/* Email */}
      <a
        href={`mailto:${profile.email}`}
        aria-label="Email"
        className="p-3 rounded-xl border transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }}
        data-cursor="pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </a>
    </>
  );

  return (
    <footer
      id="contact"
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-base)',
        paddingTop: '6rem',
        // Mobile: extra bottom padding for bottom nav
        paddingBottom: mounted && isMobile
          ? 'calc(env(safe-area-inset-bottom) + 96px)'
          : '8rem',
      }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <GlowOrb
        size={mounted && isMobile ? 300 : 500}
        color="var(--accent)"
        blur={mounted && isMobile ? 100 : 160}
        opacity={0.06}
        animationClass="animate-orb-1"
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Large decorative background word */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-black tracking-tighter select-none"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            opacity: 0.025,
            lineHeight: 1,
            // Scale relative to height on mobile, width on desktop
            fontSize: mounted && isMobile ? '18vh' : '18vw',
          }}
        >
          CONTACT
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10 text-center">
        {/* Section label */}
        <motion.p
          {...fadeUp(0)}
          className="text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          {/* // let&apos;s connect */}
        </motion.p>

        {/* Main heading */}
        <motion.h2
          {...fadeUp(0.08)}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {(profile.footerHeadline || "Let's build something *great* together.").split(/\*(.*?)\*/g).map((part, i) =>
            i % 2 === 1 ? <span key={i} style={{ color: 'var(--accent)' }}>{part}</span> : part
          )}
        </motion.h2>

        <motion.p
          {...fadeUp(0.16)}
          className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.footerPitch || 'Available for full-time roles, contract work, and open-source collaborations. Drop me a message or grab my resume.'}
        </motion.p>

        {/* Location */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {profile.footerLocation || 'Available worldwide · Open to relocation'}
          </span>
        </motion.div>

        {/* ════════════════════════════════════════════════
            MOBILE: Full-bleed gradient CTA card
            ════════════════════════════════════════════════ */}
        {mounted && isMobile && (
          <motion.div
            {...fadeUp(0.25)}
            className="mobile-full-bleed rounded-2xl overflow-hidden mb-10"
            style={{
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)',
              border: '1px solid var(--border-hover)',
              boxShadow: '0 0 0 1px var(--border), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="p-6 flex flex-col gap-3">
              {/* Send Email with copy fallback */}
              <div className="relative">
                <motion.a
                  href={`mailto:${profile.email}`}
                  className="flex flex-col items-center justify-center gap-0.5 w-full rounded-xl transition-colors duration-200"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#FFFFFF',
                    height: '60px',
                  }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                >
                  <span className="text-sm font-semibold">Send Email</span>
                  <span className="text-[10px] opacity-70">{profile.email}</span>
                </motion.a>

                {/* Copy email button */}
                <motion.button
                  onClick={handleCopyEmail}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-colors duration-200"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    backdropFilter: 'blur(4px)',
                  }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </motion.button>
              </div>

              <motion.a
                href={profile.resumeUrl || '#'}
                download
                className="flex items-center justify-center gap-2 w-full rounded-xl border transition-colors duration-200"
                style={{
                  borderColor: 'var(--border-hover)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-surface)',
                  height: '56px',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </motion.a>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            DESKTOP: Original CTA buttons
            ════════════════════════════════════════════════ */}
        {(!mounted || !isMobile) && (
          <motion.div
            {...fadeUp(0.25)}
            className="flex flex-wrap items-center justify-center gap-4 mb-14"
          >
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-accent)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
              data-cursor="pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resume
            </a>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            MOBILE: Social icons in glassmorphism pill
            ════════════════════════════════════════════════ */}
        {mounted && isMobile && (
          <motion.div
            {...fadeUp(0.32)}
            className="flex items-center justify-center mb-12"
          >
            <div className="glass-pill flex items-center gap-1 p-2">
              <SocialLinks />
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            DESKTOP: Social icons row
            ════════════════════════════════════════════════ */}
        {(!mounted || !isMobile) && (
          <motion.div
            {...fadeUp(0.32)}
            className="flex items-center justify-center gap-5 mb-16"
          >
            <SocialLinks />
          </motion.div>
        )}

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <p className="w-full sm:w-auto">&copy; {new Date().getFullYear()} {profile.copyrightName}. All rights reserved.</p>
          <p className="w-full sm:w-auto" style={{ fontFamily: 'var(--font-mono)' }}>
            Built with{' '}
            <span style={{ color: 'var(--accent)' }}>Next.js</span>
            {' '}+{' '}
            <span style={{ color: 'var(--accent)' }}>Sanity</span>
            {' '}+{' '}
            <span style={{ color: 'var(--accent)' }}>Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
