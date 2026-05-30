import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white">
            Portfolio
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
