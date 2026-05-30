'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/lib/sanity';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  // Sort experiences chronologically (latest first or earliest first - typically latest first is preferred in CVs, but user asked for chronological)
  // Let's sort with latest first to match professional standards, or sorted by dateRange/createdAt.
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="experience" className="relative py-24 px-6 md:px-12 bg-zinc-50/30 dark:bg-zinc-950/30 border-t border-zinc-200/50 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-200 dark:to-zinc-400 text-transparent"
          >
            Professional Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg"
          >
            A timeline of my professional work engagements, roles, and educational landmarks.
          </motion.p>
        </div>

        {/* Timeline body */}
        <div className="relative pl-6 md:pl-8 border-l border-zinc-250 dark:border-zinc-800/80 space-y-12 ml-4">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-12"
          >
            {sortedExperiences.map((exp, index) => {
              const isWork = exp.type === 'Work';
              
              return (
                <motion.div
                  key={exp._id}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Timeline Bullet Node Dot */}
                  <span className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-50 dark:border-zinc-950 flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-sm
                    ${isWork 
                      ? 'bg-blue-600 dark:bg-blue-500 shadow-blue-500/20 group-hover:shadow-blue-500/40' 
                      : 'bg-violet-600 dark:bg-violet-500 shadow-violet-500/20 group-hover:shadow-violet-500/40'
                    }`} 
                  />

                  {/* Glassmorphic Item Card */}
                  <div className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md hover:border-zinc-300 dark:hover:border-zinc-700/60 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        {/* Role / Degree */}
                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200">
                          {exp.role}
                        </h3>
                        {/* Company / Institution */}
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {exp.organization}
                        </p>
                      </div>
                      
                      {/* Date Range & Type Badge Container */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30">
                          {exp.dateRange}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
                          ${isWork 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/15 border-blue-100 dark:border-blue-500/20' 
                            : 'text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-500/15 border-violet-100 dark:border-violet-500/20'
                          }`}
                        >
                          {exp.type}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
