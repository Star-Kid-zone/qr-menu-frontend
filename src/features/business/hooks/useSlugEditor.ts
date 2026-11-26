"use client";

import { useEffect, useState } from "react";
import { normalizeTenantSlug, tenantSlugSchema } from "@/schemas/tenant.schema";
import type { Availability } from "@/types/admin/workspace/PublicSlugEditor.types";
import { toast } from "@/components/ui";
import { getApiErrorMessage } from "@/utils/errors";
import { workspaceService } from "@/services/workspace.service";
import type { SlugCheckResult } from "../types";

/**
 * Web-address (slug) editor for the website hub: draft, format validation, a debounced
 * availability check, and saving. `savedSlug` is the workspace's current slug; `onSaved`
 * reloads the hub after a successful change.
 */
export function useSlugEditor(savedSlug: string, onSaved: () => Promise<void>) {
  const [publicSiteEditMode, setPublicSiteEditMode] = useState(false);
  const [slugDraft, setSlugDraft] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugCheck, setSlugCheck] = useState<SlugCheckResult | null>(null);

  const normalizedSlugDraft = normalizeTenantSlug(slugDraft);
  const parsedSlugDraft = tenantSlugSchema.safeParse(normalizedSlugDraft);

  // When the slug inputs change, drop the previous availability result and
  // sync the validation message (adjusted during render, not in an effect).
  const [slugInputs, setSlugInputs] = useState({
    editMode: publicSiteEditMode,
    draft: slugDraft,
    saved: savedSlug,
  });
  if (
    slugInputs.editMode !== publicSiteEditMode ||
    slugInputs.draft !== slugDraft ||
    slugInputs.saved !== savedSlug
  ) {
    setSlugInputs({ editMode: publicSiteEditMode, draft: slugDraft, saved: savedSlug });
    setSlugCheck(null);
    if (!publicSiteEditMode) {
      setSlugError(null);
    } else if (normalizedSlugDraft && normalizedSlugDraft !== savedSlug) {
      setSlugError(
        parsedSlugDraft.success
          ? null
          : parsedSlugDraft.error.issues?.[0]?.message ?? "Invalid slug format"
      );
    }
  }

  const slugAvailability: Availability =
    !publicSiteEditMode || !normalizedSlugDraft
      ? "idle"
      : normalizedSlugDraft === savedSlug
        ? "unchanged"
        : !parsedSlugDraft.success
          ? "invalid"
          : slugCheck?.slug === normalizedSlugDraft
            ? slugCheck.status
            : "checking";

  useEffect(() => {
    if (!publicSiteEditMode) return;
    const normalized = normalizeTenantSlug(slugDraft);
    if (!normalized || normalized === savedSlug) return;
    if (!tenantSlugSchema.safeParse(normalized).success) return;
    const t = window.setTimeout(async () => {
      try {
        const res = await workspaceService.checkSlugAvailability(normalized);
        setSlugCheck({ slug: normalized, status: res.data.available ? "available" : "taken" });
      } catch {
        setSlugCheck({ slug: normalized, status: "error" });
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [publicSiteEditMode, slugDraft, savedSlug]);

  const canSaveSlug =
    tenantSlugSchema.safeParse(normalizeTenantSlug(slugDraft)).success &&
    normalizeTenantSlug(slugDraft) !== savedSlug &&
    (slugAvailability === "available" || slugAvailability === "error");

  const handleSaveSlug = async () => {
    if (!canSaveSlug) return;
    const normalized = normalizeTenantSlug(slugDraft);
    setSlugSaving(true);
    setSlugError(null);
    try {
      await workspaceService.updateSlug(normalized);
      toast.success("Store link updated!");
      setPublicSiteEditMode(false);
      setSlugDraft("");
      await onSaved();
    } catch (err) {
      setSlugError(
        getApiErrorMessage(err, "Failed to update slug. Please try another.")
      );
    } finally {
      setSlugSaving(false);
    }
  };

  return {
    publicSiteEditMode,
    setPublicSiteEditMode,
    slugDraft,
    setSlugDraft,
    slugSaving,
    slugError,
    setSlugError,
    slugAvailability,
    canSaveSlug,
    handleSaveSlug,
  };
}
