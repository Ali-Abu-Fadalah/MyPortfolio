"use client";

import { useTheme } from "@/components/providers";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors cursor-none"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-400" />}
    </button>
  );
}
