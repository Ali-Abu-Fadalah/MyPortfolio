'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Experience } from '@/lib/sanity';
import { GlowOrb } from './GlowOrb';

interface TimelineProps {
  experiences: Experience[];
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

export function Timeline({ experiences }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();

  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
  );

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
          // journey
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
          Professional Journey
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
          className="text-center mb-16 text-sm sm:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          A timeline of my professional roles, projects, and educational milestones.
        </motion.p>

        {/* Timeline */}
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
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* NOW indicator */}
          <div className="relative pl-14 mt-8">
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
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>— Building &amp; growing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
