"use client";

import React from "react";
import { invalidateWorkspace, useWorkspace } from "@/hooks/useWorkspace";
import { PiQrCode, PiWarningCircle } from "react-icons/pi";
import { Button, EmptyState, PageHeader, Skeleton } from "@/components/ui";
import { usePermissions } from "@/hooks/usePermissions";
import { QrStudio } from "@/features/qr-codes";
import { AddressCard } from "./AddressCard";

/** One page for the whole job: pick the address, design the code, then download or print it. */
export function QrMenuPage() {
  const { canEditWebsite, hasPermission } = usePermissions();
  const { data: workspace, loading, error: loadError, refetch } = useWorkspace();
  // After the address changes (or on retry), read the workspace fresh rather than from the cache.
  const fetchWorkspace = () => {
    invalidateWorkspace();
    return refetch();
  };

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading QR menu">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-[26rem_1fr]">
          <Skeleton className="h-[34rem] w-full rounded-lg" />
          <Skeleton className="h-[34rem] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <EmptyState
        icon={<PiWarningCircle className="size-7" />}
        title="We couldn't load your QR menu"
        description={loadError ?? undefined}
        action={
          <Button
            onClick={() => {
              void fetchWorkspace();
            }}
          >
            Try again
          </Button>
        }
      />
    );
  }

  const slug = workspace.publicSlug?.trim() ?? "";

  return (
    <div className="h-full w-full space-y-6 overflow-y-auto pb-8 pr-1">
      <PageHeader
        title="QR menu"
        description="Design table cards and stickers for your menu, then download or print them."
      />
      <AddressCard slug={slug} canEdit={canEditWebsite} onChanged={() => void fetchWorkspace()} />
      {slug ? (
        hasPermission("qr-assets") ? (
          // Remount after an address change so the code points at the new link.
          <QrStudio key={slug} workspace={workspace} />
        ) : (
          <p className="text-body text-muted-foreground">You don&apos;t have access to download QR codes.</p>
        )
      ) : (
        <EmptyState
          icon={<PiQrCode className="size-7" />}
          title="Your QR code comes next"
          description="Choose a web address above and your QR code designer will appear here."
        />
      )}
    </div>
  );
}
