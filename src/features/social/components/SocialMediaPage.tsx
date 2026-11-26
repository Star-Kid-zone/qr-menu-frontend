"use client";

import { useState, useMemo } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LoadErrorNotice } from "@/components/feedback/LoadErrorNotice";
import {
  PiClockBold,
  PiDeviceMobileBold,
  PiImagesBold,
  PiPaperPlaneTiltBold,
  PiShareNetworkBold,
} from "react-icons/pi";
import { Button, ConfirmDeleteModal, EmptyState, toast } from "@/components/ui";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Modal } from "@/components/Modal";

type PendingConfirm =
  | { kind: "post"; networks: string[] }
  | { kind: "publishNow"; postId: string }
  | { kind: "cancel"; postId: string };

function listNetworks(names: string[]) {
  const pretty = names.map((n) => (n === "x" ? "X" : n.charAt(0).toUpperCase() + n.slice(1)));
  if (pretty.length <= 1) return pretty[0] ?? "the selected network";
  return `${pretty.slice(0, -1).join(", ")} and ${pretty[pretty.length - 1]}`;
}
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
  const [busy, setBusy] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
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

  function requestData() {
    return Promise.allSettled([
      socialService.getAccounts(),
      socialService.getAssets(),
      socialService.getPosts(),
      socialService.getWeeklyPosters(),
      socialService.getPlatformAssets(),
    ]);
  }

  function applyData([
    accountsRes,
    assetsRes,
    postsRes,
    weeklyRes,
    platformRes,
  ]: Awaited<ReturnType<typeof requestData>>) {
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
  }

  // Everything that loaded is shown; if any part failed, the page says so with a retry
  // (allSettled alone used to hide those failures).
  const { loading, error: loadError, refetch: loadData } = useAsyncData(
    async () => {
      const results = await requestData();
      applyData(results);
      const failed = results.find((r) => r.status === "rejected");
      if (failed) throw failed.reason;
      return true;
    },
    [],
    "Could not load social media data.",
  );

  async function connectPlatform(platform: SocialPlatform) {
    try {
      const { data } = await socialService.startOAuth(platform);
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        toast.error("Couldn't start connecting that account. Try again.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Could not connect ${platform}.`));
    }
  }

  async function handleDisconnect() {
    if (!accountToDisconnect) return;
    // ConfirmDeleteModal shows the success toast or the inline error.
    await socialService.disconnect(accountToDisconnect.id);
    setAccounts((prev) => prev.filter((a) => a.id !== accountToDisconnect.id));
    setAccountToDisconnect(null);
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

  async function handlePublishOrSchedule(action: "now" | "schedule", confirmed = false) {
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

    // Posting goes out publicly straight away and can't be pulled back from here.
    if (action === "now" && !confirmed) {
      const networks = accounts
        .filter((a) => destinations.some((d) => d.accountId === a.id))
        .map((a) => a.platform);
      setPendingConfirm({ kind: "post", networks });
      return;
    }

    setPendingConfirm(null);
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

  async function handleCancelPost(postId: string, confirmed = false) {
    if (!confirmed) {
      setPendingConfirm({ kind: "cancel", postId });
      return;
    }
    setPendingConfirm(null);
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

  async function handlePublishNow(postId: string, confirmed = false) {
    if (!confirmed) {
      setPendingConfirm({ kind: "publishNow", postId });
      return;
    }
    setPendingConfirm(null);
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

  const hasConnectedAccount = accounts.some((a) => a.status === "connected");

  const tabs = [
    {
      id: "compose" as const,
      label: "Create post",
      icon: <PiPaperPlaneTiltBold size={16} />,
    },
    {
      id: "library" as const,
      label: "Media library",
      icon: <PiImagesBold size={16} />,
      badge: assets.length + weeklyPosters.length,
    },
    {
      id: "history" as const,
      label: "Planned and sent",
      icon: <PiClockBold size={16} />,
      badge: posts.length,
    },
    {
      id: "accounts" as const,
      label: "Connected accounts",
      icon: <PiShareNetworkBold size={16} />,
      badge: accounts.length,
    },
  ];

  return (
    <div className="flex h-full w-full gap-4">
      {/* Left main pane */}
      <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
        <PageHeader title="Social posts" description="Post to your connected accounts now or schedule for later." />
        {loadError && !loading ? (
          <LoadErrorNotice title="Some of your social posts data didn't load" message={loadError} onRetry={loadData} />
        ) : null}
        <div role="tablist" aria-label="Social posts sections" className="flex shrink-0 gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-border">
          {tabs.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-body-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="rounded bg-muted px-2 text-caption text-muted-foreground">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </div>
        {/* Active Tab Panel */}
        <div className="min-h-0 flex-1 overflow-hidden">
          {activeTab === "compose" && !loading && !hasConnectedAccount && (
            <EmptyState
              icon={<PiShareNetworkBold className="size-7" />}
              title="Connect a social account to start posting"
              description="Connect Facebook, Instagram, X or LinkedIn. Your media library is ready to use once you do."
              action={
                <Button onClick={() => setActiveTab("accounts")}>Connect an account</Button>
              }
            />
          )}
          {activeTab === "compose" && (loading || hasConnectedAccount) && (
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
      <aside className={cn("hidden w-[340px] shrink-0 h-full", (activeTab !== "compose" || hasConnectedAccount) && "xl:block")}>
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
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary px-4 py-3 text-xs font-bold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 xl:hidden"
      >
        <PiDeviceMobileBold size={17} />
        <span>Live Preview</span>
      </button>

      {/* Mobile live preview */}
      <Modal
        isOpen={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
        title="Preview"
        maxWidth="max-w-sm"
      >
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
      </Modal>

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
          successMessage={`${accountToDisconnect.displayName} disconnected`}
          confirmLabel="Disconnect"
          title="Disconnect this account?"
          description={`Are you sure you want to disconnect ${accountToDisconnect.displayName}? You will no longer be able to publish organic posts to this profile.`}
        />
      )}

      <ConfirmationDialog
        isOpen={pendingConfirm !== null}
        onClose={() => setPendingConfirm(null)}
        tone={pendingConfirm?.kind === "cancel" ? "destructive" : "default"}
        loading={busy}
        title={
          pendingConfirm?.kind === "cancel"
            ? "Cancel this scheduled post?"
            : pendingConfirm?.kind === "post"
              ? `Post to ${listNetworks(pendingConfirm.networks)} now?`
              : "Post this now?"
        }
        description={
          pendingConfirm?.kind === "cancel"
            ? "It won't be posted. You can create it again later."
            : "It goes live straight away. To remove it afterwards, delete it on the social network itself."
        }
        confirmLabel={pendingConfirm?.kind === "cancel" ? "Cancel post" : "Post now"}
        cancelLabel={pendingConfirm?.kind === "cancel" ? "Keep post" : "Not yet"}
        onConfirm={() => {
          if (!pendingConfirm) return;
          if (pendingConfirm.kind === "post") void handlePublishOrSchedule("now", true);
          else if (pendingConfirm.kind === "publishNow") void handlePublishNow(pendingConfirm.postId, true);
          else void handleCancelPost(pendingConfirm.postId, true);
        }}
      />
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
