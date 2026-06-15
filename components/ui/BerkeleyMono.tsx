import localFont from 'next/font/local';
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const berkeleyMono = {
  variable: '--font-berkeley-mono',
  className: `${geistMono.className} font-mono`, // Fallback
};