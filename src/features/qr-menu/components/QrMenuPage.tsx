"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PiQrCode, PiWarningCircle } from "react-icons/pi";
import { Button, EmptyState, PageHeader, Skeleton } from "@/components/ui";
import { toast } from "@/components/ui/toast";
import { usePermissions } from "@/hooks/usePermissions";
import { QrGeneratorPage } from "@/features/qr-codes";
import { workspaceService } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { AddressCard } from "./AddressCard";

/** One page for the whole job: pick the address, then download the QR code. */
export function QrMenuPage() {
  const { canEditWebsite, hasPermission } = usePermissions();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await workspaceService.getWorkspace();
      setSlug(res.data.publicSlug?.trim() ?? "");
      setLoadError(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "We couldn't load your QR menu settings.");
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    workspaceService
      .getWorkspace()
      .then((res) => {
        if (alive) setSlug(res.data.publicSlug?.trim() ?? "");
      })
      .catch((err) => {
        if (!alive) return;
        const message = getApiErrorMessage(err, "We couldn't load your QR menu settings.");
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading QR menu">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (loadError && slug === null) {
    return (
      <EmptyState
        icon={<PiWarningCircle className="size-7" />}
        title="We couldn't load your QR menu"
        description={loadError}
        action={<Button onClick={() => void load()}>Try again</Button>}
      />
    );
  }

  const hasAddress = Boolean(slug);

  return (
    <div className="h-full w-full space-y-6 overflow-y-auto pb-8 pr-1">
      <PageHeader
        title="QR menu"
        description="Pick your web address, then download the QR code guests scan at your tables."
      />
      <AddressCard slug={slug ?? ""} canEdit={canEditWebsite} onChanged={() => void load()} />
      {hasAddress ? (
        hasPermission("qr-assets") ? (
          // Remount after an address change so the QR points at the new link.
          <QrGeneratorPage key={slug} embedded />
        ) : (
          <p className="text-body text-muted-foreground">You don&apos;t have access to download QR codes.</p>
        )
      ) : (
        <EmptyState
          icon={<PiQrCode className="size-7" />}
          title="Your QR code comes next"
          description="Choose a web address above and your QR code will appear here."
        />
      )}
    </div>
  );
}
