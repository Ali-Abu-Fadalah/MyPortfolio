'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

interface TerminalUIProps {
  repos: GitHubRepo[];
  isLive: boolean;
  username: string;
}

export function TerminalUI({ repos, isLive, username }: TerminalUIProps) {
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullText = `> fetching latest commits from @${username}...`;

  useEffect(() => {
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength++;
      setTypedText(fullText.substring(0, currentLength));
      if (currentLength >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setIsTypingComplete(true), 400); // Small pause before showing data
      }
    }, 30);

    return () => clearInterval(interval);
  }, [fullText]);

  const getLanguageColor = (lang: string | null): string => {
    if (!lang) return 'text-zinc-500';
    const colors: Record<string, string> = {
      typescript: 'text-blue-400',
      javascript: 'text-yellow-400',
      rust: 'text-amber-500',
      go: 'text-cyan-400',
      python: 'text-green-400',
      html: 'text-orange-400',
      css: 'text-indigo-400',
      c: 'text-zinc-400',
      'c++': 'text-pink-400',
      java: 'text-red-500',
    };
    return colors[lang.toLowerCase()] || 'text-blue-300';
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return 'recent';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#0d0d0d] border border-zinc-800 shadow-2xl font-mono text-sm sm:text-base">
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-3 bg-[#161616] border-b border-zinc-800">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-zinc-400 text-xs flex-grow text-center font-sans tracking-wider">
          {username} — bash
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{isLive ? 'LIVE' : 'CACHE'}</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-6 text-zinc-300 min-h-[320px]">
        <div className="mb-6">
          <span className="text-emerald-400">guest@portfolio</span>
          <span className="text-zinc-500">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-zinc-500">$ </span>
          <span>{typedText}</span>
          {!isTypingComplete && <span className="w-2 h-4 bg-zinc-300 inline-block ml-1 animate-pulse" />}
        </div>

        {isTypingComplete && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-500 mb-4"
            >
              [SUCCESS] Found {repos.length} active repositories...
            </motion.div>

            {repos.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                className="group relative border-l-2 border-zinc-800 pl-4 hover:border-emerald-500 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-zinc-100 hover:text-emerald-400 transition-colors"
                  >
                    {repo.name}
                  </a>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={getLanguageColor(repo.language)}>
                      {repo.language || 'Unknown'}
                    </span>
                    <span className="text-zinc-500">[{formatDate(repo.updated_at)}]</span>
                  </div>
                </div>
                
                <p className="text-zinc-400 text-sm mb-3">
                  {repo.description || "No description provided."}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <span>★</span>
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>⑂</span>
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: repos.length * 0.15 + 0.2 }}
              className="mt-6 pt-4"
            >
              <span className="text-emerald-400">guest@portfolio</span>
              <span className="text-zinc-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-zinc-500">$ </span>
              <span className="w-2 h-4 bg-zinc-300 inline-block ml-1 animate-pulse" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
