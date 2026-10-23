"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  PiCalendarBlankBold,
  PiClockBold,
  PiDeviceMobileBold,
  PiFacebookLogoBold,
  PiFacebookLogoFill,
  PiImagesBold,
  PiInstagramLogoBold,
  PiInstagramLogoFill,
  PiPaperPlaneTiltBold,
  PiPlusBold,
  PiShareNetworkBold,
  PiUploadSimpleBold,
  PiWarningCircleBold,
  PiXBold,
  PiVideoFill,
  PiRepeatBold,
  PiArrowsCounterClockwiseBold,
  PiXLogoBold,
  PiLinkedinLogoBold,
  PiLinkedinLogoFill,
  PiTiktokLogoBold,
  PiTiktokLogoFill,
  PiCheckCircleBold,
  PiShieldCheckBold,
  PiLightningBold,
  PiSparkleBold,
  PiPlayCircleBold,
  PiArrowRightBold,
  PiCheckBold,
  PiTrashBold,
  PiEyeBold,
  PiTagBold,
  PiHashBold,
  PiDownloadSimpleBold,
} from "react-icons/pi";
import type { PlatformMarketingAsset } from "@/services/superadmin.service";
import { SiX } from "react-icons/si";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollableTabRow } from "@/components/ui/ScrollableTabRow";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/toast";
import { SocialPostPreview } from "@/components/admin/social/SocialPostPreview";
import {
  socialService,
  type CreatePostInput,
  type SocialAccount,
  type SocialAsset,
  type SocialPlatform,
  type SocialPost,
  type WeeklyPoster,
  PLATFORM_META,
  tokenStatusBadge,
  tokenDaysLeft,
} from "@/services/social.service";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

type SocialTabId = "compose" | "library" | "history" | "accounts";

const POPULAR_HASHTAGS = [
  "#DailySpecial",
  "#FoodLovers",
  "#ChefSpecial",
  "#FreshFlavor",
  "#WeekendVibes",
  "#SpecialOffer",
  "#LocalEats",
  "#DineWithUs",
];

function SocialMediaPageContent() {
  const [activeTab, setActiveTab] = useState<SocialTabId>("compose");
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [assets, setAssets] = useState<SocialAsset[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [weeklyPosters, setWeeklyPosters] = useState<WeeklyPoster[]>([]);
  const [platformAssets, setPlatformAssets] = useState<PlatformMarketingAsset[]>([]);

  // Composer selection
  const [assetId, setAssetId] = useState("");
  const [weeklyPosterId, setWeeklyPosterId] = useState("");
  const [platformAssetId, setPlatformAssetId] = useState("");
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<"all" | "platform" | "uploads" | "videos" | "weekly">("all");
  const [historyFilter, setHistoryFilter] = useState<"all" | "published" | "scheduled" | "draft">("all");

  // Disconnect modal
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);

  // ─── Per-platform caption state ───────────────────────────────────────────
  // Map: accountId → caption string. Each connected account gets its own caption.
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [syncCaptions, setSyncCaptions] = useState(true);
  // activeComposerPlatform is the tab currently shown in the per-platform composer
  const [activeComposerPlatform, setActiveComposerPlatform] = useState<SocialPlatform | null>(null);

  // ─── Recurrence ───────────────────────────────────────────────────────────
  const [recurrenceRule, setRecurrenceRule] = useState<"daily" | "weekly" | "biweekly" | "monthly" | "">("");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  // ─── Media preview for video ──────────────────────────────────────────────
  const [assetIsVideo, setAssetIsVideo] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const [accountsRes, assetsRes, postsRes, weeklyRes, platformRes] = await Promise.allSettled([
        socialService.getAccounts(),
        socialService.getAssets(),
        socialService.getPosts(),
        socialService.getWeeklyPosters(),
        socialService.getPlatformAssets(),
      ]);

      if (accountsRes.status === "fulfilled") setAccounts(accountsRes.value.data || []);
      if (assetsRes.status === "fulfilled") {
        const fetchedAssets = assetsRes.value.data || [];
        setAssets(fetchedAssets);
        if (!assetId && !weeklyPosterId && !platformAssetId && fetchedAssets[0]) {
          setAssetId(fetchedAssets[0].id);
        }
      }
      if (postsRes.status === "fulfilled") setPosts(postsRes.value.data || []);
      if (weeklyRes.status === "fulfilled") setWeeklyPosters(weeklyRes.value.data || []);
      if (platformRes.status === "fulfilled") {
        const pList = platformRes.value.data?.data || [];
        setPlatformAssets(pList);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load social media data."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function connectPlatform(platform: SocialPlatform) {
    try {
      const { data } = await socialService.startOAuth(platform);
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        toast.error("OAuth URL not returned by server.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Could not connect ${platform}.`));
    }
  }

  async function handleDisconnect() {
    if (!accountToDisconnect) return;
    try {
      await socialService.disconnect(accountToDisconnect.id);
      setAccounts((prev) => prev.filter((a) => a.id !== accountToDisconnect.id));
      toast.success(`${accountToDisconnect.displayName} disconnected.`);
      setDisconnectModalOpen(false);
      setAccountToDisconnect(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to disconnect account."));
    }
  }

  async function handleUpload(file?: File) {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Only image and video files are supported.");
      return;
    }
    setUploading(true);
    try {
      const { data } = await socialService.uploadAsset(file);
      setAssets((current) => [data.asset, ...current]);
      setAssetId(data.asset.id);
      setAssetIsVideo(data.asset.mediaType === 'video' || data.asset.mediaType === 'reel');
      setWeeklyPosterId("");
      toast.success(isVideo ? "Video uploaded successfully. It will post as a Reel on Instagram." : "Poster image uploaded successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Asset upload failed."));
    } finally {
      setUploading(false);
    }
  }

  function handleSelectPlatformAsset(item: PlatformMarketingAsset) {
    setPlatformAssetId(item.id);
    setAssetId("");
    setWeeklyPosterId("");
    if (item.title) setTitle(item.title);
    if (item.captionSuggestion) {
      const fullCaption = item.hashtags?.length
        ? `${item.captionSuggestion}\n\n${item.hashtags.join(" ")}`
        : item.captionSuggestion;
      const nextCaps: Record<string, string> = {};
      accounts.forEach((acc) => {
        nextCaps[acc.id] = fullCaption;
      });
      setCaptions(nextCaps);
    }
    setActiveTab("compose");
    toast.success(`"${item.title}" loaded with suggested captions & hashtags!`);
  }

  async function handlePublishOrSchedule(action: "now" | "schedule") {
    // Build destinations from selected accounts
    const destinations = accounts
      .filter((a) => selectedAccountIds.has(a.id) && a.status === 'connected')
      .map((a) => ({
        accountId: a.id,
        caption: (captions[a.id] ?? captions[a.platform] ?? captions['all'] ?? "").trim(),
      }))
      .filter((d) => d.caption.length > 0);

    if (!assetId && !weeklyPosterId && !platformAssetId) {
      toast.warning("Please select a poster image or video from the library.");
      return;
    }

    if (!destinations.length) {
      toast.warning("Select at least one connected destination and enter a caption.");
      return;
    }

    if (action === "schedule" && !schedule) {
      toast.warning("Please choose a valid date and time for scheduling.");
      return;
    }

    setBusy(true);
    try {
      const payload: CreatePostInput = {
        title: title.trim() || undefined,
        scheduledAt: action === "schedule" ? new Date(schedule).toISOString() : undefined,
        destinations,
        assetId: assetId || undefined,
        weeklyPosterId: weeklyPosterId || undefined,
        platformAssetId: platformAssetId || undefined,
        recurrenceRule: recurrenceRule || null,
        recurrenceEndDate: recurrenceEndDate || null,
      };

      const { data } = await socialService.createPost(payload);
      setPosts((current) => [data, ...current]);
      toast.success(action === "now" ? "Post queued for immediate publishing!" : "Post successfully scheduled!");

      // Reset form fields
      setTitle("");
      setCaptions({});
      setSelectedAccountIds(new Set());
      setSchedule("");
      setRecurrenceRule("");
      setRecurrenceEndDate("");
      setPlatformAssetId("");
      setActiveTab("history");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create post."));
    } finally {
      setBusy(false);
    }
  }

  async function handleCancelPost(postId: string) {
    try {
      await socialService.cancel(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, lifecycleStatus: "cancelled" } : p)),
      );
      toast.success("Scheduled post cancelled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to cancel post."));
    }
  }

  async function handlePublishNow(postId: string) {
    try {
      await socialService.publishNow(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, lifecycleStatus: "publishing" } : p)),
      );
      toast.success("Post queued for publishing now.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to publish post."));
    }
  }


  // Active poster resolver
  const activePoster = useMemo(() => {
    if (platformAssetId) {
      const item = platformAssets.find((p) => p.id === platformAssetId);
      if (item) {
        const isVid = item.type === "video";
        return {
          url: item.thumbnailUrl ?? item.mediaUrl,
          title: item.title,
          type: isVid ? "Platform AI Reel" : item.type === "poster_spec" ? "Platform Blueprint" : "Platform Pack",
          isVideo: isVid,
        };
      }
    }
    if (weeklyPosterId) {
      const item = weeklyPosters.find((p) => p.id === weeklyPosterId);
      if (item) {
        return {
          url: item.thumbnailUrl ?? item.imageUrl,
          title: item.title,
          type: "Weekly Special",
          isVideo: false,
        };
      }
    }
    if (assetId) {
      const item = assets.find((a) => a.id === assetId);
      if (item) {
        const isVid = item.mediaType === "video" || item.mediaType === "reel" || (typeof item.mimeType === "string" && item.mimeType.startsWith("video/"));
        return {
          url: item.thumbnailUrl ?? item.publishingUrl,
          title: item.originalFilename,
          type: isVid ? "Video / Reel" : "Your Upload",
          isVideo: isVid,
          mimeType: item.mimeType,
          mediaType: item.mediaType,
        };
      }
    }
    return null;
  }, [weeklyPosterId, assetId, platformAssetId, weeklyPosters, assets, platformAssets]);

  // Tab definitions matching listbusiness pattern
  const tabs = [
    {
      id: "compose" as const,
      label: "Compose & Publish",
      icon: <PiPaperPlaneTiltBold size={16} />,
    },
    {
      id: "library" as const,
      label: "Poster Library",
      icon: <PiImagesBold size={16} />,
      badge: assets.length + weeklyPosters.length,
    },
    {
      id: "history" as const,
      label: "Publishing History",
      icon: <PiClockBold size={16} />,
      badge: posts.length,
    },
    {
      id: "accounts" as const,
      label: "Connected Accounts",
      icon: <PiShareNetworkBold size={16} />,
      badge: accounts.length,
    },
  ];

  const fbAccount = accounts.find((a) => a.platform === "facebook");
  const igAccount = accounts.find((a) => a.platform === "instagram");

  // Tab 1: Compose & Publish
  const renderComposeTab = () => {
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
                      onChange={(e) => handleUpload(e.target.files?.[0])}
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
                                <span className="size-1.5 rounded-full" style={{ backgroundColor: p.brandColor }} />
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
                          onChange={(e) => handleUpload(e.target.files?.[0])}
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
                              platform.gradient
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
                          onClick={() => connectPlatform(platform.id)}
                          className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary group-hover:scale-105 active:scale-95 shrink-0"
                        >
                          <span>Connect</span>
                          <PiArrowRightBold className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    );
                  }

                  // Platform is connected: render for each connected account
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
                            : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <div
                              className={cn(
                                "flex size-11 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br transition-transform group-hover:scale-105",
                                platform.gradient
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
                                : "border-border bg-background text-transparent group-hover:border-primary/40"
                            )}
                          >
                            <PiCheckBold className={cn("size-3.5 stroke-[3]", isSelected ? "opacity-100" : "opacity-0")} />
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
                          const first = Object.values(captions).find((c) => c.trim()) || "";
                          if (first) {
                            const sync: Record<string, string> = { all: first };
                            selectedAccountIds.forEach((id) => {
                              sync[id] = first;
                            });
                            (
                              ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'] as const
                            ).forEach((p) => {
                              sync[p] = first;
                            });
                            setCaptions((prev) => ({ ...prev, ...sync }));
                          }
                        }
                      }}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-foreground">Mirror caption across all channels</span>
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
                        const platCaption = captions[plat.id] ?? (captions["all"] ?? "");
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
                                : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                            )}
                            style={
                              isTabActive
                                ? { backgroundColor: plat.brandColor, borderColor: plat.brandColor }
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
                                    : "bg-muted text-muted-foreground"
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
                          ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'] as const
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
                              isOver ? "text-red-500 font-bold" : "text-muted-foreground"
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
                              : "border-border focus:border-primary focus:ring-primary"
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
                            const prevAll = captions["all"] ?? Object.values(captions)[0] ?? "";
                            const nextVal = prevAll ? `${prevAll} ${tag}` : tag;
                            const sync: Record<string, string> = { all: nextVal };
                            selectedAccountIds.forEach((id) => {
                              sync[id] = nextVal;
                            });
                            (
                              ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'] as const
                            ).forEach((p) => {
                              sync[p] = nextVal;
                            });
                            setCaptions((prev) => ({ ...prev, ...sync }));
                          } else {
                            const prevPlat = captions[plat] ?? (captions["all"] ?? "");
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
                      onClick={() => handlePublishOrSchedule("schedule")}
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
                      onClick={() => handlePublishOrSchedule("now")}
                      startIcon={busy ? undefined : <PiPaperPlaneTiltBold className="size-4.5" />}
                      loading={busy}
                      className={cn(
                        "font-bold px-6 shadow-md transition-all active:scale-95",
                        selectedAccountIds.size > 0 &&
                          "bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-primary/20"
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
  };

  // Tab 2: Poster Library
  const renderLibraryTab = () => {
    const displayedPlatform =
      libraryFilter === "uploads" || libraryFilter === "videos" || libraryFilter === "weekly"
        ? []
        : platformAssets;
    const displayedAssets =
      libraryFilter === "weekly" || libraryFilter === "platform"
        ? []
        : libraryFilter === "videos"
          ? assets.filter((a) => a.mediaType === "video")
          : assets;
    const displayedWeekly =
      libraryFilter === "uploads" || libraryFilter === "videos" || libraryFilter === "platform" ? [] : weeklyPosters;

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Poster & Media Library"
          actions={
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90">
                  {uploading ? <Spinner size="sm" /> : <PiUploadSimpleBold className="size-4" />}
                  Upload Photo / Reel
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                  disabled={uploading}
                />
              </label>
            </div>
          }
        />

        {/* Filter Pills */}
        <div className="flex shrink-0 items-center gap-2 border-b border-border pb-2 overflow-x-auto">
          {(["all", "platform", "uploads", "videos", "weekly"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setLibraryFilter(filter)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition shrink-0 flex items-center gap-1.5",
                libraryFilter === filter
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {filter === "platform" && <PiSparkleBold className="size-3 text-amber-300" />}
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
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {displayedPlatform.length === 0 && displayedWeekly.length === 0 && displayedAssets.length === 0 ? (
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
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                      disabled={uploading}
                    />
                  </label>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {/* Platform Distributed Assets (From Superadmin Vault) */}
              {displayedPlatform.map((pAsset) => {
                const isSelected = platformAssetId === pAsset.id;
                const isVideo = pAsset.type === "video";
                return (
                  <Card
                    key={`platform-${pAsset.id}`}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-150 hover:shadow-md",
                      isSelected ? "border-amber-500 ring-2 ring-amber-500/30" : "border-border",
                    )}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                      {isVideo ? (
                        <>
                          <video
                            src={pAsset.mediaUrl}
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
                          src={pAsset.thumbnailUrl ?? pAsset.mediaUrl}
                          alt={pAsset.title}
                          className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <Badge tone="warning" className="shadow-xs text-[8px] flex items-center gap-1 bg-amber-500 text-white border-none font-bold">
                          <PiSparkleBold className="size-2.5" /> Special
                        </Badge>
                      </div>

                      {pAsset.aspectRatio && (
                        <div className="absolute top-2 right-2">
                          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white font-mono backdrop-blur-xs">
                            {pAsset.aspectRatio}
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 p-2 text-center">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="w-full text-xs"
                          startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                          onClick={() => handleSelectPlatformAsset(pAsset)}
                        >
                          Use in Post
                        </Button>
                        <a
                          href={pAsset.mediaUrl}
                          download={`${pAsset.title || 'special-asset'}.${isVideo ? 'mp4' : 'png'}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-medium text-white hover:bg-white/20 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <PiDownloadSimpleBold className="size-3" />
                          Download
                        </a>
                      </div>
                    </div>

                    <div className="p-3 space-y-0.5">
                      <p className="truncate font-semibold text-foreground text-xs" title={pAsset.title}>
                        {pAsset.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {pAsset.captionSuggestion || 'Ready to publish'}
                      </p>
                    </div>
                  </Card>
                );
              })}
              {/* Weekly Special Posters */}
              {displayedWeekly.map((poster) => {
                const isSelected = weeklyPosterId === poster.id;
                return (
                  <Card
                    key={`weekly-${poster.id}`}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-150 hover:shadow-md",
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                      <img
                        src={poster.thumbnailUrl ?? poster.imageUrl}
                        alt={poster.title}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge tone="primary" className="shadow-xs text-[8px]">
                          Weekly Special
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-2xs transition-opacity group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                          onClick={() => {
                            setWeeklyPosterId(poster.id);
                            setAssetId("");
                            setActiveTab("compose");
                            toast.success(`"${poster.title}" selected for your post!`);
                          }}
                        >
                          Use in Post
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="truncate font-semibold text-foreground text-xs">
                        {poster.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Week of {new Date(poster.weekStart).toLocaleDateString()}
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
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border",
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
                          <Badge tone="primary" className="shadow-xs text-[8px] flex items-center gap-1">
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
                          onClick={() => {
                            setAssetId(asset.id);
                            setWeeklyPosterId("");
                            setActiveTab("compose");
                            toast.success(`"${asset.originalFilename}" selected for your post!`);
                          }}
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
  };

  // Tab 3: Publishing History
  const renderHistoryTab = () => {
    const filteredPosts =
      historyFilter === "all"
        ? posts
        : posts.filter((p) => p.lifecycleStatus.toLowerCase() === historyFilter);

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Publishing History"
          actions={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={loadData}
                disabled={loading}
                startIcon={<PiClockBold className="size-4" />}
              >
                Refresh
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("compose")}
                startIcon={<PiPlusBold className="size-4" />}
              >
                New Post
              </Button>
            </div>
          }
        />

        {/* Filter Pills */}
        <div className="flex shrink-0 items-center gap-2 border-b border-border pb-2">
          {(["all", "published", "scheduled", "draft"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setHistoryFilter(filter)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
                historyFilter === filter
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {filteredPosts.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <EmptyState
                icon={<PiClockBold size={32} />}
                title="No posts found"
                action={
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    startIcon={<PiPlusBold className="size-3.5" />}
                    onClick={() => setActiveTab("compose")}
                  >
                    Compose New Post
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredPosts.map((post) => {
                const isScheduled = post.lifecycleStatus === "scheduled";
                const isPublished = post.lifecycleStatus === "published";
                const isCancelled = post.lifecycleStatus === "cancelled";

                const badgeTone = isPublished
                  ? "success"
                  : isScheduled
                    ? "primary"
                    : isCancelled
                      ? "danger"
                      : "neutral";

                return (
                  <Card key={post.id} className="p-4 transition-all hover:shadow-xs">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            #{post.id.slice(0, 8)}
                          </span>
                          <p className="font-bold text-foreground text-sm truncate">
                            {post.title || "Untitled Social Post"}
                          </p>
                          <Badge tone={badgeTone} className="text-[8px]">
                            {post.lifecycleStatus}
                          </Badge>
                        </div>
                        {post.scheduledAtUtc && (
                          <p className="text-xs text-muted-foreground">
                            Scheduled for:{" "}
                            <span className="font-semibold text-foreground">
                              {new Date(post.scheduledAtUtc).toLocaleString()}
                            </span>
                          </p>
                        )}
                        {post.destinations && post.destinations.length > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-muted-foreground">Channels:</span>
                            {post.destinations.map((d) => (
                              <Badge key={d.id} tone="neutral" className="text-[8px]">
                                {d.status}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isScheduled && (
                          <>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              startIcon={<PiPaperPlaneTiltBold className="size-3.5" />}
                              onClick={() => handlePublishNow(post.id)}
                            >
                              Publish Now
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              startIcon={<PiXBold className="size-3.5" />}
                              onClick={() => handleCancelPost(post.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tab 4: Connected Accounts
  const renderAccountsTab = () => {
    const supportedPlatforms: {
      platform: SocialPlatform;
      name: string;
      apiName: string;
      color: string;
      gradient?: string;
      icon: React.ReactNode;
      description: string;
      badges: string[];
      isBeta?: boolean;
    }[] = [
      {
        platform: "facebook",
        name: "Facebook Page",
        apiName: "Meta Graph API v20.0",
        color: "#1877F2",
        icon: <PiFacebookLogoBold size={24} />,
        description: "Publish organic posts, promotional flyers, menu specials, and dining updates directly to your official Facebook Business Page.",
        badges: ["Page Feed", "Photo Albums", "Insights & Metrics"],
      },
      {
        platform: "instagram",
        name: "Instagram Professional",
        apiName: "Instagram Graph API",
        color: "#E1306C",
        gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
        icon: <PiInstagramLogoBold size={24} />,
        description: "Post high-resolution food photography and vertical video Reels directly to your restaurant's Instagram profile.",
        badges: ["Feed Photos", "Instagram Reels", "Audio Sync", "Hashtag Cloud"],
      },
      {
        platform: "twitter",
        name: "Twitter / X",
        apiName: "Twitter API v2 (PKCE)",
        color: "#000000",
        icon: <PiXLogoBold size={22} />,
        description: "Broadcast instant lunch specials, daily deals, and timely announcements to diners with automated tweet delivery and video uploads.",
        badges: ["280-char Tweets", "Video Uploads", "Real-time Trends", "PKCE OAuth"],
      },
      {
        platform: "linkedin",
        name: "LinkedIn",
        apiName: "UGC Community Post API",
        color: "#0A66C2",
        icon: <PiLinkedinLogoBold size={24} />,
        description: "Connect with local corporate clients, catering opportunities, and professional dinner parties through business posts.",
        badges: ["Company Page", "Corporate Catering", "Long-form (3k chars)", "Auto-Refresh"],
      },
      {
        platform: "tiktok",
        name: "TikTok",
        apiName: "Creator & Video API",
        color: "#FE2C55",
        icon: <PiTiktokLogoBold size={24} />,
        description: "Engage foodies with behind-the-scenes chef preparations, kitchen highlights, and short-form video content.",
        badges: ["Vertical 9:16 Video", "Food Trends", "Viral Sounds"],
        isBeta: true,
      },
    ];

    const connectedCount = accounts.filter((a) => a.status === "connected").length;

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Connected Accounts & Platform Channels"
          actions={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={loadData}
              disabled={loading}
              startIcon={<PiArrowsCounterClockwiseBold className="size-4" />}
            >
              Refresh Status
            </Button>
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-4 pb-6">
            {/* Top Overview Banner */}
            <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-muted/20 to-card p-4 shadow-xs">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-foreground">
                      Multi-Platform Publishing Network
                    </h3>
                    <Badge tone={connectedCount > 0 ? "success" : "neutral"} className="text-[10px]">
                      {connectedCount} of 5 Channels Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connect your restaurant's social channels to compose once and publish everywhere with automated token refreshes.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    <PiShieldCheckBold className="size-4" />
                    <span>Auto Token Refresh: Active (Every 6h)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid of 5 Channels */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {supportedPlatforms.map((item) => {
                const acct = accounts.find((a) => a.platform === item.platform);
                const isConnected = !!acct && acct.status === "connected";
                const badge = acct ? tokenStatusBadge(acct) : null;
                const daysLeft = acct ? tokenDaysLeft(acct) : null;

                return (
                  <Card
                    key={item.platform}
                    className={cn(
                      "flex flex-col justify-between p-4.5 rounded-2xl border transition-all duration-200",
                      isConnected
                        ? "border-border bg-card shadow-sm hover:border-primary/40"
                        : "border-border/60 bg-card/60 hover:border-border"
                    )}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs",
                              item.gradient ? `bg-gradient-to-tr ${item.gradient}` : ""
                            )}
                            style={!item.gradient ? { backgroundColor: item.color } : {}}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-foreground truncate">{item.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-mono">{item.apiName}</p>
                          </div>
                        </div>

                        {item.isBeta ? (
                          <Badge tone="warning" className="text-[9px] shrink-0">
                            Beta
                          </Badge>
                        ) : isConnected ? (
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                            style={{ color: badge?.color, backgroundColor: badge?.color + "20" }}
                          >
                            <span className="size-1.5 rounded-full" style={{ backgroundColor: badge?.color }} />
                            {badge?.label}
                          </span>
                        ) : (
                          <Badge tone="neutral" className="text-[9px] shrink-0">
                            Disconnected
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Feature Pills */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.badges.map((b) => (
                          <span
                            key={b}
                            className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      {/* Connected Details */}
                      {isConnected && acct && (
                        <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] text-muted-foreground">Account:</span>
                            <span className="font-semibold text-foreground truncate max-w-[140px]">
                              {acct.username ? `@${acct.username}` : acct.displayName}
                            </span>
                          </div>
                          {daysLeft !== null && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">Token Health:</span>
                              <span className={cn(
                                "font-medium",
                                daysLeft > 14 ? "text-emerald-400" : daysLeft > 7 ? "text-amber-400" : "text-red-400"
                              )}>
                                {daysLeft} days remaining (auto-refreshed)
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-border/50">
                      {isConnected && acct ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <PiCheckCircleBold size={13} /> Active & Ready
                          </span>
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            startIcon={<PiXBold className="size-3.5" />}
                            onClick={() => {
                              setAccountToDisconnect(acct);
                              setDisconnectModalOpen(true);
                            }}
                          >
                            Disconnect
                          </Button>
                        </div>
                      ) : item.isBeta ? (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground italic">Creator API Integration</span>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled
                            className="opacity-60 cursor-not-allowed"
                          >
                            Coming Soon
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => connectPlatform(item.platform)}
                          className={cn(
                            "w-full font-semibold text-white shadow-xs transition hover:opacity-90",
                            item.gradient ? `bg-gradient-to-r ${item.gradient}` : ""
                          )}
                          style={!item.gradient ? { backgroundColor: item.color } : {}}
                        >
                          Connect {item.name}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "library":
        return renderLibraryTab();
      case "history":
        return renderHistoryTab();
      case "accounts":
        return renderAccountsTab();
      case "compose":
      default:
        return renderComposeTab();
    }
  };

  return (
    <div className="flex h-full w-full gap-4">
      {/* Left main pane */}
      <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
        {/* Navigation Tab strip matching listbusiness */}
        <div className="shrink-0">
          <div className="w-full rounded-xl border border-border bg-card p-1.5 shadow-sm">
            <ScrollableTabRow
              activeKey={activeTab}
              role="tablist"
              aria-label="Social media sections"
              scrollContainerClassName="gap-1"
            >
              {tabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    data-tab-active={selected || undefined}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1.5 py-0.2 text-[10px]",
                          selected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </ScrollableTabRow>
          </div>
        </div>

        {/* Active Tab Panel */}
        <div className="min-h-0 flex-1 overflow-hidden">{renderPanel()}</div>
      </div>

      {/* Desktop Preview Column matching listbusiness PhonePreview aside */}
      <aside className="hidden w-[340px] shrink-0 xl:block h-full">
        <SocialPostPreview
          posterUrl={activePoster?.url}
          posterTitle={activePoster?.title}
          isVideo={assetIsVideo}
          caption={syncCaptions ? (Object.values(captions)[0] ?? "") : ""}
          captions={captions}
          selectedAccountIds={selectedAccountIds}
          accounts={accounts}
          scheduledAt={schedule || null}
          recurrenceRule={recurrenceRule || null}
        />
      </aside>

      {/* Floating Action Button for Mobile Preview */}
      <button
        type="button"
        onClick={() => setMobilePreviewOpen(true)}
        aria-label="Open live social preview"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 xl:hidden"
      >
        <PiDeviceMobileBold size={17} />
        <span>Live Preview</span>
      </button>

      {/* Mobile Live Preview Modal Sheet */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs xl:hidden">
          <div className="flex max-h-[92vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <PiDeviceMobileBold size={14} />
                </div>
                <p className="text-xs font-bold text-foreground">Live Social Preview</p>
              </div>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                aria-label="Close preview"
                className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <PiXBold size={14} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <SocialPostPreview
                posterUrl={activePoster?.url}
                posterTitle={activePoster?.title}
                isVideo={assetIsVideo}
                caption={syncCaptions ? (Object.values(captions)[0] ?? "") : ""}
                captions={captions}
                selectedAccountIds={selectedAccountIds}
                accounts={accounts}
                scheduledAt={schedule || null}
                recurrenceRule={recurrenceRule || null}
              />
            </div>
          </div>
        </div>
      )}

      {/* Disconnect confirmation modal */}
      {disconnectModalOpen && accountToDisconnect && (
        <ConfirmDeleteModal
          isOpen={disconnectModalOpen}
          onClose={() => {
            setDisconnectModalOpen(false);
            setAccountToDisconnect(null);
          }}
          onConfirm={handleDisconnect}
          entityName={accountToDisconnect.displayName}
          title="Disconnect Social Account"
          description={`Are you sure you want to disconnect ${accountToDisconnect.displayName}? You will no longer be able to publish organic posts to this profile.`}
        />
      )}
    </div>
  );
}

export default function SocialMediaPage() {
  return (
    <PermissionGuard requiredUnit="marketing">
      <SocialMediaPageContent />
    </PermissionGuard>
  );
}
