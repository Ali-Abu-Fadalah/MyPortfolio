"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCursor } from "@/app/providers/CursorProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { setActive } = useCursor();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Work", href: "#work" },
    { name: "Arsenal", href: "#arsenal" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-zinc-950/80 border-b-[0.5px] border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-[14px] text-cyan-500 font-mono tracking-wider font-bold"
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        >
          A.AF
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-[13px] text-zinc-400 hover:text-white transition-colors py-1 group"
                onMouseEnter={() => setActive(true)}
                onMouseLeave={() => setActive(false)}
              >
                {link.name}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-cyan-500 transition-all duration-300
                    ${activeSection === link.href.substring(1) ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            ))}
          </div>
          <div
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
          >
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
