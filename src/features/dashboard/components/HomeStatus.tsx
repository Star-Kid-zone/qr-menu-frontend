"use client";

import Link from "next/link";
import { PiArrowSquareOut, PiCheckCircleFill, PiCircle, PiCopy } from "react-icons/pi";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { usePermissions } from "@/hooks/usePermissions";
import type { WorkspaceData } from "@/services/workspace.service";
import type { MenuStats } from "@/services/menu.service";
import { buildPublicLandingUrl } from "@/utils/tenantHost";

/** Where guests find the restaurant, as the first thing on Home. */
export function SiteStatusCard({ workspace }: { workspace: WorkspaceData | null }) {
  const url = workspace?.publicSlug ? buildPublicLandingUrl(workspace.publicSlug) : null;
  if (!url) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Select the link and copy it instead.");
    }
  };
  return (
    <section aria-label="Your website" className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-body text-muted-foreground">Guests find you at</p>
        <p className="truncate text-h3 text-foreground">{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
        <Link href="/admin/qr-menu" className="text-caption font-medium text-primary hover:underline">
          Download QR codes for your tables
        </Link>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" onClick={() => void copy()} leftIcon={<PiCopy aria-hidden className="size-4" />}>
          Copy link
        </Button>
        <a href={url} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "secondary" })}>
          View website
          <PiArrowSquareOut aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}

interface Step {
  label: string;
  done: boolean;
  href: string;
  allowed: boolean;
}

/** First-run steps, worked out from data the app already has. Hidden once all are done. */
export function SetupChecklist({ workspace, menuStats }: { workspace: WorkspaceData | null; menuStats: MenuStats | null }) {
  const { hasPermission } = usePermissions();
  if (!workspace || !menuStats) return null;

  const steps: Step[] = [
    { label: "Add your dishes", done: menuStats.total > 0, href: "/admin/listmenu", allowed: hasPermission("menu") },
    { label: "Set up bill payment", done: Boolean(workspace.payment?.link || workspace.payment?.qrImage), href: "/admin/settings?tab=payment", allowed: hasPermission("payments") },
    { label: "Add your opening hours", done: Boolean(workspace.business?.businessHours || workspace.business?.availability?.length), href: "/admin/listbusiness", allowed: hasPermission("workspace") },
    { label: "Add photos to your website", done: (workspace.gallery?.length ?? 0) > 0, href: "/admin/settings", allowed: hasPermission("workspace") },
    { label: "Link your Google reviews", done: Boolean(workspace.review?.googleReviewLink), href: "/admin/addreview", allowed: hasPermission("reviews") },
  ].filter((s) => s.allowed);

  const remaining = steps.filter((s) => !s.done).length;
  if (steps.length === 0 || remaining === 0) return null;

  return (
    <section aria-labelledby="setup-heading" className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="setup-heading" className="text-h3 text-foreground">Finish setting up</h2>
        <p className="text-caption text-muted-foreground">
          {steps.length - remaining} of {steps.length} done
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={steps.length - remaining}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((steps.length - remaining) / steps.length) * 100}%` }} />
      </div>
      <ul className="mt-3 divide-y divide-border">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center justify-between gap-3 py-3">
            <span className="flex items-center gap-3 text-body text-foreground">
              {step.done ? (
                <PiCheckCircleFill aria-hidden className="size-5 text-success" />
              ) : (
                <PiCircle aria-hidden className="size-5 text-muted-foreground" />
              )}
              <span className={step.done ? "text-muted-foreground line-through" : undefined}>{step.label}</span>
              <span className="sr-only">{step.done ? "(done)" : "(to do)"}</span>
            </span>
            {!step.done ? (
              <Link href={step.href} className="text-body-medium text-primary hover:underline">
                Start
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
