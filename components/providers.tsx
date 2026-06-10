'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { LenisProvider } from '@/app/providers/LenisProvider';
import { CursorProvider } from '@/app/providers/CursorProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
    >
      <LenisProvider>
        <CursorProvider>
          {children}
        </CursorProvider>
      </LenisProvider>
    </NextThemesProvider>
  );
}
