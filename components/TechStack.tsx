'use client';

import { motion } from 'framer-motion';
import { Skill } from '@/lib/sanity';

interface TechStackProps {
  skills: Skill[];
}

const CATEGORY_ORDER = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps & Tools',
  'AI & Machine Learning'
];

export function TechStack({ skills }: TechStackProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Filter out any categories that don't have skills, but maintain order
  const categoriesToRender = CATEGORY_ORDER.filter(
    (cat) => groupedSkills[cat] && groupedSkills[cat].length > 0
  );

  // Add any other categories that might not be in the order array
  Object.keys(groupedSkills).forEach((cat) => {
    if (!categoriesToRender.includes(cat) && groupedSkills[cat].length > 0) {
      categoriesToRender.push(cat);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="skills" className="relative py-24 px-6 md:px-12 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-200/50 dark:border-zinc-900 transition-colors duration-300">
      {/* Decorative gradient background elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/5 dark:bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 text-transparent"
          >
            Technical Arsenal
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg"
          >
            A curated list of languages, frameworks, databases, and DevOps utilities I construct modern software with.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {categoriesToRender.map((category) => (
            <motion.div
              key={category}
              variants={cardVariants}
              className="relative p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-250 dark:border-zinc-800/80 backdrop-blur-md overflow-hidden group hover:border-zinc-350 dark:hover:border-zinc-700/60 hover:shadow-md transition-all duration-300"
            >
              {/* Highlight background light overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-200/10 dark:from-zinc-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 rounded-full bg-blue-500" />
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{category}</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {groupedSkills[category].map((skill) => (
                  <motion.div
                    key={skill._id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                    className="group px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100/40 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(59,130,246,0.06)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-xl cursor-default flex items-center gap-2 select-none transition-all duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors" />
                    {skill.title}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
