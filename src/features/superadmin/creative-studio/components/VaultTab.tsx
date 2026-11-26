"use client";

import React from "react";
import {
  Card,
  Button,
  Spinner,
  EmptyState,
} from "@/components/ui";
import { Modal } from "@/components/Modal";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import {
  PiImagesBold,
  PiCheckCircleBold,
  PiEyeBold,
  PiPaperPlaneTiltBold,
  PiTrashBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { VAULT_TYPE_LABELS, VAULT_TARGET_OPTIONS } from "@/constants/studio.constants";
import type { PlatformMarketingAsset, IndustryItem } from "../types";

interface VaultTabProps {
  vaultStats: {
    total: number;
    published: number;
    images: number;
    videos: number;
    specs: number;
  };
  typeFilter: "all" | "image" | "video" | "poster_spec";
  setTypeFilter: (filter: "all" | "image" | "video" | "poster_spec") => void;
  publishedFilter: "all" | "published" | "draft";
  setPublishedFilter: (filter: "all" | "published" | "draft") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadingAssets: boolean;
  filteredAssets: PlatformMarketingAsset[];
  previewAsset: PlatformMarketingAsset | null;
  setPreviewAsset: (asset: PlatformMarketingAsset | null) => void;
  publishModalAsset: PlatformMarketingAsset | null;
  setPublishModalAsset: (asset: PlatformMarketingAsset | null) => void;
  publishTarget: "all" | "industry" | "selected_tenants";
  setPublishTarget: (target: "all" | "industry" | "selected_tenants") => void;
  selectedIndustryId: string;
  setSelectedIndustryId: (id: string) => void;
  targetWorkspaceIds: string;
  setTargetWorkspaceIds: (ids: string) => void;
  publishing: boolean;
  handlePublishAsset: () => Promise<void>;
  handleDeleteAsset: (id: string) => Promise<void>;
  industries: IndustryItem[];
}

const TYPE_LABELS: Record<string, string> = VAULT_TYPE_LABELS;

const TARGET_OPTIONS: readonly { value: "all" | "industry" | "selected_tenants"; label: string }[] = VAULT_TARGET_OPTIONS;

export function VaultTab({
  vaultStats,
  typeFilter,
  setTypeFilter,
  publishedFilter,
  setPublishedFilter,
  searchQuery,
  setSearchQuery,
  loadingAssets,
  filteredAssets,
  previewAsset,
  setPreviewAsset,
  publishModalAsset,
  setPublishModalAsset,
  publishTarget,
  setPublishTarget,
  selectedIndustryId,
  setSelectedIndustryId,
  targetWorkspaceIds,
  setTargetWorkspaceIds,
  publishing,
  handlePublishAsset,
  handleDeleteAsset,
  industries,
}: VaultTabProps) {
  const [pendingDelete, setPendingDelete] = React.useState<PlatformMarketingAsset | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const filterButton = (active: boolean) => (active ? "secondary" : "ghost");

  return (
    <div className="space-y-6">
      {/* Quick metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card className="p-4">
          <div className="text-caption text-muted-foreground">Saved assets</div>
          <div className="mt-1 text-h3 text-foreground">{vaultStats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-caption text-muted-foreground">Sent to restaurants</div>
          <div className="mt-1 text-h3 text-foreground">{vaultStats.published}</div>
        </Card>
        <Card className="p-4">
          <div className="text-caption text-muted-foreground">Photos and graphics</div>
          <div className="mt-1 text-h3 text-foreground">{vaultStats.images}</div>
        </Card>
        <Card className="p-4">
          <div className="text-caption text-muted-foreground">Reels</div>
          <div className="mt-1 text-h3 text-foreground">{vaultStats.videos}</div>
        </Card>
        <Card className="p-4">
          <div className="text-caption text-muted-foreground">Poster layouts</div>
          <div className="mt-1 text-h3 text-foreground">{vaultStats.specs}</div>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg border border-border bg-muted/40 p-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 overflow-x-auto">
          <div role="group" aria-label="Filter by type" className="flex items-center gap-2">
            <Button variant={filterButton(typeFilter === "all")} size="sm" aria-pressed={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
              All types
            </Button>
            <Button variant={filterButton(typeFilter === "image")} size="sm" aria-pressed={typeFilter === "image"} onClick={() => setTypeFilter("image")}>
              Images ({vaultStats.images})
            </Button>
            <Button variant={filterButton(typeFilter === "video")} size="sm" aria-pressed={typeFilter === "video"} onClick={() => setTypeFilter("video")}>
              Reels ({vaultStats.videos})
            </Button>
            <Button
              variant={filterButton(typeFilter === "poster_spec")}
              size="sm"
              aria-pressed={typeFilter === "poster_spec"}
              onClick={() => setTypeFilter("poster_spec")}
            >
              Poster layouts ({vaultStats.specs})
            </Button>
          </div>

          <div className="mx-1 h-4 w-px bg-border" aria-hidden />

          <div role="group" aria-label="Filter by status" className="flex items-center gap-2">
            <Button
              variant={filterButton(publishedFilter === "all")}
              size="sm"
              aria-pressed={publishedFilter === "all"}
              onClick={() => setPublishedFilter("all")}
            >
              Any status
            </Button>
            <Button
              variant={filterButton(publishedFilter === "published")}
              size="sm"
              aria-pressed={publishedFilter === "published"}
              onClick={() => setPublishedFilter("published")}
            >
              Sent
            </Button>
            <Button
              variant={filterButton(publishedFilter === "draft")}
              size="sm"
              aria-pressed={publishedFilter === "draft"}
              onClick={() => setPublishedFilter("draft")}
            >
              Not sent yet
            </Button>
          </div>
        </div>

        <SearchInput
          aria-label="Search saved assets"
          placeholder="Search saved assets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      {/* Assets grid */}
      {loadingAssets ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="size-8 text-primary" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          icon={<PiImagesBold className="size-10 text-muted-foreground" />}
          title="No saved assets yet"
          description="Generate pictures, copy a flyer's layout, or generate with your ChatGPT or Ideogram login to add assets here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="group relative flex flex-col overflow-hidden transition-colors hover:border-primary/40">
              <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-muted">
                {asset.type === "video" ? (
                  <video
                    src={asset.mediaUrl}
                    className="h-full w-full object-cover"
                    controls={false}
                    muted
                    loop
                    playsInline
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img
                    src={asset.thumbnailUrl || asset.mediaUrl}
                    alt={asset.title}
                    className="h-full w-full object-cover"
                  />
                )}

                <div className="absolute left-2.5 top-2.5 flex items-center gap-2">
                  <span className="rounded-md bg-card/90 px-2 py-0.5 text-caption font-medium text-foreground">
                    {TYPE_LABELS[asset.type] ?? asset.type}
                  </span>
                  <span className="rounded-md bg-card/90 px-2 py-0.5 text-caption text-muted-foreground">
                    {asset.aspectRatio || "4:5"}
                  </span>
                </div>

                <div className="absolute right-2.5 top-2.5">
                  {asset.isPublishedToTenants ? (
                    <span className="flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-caption font-medium text-success-foreground">
                      <PiCheckCircleBold className="size-3" aria-hidden />
                      Sent
                    </span>
                  ) : (
                    <span className="rounded-full bg-card/90 px-2 py-0.5 text-caption font-medium text-muted-foreground">
                      Not sent yet
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-body-medium text-foreground" title={asset.title}>
                  {asset.title}
                </h3>

                {asset.captionSuggestion && (
                  <p className="mt-2 line-clamp-2 text-caption text-muted-foreground">{asset.captionSuggestion}</p>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-caption text-muted-foreground">
                  <span>
                    For:{" "}
                    <span className="font-medium text-foreground">
                      {asset.targetAudience === "selected_tenants"
                        ? "Specific restaurants"
                        : asset.targetAudience === "industry"
                          ? "One industry"
                          : "All restaurants"}
                    </span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewAsset(asset)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      aria-label={`Preview ${asset.title}`}
                      title="Preview"
                    >
                      <PiEyeBold className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPublishModalAsset(asset);
                        setPublishTarget(asset.targetAudience || "all");
                        setSelectedIndustryId(asset.targetIndustryId || "");
                      }}
                      className="rounded-md p-2 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      aria-label={`Send ${asset.title} to restaurants`}
                      title="Send to restaurants"
                    >
                      <PiPaperPlaneTiltBold className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(asset)}
                      className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      aria-label={`Delete ${asset.title}`}
                      title="Delete"
                    >
                      <PiTrashBold className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview dialog */}
      <Modal
        isOpen={Boolean(previewAsset)}
        onClose={() => setPreviewAsset(null)}
        title={previewAsset?.title ?? "Preview"}
        maxWidth="max-w-2xl"
        footer={
          previewAsset ? (
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => setPreviewAsset(null)}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setPublishModalAsset(previewAsset);
                  setPreviewAsset(null);
                }}
              >
                Send to restaurants
              </Button>
            </ModalFooter>
          ) : null
        }
      >
        {previewAsset && (
          <div className="space-y-4">
            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-caption font-medium text-foreground">
              {TYPE_LABELS[previewAsset.type] ?? previewAsset.type}
            </span>

            <div className="flex max-h-96 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {previewAsset.type === "video" ? (
                <video src={previewAsset.mediaUrl} controls className="h-full max-h-96 w-full object-contain" />
              ) : (
                <img src={previewAsset.mediaUrl} alt={previewAsset.title} className="h-full max-h-96 w-full object-contain" />
              )}
            </div>

            {previewAsset.captionSuggestion && (
              <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-caption text-muted-foreground">Suggested caption</p>
                <p className="text-body text-foreground">{previewAsset.captionSuggestion}</p>
              </div>
            )}

            {previewAsset.hashtags && previewAsset.hashtags.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Hashtags">
                {previewAsset.hashtags.map((h, i) => (
                  <li key={i} className="rounded bg-primary/10 px-2 py-0.5 text-caption font-medium text-primary">
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>

      {/* Send dialog */}
      <Modal
        isOpen={Boolean(publishModalAsset)}
        onClose={() => setPublishModalAsset(null)}
        title="Send to restaurants"
        maxWidth="max-w-lg"
        footer={
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setPublishModalAsset(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handlePublishAsset} loading={publishing}>
              Send to restaurants
            </Button>
          </ModalFooter>
        }
      >
        {publishModalAsset && (
          <div className="space-y-4">
            <p className="text-body text-muted-foreground">
              Choose which restaurants get &ldquo;{publishModalAsset.title}&rdquo; in their social media library.
            </p>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-body-medium text-foreground">Who gets it</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {TARGET_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-body transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                      publishTarget === opt.value
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name="publish-target"
                      value={opt.value}
                      checked={publishTarget === opt.value}
                      onChange={() => setPublishTarget(opt.value)}
                      className="size-4 shrink-0 accent-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {publishTarget === "industry" && (
              <FormField label="Industry" htmlFor="publish-industry" required>
                <Select
                  id="publish-industry"
                  value={selectedIndustryId}
                  onChange={(e) => setSelectedIndustryId(e.target.value)}
                  placeholder="Choose an industry"
                  options={industries.map((ind) => ({
                    value: String(ind.id),
                    label: ind.name || ind.title || `Industry #${ind.id}`,
                  }))}
                />
              </FormField>
            )}

            {publishTarget === "selected_tenants" && (
              <FormField
                label="Restaurant IDs"
                htmlFor="publish-workspace-ids"
                required
                hint="Separate with commas, e.g. 1, 4, 12"
              >
                <Input
                  id="publish-workspace-ids"
                  value={targetWorkspaceIds}
                  onChange={(e) => setTargetWorkspaceIds(e.target.value)}
                />
              </FormField>
            )}

            <p className="text-caption text-muted-foreground">
              Restaurants get the full-size file with a suggested caption and hashtags. They can post it to their
              connected accounts or download it to print or share on WhatsApp.
            </p>
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={pendingDelete !== null}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          setDeleting(true);
          try {
            await handleDeleteAsset(pendingDelete.id);
            setPendingDelete(null);
          } finally {
            setDeleting(false);
          }
        }}
        title={`Delete "${pendingDelete?.title ?? ""}"?`}
        description="It will also disappear for every restaurant it was sent to. This can't be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
