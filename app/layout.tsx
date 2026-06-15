import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Providers } from "@/components/providers";
import { LenisProvider } from "@/app/providers/LenisProvider";
import { CursorProvider } from "@/app/providers/CursorProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { LoadOrchestrator } from "@/app/providers/LoadOrchestrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ali Abu Fadaleh | Portfolio",
  description: "Computer Science Graduate & Enterprise Systems Specialist",
  keywords: ["Software Engineer", "Developer Portfolio", "Next.js", "Three.js", "React Three Fiber", "Web Development", "TypeScript", "Framer Motion"],
  authors: [{ name: "Ali Abu Fadaleh", url: "https://github.com/Ali-Abu-Fadalah" }],
  openGraph: {
    title: "Ali Abu Fadaleh | Portfolio",
    description: "Computer Science Graduate & Enterprise Systems Specialist",
    url: "https://github.com/Ali-Abu-Fadalah/MyPortfolio",
    siteName: "Ali Abu Fadaleh Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ali Abu Fadaleh | Portfolio Card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Abu Fadaleh | Portfolio",
    description: "Computer Science Graduate & Enterprise Systems Specialist",
    images: ["/og-image.png"],
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
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 overflow-x-hidden">
        <Providers>
          <LenisProvider>
            <CursorProvider>
              <LoadOrchestrator />
              <CustomCursor />
              <ScrollProgressBar />
              <Navbar />
              {children}
            </CursorProvider>
          </LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
