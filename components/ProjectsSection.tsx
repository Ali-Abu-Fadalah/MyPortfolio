'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { CategoryFilter } from './CategoryFilter';
import { GlowOrb } from './GlowOrb';
import { PortfolioProject } from '@/lib/sanity';

interface ProjectsSectionProps {
  projects: PortfolioProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
    [projects]
  );

  const filteredProjects = useMemo(
    () => (activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory)),
    [projects, activeCategory]
  );

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeInUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
      };

  return (
    <section
      id="projects"
      className="relative py-20 md:py-28 px-6 sm:px-8 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <GlowOrb
        size={400}
        color="var(--accent-dim)"
        blur={140}
        opacity={0.06}
        animationClass="animate-orb-1"
        className="top-1/2 left-0 -translate-y-1/2 -translate-x-1/2"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section label */}
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
          // selected work
        </motion.p>

        <motion.h2
          {...{ ...fadeInUp, transition: { duration: 0.6, delay: 0.05 } }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Featured Projects
        </motion.h2>

        <motion.p
          {...{ ...fadeInUp, transition: { duration: 0.6, delay: 0.1 } }}
          className="text-center mb-10 max-w-xl mx-auto text-sm sm:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          A showcase of developer tools, applications, and systems engineered for performance and reliability.
        </motion.p>

        {/* Filter tabs — only if 2+ categories */}
        {categories.length > 1 && (
          <motion.div
            {...{ ...fadeInUp, transition: { duration: 0.5, delay: 0.15 } }}
            className="mb-10"
          >
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </motion.div>
        )}

        {/* Animated project grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Count footer */}
        <motion.p
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true },
                transition: { duration: 0.4, delay: 0.3 },
              })}
          className="text-center mt-8 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          Showing {filteredProjects.length} of {projects.length} projects
        </motion.p>
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
