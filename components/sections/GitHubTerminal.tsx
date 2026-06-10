"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function GitHubTerminal({ repos }: { repos: unknown[] }) {
  const [text, setText] = useState("");
  const fullText = "Fetching from github.com/aliabufadaleh... ✓ live";
  const [showRepos, setShowRepos] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let currentIndex = 0;
    let interval: NodeJS.Timeout;

    const animateText = () => {
      interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setShowRepos(true);
        }
      }, 30);
    };

    ScrollTrigger.create({
      trigger: "#terminal-section",
      start: "top 80%",
      once: true,
      onEnter: animateText
    });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showRepos) {
      gsap.fromTo(
        ".repo-line",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.15, ease: "power2.out", duration: 0.5 }
      );
    }
  }, [showRepos]);

  return (
    <section id="terminal-section" className="w-full bg-transparent text-white py-24 flex justify-center border-t border-white/5">
      <div className="w-full max-w-4xl px-6">

        <div className="border border-white/10 rounded font-mono text-[13px] bg-[#0d0d0f] overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            <span className="ml-2 text-zinc-500">ali@github:~$</span>
          </div>

          <div className="p-6 text-zinc-300">
            <div className="flex items-center mb-6">
              <span className="text-cyan-500 mr-2">{">"}</span>
              <span>{text}</span>
              {!showRepos && <span className="w-2 h-4 bg-white ml-1 animate-pulse" />}
              {showRepos && text.includes('live') && (
                <span className="w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse" />
              )}
            </div>

            <div className="space-y-6">
              {showRepos && repos.map((repoObj) => {
                const repo = repoObj as { id: string, language: string, html_url: string, name: string, stargazers_count: number, forks_count: number, updated_at: string, description: string };
                return (
                  <div key={repo.id} className="repo-line opacity-0 flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-500 w-24">[{repo.language || 'Code'}]</span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-bold hover:text-cyan-400 transition-colors cursor-none"
                      >
                        {repo.name}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 ml-28 text-zinc-500">
                      <span className="flex items-center gap-1">★ {repo.stargazers_count}</span>
                      <span className="flex items-center gap-1">⑂ {repo.forks_count}</span>
                      <span>· updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="ml-28 text-zinc-400 line-clamp-1">
                      {repo.description || "No description provided."}
                    </div>
                  </div>
                );
              })}
            </div>

            {showRepos && (
              <div className="mt-6 flex items-center">
                <span className="text-zinc-500 mr-2">ali@github:~$</span>
                <span className="w-2 h-4 bg-zinc-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
