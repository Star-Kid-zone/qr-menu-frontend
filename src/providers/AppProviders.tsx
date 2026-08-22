import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toast';
import { ThemeProviderWrapper } from '@/contexts/theme.context';
import { FingerprintProvider } from '@/contexts/fingerprint.context';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FingerprintProvider>
      <ThemeProviderWrapper>
        <Toaster />
        {children}
      </ThemeProviderWrapper>
    </FingerprintProvider>
  );
}
