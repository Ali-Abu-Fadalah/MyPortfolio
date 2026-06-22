'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Skill } from '@/lib/sanity';
import { GlowOrb } from './GlowOrb';

interface TechStackProps {
  skills: Skill[];
}

const CATEGORY_ORDER = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps & Tools',
  'AI & Machine Learning',
];

export function TechStack({ skills }: TechStackProps) {
  const prefersReducedMotion = useReducedMotion();

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoriesToRender = [
    ...CATEGORY_ORDER.filter((c) => groupedSkills[c]?.length > 0),
    ...Object.keys(groupedSkills).filter(
      (c) => !CATEGORY_ORDER.includes(c) && groupedSkills[c].length > 0
    ),
  ];

  // Duplicate for seamless CSS marquee loop
  const allSkillTitles = skills.map((s) => s.title);
  const marqueeItems = [...allSkillTitles, ...allSkillTitles];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 16 },
    },
  };

  return (
    <section
      id="skills"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <GlowOrb
        size={350}
        color="var(--accent)"
        blur={120}
        opacity={0.07}
        animationClass="animate-orb-1"
        className="top-1/2 right-0 -translate-y-1/2"
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
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
          // technical arsenal
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
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Tech Stack
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
          className="text-center mb-14 max-w-xl mx-auto text-sm sm:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          Languages, frameworks, databases, and tools I build modern software with.
        </motion.p>

        {/* Category cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {categoriesToRender.map((category) => (
            <motion.div
              key={category}
              variants={cardVariants}
              className="relative p-6 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')
              }
            >
              {/* Accent left border line */}
              <div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />

              <h3
                className="text-base font-bold mb-4 pl-4"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {category}
              </h3>

              <div className="flex flex-wrap gap-2 pl-4">
                {groupedSkills[category].map((skill) => (
                  <motion.span
                    key={skill._id}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border cursor-default select-none"
                    style={{
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border-hover)',
                      backgroundColor: 'var(--bg-surface)',
                      fontFamily: 'var(--font-mono)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'var(--accent)';
                      el.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'var(--text-secondary)';
                      el.style.borderColor = 'var(--border-hover)';
                    }}
                  >
                    {skill.title}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Marquee strip — hidden for reduced motion */}
      {!prefersReducedMotion && marqueeItems.length > 0 && (
        <div className="mt-16 relative overflow-hidden" aria-hidden="true">
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--bg-surface), transparent)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--bg-surface), transparent)' }}
          />
          <div className="flex animate-marquee whitespace-nowrap">
            {marqueeItems.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 mx-5 text-sm font-medium"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                <span style={{ color: 'var(--accent)' }}>▸</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
