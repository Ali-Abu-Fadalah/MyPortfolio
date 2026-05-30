import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jane Doe | Full-Stack Software Engineer & 3D Web Developer",
  description: "A showcase of high-performance web applications, developer tooling, and interactive 3D experiences engineered with Next.js, Framer Motion, and Sanity.io.",
  keywords: ["Software Engineer", "Developer Portfolio", "Next.js", "Three.js", "React Three Fiber", "Web Development", "TypeScript", "Framer Motion"],
  authors: [{ name: "Jane Doe", url: "https://github.com/octocat" }],
  openGraph: {
    title: "Jane Doe | Full-Stack Software Engineer & 3D Web Developer",
    description: "A showcase of high-performance web applications, developer tooling, and interactive 3D experiences engineered with Next.js, Framer Motion, and Sanity.io.",
    url: "https://example.com",
    siteName: "Jane Doe Portfolio",
    images: [
      {
        url: "https://example.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jane Doe | Full-Stack Software Engineer & 3D Web Developer Portfolio Card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jane Doe | Full-Stack Software Engineer & 3D Web Developer",
    description: "A showcase of high-performance web applications, developer tooling, and interactive 3D experiences engineered with Next.js, Framer Motion, and Sanity.io.",
    images: ["https://example.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 overflow-x-hidden">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
