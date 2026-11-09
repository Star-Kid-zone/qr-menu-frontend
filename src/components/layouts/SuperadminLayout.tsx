'use client';

import type { ReactNode } from 'react';
import { useProtectedSessionGuard } from '@/hooks/useProtectedSessionGuard';
import { AppShell } from './AppShell';
import { GlobalProgressBar } from './GlobalProgressBar';

/** Shell for platform operators (super admin): same frame as the restaurant area, different nav. */
export default function SuperadminLayout({ children }: { children: ReactNode }) {
  useProtectedSessionGuard({ requiredRole: 'superadmin' });

  return (
    <>
      <GlobalProgressBar />
      <AppShell area="superadmin">{children}</AppShell>
    </>
  );
}
