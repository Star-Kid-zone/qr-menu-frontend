"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PiLock, PiWarningCircle } from "react-icons/pi";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { getLandingRoute } from "@/config/landing";
import { getStoredUserRole } from "@/utils/storage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/utils/cn";
import { useBusinessHubState } from "@/features/business/hooks/useBusinessHubState";
import { BusinessesTab } from "@/features/business/components/tabs/BusinessesTab";
import { ListPaymentPage } from "@/features/payments/components/ListPaymentPage";
import { ConnectedAccounts } from "./ConnectedAccounts";

type SettingsTab = "business" | "payment" | "accounts";

/** Business details uses the same state and form the Website page used before. */
function BusinessDetails() {
  const s = useBusinessHubState();
  // Never show "No business profile yet" when the load actually failed.
  if (s.loadError && s.businesses.length === 0) {
    return (
      <EmptyState
        icon={<PiWarningCircle className="size-7" />}
        title="We couldn't load your business details"
        description={s.loadError}
        action={
          <Button onClick={() => void s.fetchWorkspaceData()} loading={s.isRefreshing}>
            Try again
          </Button>
        }
      />
    );
  }
  if (s.isInitialLoading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading business details">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }
  return (
    <BusinessesTab
      businesses={s.businesses}
      businessEditMode={s.businessEditMode}
      setBusinessEditMode={s.setBusinessEditMode}
      businessSection={s.businessSection}
      setBusinessSection={s.setBusinessSection}
      businessFormLoading={s.businessFormLoading}
      setBusinessFormLoading={s.setBusinessFormLoading}
      industries={s.industries}
      setBusinessDraft={s.setBusinessDraft}
      onUpdateBusiness={s.handleUpdateBusiness}
    />
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission, canEditWebsite, permissions } = usePermissions();

  const tabs: { id: SettingsTab; label: string; allowed: boolean }[] = [
    { id: "business", label: "Business details", allowed: canEditWebsite },
    { id: "payment", label: "Bill payment", allowed: hasPermission("payments") },
    { id: "accounts", label: "Connected accounts", allowed: hasPermission("reviews") || hasPermission("marketing") },
  ];
  const visible = tabs.filter((t) => t.allowed);
  const requested = searchParams?.get("tab") as SettingsTab | null;
  const active = visible.find((t) => t.id === requested) ?? visible[0];
  const startEditingPayment = searchParams?.get("edit") === "1";

  if (!active) {
    return (
      <EmptyState
        icon={<PiLock className="size-7" />}
        title="Your role can't open this page"
        description="Ask the restaurant owner if something in Settings needs changing."
        action={
          <Link href={getLandingRoute(getStoredUserRole(), permissions)} className={buttonVariants({ variant: "primary" })}>
            Go to my start page
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <nav aria-label="Settings sections" className="shrink-0">
        <div
          role="tablist"
          className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => router.replace(`?tab=${tab.id}`)}
                className={cn(
                  "-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-body-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* The only scroll area on the page; tabs stay pinned above it. */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-6 [scrollbar-gutter:stable]">
        {active.id === "business" && <BusinessDetails />}
        {active.id === "payment" && <ListPaymentPage startEditing={startEditingPayment} />}
        {active.id === "accounts" && <ConnectedAccounts />}
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
