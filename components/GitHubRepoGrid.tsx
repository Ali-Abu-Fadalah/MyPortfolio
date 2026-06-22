'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

function getLanguageColor(lang: string | null): string {
  if (!lang) return '#8888AA';
  const colors: Record<string, string> = {
    typescript: '#3178C6',
    javascript: '#F7DF1E',
    rust: '#CE422B',
    go: '#00ADD8',
    python: '#3776AB',
    html: '#E34F26',
    css: '#563D7C',
  };
  return colors[lang.toLowerCase()] ?? '#6C63FF';
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

interface GitHubRepoGridProps {
  repos: GitHubRepo[];
  githubUsername: string;
}

export function GitHubRepoGrid({ repos }: GitHubRepoGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {repos.map((repo) => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          variants={cardVariants}
          whileHover={prefersReducedMotion ? {} : { y: -5 }}
          className="group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--accent)';
            el.style.boxShadow = '0 8px 32px rgba(108,99,255,0.12)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--border)';
            el.style.boxShadow = 'none';
          }}
          data-cursor="pointer"
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <div
                className="p-2 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </div>
              <svg
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: 'var(--accent)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>

            <h3
              className="font-bold mb-2 truncate group-hover:text-[color:var(--accent)] transition-colors"
              style={
                { color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }
              }
            >
              {repo.name}
            </h3>

            <p
              className="text-sm line-clamp-2 mb-5 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {repo.description ?? 'No description provided.'}
            </p>
          </div>

          <div
            className="flex items-center gap-4 text-xs border-t pt-4"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span>{repo.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              {repo.stargazers_count}
            </div>
            <span className="ml-auto text-[11px]">{formatDate(repo.updated_at)}</span>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
