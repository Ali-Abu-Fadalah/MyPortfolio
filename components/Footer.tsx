import { Mail, FileText, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  email: string;
  linkedinUrl: string;
  copyrightName: string;
}

export function Footer({ email, linkedinUrl, copyrightName }: FooterProps) {
  return (
    <footer id="contact" className="relative py-20 px-6 md:px-12 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-200/20 dark:to-black/30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-16">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Let's build something together.
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
              I am currently available for contract work, full-time opportunities, or open-source collaborations. Drop me a line or take a look at my resume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Download Resume Button */}
            <a
              href="/resume.pdf"
              download="resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-2xl bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950 shadow-md hover:shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-350 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Download Resume
            </a>

            {/* Email Contact Link */}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Email Me
            </a>

            {/* LinkedIn Handle */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 active:scale-95 animate-none"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Lower footer copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} {copyrightName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-850 dark:hover:text-zinc-300 transition-colors flex items-center gap-1 group"
            >
              GitHub
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-850 dark:hover:text-zinc-300 transition-colors flex items-center gap-1 group"
            >
              LinkedIn
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
