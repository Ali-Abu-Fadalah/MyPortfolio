'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { GlowOrb } from './GlowOrb';
import { Profile } from '@/lib/sanity';
import { useMobileDetect } from '@/hooks/useMobileDetect';

export function AboutSection({ profile }: { profile: Profile }) {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, mounted } = useMobileDetect();
  const [activeTab, setActiveTab] = useState<'about' | 'code'>('about');
  const [codeExpanded, setCodeExpanded] = useState(false);

  const codeSnippet = profile.aboutCodeSnippet || {
    name: 'Placeholder',
    role: 'Role',
    focus: [],
    available: false,
    location: 'Location',
  };

  const CODE_LINES = [
    { indent: 0, content: [{ type: 'keyword', text: 'const ' }, { type: 'variable', text: 'ali' }, { type: 'plain', text: ' = {' }] },
    { indent: 1, content: [{ type: 'property', text: 'name' }, { type: 'plain', text: ': ' }, { type: 'string', text: `"${codeSnippet.name}"` }, { type: 'plain', text: ',' }] },
    { indent: 1, content: [{ type: 'property', text: 'role' }, { type: 'plain', text: ': ' }, { type: 'string', text: `"${codeSnippet.role}"` }, { type: 'plain', text: ',' }] },
    { indent: 1, content: [{ type: 'property', text: 'focus' }, { type: 'plain', text: ': [' }] },
    {
      indent: 2, content: codeSnippet.focus?.flatMap((item: string, i: number, arr: string[]) => [
        { type: 'string', text: `"${item}"` },
        ...(i < arr.length - 1 ? [{ type: 'plain', text: ', ' }] : []),
      ]) || [],
    },
    { indent: 1, content: [{ type: 'plain', text: '],' }] },
    { indent: 1, content: [{ type: 'property', text: 'available' }, { type: 'plain', text: ': ' }, { type: 'boolean', text: codeSnippet.available ? 'true' : 'false' }, { type: 'plain', text: ',' }] },
    { indent: 1, content: [{ type: 'property', text: 'location' }, { type: 'plain', text: ': ' }, { type: 'string', text: `"${codeSnippet.location}"` }, { type: 'plain', text: ',' }] },
    { indent: 0, content: [{ type: 'plain', text: '};' }] },
  ];

  const TOKEN_COLORS: Record<string, string> = {
    keyword: 'var(--token-keyword)',
    variable: 'var(--token-variable)',
    property: 'var(--token-property)',
    string: 'var(--token-string)',
    boolean: 'var(--token-boolean)',
    plain: 'var(--token-plain)',
  };

  const slideLeft = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -32 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      };

  const slideRight = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 32 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 },
      };

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
      };

  /* ── Code editor card (shared between mobile & desktop) ── */
  const CodeEditorCard = ({ expandable = false }: { expandable?: boolean }) => (
    <div
      className="rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-300"
      style={{ backgroundColor: 'var(--code-bg)', borderColor: 'var(--border)' }}
    >
      {/* macOS traffic lights */}
      <div
        className="flex items-center gap-2 px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--code-header-bg)' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
        <span className="ml-3 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          profile.ts
        </span>
        {expandable && (
          <button
            onClick={() => setCodeExpanded(!codeExpanded)}
            className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors duration-200"
            style={{
              color: 'var(--accent)',
              borderColor: 'var(--accent)',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {codeExpanded ? '▲ collapse' : '▼ expand'}
          </button>
        )}
      </div>

      {/* Code lines */}
      <div className="p-5 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <pre className="text-sm leading-7" style={{ fontFamily: 'var(--font-mono)', minWidth: 'max-content' }}>
          {/* Always show first line */}
          {CODE_LINES.slice(0, 1).map((line, li) => (
            <div key={li}>
              <span className="select-none mr-6 text-xs" style={{ color: 'var(--text-muted)', minWidth: '1.5rem', display: 'inline-block', textAlign: 'right' }}>
                {li + 1}
              </span>
              {'  '.repeat(line.indent)}
              {line.content.map((token, ti) => (
                <span key={ti} style={{ color: TOKEN_COLORS[token.type] ?? TOKEN_COLORS.plain }}>{token.text}</span>
              ))}
            </div>
          ))}

          {/* Expandable lines on mobile, always shown on desktop */}
          <AnimatePresence initial={false}>
            {(!expandable || codeExpanded) && (
              <motion.div
                key="code-body"
                initial={expandable && !prefersReducedMotion ? { height: 0, opacity: 0 } : false}
                animate={{ height: 'auto', opacity: 1 }}
                exit={expandable && !prefersReducedMotion ? { height: 0, opacity: 0 } : {}}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                {CODE_LINES.slice(1).map((line, li) => (
                  <motion.div
                    key={li + 1}
                    initial={expandable && !prefersReducedMotion ? { opacity: 0, x: -8 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: li * 0.05, duration: 0.3 }}
                  >
                    <span className="select-none mr-6 text-xs" style={{ color: 'var(--text-muted)', minWidth: '1.5rem', display: 'inline-block', textAlign: 'right' }}>
                      {li + 2}
                    </span>
                    {'  '.repeat(line.indent)}
                    {line.content.map((token, ti) => (
                      <span key={ti} style={{ color: TOKEN_COLORS[token.type] ?? TOKEN_COLORS.plain }}>{token.text}</span>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed hint */}
          {expandable && !codeExpanded && (
            <div className="opacity-40">
              <span className="select-none mr-6 text-xs" style={{ color: 'var(--text-muted)', minWidth: '1.5rem', display: 'inline-block', textAlign: 'right' }}>
                …
              </span>
              <span style={{ color: 'var(--text-muted)' }}>// tap to expand</span>
            </div>
          )}
        </pre>
      </div>
    </div>
  );

  /* ── Mobile availability badge with sonar ring ─────── */
  const AvailabilityBadge = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border ${mobile ? 'relative' : ''}`}
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <span className="relative flex h-2.5 w-2.5">
        {mobile && !prefersReducedMotion && (
          <span className="sonar-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500" />
        )}
        <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse bg-emerald-500" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {profile.availabilityText || 'Available for new opportunities'}
      </span>
    </div>
  );

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 px-6 sm:px-8 overflow-x-clip overflow-y-visible"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <GlowOrb
        size={350}
        color="var(--accent)"
        blur={130}
        opacity={0.07}
        animationClass="animate-orb-2"
        className="top-1/2 right-0 -translate-y-1/2"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.p
          {...fadeUp}
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          // about me
        </motion.p>

        {/* ════════════════════════════════════════════════
            MOBILE LAYOUT — Tab switcher
            ════════════════════════════════════════════════ */}
        {mounted && isMobile && (
          <>
            {/* Section headline */}
            <h2
              className="text-3xl font-bold tracking-tight mb-5 leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {(profile.aboutHeadline || 'Turning complex systems into *elegant* solutions')
                .split(/\*(.*?)\*/g)
                .map((part, i) =>
                  i % 2 === 1 ? <span key={i} style={{ color: 'var(--accent)' }}>{part}</span> : part
                )}
            </h2>

            {/* Tab pill switcher */}
            <div
              className="flex rounded-xl border p-1 mb-6"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
              {(['about', 'code'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 capitalize"
                  style={{ color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  data-cursor="pointer"
                >
                  {activeTab === tab && (
                    <motion.span
                      layoutId="about-tab-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: 'var(--bg-surface-2)' }}
                      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab === 'about' ? '👤 About' : '💻 Code'}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  key="about-tab"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Bio paragraphs */}
                  {profile.aboutBio?.split('\n').filter((p: string) => p.trim()).map((paragraph: string, index: number, arr: string[]) => (
                    <p
                      key={index}
                      className={`leading-relaxed ${
                        index === 0
                          ? 'text-base mb-5'
                          : `text-sm ${index === arr.length - 1 ? 'mb-6' : 'mb-4'}`
                      }`}
                      style={{ color: index === 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                    >
                      {paragraph}
                    </p>
                  ))}

                  {/* Mobile stats — horizontal snap strip */}
                  {profile.aboutStats && profile.aboutStats.length > 0 && (
                    <div className="snap-scroll-x pb-2 mb-6 -mx-6 px-6">
                      {profile.aboutStats.map(({ target, suffix, label }: { target: number; suffix: string; label: string }) => (
                        <div
                          key={label}
                          className="snap-item shimmer-hint flex-shrink-0 p-4 rounded-xl border mr-3"
                          style={{
                            width: '130px',
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          <div
                            className="text-2xl font-bold mb-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                          >
                            <AnimatedCounter target={target} suffix={suffix} duration={1600} />
                          </div>
                          <div className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Availability badge with sonar ring */}
                  <AvailabilityBadge mobile />
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  key="code-tab"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CodeEditorCard expandable />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ════════════════════════════════════════════════
            DESKTOP LAYOUT — Side-by-side grid (unchanged)
            ════════════════════════════════════════════════ */}
        {(!mounted || !isMobile) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Text */}
            <motion.div {...slideLeft}>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {(profile.aboutHeadline || 'Turning complex systems into *elegant* solutions').split(/\*(.*?)\*/g).map((part, i) =>
                  i % 2 === 1 ? <span key={i} style={{ color: 'var(--accent)' }}>{part}</span> : part
                )}
              </h2>

              {profile.aboutBio?.split('\n').filter((p: string) => p.trim()).map((paragraph: string, index: number, arr: string[]) => (
                <p
                  key={index}
                  className={`leading-relaxed ${
                    index === 0
                      ? 'text-base sm:text-lg mb-6'
                      : `text-sm sm:text-base ${index === arr.length - 1 ? 'mb-10' : 'mb-6'}`
                  }`}
                  style={{ color: index === 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                >
                  {paragraph}
                </p>
              ))}

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {profile.aboutStats?.map(({ target, suffix, label }: { target: number; suffix: string; label: string }) => (
                  <div
                    key={label}
                    className="p-5 rounded-xl border"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                  >
                    <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      <AnimatedCounter target={target} suffix={suffix} duration={1600} />
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>

              <AvailabilityBadge />
            </motion.div>

            {/* RIGHT — Code card */}
            <motion.div {...slideRight} className="relative">
              <CodeEditorCard />
            </motion.div>
          </div>
        )}
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
