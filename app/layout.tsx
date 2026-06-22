import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/providers';
import { CustomCursor } from '@/components/CustomCursor';
import { PageLoader } from '@/components/PageLoader';
import { ScrollProgress } from '@/components/ScrollProgress';
import { getProfile } from '@/lib/sanity';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Ali Abu Fadaleh | Portfolio',
  description: 'Computer Science Graduate & Enterprise Systems Specialist — building high-performance web apps, AI integrations, and developer tooling.',
  keywords: [
    'Software Engineer', 'Developer Portfolio', 'Next.js', 'Three.js',
    'React Three Fiber', 'Web Development', 'TypeScript', 'Framer Motion',
    'Enterprise Systems', 'AI Integration',
  ],
  authors: [{ name: 'Ali Abu Fadaleh', url: 'https://github.com/Ali-Abu-Fadalah' }],
  metadataBase: new URL('https://my-portfolio-ali-abu-fadalehs-projects.vercel.app'),
  openGraph: {
    title: 'Ali Abu Fadaleh | Portfolio',
    description: 'Computer Science Graduate & Enterprise Systems Specialist.',
    url: 'https://my-portfolio-ali-abu-fadalehs-projects.vercel.app',
    siteName: 'Ali Abu Fadaleh Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Ali Abu Fadaleh Portfolio' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Abu Fadaleh | Portfolio',
    description: 'Computer Science Graduate & Enterprise Systems Specialist.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getProfile();
  
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <Providers>
          <PageLoader />
          <ScrollProgress />
          <CustomCursor />
          <Navbar resumeUrl={profile.resumeUrl} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
