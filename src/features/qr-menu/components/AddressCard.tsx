"use client";

import React, { useEffect, useState } from "react";
import { PiCopyBold, PiGlobeHemisphereWestBold, PiPencilSimpleBold } from "react-icons/pi";
import { Button, Card, Input } from "@/components/ui";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { toast } from "@/components/ui/toast";
import { normalizeTenantSlug, tenantSlugSchema } from "@/schemas/tenant.schema";
import { workspaceService } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { buildPublicMenuUrl } from "@/utils/tenantHost";
import { SLUG_STATUS_TEXT } from "@/constants/site.constants";

type Status = "idle" | "checking" | "available" | "taken" | "error";

interface AddressCardProps {
  slug: string;
  canEdit: boolean;
  /** Called after the address is saved so the page can reload. */
  onChanged: () => void;
}

const STATUS_TEXT: Record<Exclude<Status, "idle">, { text: string; className: string }> = SLUG_STATUS_TEXT;

/** Step 1: choose the web address. First run shows the editor; afterwards a summary. */
export function AddressCard({ slug, canEdit, onChanged }: AddressCardProps) {
  const firstRun = !slug;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [check, setCheck] = useState<{ slug: string; status: "available" | "taken" | "error" } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = firstRun ? canEdit : editing;
  const normalized = normalizeTenantSlug(draft);
  const formatError = normalized && !tenantSlugSchema.safeParse(normalized).success;
  const unchanged = normalized === slug;

  const needsCheck = isEditing && Boolean(normalized) && !unchanged && !formatError;
  const status: Status = !needsCheck ? "idle" : check?.slug === normalized ? check.status : "checking";

  useEffect(() => {
    if (!needsCheck) return;
    let cancelled = false;
    const t = window.setTimeout(async () => {
      try {
        const res = await workspaceService.checkSlugAvailability(normalized);
        if (!cancelled) setCheck({ slug: normalized, status: res.data.available ? "available" : "taken" });
      } catch {
        if (!cancelled) setCheck({ slug: normalized, status: "error" });
      }
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [needsCheck, normalized]);

  const canSave =
    Boolean(normalized) && !unchanged && !formatError && (status === "available" || status === "error");

  const save = async () => {
    setSaving(true);
    try {
      await workspaceService.updateSlug(normalized);
      toast.success(firstRun ? "Address saved" : "Web address changed");
      setConfirmOpen(false);
      setEditing(false);
      onChanged();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save the web address. Try again."));
    } finally {
      setSaving(false);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Select the link and copy it instead.");
    }
  };

  const menuUrl = slug ? buildPublicMenuUrl(slug) : "";
  const previewUrl = normalized && !formatError ? buildPublicMenuUrl(normalized) : "";

  return (
    <Card className={isEditing || firstRun ? "space-y-4 p-6" : "p-4 sm:px-6"}>
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void save()}
        loading={saving}
        title="Change your web address?"
        description="QR codes you've already printed, and links you've shared, will stop working. You'll need to download and print new QR codes."
        confirmLabel="Change address"
        tone="default"
      />
      {isEditing || firstRun ? (
        <div>
          <h2 className="text-h2 text-foreground">{firstRun ? "Choose your web address" : "Change your web address"}</h2>
          <p className="mt-1 text-body text-muted-foreground">
            {firstRun
              ? "Guests will see this in their browser after scanning. Pick something short that people can read."
              : "Guests open your menu here when they scan your QR code."}
          </p>
        </div>
      ) : null}

      {isEditing ? (
        <div className="space-y-2">
          <Input
            className="font-mono"
            value={draft}
            placeholder="e.g. my-restaurant"
            disabled={saving}
            autoComplete="off"
            autoFocus={!firstRun}
            aria-label="Web address"
            onChange={(e) => setDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          />
          <p className="min-h-5 break-all text-caption text-muted-foreground">
            {formatError ? (
              <span className="text-destructive">Use letters and numbers, with single hyphens between words (like my-restaurant).</span>
            ) : previewUrl ? (
              <>Your menu will be at {previewUrl}</>
            ) : null}
          </p>
          {status !== "idle" && !formatError ? (
            <p className={`text-caption ${STATUS_TEXT[status].className}`} aria-live="polite">
              {STATUS_TEXT[status].text}
            </p>
          ) : null}
          <div className="flex gap-2">
            {!firstRun ? (
              <Button variant="secondary" size="sm" disabled={saving} onClick={() => setEditing(false)}>
                Cancel
              </Button>
            ) : null}
            <Button
              size="sm"
              disabled={!canSave || saving}
              loading={saving && firstRun}
              onClick={() => (firstRun ? void save() : setConfirmOpen(true))}
            >
              {firstRun ? "Save address" : "Save"}
            </Button>
          </div>
        </div>
      ) : firstRun ? (
        <p className="text-body text-muted-foreground">Only the owner or a manager can set the web address.</p>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <PiGlobeHemisphereWestBold className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-caption text-muted-foreground">Guests open your menu at</p>
              <a
                href={menuUrl}
                target="_blank"
                rel="noreferrer"
                className="block min-w-0 break-all text-body font-semibold text-foreground hover:underline"
              >
                {menuUrl}
              </a>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              size="sm"
              data-readonly-safe
              startIcon={<PiCopyBold className="size-4" />}
              onClick={() => void copy(menuUrl)}
            >
              Copy link
            </Button>
            {canEdit ? (
              <Button
                variant="ghost"
                size="sm"
                startIcon={<PiPencilSimpleBold className="size-4" />}
                onClick={() => {
                  setDraft(slug);
                  setEditing(true);
                }}
              >
                Change address
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </Card>
  );
}
