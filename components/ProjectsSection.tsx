'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { PortfolioProject } from '@/lib/sanity';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

interface ProjectsSectionProps {
  projects: PortfolioProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-12 md:mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-400 text-transparent">
          Featured Projects
        </h2>
        <p className="max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 sm:text-lg leading-relaxed">
          A showcase of recent developer tools, applications, and blockchain solutions engineered for performance and reliability.
        </p>
        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </motion.div>
    </section>
  );
}
