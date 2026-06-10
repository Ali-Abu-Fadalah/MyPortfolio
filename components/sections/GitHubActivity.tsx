import { GitHubTerminal } from "./GitHubTerminal";

export async function GitHubActivity({ githubUsername }: { githubUsername: string }) {
  let repos: unknown[] = [];
  try {
    const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`, {
      next: { revalidate: 60 } // ISR caching
    });
    if (res.ok) {
      repos = await res.json();
    }
  } catch (e) {
    console.error(e);
  }

  return <GitHubTerminal repos={repos} />;
}
