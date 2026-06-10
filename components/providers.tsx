'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LenisProvider } from '@/app/providers/LenisProvider';
import { CursorProvider } from '@/app/providers/CursorProvider';

const BackgroundShader = dynamic(() => import('@/components/BackgroundShader'), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
    >
      <LenisProvider>
        <CursorProvider>
          <BackgroundShader />
          {children}
        </CursorProvider>
      </LenisProvider>
    </NextThemesProvider>
  );
}
