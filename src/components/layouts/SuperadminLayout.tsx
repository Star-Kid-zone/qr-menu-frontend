'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useProtectedSessionGuard } from '@/hooks/useProtectedSessionGuard';
import { SuperadminSidebar } from './SuperadminSidebar';
import Navbar from './Navbar';

/**
 * Shell for platform operators (superadmin): separate nav from tenant admin,
 * same token system and fixed-viewport shell as the admin panel.
 */
export default function SuperadminLayout({ children }: { children: ReactNode }) {
  useProtectedSessionGuard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground font-sans selection:bg-accent">
      <SuperadminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex h-dvh min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-200 ${
          isSidebarOpen ? 'lg:ml-[17rem]' : 'lg:ml-20'
        }`}
      >
        <Navbar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          role="superadmin"
          identityLabel="Superadmin"
          identityInitials="SA"
        />
        <main className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
          <div className="mx-auto h-full w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
