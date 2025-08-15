
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="light" storageKey="febryer-theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
