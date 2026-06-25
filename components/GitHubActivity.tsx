import { GitHubRepoGrid, GitHubRepo } from './GitHubRepoGrid';

const MOCK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'portfolio-2026',
    description:
      'High-performance portfolio built with Next.js 16, Framer Motion, Three.js, and Sanity CMS.',
    html_url: 'https://github.com/Ali-Abu-Fadalah/MyPortfolio',
    stargazers_count: 12,
    forks_count: 2,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'ai-integration-toolkit',
    description:
      'A modular TypeScript toolkit for integrating LLMs (Gemini, OpenAI) into enterprise web applications.',
    html_url: 'https://github.com/Ali-Abu-Fadalah',
    stargazers_count: 34,
    forks_count: 5,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'enterprise-dashboard',
    description:
      'Real-time analytics dashboard with WebSocket updates, role-based auth, and PostgreSQL backend.',
    html_url: 'https://github.com/Ali-Abu-Fadalah',
    stargazers_count: 28,
    forks_count: 3,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
  },
];

export async function GitHubActivity({ githubUsername }: { githubUsername: string }) {
  let repos: GitHubRepo[] = [];
  let isLive = false;

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`,
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'portfolio-2026', Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    if (response.ok) {
      const data: unknown = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        repos = data as GitHubRepo[];
        isLive = true;
      } else {
        repos = MOCK_REPOS;
      }
    } else {
      repos = MOCK_REPOS;
    }
  } catch {
    repos = MOCK_REPOS;
  }

  return (
    <section
      id="github"
      className="relative py-20 md:py-28 px-6 sm:px-8 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            >
              // code activity
            </p>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Latest Repositories
              </h2>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                style={{
                  backgroundColor: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  borderColor: isLive ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
                  color: isLive ? '#10b981' : '#f59e0b',
                }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {isLive ? 'Live' : 'Featured'}
              </span>
            </div>
            <p
              className="text-sm sm:text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              Recent open-source contributions fetched from GitHub.
            </p>
          </div>

          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 group flex-shrink-0 hover:text-[color:var(--accent)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            @{githubUsername}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        <GitHubRepoGrid repos={repos} githubUsername={githubUsername} />
      </div>

      <div className="section-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
