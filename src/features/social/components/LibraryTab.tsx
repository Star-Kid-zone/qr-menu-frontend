"use client";

import React from "react";
import {
  PiImagesBold,
  PiPaperPlaneTiltBold,
  PiPlayCircleBold,
  PiSparkleBold,
  PiUploadSimpleBold,
  PiVideoFill,
} from "react-icons/pi";
import { Badge } from "@/shared/components";
import { Button } from "@/shared/components";
import { Card } from "@/shared/components";
import { EmptyState } from "@/shared/components";
import { PageHeader } from "@/shared/components";
import { Spinner } from "@/shared/components";
import { cn } from "@/shared/utils";
import type {
  LibraryFilter,
  PlatformMarketingAsset,
  SocialAsset,
  WeeklyPoster,
} from "../types";

interface LibraryTabProps {
  assets: SocialAsset[];
  weeklyPosters: WeeklyPoster[];
  platformAssets: PlatformMarketingAsset[];
  libraryFilter: LibraryFilter;
  onFilterChange: (filter: LibraryFilter) => void;
  assetId: string;
  weeklyPosterId: string;
  platformAssetId: string;
  uploading: boolean;
  onUpload: (file?: File) => void;
  onSelectAsset: (asset: SocialAsset) => void;
  onSelectWeeklyPoster: (poster: WeeklyPoster) => void;
  onSelectPlatformAsset: (asset: PlatformMarketingAsset) => void;
}

export function LibraryTab({
  assets,
  weeklyPosters,
  platformAssets,
  libraryFilter,
  onFilterChange,
  assetId,
  weeklyPosterId,
  platformAssetId,
  uploading,
  onUpload,
  onSelectAsset,
  onSelectWeeklyPoster,
  onSelectPlatformAsset,
}: LibraryTabProps) {
  const displayedPlatform =
    libraryFilter === "uploads" ||
    libraryFilter === "videos" ||
    libraryFilter === "weekly"
      ? []
      : platformAssets;
  const displayedAssets =
    libraryFilter === "weekly" || libraryFilter === "platform"
      ? []
      : libraryFilter === "videos"
        ? assets.filter((a) => a.mediaType === "video")
        : assets;
  const displayedWeekly =
    libraryFilter === "uploads" ||
    libraryFilter === "videos" ||
    libraryFilter === "platform"
      ? []
      : weeklyPosters;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Poster & Media Library"
        actions={
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90">
                {uploading ? (
                  <Spinner size="sm" />
                ) : (
                  <PiUploadSimpleBold className="size-4" />
                )}
                Upload Photo / Reel
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={(e) => onUpload(e.target.files?.[0])}
                disabled={uploading}
              />
            </label>
          </div>
        }
      />

      {/* Filter Pills */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {(["all", "platform", "uploads", "videos", "weekly"] as const).map(
          (filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition shrink-0 flex items-center gap-1.5",
                libraryFilter === filter
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {filter === "platform" && (
                <PiSparkleBold className="size-3 text-amber-300" />
              )}
              {filter === "all"
                ? `All Media (${assets.length + weeklyPosters.length + platformAssets.length})`
                : filter === "platform"
                  ? `Platform Specials (${platformAssets.length})`
                  : filter === "uploads"
                    ? `Your Uploads (${assets.length})`
                    : filter === "videos"
                      ? `Videos & Reels (${assets.filter((a) => a.mediaType === "video").length})`
                      : `Weekly Specials (${weeklyPosters.length})`}
            </button>
          ),
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {displayedPlatform.length === 0 &&
        displayedWeekly.length === 0 &&
        displayedAssets.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <EmptyState
              icon={<PiImagesBold size={32} />}
              title="No media assets found"
              action={
                <label className="cursor-pointer">
                  <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90">
                    <PiUploadSimpleBold className="size-4" /> Upload First Photo or Reel
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={(e) => onUpload(e.target.files?.[0])}
                    disabled={uploading}
                  />
                </label>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-6">
            {/* Platform Master Specials */}
            {displayedPlatform.map((pa) => {
              const isSelected = platformAssetId === pa.id;
              return (
                <Card
                  key={`platform-${pa.id}`}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-150 hover:shadow-md",
                    isSelected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border",
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                    <img
                      src={pa.thumbnailUrl ?? pa.mediaUrl}
                      alt={pa.title}
                      className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        tone="warning"
                        className="shadow-xs text-[8px] flex items-center gap-1 bg-amber-500/90 text-black font-bold"
                      >
                        <PiSparkleBold className="size-2.5" /> Platform Special
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-2xs transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                        onClick={() => onSelectPlatformAsset(pa)}
                      >
                        Use in Post
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate font-semibold text-foreground text-xs">
                      {pa.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {pa.categoryTag || "General Special"}
                    </p>
                  </div>
                </Card>
              );
            })}

            {/* Weekly Specials */}
            {displayedWeekly.map((poster) => {
              const isSelected = weeklyPosterId === poster.id;
              return (
                <Card
                  key={`weekly-${poster.id}`}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-150 hover:shadow-md",
                    isSelected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border",
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                    <img
                      src={poster.imageUrl}
                      alt={poster.title}
                      className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge tone="primary" className="shadow-xs text-[8px]">
                        Weekly Poster
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-2xs transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                        onClick={() => onSelectWeeklyPoster(poster)}
                      >
                        Use in Post
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate font-semibold text-foreground text-xs">
                      {poster.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {poster.weekStart ? `Week of ${new Date(poster.weekStart).toLocaleDateString()}` : "Special"}
                    </p>
                  </div>
                </Card>
              );
            })}

            {/* Uploaded Assets */}
            {displayedAssets.map((asset) => {
              const isSelected = assetId === asset.id;
              const isVideo = asset.mediaType === "video";
              return (
                <Card
                  key={`asset-${asset.id}`}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-150 hover:shadow-md",
                    isSelected
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border",
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted/30 flex items-center justify-center">
                    {isVideo ? (
                      <>
                        <video
                          src={asset.publishingUrl}
                          className="size-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                          <span className="flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs">
                            <PiPlayCircleBold className="size-6" />
                          </span>
                        </div>
                      </>
                    ) : (
                      <img
                        src={asset.thumbnailUrl ?? asset.publishingUrl}
                        alt={asset.originalFilename}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-2 left-2">
                      {isVideo ? (
                        <Badge
                          tone="primary"
                          className="shadow-xs text-[8px] flex items-center gap-1"
                        >
                          <PiVideoFill className="size-2.5" /> Reel / Video
                        </Badge>
                      ) : (
                        <Badge tone="neutral" className="shadow-xs text-[8px]">
                          Upload
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-2xs transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                        onClick={() => onSelectAsset(asset)}
                      >
                        Use in Post
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate font-semibold text-foreground text-xs">
                      {asset.originalFilename}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Uploaded {new Date(asset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
