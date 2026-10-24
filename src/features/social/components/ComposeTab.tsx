"use client";

import React from "react";
import {
  PiArrowRightBold,
  PiCalendarBlankBold,
  PiCheckBold,
  PiCheckCircleBold,
  PiClockBold,
  PiFacebookLogoFill,
  PiHashBold,
  PiImagesBold,
  PiInstagramLogoFill,
  PiLinkedinLogoFill,
  PiPaperPlaneTiltBold,
  PiPlayCircleBold,
  PiRepeatBold,
  PiSparkleBold,
  PiTagBold,
  PiTiktokLogoFill,
  PiTrashBold,
  PiUploadSimpleBold,
  PiVideoFill,
} from "react-icons/pi";
import { SiX } from "react-icons/si";
import { Button } from "@/shared/components";
import { PageHeader } from "@/shared/components";
import { Spinner } from "@/shared/components";
import { cn } from "@/shared/utils";
import {
  PLATFORM_META,
  tokenStatusBadge,
  type SocialAccount,
  type SocialPlatform,
} from "@/services/social.service";
import { POPULAR_HASHTAGS } from "../constants";
import type {
  ActivePosterInfo,
  RecurrenceRule,
  SocialTabId,
} from "../types";

export interface ComposeTabProps {
  accounts: SocialAccount[];
  activePoster: ActivePosterInfo | null;
  setAssetId: (id: string) => void;
  setWeeklyPosterId: (id: string) => void;
  setPlatformAssetId: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  schedule: string;
  setSchedule: (schedule: string) => void;
  captions: Record<string, string>;
  setCaptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedAccountIds: Set<string>;
  setSelectedAccountIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  syncCaptions: boolean;
  setSyncCaptions: (sync: boolean) => void;
  activeComposerPlatform: SocialPlatform | null;
  setActiveComposerPlatform: (platform: SocialPlatform | null) => void;
  recurrenceRule: RecurrenceRule;
  setRecurrenceRule: (rule: RecurrenceRule) => void;
  recurrenceEndDate: string;
  setRecurrenceEndDate: (date: string) => void;
  busy: boolean;
  uploading: boolean;
  onUpload: (file?: File) => void;
  onPublishOrSchedule: (mode: "now" | "schedule") => void;
  onConnectPlatform: (platform: SocialPlatform) => void;
  setActiveTab: (tab: SocialTabId) => void;
}

export function ComposeTab({
  accounts,
  activePoster,
  setAssetId,
  setWeeklyPosterId,
  setPlatformAssetId,
  title,
  setTitle,
  schedule,
  setSchedule,
  captions,
  setCaptions,
  selectedAccountIds,
  setSelectedAccountIds,
  syncCaptions,
  setSyncCaptions,
  activeComposerPlatform,
  setActiveComposerPlatform,
  recurrenceRule,
  setRecurrenceRule,
  recurrenceEndDate,
  setRecurrenceEndDate,
  busy,
  uploading,
  onUpload,
  onPublishOrSchedule,
  onConnectPlatform,
  setActiveTab,
}: ComposeTabProps) {
  const COMPOSE_PLATFORMS: Array<{
    id: SocialPlatform;
    name: string;
    subname: string;
    capabilities: string;
    icon: React.ReactNode;
    brandColor: string;
    gradient: string;
    glowShadow: string;
  }> = [
    {
      id: "instagram",
      name: "Instagram",
      subname: "Reels & Feed",
      capabilities: "Reels · Feed · Carousels",
      icon: <PiInstagramLogoFill className="size-5" />,
      brandColor: "#E1306C",
      gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
      glowShadow: "rgba(225, 48, 108, 0.35)",
    },
    {
      id: "facebook",
      name: "Facebook",
      subname: "Page & Videos",
      capabilities: "Page Posts · Videos · Feed",
      icon: <PiFacebookLogoFill className="size-5" />,
      brandColor: "#1877F2",
      gradient: "from-[#1877F2] to-[#0D65D9]",
      glowShadow: "rgba(24, 119, 242, 0.35)",
    },
    {
      id: "twitter",
      name: "Twitter / X",
      subname: "Short Updates & Media",
      capabilities: "Tweets · 280 chars · Media",
      icon: <SiX className="size-4" />,
      brandColor: "#FFFFFF",
      gradient: "from-neutral-800 to-black",
      glowShadow: "rgba(255, 255, 255, 0.2)",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      subname: "Professional Network",
      capabilities: "Articles · Company Feed",
      icon: <PiLinkedinLogoFill className="size-5" />,
      brandColor: "#0A66C2",
      gradient: "from-[#0A66C2] to-[#004182]",
      glowShadow: "rgba(10, 102, 194, 0.35)",
    },
    {
      id: "tiktok",
      name: "TikTok",
      subname: "Short-form Vertical Reels",
      capabilities: "9:16 Video · Sound",
      icon: <PiTiktokLogoFill className="size-5" />,
      brandColor: "#FE2C55",
      gradient: "from-neutral-950 via-neutral-900 to-black",
      glowShadow: "rgba(254, 44, 85, 0.35)",
    },
  ];

  const connectedCount = accounts.filter((a) => a.status === "connected").length;

  const selectAllConnected = () => {
    const ids = accounts.filter((a) => a.status === "connected").map((a) => a.id);
    setSelectedAccountIds(new Set(ids));
  };

  const deselectAll = () => {
    setSelectedAccountIds(new Set());
  };

  const setScheduleOffsetMinutes = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    const local = new Date(target.getTime() - target.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setSchedule(local);
  };

  const setScheduleTimeOfDay = (targetHour: number, daysAhead = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(targetHour, 0, 0, 0);
    if (daysAhead === 0 && d.getTime() <= Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setSchedule(local);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Top Header */}
      <PageHeader
        className="shrink-0"
        title="Compose & Publish"
        description="Design once, customize per network, and broadcast everywhere in one click."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              startIcon={<PiClockBold className="size-4 text-muted-foreground" />}
              onClick={() => setActiveTab("history")}
              className="shadow-2xs hover:border-primary/40 transition-colors"
            >
              Post History
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              startIcon={<PiImagesBold className="size-4 text-muted-foreground" />}
              onClick={() => setActiveTab("library")}
              className="shadow-2xs hover:border-primary/40 transition-colors"
            >
              Poster Library
            </Button>
          </div>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-5 pb-8">
          {/* ── STEP 1: MEDIA ASSET ─────────────────────────────────────── */}
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
                          {COMPOSE_PLATFORMS.map((p) => (
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

          {/* ── STEP 2: DESTINATIONS ────────────────────────────────────── */}
          <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
                  02
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>Destinations</span>
                    {selectedAccountIds.size > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold">
                        {selectedAccountIds.size} Selected
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Choose which social channels will broadcast this campaign
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {connectedCount > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={selectAllConnected}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
                    >
                      Deselect
                    </button>
                  </>
                )}
                <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
                  {connectedCount} of {COMPOSE_PLATFORMS.length} Connected
                </span>
              </div>
            </div>

            {/* Dynamic Platform Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {COMPOSE_PLATFORMS.map((platform) => {
                const platformAccounts = accounts.filter((a) => a.platform === platform.id);
                const isConnected = platformAccounts.length > 0;

                if (!isConnected) {
                  return (
                    <div
                      key={platform.id}
                      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-4 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br transition-transform group-hover:scale-105",
                            platform.gradient,
                          )}
                        >
                          {platform.icon}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-bold text-foreground text-sm truncate">
                            {platform.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            Not connected yet
                          </p>
                          <span className="inline-block text-[10px] text-muted-foreground/70">
                            {platform.capabilities}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onConnectPlatform(platform.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary group-hover:scale-105 active:scale-95 shrink-0"
                      >
                        <span>Connect</span>
                        <PiArrowRightBold className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  );
                }

                return platformAccounts.map((account) => {
                  const isSelected = selectedAccountIds.has(account.id);
                  const badge = tokenStatusBadge(account);

                  return (
                    <div
                      key={account.id}
                      onClick={() => {
                        setSelectedAccountIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(account.id)) next.delete(account.id);
                          else next.add(account.id);
                          return next;
                        });
                        if (!activeComposerPlatform) setActiveComposerPlatform(platform.id);
                      }}
                      className={cn(
                        "group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-200 select-none flex items-center justify-between gap-3",
                        isSelected
                          ? "border-primary/60 bg-gradient-to-r from-card to-primary/10 shadow-sm ring-1 ring-primary/30"
                          : "border-border/80 bg-card hover:border-border hover:bg-muted/30",
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div
                            className={cn(
                              "flex size-11 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br transition-transform group-hover:scale-105",
                              platform.gradient,
                            )}
                          >
                            {platform.icon}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-card shadow-xs" />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-foreground text-sm truncate">
                              {platform.name}
                            </p>
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded-full"
                              style={{
                                color: badge.color,
                                backgroundColor: badge.color + "20",
                              }}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium truncate">
                            {account.username ? `@${account.username}` : account.displayName}
                          </p>
                          <span className="inline-block text-[10px] text-muted-foreground/70">
                            {platform.capabilities}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-lg border transition-all duration-200",
                            isSelected
                              ? "bg-primary border-primary text-primary-foreground shadow-xs"
                              : "border-border bg-background text-transparent group-hover:border-primary/40",
                          )}
                        >
                          <PiCheckBold
                            className={cn(
                              "size-3.5 stroke-[3]",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>

          {/* ── STEP 3: CONTENT & CAPTIONS ──────────────────────────────── */}
          <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
                  03
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Content &amp; Captions</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Compose customized copy per platform or mirror one unified caption
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 hover:text-foreground transition-colors shadow-2xs">
                  <input
                    type="checkbox"
                    checked={syncCaptions}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSyncCaptions(checked);
                      if (checked) {
                        const first =
                          Object.values(captions).find((c) => c.trim()) || "";
                        if (first) {
                          const sync: Record<string, string> = { all: first };
                          selectedAccountIds.forEach((id) => {
                            sync[id] = first;
                          });
                          (
                            ["facebook", "instagram", "twitter", "linkedin", "tiktok"] as const
                          ).forEach((p) => {
                            sync[p] = first;
                          });
                          setCaptions((prev) => ({ ...prev, ...sync }));
                        }
                      }
                    }}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="font-semibold text-foreground">
                    Mirror caption across all channels
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {/* Campaign title */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <PiTagBold className="size-3.5 text-primary" />
                  <span>Campaign Title (optional internal note)</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Brunch Special or Chef's Tasting Menu"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Per-Platform Switcher Tabs (when not synced) */}
              {!syncCaptions && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Customize by Channel:
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Each network enforces unique length limits and formatting
                    </span>
                  </div>

                  <div className="flex gap-2 border-b border-border/60 pb-2 overflow-x-auto">
                    {COMPOSE_PLATFORMS.map((plat) => {
                      const meta = PLATFORM_META[plat.id];
                      const currentPlat = activeComposerPlatform || "instagram";
                      const isTabActive = currentPlat === plat.id;
                      const platCaption =
                        captions[plat.id] ?? (captions["all"] ?? "");
                      const charCount = platCaption.length;
                      const isOver = meta.maxCaptionLength
                        ? charCount > meta.maxCaptionLength
                        : false;

                      return (
                        <button
                          key={plat.id}
                          type="button"
                          onClick={() => setActiveComposerPlatform(plat.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-2xs",
                            isTabActive
                              ? "text-white shadow-sm ring-1 ring-white/20"
                              : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                          )}
                          style={
                            isTabActive
                              ? {
                                  backgroundColor: plat.brandColor,
                                  borderColor: plat.brandColor,
                                }
                              : {}
                          }
                        >
                          <span className="text-xs">{plat.icon}</span>
                          <span>{plat.name}</span>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-md font-mono",
                              isOver
                                ? "bg-red-500 text-white font-bold"
                                : isTabActive
                                  ? "bg-black/30 text-white/95"
                                  : "bg-muted text-muted-foreground",
                            )}
                          >
                            {charCount}/{meta.maxCaptionLength}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Textarea */}
              {syncCaptions ? (
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <PiSparkleBold className="size-3.5 text-primary" />
                      <span>Unified Caption (Mirrored across all connected platforms)</span>
                    </label>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {(captions["all"] ?? Object.values(captions)[0] ?? "").length} characters
                    </span>
                  </div>
                  <textarea
                    value={captions["all"] ?? Object.values(captions)[0] ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      const sync: Record<string, string> = { all: v };
                      selectedAccountIds.forEach((id) => {
                        sync[id] = v;
                      });
                      (
                        ["facebook", "instagram", "twitter", "linkedin", "tiktok"] as const
                      ).forEach((p) => {
                        sync[p] = v;
                      });
                      setCaptions((prev) => ({ ...prev, ...sync }));
                    }}
                    placeholder="Write an appetizing description of your special, include ingredients, timing, and calls to action..."
                    rows={4}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all leading-relaxed"
                  />
                </div>
              ) : (
                (() => {
                  const plat = activeComposerPlatform || "instagram";
                  const meta = PLATFORM_META[plat];
                  const currentPlatObj = COMPOSE_PLATFORMS.find((p) => p.id === plat);
                  const currentVal = captions[plat] ?? (captions["all"] ?? "");
                  const charCount = currentVal.length;
                  const isOver = meta.maxCaptionLength
                    ? charCount > meta.maxCaptionLength
                    : false;

                  return (
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground flex items-center gap-2">
                          <span
                            className="flex size-5 items-center justify-center rounded-md text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: meta.color }}
                          >
                            {currentPlatObj?.icon}
                          </span>
                          <span>{meta.label} Custom Caption</span>
                          {plat === "twitter" && (
                            <span className="text-[10px] text-muted-foreground font-normal">
                              (Tweet limit: 280 chars)
                            </span>
                          )}
                          {plat === "instagram" && (
                            <span className="text-[10px] text-muted-foreground font-normal">
                              (Reel &amp; Feed caption)
                            </span>
                          )}
                          {plat === "linkedin" && (
                            <span className="text-[10px] text-muted-foreground font-normal">
                              (Professional post)
                            </span>
                          )}
                        </label>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            isOver ? "text-red-500 font-bold" : "text-muted-foreground",
                          )}
                        >
                          {charCount} / {meta.maxCaptionLength} {isOver && "⚠️ EXCEEDS LIMIT"}
                        </span>
                      </div>
                      <textarea
                        value={currentVal}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCaptions((prev) => {
                            const next = { ...prev, [plat]: v };
                            const matchedAcc = accounts.find((a) => a.platform === plat);
                            if (matchedAcc) next[matchedAcc.id] = v;
                            return next;
                          });
                        }}
                        placeholder={`Write custom ${meta.label} caption with relevant tags...`}
                        rows={4}
                        className={cn(
                          "w-full rounded-xl border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 shadow-2xs focus:outline-none focus:ring-1 transition-all leading-relaxed",
                          isOver
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-border focus:border-primary focus:ring-primary",
                        )}
                      />
                    </div>
                  );
                })()
              )}

              {/* Quick Hashtags Toolbar */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <PiHashBold className="size-3 text-primary" />
                    <span>Popular Restaurant Hashtags</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground">Click to append</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const plat = activeComposerPlatform || "instagram";
                        if (syncCaptions) {
                          const prevAll =
                            captions["all"] ?? Object.values(captions)[0] ?? "";
                          const nextVal = prevAll ? `${prevAll} ${tag}` : tag;
                          const sync: Record<string, string> = { all: nextVal };
                          selectedAccountIds.forEach((id) => {
                            sync[id] = nextVal;
                          });
                          (
                            ["facebook", "instagram", "twitter", "linkedin", "tiktok"] as const
                          ).forEach((p) => {
                            sync[p] = nextVal;
                          });
                          setCaptions((prev) => ({ ...prev, ...sync }));
                        } else {
                          const prevPlat =
                            captions[plat] ?? (captions["all"] ?? "");
                          const nextVal = prevPlat ? `${prevPlat} ${tag}` : tag;
                          setCaptions((prev) => {
                            const next = { ...prev, [plat]: nextVal };
                            const matchedAcc = accounts.find((a) => a.platform === plat);
                            if (matchedAcc) next[matchedAcc.id] = nextVal;
                            return next;
                          });
                        }
                      }}
                      className="flex items-center gap-1 rounded-full border border-border/80 bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95 shadow-2xs"
                    >
                      <span className="text-primary/70">#</span>
                      <span>{tag.replace(/^#/, "")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurring Post / Autopilot Section */}
              <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-3.5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary shadow-xs shrink-0">
                      <PiRepeatBold className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span>Recurring Post (Autopilot)</span>
                        <span className="rounded-full bg-primary/20 px-2 py-0.2 text-[9px] font-bold text-primary">
                          Smart Automation
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically re-publish weekly specials, happy hours, or seasonal promos
                      </p>
                    </div>
                  </div>

                  <select
                    value={recurrenceRule}
                    onChange={(e) => setRecurrenceRule(e.target.value as any)}
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none shadow-2xs"
                  >
                    <option value="">Don't repeat</option>
                    <option value="daily">Repeat Daily</option>
                    <option value="weekly">Repeat Weekly</option>
                    <option value="biweekly">Repeat Every 2 Weeks</option>
                    <option value="monthly">Repeat Monthly</option>
                  </select>
                </div>

                {recurrenceRule && (
                  <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-border/40">
                    <label className="text-[11px] font-bold text-muted-foreground shrink-0">
                      Autopilot End Date:
                    </label>
                    <input
                      type="date"
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none shadow-2xs"
                    />
                    {recurrenceEndDate && (
                      <button
                        type="button"
                        onClick={() => setRecurrenceEndDate("")}
                        className="text-[11px] text-muted-foreground hover:text-foreground underline"
                      >
                        Clear end date
                      </button>
                    )}
                    <span className="text-[10px] text-primary font-medium ml-auto">
                      Will generate next post automatically when current post succeeds.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── STEP 4: LAUNCHPAD (Publish or Schedule) ──────────────────── */}
          <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 p-5 shadow-xs transition-all hover:border-primary/30">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-black text-xs shadow-md shadow-primary/25 shrink-0">
                  04
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Launchpad</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Schedule for peak audience traffic or publish immediately
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">Targeting:</span>
                <div className="flex flex-wrap items-center gap-1">
                  {accounts
                    .filter((a) => selectedAccountIds.has(a.id))
                    .map((a) => {
                      const platObj = COMPOSE_PLATFORMS.find((p) => p.id === a.platform);
                      return (
                        <span
                          key={a.id}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: platObj?.brandColor || "#1877F2" }}
                          title={a.displayName}
                        >
                          {platObj?.icon}
                          <span>{platObj?.name}</span>
                        </span>
                      );
                    })}
                  {selectedAccountIds.size === 0 && (
                    <span className="text-[11px] text-muted-foreground italic bg-muted px-2 py-0.5 rounded-md">
                      No channels selected yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left: Schedule picker + presets */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <PiCalendarBlankBold className="size-4 text-primary" />
                    <span>Schedule for Later:</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                      <PiClockBold className="size-4 text-muted-foreground shrink-0" />
                      <input
                        type="datetime-local"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        className="bg-transparent text-xs text-foreground focus:outline-none [color-scheme:dark]"
                      />
                    </div>

                    {/* Quick Schedule Presets */}
                    <button
                      type="button"
                      onClick={() => setScheduleOffsetMinutes(60)}
                      className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                    >
                      +1 Hour
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleTimeOfDay(19, 0)}
                      className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                    >
                      Tonight (7 PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleTimeOfDay(12, 1)}
                      className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                    >
                      Tomorrow (12 PM)
                    </button>

                    {schedule && (
                      <button
                        type="button"
                        onClick={() => setSchedule("")}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2.5 pt-2 lg:pt-0 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    disabled={busy || !schedule || selectedAccountIds.size === 0}
                    onClick={() => onPublishOrSchedule("schedule")}
                    startIcon={<PiClockBold className="size-4" />}
                    className="shadow-2xs"
                  >
                    Schedule Post
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={busy || selectedAccountIds.size === 0}
                    onClick={() => onPublishOrSchedule("now")}
                    startIcon={
                      busy ? undefined : <PiPaperPlaneTiltBold className="size-4.5" />
                    }
                    loading={busy}
                    className={cn(
                      "font-bold px-6 shadow-md transition-all active:scale-95",
                      selectedAccountIds.size > 0 &&
                        "bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-primary/20",
                    )}
                  >
                    {selectedAccountIds.size === 0
                      ? "Select Destination(s) to Publish"
                      : `Publish to ${selectedAccountIds.size} Channel${selectedAccountIds.size > 1 ? "s" : ""} Now`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
