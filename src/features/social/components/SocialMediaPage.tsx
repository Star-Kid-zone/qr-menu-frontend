"use client";

import { useEffect, useState, useMemo } from "react";
import {
  PiClockBold,
  PiDeviceMobileBold,
  PiImagesBold,
  PiPaperPlaneTiltBold,
  PiShareNetworkBold,
  PiXBold,
} from "react-icons/pi";
import { ConfirmDeleteModal, ScrollableTabRow, toast } from "@/components/ui";
import { PermissionGuard } from "@/components/auth";
import { cn, getApiErrorMessage } from "@/utils";
import {
  socialService,
  type CreatePostInput,
  type SocialAccount,
  type SocialAsset,
  type SocialPlatform,
  type SocialPost,
  type WeeklyPoster,
} from "@/services/social.service";
import type { PlatformMarketingAsset } from "@/services/superadmin.service";
import { SocialPostPreview } from "./SocialPostPreview";
import { ComposeTab } from "./ComposeTab";
import { LibraryTab } from "./LibraryTab";
import { HistoryTab } from "./HistoryTab";
import { AccountsTab } from "./AccountsTab";
import type {
  ActivePosterInfo,
  HistoryFilter,
  LibraryFilter,
  RecurrenceRule,
  SocialTabId,
} from "../types";

export function SocialMediaPageContent() {
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
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("all");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");

  // Disconnect modal
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);

  // Per-platform caption state
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [syncCaptions, setSyncCaptions] = useState(true);
  const [activeComposerPlatform, setActiveComposerPlatform] = useState<SocialPlatform | null>(null);

  // Recurrence
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule>("");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  // Media preview for video
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
      setAssetIsVideo(data.asset.mediaType === "video" || data.asset.mediaType === "reel");
      setWeeklyPosterId("");
      toast.success(
        isVideo
          ? "Video uploaded successfully. It will post as a Reel on Instagram."
          : "Poster image uploaded successfully.",
      );
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

  function handleSelectWeeklyPoster(poster: WeeklyPoster) {
    setWeeklyPosterId(poster.id);
    setAssetId("");
    setPlatformAssetId("");
    setActiveTab("compose");
    toast.success(`"${poster.title}" selected for your post!`);
  }

  function handleSelectAsset(asset: SocialAsset) {
    setAssetId(asset.id);
    setWeeklyPosterId("");
    setPlatformAssetId("");
    setActiveTab("compose");
    toast.success(`"${asset.originalFilename}" selected for your post!`);
  }

  async function handlePublishOrSchedule(action: "now" | "schedule") {
    const destinations = accounts
      .filter((a) => selectedAccountIds.has(a.id) && a.status === "connected")
      .map((a) => ({
        accountId: a.id,
        caption: (captions[a.id] ?? captions[a.platform] ?? captions["all"] ?? "").trim(),
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
      toast.success(
        action === "now"
          ? "Post queued for immediate publishing!"
          : "Post successfully scheduled!",
      );

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
  const activePoster: ActivePosterInfo | null = useMemo(() => {
    if (platformAssetId) {
      const item = platformAssets.find((p) => p.id === platformAssetId);
      if (item) {
        const isVid = item.type === "video";
        return {
          url: item.thumbnailUrl ?? item.mediaUrl,
          title: item.title,
          type: "platform" as const,
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
          type: "weekly" as const,
          isVideo: false,
        };
      }
    }
    if (assetId) {
      const item = assets.find((a) => a.id === assetId);
      if (item) {
        const isVid =
          item.mediaType === "video" ||
          item.mediaType === "reel" ||
          (typeof item.mimeType === "string" && item.mimeType.startsWith("video/"));
        return {
          url: item.thumbnailUrl ?? item.publishingUrl,
          title: item.originalFilename,
          type: "upload" as const,
          isVideo: isVid,
        };
      }
    }
    return null;
  }, [weeklyPosterId, assetId, platformAssetId, weeklyPosters, assets, platformAssets]);

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

  return (
    <div className="flex h-full w-full gap-4">
      {/* Left main pane */}
      <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
        {/* Navigation Tab strip */}
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
        <div className="min-h-0 flex-1 overflow-hidden">
          {activeTab === "compose" && (
            <ComposeTab
              accounts={accounts}
              activePoster={activePoster}
              setAssetId={setAssetId}
              setWeeklyPosterId={setWeeklyPosterId}
              setPlatformAssetId={setPlatformAssetId}
              title={title}
              setTitle={setTitle}
              schedule={schedule}
              setSchedule={setSchedule}
              captions={captions}
              setCaptions={setCaptions}
              selectedAccountIds={selectedAccountIds}
              setSelectedAccountIds={setSelectedAccountIds}
              syncCaptions={syncCaptions}
              setSyncCaptions={setSyncCaptions}
              activeComposerPlatform={activeComposerPlatform}
              setActiveComposerPlatform={setActiveComposerPlatform}
              recurrenceRule={recurrenceRule}
              setRecurrenceRule={setRecurrenceRule}
              recurrenceEndDate={recurrenceEndDate}
              setRecurrenceEndDate={setRecurrenceEndDate}
              busy={busy}
              uploading={uploading}
              onUpload={handleUpload}
              onPublishOrSchedule={handlePublishOrSchedule}
              onConnectPlatform={connectPlatform}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "library" && (
            <LibraryTab
              assets={assets}
              weeklyPosters={weeklyPosters}
              platformAssets={platformAssets}
              libraryFilter={libraryFilter}
              onFilterChange={setLibraryFilter}
              assetId={assetId}
              weeklyPosterId={weeklyPosterId}
              platformAssetId={platformAssetId}
              uploading={uploading}
              onUpload={handleUpload}
              onSelectAsset={handleSelectAsset}
              onSelectWeeklyPoster={handleSelectWeeklyPoster}
              onSelectPlatformAsset={handleSelectPlatformAsset}
            />
          )}

          {activeTab === "history" && (
            <HistoryTab
              posts={posts}
              loading={loading}
              historyFilter={historyFilter}
              onFilterChange={setHistoryFilter}
              onRefresh={loadData}
              onNewPost={() => setActiveTab("compose")}
              onPublishNow={handlePublishNow}
              onCancelPost={handleCancelPost}
            />
          )}

          {activeTab === "accounts" && (
            <AccountsTab
              accounts={accounts}
              loading={loading}
              onRefresh={loadData}
              onConnect={connectPlatform}
              onDisconnectRequest={(acct) => {
                setAccountToDisconnect(acct);
                setDisconnectModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Desktop Preview Column */}
      <aside className="hidden w-[340px] shrink-0 xl:block h-full">
        <SocialPostPreview
          posterUrl={activePoster?.url}
          posterTitle={activePoster?.title}
          isVideo={assetIsVideo}
          caption={syncCaptions ? Object.values(captions)[0] ?? "" : ""}
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
                caption={syncCaptions ? Object.values(captions)[0] ?? "" : ""}
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

export function SocialMediaPage() {
  return (
    <PermissionGuard requiredUnit="marketing">
      <SocialMediaPageContent />
    </PermissionGuard>
  );
}
