"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  PiCalendarBlankBold,
  PiClockBold,
  PiDeviceMobileBold,
  PiFacebookLogoBold,
  PiImagesBold,
  PiInstagramLogoBold,
  PiPaletteBold,
  PiPaperPlaneTiltBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiShareNetworkBold,
  PiSparkleBold,
  PiUploadSimpleBold,
  PiWarningCircleBold,
  PiXBold,
} from "react-icons/pi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollableTabRow } from "@/components/ui/ScrollableTabRow";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/toast";
import { SocialPostPreview } from "@/components/admin/social/SocialPostPreview";
import { POSTER_CATEGORIES, POSTER_TEMPLATES } from "@/components/marketing/posterTemplates";
import {
  socialService,
  type SocialAccount,
  type SocialAsset,
  type SocialPost,
  type WeeklyPoster,
} from "@/services/social.service";
import { getApiErrorMessage } from "@/utils/errors";
import { cn } from "@/utils/cn";

type SocialTabId = "compose" | "library" | "templates" | "history" | "accounts";

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

export default function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState<SocialTabId>("compose");
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [assets, setAssets] = useState<SocialAsset[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [weeklyPosters, setWeeklyPosters] = useState<WeeklyPoster[]>([]);

  // Composer selection
  const [assetId, setAssetId] = useState("");
  const [weeklyPosterId, setWeeklyPosterId] = useState("");
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState("");
  const [facebookSelected, setFacebookSelected] = useState(true);
  const [instagramSelected, setInstagramSelected] = useState(true);
  const [syncCaptions, setSyncCaptions] = useState(true);
  const [facebookCaption, setFacebookCaption] = useState("");
  const [instagramCaption, setInstagramCaption] = useState("");
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [libraryFilter, setLibraryFilter] = useState<"all" | "uploads" | "weekly">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [historyFilter, setHistoryFilter] = useState<"all" | "published" | "scheduled" | "draft">("all");

  // Disconnect modal
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const [accountsRes, assetsRes, postsRes, weeklyRes] = await Promise.allSettled([
        socialService.getAccounts(),
        socialService.getAssets(),
        socialService.getPosts(),
        socialService.getWeeklyPosters(),
      ]);

      if (accountsRes.status === "fulfilled") setAccounts(accountsRes.value.data || []);
      if (assetsRes.status === "fulfilled") {
        const fetchedAssets = assetsRes.value.data || [];
        setAssets(fetchedAssets);
        if (!assetId && !weeklyPosterId && fetchedAssets[0]) {
          setAssetId(fetchedAssets[0].id);
        }
      }
      if (postsRes.status === "fulfilled") setPosts(postsRes.value.data || []);
      if (weeklyRes.status === "fulfilled") setWeeklyPosters(weeklyRes.value.data || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load social media data."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function connectPlatform(platform: "facebook" | "instagram") {
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
    setUploading(true);
    try {
      const { data } = await socialService.uploadAsset(file);
      setAssets((current) => [data.asset, ...current]);
      setAssetId(data.asset.id);
      setWeeklyPosterId("");
      setSelectedTemplateSlug("");
      toast.success("Poster image uploaded successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Poster upload failed."));
    } finally {
      setUploading(false);
    }
  }

  async function handlePublishOrSchedule(action: "now" | "schedule") {
    const selectedAccounts = accounts.filter(
      (a) =>
        (a.platform === "facebook" && facebookSelected && facebookCaption.trim()) ||
        (a.platform === "instagram" && instagramSelected && instagramCaption.trim()),
    );

    if (!assetId && !weeklyPosterId && !selectedTemplateSlug) {
      toast.warning("Please select a poster image from the library or templates.");
      return;
    }

    if (!selectedAccounts.length) {
      toast.warning("Select at least one connected destination and enter a caption.");
      return;
    }

    if (action === "schedule" && !schedule) {
      toast.warning("Please choose a valid date and time for scheduling.");
      return;
    }

    setBusy(true);
    try {
      const payload: Record<string, any> = {
        title: title.trim() || undefined,
        scheduledAt: action === "schedule" ? new Date(schedule).toISOString() : undefined,
        destinations: selectedAccounts.map((a) => ({
          accountId: a.id,
          caption: a.platform === "facebook" ? facebookCaption : instagramCaption,
        })),
      };

      if (weeklyPosterId) {
        payload.weeklyPosterId = weeklyPosterId;
      } else if (assetId) {
        payload.assetId = assetId;
      }

      const { data } = await socialService.createPost(payload);
      setPosts((current) => [data, ...current]);
      toast.success(action === "now" ? "Post queued for immediate publishing!" : "Post successfully scheduled!");

      // Reset form fields
      setTitle("");
      setFacebookCaption("");
      setInstagramCaption("");
      setSchedule("");
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

  function handleCaptionChange(value: string, platform: "facebook" | "instagram") {
    if (syncCaptions) {
      setFacebookCaption(value);
      setInstagramCaption(value);
    } else {
      if (platform === "facebook") setFacebookCaption(value);
      if (platform === "instagram") setInstagramCaption(value);
    }
  }

  function appendHashtag(tag: string) {
    if (syncCaptions) {
      const nextFb = facebookCaption ? `${facebookCaption} ${tag}` : tag;
      const nextIg = instagramCaption ? `${instagramCaption} ${tag}` : tag;
      setFacebookCaption(nextFb);
      setInstagramCaption(nextIg);
    } else {
      const nextIg = instagramCaption ? `${instagramCaption} ${tag}` : tag;
      setInstagramCaption(nextIg);
    }
  }

  // Active poster resolver
  const activePoster = useMemo(() => {
    if (weeklyPosterId) {
      const item = weeklyPosters.find((p) => p.id === weeklyPosterId);
      if (item) {
        return {
          url: item.thumbnailUrl ?? item.imageUrl,
          title: item.title,
          type: "Weekly Special",
        };
      }
    }
    if (assetId) {
      const item = assets.find((a) => a.id === assetId);
      if (item) {
        return {
          url: item.thumbnailUrl ?? item.publishingUrl,
          title: item.originalFilename,
          type: "Your Upload",
        };
      }
    }
    if (selectedTemplateSlug) {
      const item = POSTER_TEMPLATES.find((t) => t.slug === selectedTemplateSlug);
      if (item) {
        return {
          url: null,
          title: item.name,
          type: "Template",
          slug: item.slug,
        };
      }
    }
    return null;
  }, [weeklyPosterId, assetId, selectedTemplateSlug, weeklyPosters, assets]);

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
      id: "templates" as const,
      label: "Poster Templates",
      icon: <PiPaletteBold size={16} />,
      badge: POSTER_TEMPLATES.length,
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
  const renderComposeTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Compose & Publish"
        description="Craft eye-catching social posts and publish directly to your connected Meta channels."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              startIcon={<PiClockBold className="size-4" />}
              onClick={() => setActiveTab("history")}
            >
              Post History
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              startIcon={<PiImagesBold className="size-4" />}
              onClick={() => setActiveTab("library")}
            >
              Poster Library
            </Button>
          </div>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-4 pb-6">
          {/* Section 1: Selected Media Card */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">1. Poster Image</CardTitle>
                  <CardDescription className="text-xs">
                    Choose the visual creative to accompany this post.
                  </CardDescription>
                </div>
                <label className="cursor-pointer">
                  <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted">
                    <PiUploadSimpleBold className="size-3.5" /> Upload Image
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                    disabled={uploading}
                  />
                </label>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {activePoster ? (
                <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-background shadow-xs">
                      {activePoster.url ? (
                        <img
                          src={activePoster.url}
                          alt={activePoster.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-primary/10 text-primary">
                          <PiPaletteBold size={24} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-foreground text-xs sm:text-sm">
                          {activePoster.title}
                        </p>
                        <Badge tone="primary" className="shrink-0 text-[8px]">
                          {activePoster.type}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Ready for Instagram (4:5) and Facebook publishing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      startIcon={<PiImagesBold className="size-3.5" />}
                      onClick={() => setActiveTab("library")}
                    >
                      Browse Library
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-6 text-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <PiImagesBold size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">No poster selected</p>
                    <p className="text-[11px] text-muted-foreground">
                      Pick a poster from your library, weekly specials, or upload a new file.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="mt-1"
                    startIcon={<PiImagesBold className="size-3.5" />}
                    onClick={() => setActiveTab("library")}
                  >
                    Select from Library
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Destination Channels */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">2. Target Destinations</CardTitle>
              <CardDescription className="text-xs">
                Select which connected Meta profiles this post should be published to.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 pt-2 sm:grid-cols-2">
              {/* Facebook Card */}
              <div
                onClick={() => setFacebookSelected(!facebookSelected)}
                className={cn(
                  "cursor-pointer rounded-xl border p-3.5 transition-all",
                  facebookSelected
                    ? "border-[#1877f2]/50 bg-[#1877f2]/5 shadow-xs"
                    : "border-border bg-card hover:bg-muted/30 opacity-70",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#1877f2]/15 text-[#1877f2]">
                      <PiFacebookLogoBold size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-xs">Facebook Page</p>
                      <p className="text-[11px] text-muted-foreground">
                        {fbAccount ? fbAccount.displayName : "No page connected"}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={facebookSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      setFacebookSelected(e.target.checked);
                    }}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                </div>
                {!fbAccount && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2">
                    <span className="text-[10px] text-warning flex items-center gap-1">
                      <PiWarningCircleBold size={12} /> Account needed
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        connectPlatform("facebook");
                      }}
                      className="text-[11px] font-semibold text-[#1877f2] hover:underline"
                    >
                      Connect Page &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Instagram Card */}
              <div
                onClick={() => setInstagramSelected(!instagramSelected)}
                className={cn(
                  "cursor-pointer rounded-xl border p-3.5 transition-all",
                  instagramSelected
                    ? "border-[#e1306c]/50 bg-[#e1306c]/5 shadow-xs"
                    : "border-border bg-card hover:bg-muted/30 opacity-70",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#e1306c]/15 text-[#e1306c]">
                      <PiInstagramLogoBold size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-xs">Instagram Professional</p>
                      <p className="text-[11px] text-muted-foreground">
                        {igAccount ? `@${igAccount.username || igAccount.displayName}` : "No account connected"}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={instagramSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      setInstagramSelected(e.target.checked);
                    }}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                </div>
                {!igAccount && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2">
                    <span className="text-[10px] text-warning flex items-center gap-1">
                      <PiWarningCircleBold size={12} /> Account needed
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        connectPlatform("instagram");
                      }}
                      className="text-[11px] font-semibold text-[#e1306c] hover:underline"
                    >
                      Connect Instagram &rarr;
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Captions & Copy */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-bold">3. Post Content & Captions</CardTitle>
                  <CardDescription className="text-xs">
                    Compose your message with tailored captions and hashtag enhancements.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncCaptions}
                      onChange={(e) => setSyncCaptions(e.target.checked)}
                      className="size-3.5 rounded border-border"
                    />
                    <span>Sync Facebook & Instagram</span>
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 p-4 pt-2">
              <div>
                <label className="mb-1 block text-caption font-semibold text-foreground">
                  Internal Campaign Title (optional)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Special Promo"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {syncCaptions ? (
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-caption font-semibold text-foreground">
                      Unified Caption
                    </label>
                    <span className="text-[10px] text-muted-foreground">
                      {instagramCaption.length} characters
                    </span>
                  </div>
                  <textarea
                    value={instagramCaption}
                    onChange={(e) => handleCaptionChange(e.target.value, "instagram")}
                    placeholder="Write a compelling caption for both Facebook and Instagram..."
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-caption font-semibold text-foreground">
                        <PiFacebookLogoBold className="text-[#1877f2]" /> Facebook Caption
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {facebookCaption.length} chars
                      </span>
                    </div>
                    <textarea
                      disabled={!facebookSelected}
                      value={facebookCaption}
                      onChange={(e) => handleCaptionChange(e.target.value, "facebook")}
                      placeholder="Write Facebook post text..."
                      rows={4}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body disabled:opacity-50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-caption font-semibold text-foreground">
                        <PiInstagramLogoBold className="text-[#e1306c]" /> Instagram Caption
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {instagramCaption.length} chars
                      </span>
                    </div>
                    <textarea
                      disabled={!instagramSelected}
                      value={instagramCaption}
                      onChange={(e) => handleCaptionChange(e.target.value, "instagram")}
                      placeholder="Write Instagram caption & hashtags..."
                      rows={4}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body disabled:opacity-50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Hashtag Helper Pills */}
              <div>
                <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <PiSparkleBold className="text-primary size-3.5" /> Quick Hashtags:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => appendHashtag(tag)}
                      className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Schedule & Action Bar */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-bold">4. Publish or Schedule</CardTitle>
                  <CardDescription className="text-xs">
                    Publish immediately to your connected channels, or set a future date & time.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Channels:</span>
                  <div className="flex items-center gap-1">
                    {facebookSelected && (
                      <Badge tone={fbAccount ? "success" : "neutral"} className="text-[9px]">
                        Facebook
                      </Badge>
                    )}
                    {instagramSelected && (
                      <Badge tone={igAccount ? "success" : "neutral"} className="text-[9px]">
                        Instagram
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Schedule picker */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <PiCalendarBlankBold className="size-4 text-muted-foreground shrink-0" />
                    <input
                      type="datetime-local"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="bg-transparent text-xs text-foreground focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={busy || !schedule}
                    onClick={() => handlePublishOrSchedule("schedule")}
                    startIcon={<PiClockBold className="size-3.5" />}
                  >
                    Schedule Post
                  </Button>
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

                {/* Right: Publish Now button */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={busy}
                    onClick={() => handlePublishOrSchedule("now")}
                    startIcon={busy ? undefined : <PiPaperPlaneTiltBold className="size-4" />}
                    loading={busy}
                    className="shadow-sm font-semibold px-5"
                  >
                    Publish Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Tab 2: Poster Library
  const renderLibraryTab = () => {
    const displayedAssets = libraryFilter === "weekly" ? [] : assets;
    const displayedWeekly = libraryFilter === "uploads" ? [] : weeklyPosters;

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Poster Library"
          description="Browse and organize uploaded poster creatives and weekly marketing kits."
          actions={
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90">
                  {uploading ? <Spinner size="sm" /> : <PiUploadSimpleBold className="size-4" />}
                  Upload Poster
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                  disabled={uploading}
                />
              </label>
            </div>
          }
        />

        {/* Filter Pills */}
        <div className="flex shrink-0 items-center gap-2 border-b border-border pb-2">
          {(["all", "uploads", "weekly"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setLibraryFilter(filter)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold capitalize transition",
                libraryFilter === filter
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {filter === "all"
                ? `All Media (${assets.length + weeklyPosters.length})`
                : filter === "uploads"
                  ? `Your Uploads (${assets.length})`
                  : `Weekly Specials (${weeklyPosters.length})`}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {displayedWeekly.length === 0 && displayedAssets.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <EmptyState
                icon={<PiImagesBold size={32} />}
                title="No poster assets found"
                description="Upload an image poster or use weekly specials to get started."
                action={
                  <label className="cursor-pointer">
                    <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90">
                      <PiUploadSimpleBold className="size-4" /> Upload First Poster
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                      disabled={uploading}
                    />
                  </label>
                }
              />
            </div>
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 pb-6">
              {/* Weekly Posters */}
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
                            setSelectedTemplateSlug("");
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
                return (
                  <Card
                    key={`asset-${asset.id}`}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-150 hover:shadow-md",
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                      <img
                        src={asset.thumbnailUrl ?? asset.publishingUrl}
                        alt={asset.originalFilename}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge tone="neutral" className="shadow-xs text-[8px]">
                          Upload
                        </Badge>
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
                            setSelectedTemplateSlug("");
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
                        {new Date(asset.createdAt).toLocaleDateString()}
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

  // Tab 3: Poster Templates
  const renderTemplatesTab = () => {
    const filteredTemplates =
      selectedCategory === "All"
        ? POSTER_TEMPLATES
        : POSTER_TEMPLATES.filter((t) => t.category === selectedCategory);

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <PageHeader
          className="shrink-0"
          title="Poster Templates"
          description="High-converting restaurant templates you can customize and export for organic marketing."
        />

        {/* Category Pills */}
        <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto pb-1">
          {["All", ...POSTER_CATEGORIES].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-6">
            {filteredTemplates.map((tpl) => (
              <Card
                key={tpl.slug}
                className="group flex flex-col overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden p-6 flex flex-col justify-between"
                  style={{
                    background:
                      tpl.background.type === "gradient"
                        ? tpl.background.value
                        : tpl.background.value,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                      {tpl.category}
                    </span>
                    <span className="text-white/80">
                      <PiPaletteBold size={18} />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white uppercase drop-shadow-sm">
                      {tpl.name}
                    </p>
                    <p className="text-[11px] text-white/90 drop-shadow-xs line-clamp-2">
                      {tpl.textFields[0]?.defaultText ?? "Special Promotion"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 p-3 bg-card border-t border-border">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {tpl.name}
                  </span>
                  <Link
                    href={`/admin/social-media/editor/${tpl.slug}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 shrink-0"
                  >
                    <PiPencilSimpleBold size={13} /> Customize
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Tab 4: Publishing History
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
          description="View past publications, track scheduled posts, and monitor status results."
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
                description="Your drafts, scheduled campaigns, and published posts will appear here."
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

  // Tab 5: Connected Accounts
  const renderAccountsTab = () => (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader
        className="shrink-0"
        title="Connected Accounts"
        description="Link your official Facebook Pages and Instagram Professional profiles via Meta OAuth."
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={loading}
            startIcon={<PiClockBold className="size-4" />}
          >
            Refresh Status
          </Button>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-4 pb-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Facebook Connection Card */}
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#1877f2]/15 text-[#1877f2]">
                    <PiFacebookLogoBold size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Facebook Page</h3>
                    <p className="text-xs text-muted-foreground">Meta Graph API Pages publishing</p>
                  </div>
                </div>
                <Badge tone={fbAccount ? "success" : "neutral"}>
                  {fbAccount ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                {fbAccount ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Page Name
                      </p>
                      <p className="text-xs font-bold text-foreground">{fbAccount.displayName}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground">Status: Active</span>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        startIcon={<PiXBold className="size-3.5" />}
                        onClick={() => {
                          setAccountToDisconnect(fbAccount);
                          setDisconnectModalOpen(true);
                        }}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Connect a Facebook Page to automatically publish specials, announcements, and posters.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => connectPlatform("facebook")}
                      startIcon={<PiFacebookLogoBold className="size-4" />}
                      className="bg-[#1877f2] hover:bg-[#1877f2]/90 text-white"
                    >
                      Connect Facebook Page
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Instagram Connection Card */}
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#e1306c]/15 text-[#e1306c]">
                    <PiInstagramLogoBold size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Instagram Professional</h3>
                    <p className="text-xs text-muted-foreground">Business or Creator Meta account</p>
                  </div>
                </div>
                <Badge tone={igAccount ? "success" : "neutral"}>
                  {igAccount ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                {igAccount ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Profile Handle
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        @{igAccount.username || igAccount.displayName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground">Status: Active</span>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        startIcon={<PiXBold className="size-3.5" />}
                        onClick={() => {
                          setAccountToDisconnect(igAccount);
                          setDisconnectModalOpen(true);
                        }}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Connect an Instagram Professional account to publish feed media directly from your admin panel.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => connectPlatform("instagram")}
                      startIcon={<PiInstagramLogoBold className="size-4" />}
                      className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90"
                    >
                      Connect Instagram
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-muted/20 border-border">
            <h4 className="text-xs font-bold text-foreground mb-1">Meta Publishing Requirements</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Personal Facebook profiles cannot publish via Meta Graph API. You must have a Facebook Page
              with admin or task permissions. For Instagram, the account must be configured as a
              Professional (Business or Creator) profile and linked to your Facebook Page in Meta Business Suite.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPanel = () => {
    switch (activeTab) {
      case "library":
        return renderLibraryTab();
      case "templates":
        return renderTemplatesTab();
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
          caption={syncCaptions ? instagramCaption : ""}
          facebookCaption={facebookCaption}
          instagramCaption={instagramCaption}
          facebookSelected={facebookSelected}
          instagramSelected={instagramSelected}
          accounts={accounts}
          scheduledAt={schedule || null}
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
                caption={syncCaptions ? instagramCaption : ""}
                facebookCaption={facebookCaption}
                instagramCaption={instagramCaption}
                facebookSelected={facebookSelected}
                instagramSelected={instagramSelected}
                accounts={accounts}
                scheduledAt={schedule || null}
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
