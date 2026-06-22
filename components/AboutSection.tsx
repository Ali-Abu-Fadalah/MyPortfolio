'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { GlowOrb } from './GlowOrb';
import { Profile } from '@/lib/sanity';

export function AboutSection({ profile }: { profile: Profile }) {
  const prefersReducedMotion = useReducedMotion();

  const codeSnippet = profile.aboutCodeSnippet || {
    name: "Placeholder",
    role: "Role",
    focus: [],
    available: false,
    location: "Location",
  };

  const CODE_LINES = [
    { indent: 0, content: [{ type: 'keyword', text: 'const ' }, { type: 'variable', text: 'ali' }, { type: 'plain', text: ' = {' }] },
    { indent: 1, content: [{ type: 'property', text: 'name' }, { type: 'plain', text: ': ' }, { type: 'string', text: `"${codeSnippet.name}"` }, { type: 'plain', text: ',' }] },
    { indent: 1, content: [{ type: 'property', text: 'role' }, { type: 'plain', text: ': ' }, { type: 'string', text: `"${codeSnippet.role}"` }, { type: 'plain', text: ',' }] },
    { indent: 1, content: [{ type: 'property', text: 'focus' }, { type: 'plain', text: ': [' }] },
    { indent: 2, content: codeSnippet.focus?.flatMap((item, i, arr) => [
      { type: 'string', text: `"${item}"` },
      ...(i < arr.length - 1 ? [{ type: 'plain', text: ', ' }] : []),
    ]) || [] },
    { indent: 1, content: [{ type: 'plain', text: '],' }] },
    { indent: 1, content: [{ type: 'property', text: 'available' }, { type: 'plain', text: ': ' }, { type: 'boolean', text: codeSnippet.available ? 'true' : 'false' }, { type: 'plain', text: ',' }] },
    { indent: 1, content: [{ type: 'property', text: 'location' }, { type: 'plain', text: ': ' }, { type: 'string', text: `"${codeSnippet.location}"` }, { type: 'plain', text: ',' }] },
    { indent: 0, content: [{ type: 'plain', text: '};' }] },
  ];

  const TOKEN_COLORS: Record<string, string> = {
    keyword: '#C792EA',
    variable: '#82AAFF',
    property: '#F78C6C',
    string: '#C3E88D',
    boolean: '#FF9CAC',
    plain: '#8888AA',
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

  return (
    <section
      id="about"
      className="relative py-20 md:py-28 px-6 sm:px-8 overflow-hidden"
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
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.5 },
              })}
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          // about me
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — Text */}
          <motion.div {...slideLeft}>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Turning complex systems into{' '}
              <span style={{ color: 'var(--accent)' }}>elegant</span>{' '}
              solutions
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              I&apos;m a Computer Science graduate specializing in enterprise-grade web systems,
              AI integrations, and high-performance frontend experiences. I obsess over the
              intersection of speed, design, and developer experience.
            </p>

            <p
              className="text-sm sm:text-base leading-relaxed mb-10"
              style={{ color: 'var(--text-muted)' }}
            >
              When I&apos;m not building, I&apos;m exploring bleeding-edge tools — from 3D WebGL
              experiences to multi-agent AI pipelines. I believe great software feels
              as good as it performs.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {profile.aboutStats?.map(({ target, suffix, label }) => (
                <div
                  key={label}
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    <AnimatedCounter target={target} suffix={suffix} duration={1600} />
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse bg-emerald-500" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {profile.availabilityText || 'Available for new opportunities'}
              </span>
            </div>
          </motion.div>

          {/* RIGHT — Code card */}
          <motion.div {...slideRight} className="relative">
            <div
              className="rounded-2xl border overflow-hidden shadow-2xl"
              style={{ backgroundColor: '#0D0D14', borderColor: 'var(--border)' }}
            >
              {/* macOS traffic lights */}
              <div
                className="flex items-center gap-2 px-5 py-3.5 border-b"
                style={{ borderColor: 'var(--border)', backgroundColor: '#0A0A10' }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
                <span
                  className="ml-3 text-xs"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  profile.ts
                </span>
              </div>

              {/* Code lines */}
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm leading-7" style={{ fontFamily: 'var(--font-mono)' }}>
                  {CODE_LINES.map((line, li) => (
                    <div key={li}>
                      <span
                        className="select-none mr-6 text-xs"
                        style={{
                          color: 'var(--text-muted)',
                          minWidth: '1.5rem',
                          display: 'inline-block',
                          textAlign: 'right',
                        }}
                      >
                        {li + 1}
                      </span>
                      {'  '.repeat(line.indent)}
                      {line.content.map((token, ti) => (
                        <span key={ti} style={{ color: TOKEN_COLORS[token.type] ?? TOKEN_COLORS.plain }}>
                          {token.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
