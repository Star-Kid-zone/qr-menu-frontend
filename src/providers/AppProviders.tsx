import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toast';
import { ThemeProviderWrapper } from '@/contexts/theme.context';

// The device fingerprint used by guest analytics is resolved inside useAnalytics (lazily, when
// idle), so admin and marketing pages never load the fingerprinting library.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProviderWrapper>
      <Toaster />
      {children}
    </ThemeProviderWrapper>
  );
}
