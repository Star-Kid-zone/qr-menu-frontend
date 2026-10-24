"use client";

import React from "react";
import {
  PiImagesBold,
  PiPlayCircleBold,
  PiTrashBold,
  PiUploadSimpleBold,
  PiVideoFill,
  PiCheckCircleBold,
} from "react-icons/pi";
import { Button, Spinner } from "@/shared/components";
import type { ActivePosterInfo, SocialTabId } from "../../types";
import type { ComposePlatformInfo } from "./types";

export interface ComposeMediaSectionProps {
  activePoster: ActivePosterInfo | null;
  uploading: boolean;
  onUpload: (file?: File) => void;
  setActiveTab: (tab: SocialTabId) => void;
  setAssetId: (id: string) => void;
  setWeeklyPosterId: (id: string) => void;
  setPlatformAssetId: (id: string) => void;
  platforms: ComposePlatformInfo[];
}

export function ComposeMediaSection({
  activePoster,
  uploading,
  onUpload,
  setActiveTab,
  setAssetId,
  setWeeklyPosterId,
  setPlatformAssetId,
  platforms,
}: ComposeMediaSectionProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-5 shadow-xs transition-all hover:border-primary/30">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
            01
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Media Asset</span>
              {activePoster && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Selected
                </span>
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Photo, promotional banner, or 9:16 vertical video reel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary shadow-xs transition hover:bg-primary hover:text-primary-foreground active:scale-95">
              {uploading ? (
                <Spinner size="sm" />
              ) : (
                <PiUploadSimpleBold className="size-3.5" />
              )}
              <span>Upload Photo / Video</span>
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            startIcon={<PiImagesBold className="size-3.5" />}
            onClick={() => setActiveTab("library")}
            className="shadow-2xs"
          >
            Browse Library
          </Button>
        </div>
      </div>

      <div className="pt-4">
        {activePoster ? (
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card/90 via-muted/20 to-card p-4 shadow-sm group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Thumbnail */}
                <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-neutral-950 shadow-md group-hover:scale-[1.02] transition-transform duration-300">
                  {activePoster.isVideo ? (
                    <div className="relative size-full bg-neutral-950 flex items-center justify-center">
                      <video
                        src={activePoster.url}
                        className="size-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md shadow-lg ring-1 ring-white/30">
                          <PiPlayCircleBold size={22} className="text-white" />
                        </div>
                      </div>
                    </div>
                  ) : activePoster.url ? (
                    <img
                      src={activePoster.url}
                      alt={activePoster.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
                      <PiImagesBold size={28} />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground text-sm truncate max-w-sm">
                      {activePoster.title}
                    </p>
                    {activePoster.isVideo ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 text-pink-400 border border-pink-500/30 px-2.5 py-0.5 text-[9px] font-black tracking-wide shadow-xs">
                        <PiVideoFill size={11} className="text-pink-400 animate-pulse" />
                        9:16 REEL / VIDEO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold">
                        <PiCheckCircleBold size={11} /> PHOTO READY
                      </span>
                    )}
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
                      {activePoster.type}
                    </span>
                  </div>

                  {activePoster.isVideo ? (
                    <p className="text-xs text-pink-400/90 font-medium">
                      ✨ Video formatted for Instagram Reels, TikTok, and X Video posts.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Photo ready for Facebook, Instagram feed, Twitter / X &amp; LinkedIn.
                    </p>
                  )}

                  {/* Quick Platform Readiness Chips */}
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="text-[10px] font-semibold text-muted-foreground mr-1">
                      Ready for:
                    </span>
                    {platforms.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5 text-[10px] font-semibold border border-border/80 text-foreground/80 shadow-2xs"
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: p.brandColor }}
                        />
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("library")}
                  className="shadow-2xs"
                >
                  Change Media
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setAssetId("");
                    setWeeklyPosterId("");
                    setPlatformAssetId("");
                  }}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors"
                  title="Remove media"
                >
                  <PiTrashBold className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 bg-gradient-to-b from-card to-primary/5 py-8 px-4 text-center transition-all hover:border-primary/50">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
              <PiUploadSimpleBold size={26} />
            </div>
            <div className="max-w-md space-y-1">
              <p className="text-sm font-bold text-foreground">
                Select media for your post
              </p>
              <p className="text-xs text-muted-foreground">
                Upload high-res restaurant photos, promotional posters, or short-form MP4/MOV videos for Instagram Reels &amp; TikTok.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
              <label className="cursor-pointer">
                <span className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-95">
                  <PiUploadSimpleBold className="size-4" />
                  <span>Upload File</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                  disabled={uploading}
                />
              </label>
              <Button
                type="button"
                variant="secondary"
                size="md"
                startIcon={<PiImagesBold className="size-4" />}
                onClick={() => setActiveTab("library")}
                className="shadow-2xs"
              >
                Choose from Poster Library
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
