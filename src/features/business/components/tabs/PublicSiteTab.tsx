"use client";

import React from "react";
import { Button, Card, EmptyState, Input, PageHeader } from "@/components/ui";
import { PiLinkBold, PiPencilSimpleBold, PiPlusBold } from "react-icons/pi";
import { buildPublicLandingUrl, buildPublicMenuUrl } from "@/utils/tenantHost";
import { normalizeTenantSlug, tenantSlugSchema } from "@/schemas/tenant.schema";
import { workspaceService } from "@/services/workspace.service";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
import type { WorkspaceSetting } from "@/types/workspace.types";
import type { Availability } from "@/types/components/admin/workspace/PublicSlugEditor.types";

interface PublicSiteTabProps {
  workspace: WorkspaceSetting | null;
  publicSiteEditMode: boolean;
  setPublicSiteEditMode: (val: boolean) => void;
  slugDraft: string;
  setSlugDraft: (val: string) => void;
  slugSaving: boolean;
  setSlugSaving: (val: boolean) => void;
  setSlugError: (val: string | null) => void;
  canSaveSlug: boolean;
  slugAvailabilityLabel: React.ReactNode;
  onRefreshData: () => Promise<void>;
  onOpenAddWorkspaceModal: () => void;
  copyToClipboard: (text: string) => Promise<void>;
}

export function PublicSiteTab({
  workspace,
  publicSiteEditMode,
  setPublicSiteEditMode,
  slugDraft,
  setSlugDraft,
  slugSaving,
  setSlugSaving,
  setSlugError,
  canSaveSlug,
  slugAvailabilityLabel,
  onRefreshData,
  onOpenAddWorkspaceModal,
  copyToClipboard,
}: PublicSiteTabProps) {
  const slug = workspace?.public_slug?.trim() ?? "";
  const landingUrl = slug ? buildPublicLandingUrl(slug) : "";
  const menuUrl = slug ? buildPublicMenuUrl(slug) : "";

  const panelActions = (() => {
    if (!workspace) return null;
    if (publicSiteEditMode) {
      return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            disabled={slugSaving}
            onClick={() => {
              setPublicSiteEditMode(false);
              setSlugError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            loading={slugSaving}
            disabled={!canSaveSlug || slugSaving}
            onClick={async () => {
              const normalized = normalizeTenantSlug(slugDraft);
              if (!tenantSlugSchema.safeParse(normalized).success) return;
              setSlugSaving(true);
              setSlugError(null);
              try {
                await workspaceService.updateSlug(normalized);
                setPublicSiteEditMode(false);
                toast.success("Public slug updated successfully!");
                void onRefreshData();
              } catch (err) {
                toast.error(getApiErrorMessage(err, "Could not save slug. Try again."));
              } finally {
                setSlugSaving(false);
              }
            }}
          >
            Save
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="secondary"
        size="sm"
        startIcon={<PiPencilSimpleBold className="size-4" />}
        onClick={() => {
          setSlugDraft(workspace?.public_slug?.trim() ?? "");
          setSlugError(null);
          setPublicSiteEditMode(true);
        }}
      >
        Edit slug
      </Button>
    );
  })();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Public site"
        description="Manage your public subdomain and routing URLs."
        actions={panelActions}
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {workspace ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-4 p-6 md:col-span-2">
              <p className="text-caption uppercase tracking-wide text-muted-foreground">
                Public slug
              </p>
              <Input
                className="font-mono"
                value={publicSiteEditMode ? slugDraft : slug || ""}
                placeholder={publicSiteEditMode ? "e.g. my-restaurant" : "Not set"}
                disabled={!publicSiteEditMode || slugSaving}
                onChange={(e) =>
                  setSlugDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                autoComplete="off"
              />
              {publicSiteEditMode && slugAvailabilityLabel ? (
                <p className="text-caption">{slugAvailabilityLabel}</p>
              ) : null}
            </Card>
            <Card className="space-y-3 p-6 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-caption uppercase tracking-wide text-muted-foreground">
                  Landing URL
                </p>
                {landingUrl ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void copyToClipboard(landingUrl)}
                  >
                    Copy URL
                  </Button>
                ) : null}
              </div>
              {landingUrl ? (
                <a
                  href={landingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-body font-semibold text-foreground hover:underline"
                >
                  {landingUrl}
                </a>
              ) : (
                <p className="text-body text-muted-foreground">
                  Set a public slug to generate your landing page URL.
                </p>
              )}
            </Card>
            <Card className="space-y-3 p-6 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-caption uppercase tracking-wide text-muted-foreground">
                  Guest menu URL
                </p>
                {menuUrl ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void copyToClipboard(menuUrl)}
                  >
                    Copy URL
                  </Button>
                ) : null}
              </div>
              {menuUrl ? (
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-body font-semibold text-primary hover:underline"
                >
                  {menuUrl}
                </a>
              ) : (
                <p className="text-body text-muted-foreground">
                  Set a public slug to generate the guest menu URL.
                </p>
              )}
            </Card>
          </div>
        ) : (
          <EmptyState
            icon={<PiLinkBold className="size-8" />}
            title="Create a workspace first"
            description="Public tenant URLs are tied to your workspace public slug."
            action={
              <Button
                onClick={onOpenAddWorkspaceModal}
                startIcon={<PiPlusBold className="size-5" />}
              >
                Create workspace
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
