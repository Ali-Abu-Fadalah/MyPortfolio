import { TerminalUI, GitHubRepo } from './TerminalUI';

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
    description: "A dark-mode-first high-performance portfolio featuring Next.js 16, Tailwind CSS v4, Three.js, and Sanity.io.",
    html_url: "https://github.com",
    stargazers_count: 45,
    forks_count: 2,
    language: "TypeScript",
    updated_at: new Date().toISOString()
  }
];

interface GitHubTerminalProps {
  githubUsername: string;
}

export async function GitHubTerminal({ githubUsername }: GitHubTerminalProps) {
  let repos: GitHubRepo[] = [];
  let isLive = false;

  try {
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
    <section id="github" className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#09090b] border-t border-zinc-900 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Live Terminal Feed
            </h2>
            <p className="mt-4 text-zinc-400 max-w-xl text-base sm:text-lg">
              Direct connection to GitHub. Real-time data pipeline logging recent commits and repositories.
            </p>
          </div>
          
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors group"
          >
            ssh {githubUsername}@github
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Terminal Client */}
        <TerminalUI repos={repos} isLive={isLive} username={githubUsername} />
      </div>
    </section>
  );
}
