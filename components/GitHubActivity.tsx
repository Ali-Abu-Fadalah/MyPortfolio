import { Profile } from '@/lib/sanity';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

const MOCK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "quantum-editor",
    description: "An agentic and extensible text editor engineered with Rust, featuring canvas-driven rendering and AI autocomplete.",
    html_url: "https://github.com",
    stargazers_count: 342,
    forks_count: 24,
    language: "Rust",
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "r3f-physics-sandbox",
    description: "Real-time rigid body physics simulation constructed in Next.js using React Three Fiber, Rapier, and custom shaders.",
    html_url: "https://github.com",
    stargazers_count: 189,
    forks_count: 15,
    language: "TypeScript",
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "portfolio-2026",
    description: "A dark-mode-first high-performance portfolio featuring Next.js 15, Tailwind CSS, Framer Motion, and Sanity.io.",
    html_url: "https://github.com",
    stargazers_count: 45,
    forks_count: 2,
    language: "TypeScript",
    updated_at: new Date().toISOString()
  }
];

function getLanguageColor(lang: string | null): string {
  if (!lang) return 'bg-zinc-400';
  const colors: Record<string, string> = {
    typescript: 'bg-blue-500',
    javascript: 'bg-yellow-400',
    rust: 'bg-amber-600',
    go: 'bg-cyan-500',
    python: 'bg-green-500',
    html: 'bg-orange-500',
    css: 'bg-indigo-500',
    c: 'bg-zinc-400',
    'c++': 'bg-pink-500',
    java: 'bg-red-600',
  };
  return colors[lang.toLowerCase()] || 'bg-blue-400';
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

interface GitHubActivityProps {
  githubUsername: string;
}

export async function GitHubActivity({ githubUsername }: GitHubActivityProps) {
  let repos: GitHubRepo[] = [];
  let isLive = false;

  try {
    // Perform server-side fetch with 1-hour ISR cache
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`,
      {
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'portfolio-2026',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        repos = data;
        isLive = true;
      } else {
        repos = MOCK_REPOS;
      }
    } else {
      console.warn(`GitHub API responded with status ${response.status}. Using high-fidelity mock repositories.`);
      repos = MOCK_REPOS;
    }
  } catch (error) {
    console.error("Failed to fetch live GitHub activity, using mock fallbacks:", error);
    repos = MOCK_REPOS;
  }

  return (
    <section id="github" className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-zinc-50/20 dark:bg-zinc-950/20 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-4 select-none transition-colors">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isLive ? 'Live GitHub Sync' : 'Featured Repositories'}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-200 dark:to-zinc-400 text-transparent">
              Latest Code Activity
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl text-base sm:text-lg">
              Recent open-source creations and contributions fetched live from my GitHub workspace.
            </p>
          </div>
          
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group"
          >
            Follow @{githubUsername}
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-300 dark:hover:border-blue-500/30 hover:bg-white dark:hover:bg-zinc-900/70 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(59,130,246,0.04)] dark:hover:shadow-[0_12px_30px_rgba(59,130,246,0.08)] transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-md"
            >
              {/* Header inside card */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Repo icon wrapper */}
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 group-hover:border-blue-300/35 dark:group-hover:border-blue-500/20 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20 transition-colors">
                    <svg className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </div>
                  
                  {/* Hover Up Right Arrow */}
                  <svg
                    className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold text-zinc-850 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors mb-2 truncate">
                  {repo.name}
                </h3>
                
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                  {repo.description || "No description provided. Explore the codebase on GitHub."}
                </p>
              </div>

              {/* Footer metadata */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-zinc-500 dark:text-zinc-500 border-t border-zinc-200/80 dark:border-zinc-800/50 pt-4">
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
                    <span className="text-zinc-600 dark:text-zinc-400">{repo.language}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{repo.stargazers_count}</span>
                </div>

                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7a3 3 0 100-6 3 3 0 000 6zM8 7v7a4 4 0 004 4h4M16 15a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  <span>{repo.forks_count}</span>
                </div>

                <span className="ml-auto text-[11px] text-zinc-500 dark:text-zinc-650">
                  {formatDate(repo.updated_at)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
