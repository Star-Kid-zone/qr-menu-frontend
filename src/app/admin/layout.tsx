"use client";

import { useProtectedSessionGuard } from "@/hooks/useProtectedSessionGuard";
import { AppShell } from "@/components/layouts/AppShell";
import { GlobalProgressBar } from "@/components/layouts/GlobalProgressBar";
import { ImpersonationBanner } from "@/components/layouts/ImpersonationBanner";
import { TenantAnnouncementBanner } from "@/components/layouts/TenantAnnouncementBanner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useProtectedSessionGuard();

  return (
    <>
      <GlobalProgressBar />
      <AppShell
        area="admin"
        banners={
          <>
            <ImpersonationBanner />
            <TenantAnnouncementBanner />
          </>
        }
      >
        {children}
      </AppShell>
    </>
  );
}
