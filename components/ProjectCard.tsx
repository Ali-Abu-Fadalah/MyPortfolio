'use client';

import { motion } from 'framer-motion';
import { PortfolioProject } from '@/lib/sanity';

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

interface ProjectCardProps {
  project: PortfolioProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900/60 dark:to-zinc-950/80 p-6 shadow-md hover:shadow-lg dark:shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/80 hover:from-white hover:to-zinc-100/50 dark:hover:from-zinc-900/80 dark:hover:to-zinc-950"
    >
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-650 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">
            {project.category}
          </span>
        </div>

        <h3 className="text-xl font-bold mt-4 text-zinc-800 group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-white transition-colors duration-200">
          {project.title}
        </h3>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-grow line-clamp-4">
          {project.description}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/30"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white flex items-center gap-1.5 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors duration-200"
            >
              Demo Video
              <svg className="w-3.5 h-3.5 transform translate-y-[0.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
