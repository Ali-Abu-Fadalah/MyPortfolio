'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { PortfolioProject } from '@/lib/sanity';
import { useMobileDetect } from '@/hooks/useMobileDetect';

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Developer Tools': 'linear-gradient(135deg, rgba(108,99,255,0.13), rgba(108,99,255,0.27))',
  'Web Development': 'linear-gradient(135deg, rgba(6,182,212,0.13), rgba(6,182,212,0.27))',
  'Blockchain': 'linear-gradient(135deg, rgba(245,158,11,0.13), rgba(245,158,11,0.27))',
  'AI': 'linear-gradient(135deg, rgba(16,185,129,0.13), rgba(16,185,129,0.27))',
  'default': 'linear-gradient(135deg, rgba(108,99,255,0.09), rgba(75,68,204,0.18))',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Developer Tools': '#8A83FF',
  'Web Development': '#22d3ee',
  'Blockchain': '#fbbf24',
  'AI': '#34d399',
  'default': '#8A83FF',
};

interface ProjectCardProps {
  project: PortfolioProject;
  mobileIndex?: number;
}

/* Opens a URL safely in a new tab — works on both mobile and desktop */
function openLink(url: string, e: React.MouseEvent) {
  e.stopPropagation();
  e.preventDefault();
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function ProjectCard({ project, mobileIndex = 0 }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, mounted } = useMobileDetect();

  const gradient = CATEGORY_GRADIENTS[project.category] ?? CATEGORY_GRADIENTS['default'];
  const accentColor = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS['default'];
  const initial = (project.category?.charAt(0) ?? 'P').toUpperCase();

  // Alternating entrance: odd cards from bottom (+40), even from slightly above (-20)
  const mobileCardVariants = {
    hidden: {
      opacity: 0,
      y: mobileIndex % 2 === 0 ? 36 : -16,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 120,
        damping: 18,
        delay: mobileIndex * 0.06,
      },
    },
  };

  const desktopCardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={mounted && isMobile ? mobileCardVariants : desktopCardVariants}
      whileHover={(!mounted || !isMobile) && !prefersReducedMotion ? { y: -6, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        if (mounted && isMobile) return;
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--accent)';
        el.style.boxShadow = '0 8px 32px rgba(108,99,255,0.15)';
      }}
      onMouseLeave={(e) => {
        if (mounted && isMobile) return;
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Gradient header — taller on mobile */}
      <div
        className="w-full flex items-center justify-center relative overflow-hidden flex-shrink-0 shimmer-hint"
        style={{
          background: gradient,
          height: mounted && isMobile ? '200px' : '160px',
        }}
      >
        <span
          className="font-black select-none opacity-20"
          style={{
            color: accentColor,
            fontFamily: 'var(--font-display)',
            fontSize: mounted && isMobile ? '100px' : '96px',
          }}
        >
          {initial}
        </span>
        <div className="absolute top-3 left-3 pointer-events-none">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              color: accentColor,
              borderColor: `${accentColor}66`,
              backgroundColor: `${accentColor}1A`,
            }}
          >
            {project.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-5 sm:p-6">
        <h3
          className="text-lg font-bold mb-3 transition-colors duration-200 group-hover:text-[color:var(--accent)]"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed flex-grow line-clamp-3 mb-5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {project.description}
        </p>

        {/* Tech pills */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md border"
                style={{
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-surface-2)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* ── Links — isolated from outer motion.div gesture capture ── */}
        <div
          className="flex items-center gap-4 pt-4 mt-auto border-t relative z-10"
          style={{ borderColor: 'var(--border)' }}
          /* Stop the card's motion gesture from intercepting link taps */
          onClick={(e) => e.stopPropagation()}
        >
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors duration-200"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
              }}
              data-cursor="pointer"
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              onClick={(e) => openLink(project.githubUrl!, e)}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'var(--accent)';
                el.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'var(--text-secondary)';
                el.style.borderColor = 'var(--border)';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub
            </motion.a>
          )}
          {project.videoUrl && (
            <motion.a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors duration-200"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
              }}
              data-cursor="pointer"
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              onClick={(e) => openLink(project.videoUrl!, e)}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'var(--accent)';
                el.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'var(--text-secondary)';
                el.style.borderColor = 'var(--border)';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
