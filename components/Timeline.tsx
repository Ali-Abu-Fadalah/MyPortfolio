'use client';

import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Experience, Profile } from '@/lib/sanity';
import { GlowOrb } from './GlowOrb';
import { useMobileDetect } from '@/hooks/useMobileDetect';

interface TimelineProps {
  experiences: Experience[];
  profile: Profile;
}

function BriefcaseIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-8-2h4v2h-4V5zm8 14H4V9h16v10z" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
    </svg>
  );
}

/* ── Mobile alternating timeline card ──────────────────── */
function MobileTimelineCard({
  exp,
  index,
  prefersReducedMotion,
}: {
  exp: Experience;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const isWork = exp.type === 'Work';
  const nodeColor = isWork ? '#6C63FF' : '#8B5CF6';
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      key={exp._id}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '20px' }}
      transition={{
        type: 'spring',
        stiffness: 90,
        damping: 18,
        delay: index * 0.04,
      }}
      className="relative flex items-start w-full"
    >
      {/* Center node */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10">
        <div
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: nodeColor,
            color: nodeColor,
          }}
        >
          {isWork ? <BriefcaseIcon /> : <GraduationIcon />}
        </div>
      </div>

      {/* Card — alternates left / right */}
      <div
        className={`w-[calc(50%-28px)] ${isLeft ? 'mr-auto pr-3' : 'ml-auto pl-3'}`}
      >
        <div
          className="p-4 rounded-xl border flex flex-col"
          style={{
            backgroundColor: 'var(--bg-surface-2)',
            borderColor: 'var(--border)',
            borderLeft: isLeft ? `3px solid ${nodeColor}` : undefined,
            borderRight: !isLeft ? `3px solid ${nodeColor}` : undefined,
          }}
        >
          {/* Date at top on mobile */}
          <span
            className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border mb-2 self-start"
            style={{
              color: 'var(--text-muted)',
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg-surface)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {exp.dateRange}
          </span>

          <h3
            className="text-sm font-bold leading-tight mb-0.5"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {exp.role}
          </h3>
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            {exp.organization}
          </p>

          <div
            className={`text-xs leading-relaxed relative ${expanded ? '' : 'line-clamp-2'}`}
            style={{ color: 'var(--text-muted)' }}
          >
            {exp.description}
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] font-semibold mt-1 self-start flex items-center gap-1"
            style={{ color: nodeColor, fontFamily: 'var(--font-mono)' }}
          >
            {expanded ? 'Less ▴' : 'More ▾'}
          </button>

          {/* Type badge */}
          <span
            className="inline-block mt-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border self-start"
            style={{
              color: nodeColor,
              borderColor: `${nodeColor}40`,
              backgroundColor: `${nodeColor}12`,
            }}
          >
            {exp.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Timeline({ experiences, profile }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, mounted } = useMobileDetect();
  const safeNowText = profile.timelineNowText || '— Building & growing';

  const sortedExperiences = [...experiences].sort((a, b) => {
    const orderDiff = (b.order ?? 0) - (a.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 90, damping: 16 },
    },
  };

  return (
    <section
      id="experience"
      className="relative py-20 md:py-28 px-6 sm:px-8 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <GlowOrb
        size={300}
        color="var(--accent-dim)"
        blur={110}
        opacity={0.07}
        animationClass="animate-orb-2"
        className="bottom-1/4 left-0 -translate-x-1/2"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.p
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.5 },
              })}
          className="text-xs font-semibold tracking-widest uppercase mb-3 text-center"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          {'// journey'}
        </motion.p>

        <motion.h2
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.05 },
              })}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {(profile.experienceHeadline || 'Professional Journey').split(/\*(.*?)\*/g).map((part, i) =>
            i % 2 === 1 ? <span key={i} style={{ color: 'var(--accent)' }}>{part}</span> : part
          )}
        </motion.h2>

        <motion.p
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.1 },
              })}
          className="text-center mb-12 text-sm sm:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.experienceSubheadline || 'A timeline of my professional roles, projects, and educational milestones.'}
        </motion.p>

        {/* ════════════════════════════════════════════════
            MOBILE LAYOUT — Center-pinned alternating cards
            ════════════════════════════════════════════════ */}
        {mounted && isMobile && (
          <div className="relative">
            {/* Center connector line with traveling glow */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px]" style={{ backgroundColor: 'var(--border-hover)' }}>
              {!prefersReducedMotion && (
                <div
                  className="absolute inset-0 w-full rounded-full"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)',
                    backgroundSize: '100% 60px',
                    animation: 'glow-travel 3s linear infinite',
                    opacity: 0.6,
                  }}
                />
              )}
            </div>

            {/* Alternating cards */}
            <div className="flex flex-col gap-8">
              {/* NOW indicator */}
              <div className="flex flex-col items-center mb-0">
                <div
                  className="py-2.5 px-4 rounded-full border inline-flex items-center gap-3 relative z-10"
                  style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--accent)' }}
                >
                  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse bg-emerald-500" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Now</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{safeNowText}</span>
                  </div>
                </div>
                <div className="w-[2px] h-8 mt-0" style={{ backgroundColor: 'var(--border-hover)' }} />
              </div>

              {sortedExperiences.map((exp, index) => (
                <MobileTimelineCard
                  key={exp._id}
                  exp={exp}
                  index={index}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            DESKTOP LAYOUT — Left-pinned line (unchanged)
            ════════════════════════════════════════════════ */}
        {(!mounted || !isMobile) && (
          <div className="relative">
            {/* Animated connector line */}
            <motion.div
              initial={prefersReducedMotion ? {} : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute left-5 top-0 bottom-0 w-px origin-top"
              style={{ backgroundColor: 'var(--border-hover)' }}
            />

            {/* NOW indicator */}
            <div className="relative pl-14 mb-8">
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--accent)' }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse bg-emerald-500" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              </div>
              <div
                className="py-3 px-5 rounded-2xl border inline-flex items-center gap-2"
                style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Now</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{safeNowText}</span>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="space-y-8"
            >
              {sortedExperiences.map((exp) => {
                const isWork = exp.type === 'Work';
                const nodeColor = isWork ? '#6C63FF' : '#8B5CF6';

                return (
                  <motion.div key={exp._id} variants={itemVariants} className="relative pl-14">
                    {/* Node icon */}
                    <div
                      className="absolute left-0 top-3 w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: nodeColor,
                        color: nodeColor,
                      }}
                    >
                      {isWork ? <BriefcaseIcon /> : <GraduationIcon />}
                    </div>

                    {/* Card */}
                    <div
                      className="p-5 sm:p-6 rounded-2xl border"
                      style={{
                        backgroundColor: 'var(--bg-surface-2)',
                        borderColor: 'var(--border)',
                        borderLeft: `3px solid ${nodeColor}`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div>
                          <h3
                            className="text-base font-bold"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                          >
                            {exp.role}
                          </h3>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {exp.organization}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-md border"
                            style={{
                              color: 'var(--text-muted)',
                              borderColor: 'var(--border)',
                              backgroundColor: 'var(--bg-surface)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {exp.dateRange}
                          </span>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                            style={{
                              color: nodeColor,
                              borderColor: `${nodeColor}40`,
                              backgroundColor: `${nodeColor}12`,
                            }}
                          >
                            {exp.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {exp.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
