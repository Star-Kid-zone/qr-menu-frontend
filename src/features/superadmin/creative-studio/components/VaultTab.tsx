"use client";

import React from "react";
import {
  Card,
  Button,
  Spinner,
  EmptyState,
} from "@/shared/components";
import {
  PiImagesBold,
  PiCheckCircleBold,
  PiEyeBold,
  PiPaperPlaneTiltBold,
  PiTrashBold,
  PiMagnifyingGlassBold,
  PiXBold,
  PiSpinnerBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
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
  handleDeleteAsset: (id: string | number) => Promise<void>;
  industries: IndustryItem[];
}

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
  return (
    <div className="space-y-6">
      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card className="p-4 bg-card/60 backdrop-blur-sm border-border">
          <div className="text-caption text-muted-foreground">Total Assets</div>
          <div className="text-2xl font-bold mt-1 text-foreground">{vaultStats.total}</div>
        </Card>
        <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
          <div className="text-caption text-emerald-600 dark:text-emerald-400 font-medium">
            Published to Tenants
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {vaultStats.published}
          </div>
        </Card>
        <Card className="p-4 bg-card/60 border-border">
          <div className="text-caption text-muted-foreground">Photos & Graphics</div>
          <div className="text-2xl font-bold mt-1 text-foreground">{vaultStats.images}</div>
        </Card>
        <Card className="p-4 bg-purple-500/5 border-purple-500/20">
          <div className="text-caption text-purple-600 dark:text-purple-400 font-medium">
            Video Reels
          </div>
          <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
            {vaultStats.videos}
          </div>
        </Card>
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="text-caption text-amber-600 dark:text-amber-400 font-medium">
            Layout Blueprints
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
            {vaultStats.specs}
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button
            variant={typeFilter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTypeFilter("all")}
          >
            All Types
          </Button>
          <Button
            variant={typeFilter === "image" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTypeFilter("image")}
          >
            Images ({vaultStats.images})
          </Button>
          <Button
            variant={typeFilter === "video" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTypeFilter("video")}
          >
            Reels ({vaultStats.videos})
          </Button>
          <Button
            variant={typeFilter === "poster_spec" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTypeFilter("poster_spec")}
          >
            Specs ({vaultStats.specs})
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          <Button
            variant={publishedFilter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPublishedFilter("all")}
          >
            Status: All
          </Button>
          <Button
            variant={publishedFilter === "published" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPublishedFilter("published")}
          >
            Published
          </Button>
          <Button
            variant={publishedFilter === "draft" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPublishedFilter("draft")}
          >
            Drafts
          </Button>
        </div>

        <div className="relative min-w-[220px]">
          <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Assets Grid */}
      {loadingAssets ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          icon={<PiImagesBold className="h-10 w-10 text-muted-foreground" />}
          title="No assets found"
          description="Generate AI pictures, decode flyers, or run browser automation to populate your Vault."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className="group relative flex flex-col overflow-hidden border-border bg-card transition-all hover:shadow-lg hover:border-primary/40"
            >
              {/* Media Preview Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
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
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Top Floating Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white uppercase backdrop-blur-md">
                    {asset.type === "poster_spec" ? "Blueprint" : asset.type}
                  </span>
                  <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-300 backdrop-blur-md">
                    {asset.aspectRatio || "4:5"}
                  </span>
                </div>

                {/* Published Status Pill */}
                <div className="absolute top-2.5 right-2.5">
                  {asset.isPublishedToTenants ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm backdrop-blur-md">
                      <PiCheckCircleBold className="h-3 w-3" />
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
                      Vault Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-body line-clamp-1 text-foreground" title={asset.title}>
                  {asset.title}
                </h3>

                {asset.captionSuggestion && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                    {asset.captionSuggestion}
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Target:{" "}
                    <strong className="text-foreground capitalize font-medium">
                      {asset.targetAudience === "selected_tenants"
                        ? "Custom Tenants"
                        : asset.targetAudience === "industry"
                        ? "Industry"
                        : "All Tenants"}
                    </strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewAsset(asset)}
                      className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Preview details"
                    >
                      <PiEyeBold className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setPublishModalAsset(asset);
                        setPublishTarget(asset.targetAudience || "all");
                        setSelectedIndustryId(asset.targetIndustryId || "");
                      }}
                      className="rounded-lg p-1.5 hover:bg-primary/10 text-primary transition-colors"
                      title="Publish / Dispatch to Tenants"
                    >
                      <PiPaperPlaneTiltBold className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="rounded-lg p-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                      title="Delete"
                    >
                      <PiTrashBold className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Preview Asset Details */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setPreviewAsset(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PiXBold className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary uppercase">
                  {previewAsset.type}
                </span>
                <h3 className="text-lg font-bold text-foreground">{previewAsset.title}</h3>
              </div>

              <div className="max-h-[380px] w-full rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-border">
                {previewAsset.type === "video" ? (
                  <video src={previewAsset.mediaUrl} controls className="h-full w-full object-contain" />
                ) : (
                  <img
                    src={previewAsset.mediaUrl}
                    alt={previewAsset.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              {previewAsset.captionSuggestion && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Suggested Caption
                  </span>
                  <p className="text-sm text-foreground">{previewAsset.captionSuggestion}</p>
                </div>
              )}

              {previewAsset.hashtags && previewAsset.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {previewAsset.hashtags.map((h, i) => (
                    <span
                      key={i}
                      className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setPreviewAsset(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setPublishModalAsset(previewAsset);
                    setPreviewAsset(null);
                  }}
                >
                  <PiPaperPlaneTiltBold className="h-4 w-4 mr-1.5" />
                  Publish to Tenants
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Publish / Dispatch Asset to Tenants */}
      {publishModalAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setPublishModalAsset(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <PiXBold className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <PiPaperPlaneTiltBold className="h-5 w-5 text-primary" />
                  Dispatch Asset to Tenant Inboxes
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  Select which tenant workspaces should receive &ldquo;{publishModalAsset.title}&rdquo; in their
                  social media marketing library.
                </p>
              </div>

              {/* Target Audience Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPublishTarget("all")}
                    className={cn(
                      "rounded-xl border p-3 text-center text-xs transition-all",
                      publishTarget === "all"
                        ? "border-primary bg-primary/10 font-bold text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    All Tenants
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishTarget("industry")}
                    className={cn(
                      "rounded-xl border p-3 text-center text-xs transition-all",
                      publishTarget === "industry"
                        ? "border-primary bg-primary/10 font-bold text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    By Industry
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishTarget("selected_tenants")}
                    className={cn(
                      "rounded-xl border p-3 text-center text-xs transition-all",
                      publishTarget === "selected_tenants"
                        ? "border-primary bg-primary/10 font-bold text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Specific IDs
                  </button>
                </div>
              </div>

              {/* Industry Dropdown if selected */}
              {publishTarget === "industry" && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Choose Target Industry
                  </label>
                  <select
                    value={selectedIndustryId}
                    onChange={(e) => setSelectedIndustryId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select an industry...</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name || ind.title || `Industry #${ind.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Specific IDs input if selected */}
              {publishTarget === "selected_tenants" && (
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Workspace IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1, 4, 12"
                    value={targetWorkspaceIds}
                    onChange={(e) => setTargetWorkspaceIds(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground block mb-0.5">Distribution Guarantee:</span>
                Tenants receive the high-resolution media, pre-filled captions, and hashtag suggestions.
                They can publish on their connected accounts or download for local print/WhatsApp.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setPublishModalAsset(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePublishAsset}
                  disabled={publishing}
                >
                  {publishing ? (
                    <>
                      <PiSpinnerBold className="h-4 w-4 animate-spin mr-1.5" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="h-4 w-4 mr-1.5" />
                      Dispatch to Inboxes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
