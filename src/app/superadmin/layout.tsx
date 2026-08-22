'use client';

import type { ReactNode } from 'react';
import SuperadminLayout from '@/components/layouts/SuperadminLayout';

export default function SuperadminShellLayout({ children }: { children: ReactNode }) {
  return <SuperadminLayout>{children}</SuperadminLayout>;
}
