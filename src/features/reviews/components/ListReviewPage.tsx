"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import {
  workspaceService,
  type WorkspaceData,
  type GoogleReviewRecord,
} from "@/services/workspace.service";
import {
  googleService,
  type GoogleBusinessStatus,
  type AutoReplySettingsInput,
} from "@/services/google.service";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { cn } from "@/utils/cn";
import {
  PiArrowsClockwiseBold,
  PiGlobeBold,
  PiRobotBold,
  PiGoogleLogoBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiSparkleBold,
  PiStarBold,
} from "react-icons/pi";
import { AutoReplySettingsModal } from "./GoogleAutoReplyPanel";
import { ReviewStatsBar } from "./ReviewStatsBar";
import { ReviewCard } from "./ReviewCard";
import { ReviewShowcaseModal } from "./ReviewShowcase";
import { ReplyModal } from "./ReplyModal";
import { ReplyQueueModal } from "./ReplyQueueModal";
import { ReviewFilterBar } from "./ReviewFilterBar";
import {
  applyReviewView,
  isUnreplied,
  matchesFilter,
  pickBestToFeature,
  sortReviews,
  summarizeReviews,
  type ReviewFilter,
  type ReviewSort,
} from "../reviewFilters";
import { DisconnectModal } from "./DisconnectModal";

function ListReviewPageContent() {
  const router = useRouter();
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewRecord[]>([]);
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [confirmAutoReply, setConfirmAutoReply] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>("needs_reply");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ReviewSort>("urgent");
  // Snapshot taken when the queue opens, so posting replies doesn't reshuffle it mid-session.
  const [queueReviews, setQueueReviews] = useState<GoogleReviewRecord[] | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  // "Show on my website" (moved here from the Website page).
  const handleToggleFeatured = async (review: GoogleReviewRecord) => {
    try {
      setTogglingFeaturedId(review.id);
      const res = await workspaceService.toggleGoogleReviewFeatured(review.id);
      const updated = res.data.review;
      setGoogleReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isFeatured: updated?.isFeatured ?? !r.isFeatured } : r)));
      toast.success(updated?.isFeatured ?? !review.isFeatured ? "Shown on your website" : "Hidden from your website");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't change that. Try again."));
    } finally {
      setTogglingFeaturedId(null);
    }
  };
  const [featuringBest, setFeaturingBest] = useState(false);

  const handleFeatureBest = async () => {
    const picks = pickBestToFeature(googleReviews);
    if (picks.length === 0) return;
    setFeaturingBest(true);
    let added = 0;
    for (const review of picks) {
      try {
        const res = await workspaceService.toggleGoogleReviewFeatured(review.id);
        const isFeatured = res.data.review?.isFeatured ?? true;
        setGoogleReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isFeatured } : r)));
        if (isFeatured) added += 1;
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Couldn't feature every review. Try again."));
        break;
      }
    }
    setFeaturingBest(false);
    if (added > 0) toast.success(`Added ${added} review${added === 1 ? "" : "s"} to your website`);
  };
  const [loading, setLoading] = useState(true);

  // Google Business OAuth + auto-reply state
  const [googleStatus, setGoogleStatus] = useState<GoogleBusinessStatus | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("googleConnected") === "true" || Boolean(params.get("googleError"));
  });
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [runningAutoReply, setRunningAutoReply] = useState(false);

  // Auto-reply form fields
  const [enabled, setEnabled] = useState(false);
  const [minRating, setMinRating] = useState<number>(3);
  const [aiTone, setAiTone] = useState<string>("warm_professional");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // Reply modal state
  const [selectedReview, setSelectedReview] = useState<GoogleReviewRecord | null>(null);
  const [replyText, setReplyText] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [draftTone, setDraftTone] = useState("warm_professional");

  const syncFormFromStatus = (s: GoogleBusinessStatus) => {
    setEnabled(s.autoReplyEnabled);
    setMinRating(s.autoReplyMinRating);
    setAiTone(s.autoReplyAiTone || "warm_professional");
    setCustomPrompt(s.autoReplyCustomPrompt || "");
  };

  const requestPageData = () =>
    Promise.allSettled([
      workspaceService.getWorkspace(),
      workspaceService.getGoogleReviews(),
      googleService.getStatus(),
    ]);

  const applyPageData = ([
    workspaceRes,
    googleReviewsRes,
    googleStatusRes,
  ]: Awaited<ReturnType<typeof requestPageData>>) => {
    if (workspaceRes.status === "fulfilled") setWorkspace(workspaceRes.value.data);
    if (googleReviewsRes.status === "fulfilled") {
      setGoogleReviews(googleReviewsRes.value.data.reviews);
      setGooglePlaceId(googleReviewsRes.value.data.googlePlaceId);
      setLastSyncAt(googleReviewsRes.value.data.lastSyncAt);
    }
    if (googleStatusRes.status === "fulfilled") {
      setGoogleStatus(googleStatusRes.value);
      syncFormFromStatus(googleStatusRes.value);
    }
  };

  const fetchPageData = async () => {
    try {
      applyPageData(await requestPageData());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load (`loading` starts true); fetchPageData handles later refreshes.
    requestPageData()
      .then(applyPageData)
      .catch((error: unknown) => console.error(error))
      .finally(() => setLoading(false));

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("googleConnected") === "true") {
        const account = params.get("account");
        toast.success(
          account
            ? `Google Business connected: ${account}`
            : "Google Business Profile connected!"
        );
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("googleError")) {
        toast.error(`Google connection error: ${params.get("googleError")}`);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const res = await googleService.getOAuthUrl();
      if (res.url) window.location.href = res.url;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to start Google authentication"));
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      await googleService.disconnect();
      toast.success("Google Business profile disconnected");
      setShowDisconnectModal(false);
      await fetchPageData();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to disconnect"));
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      const payload: AutoReplySettingsInput = {
        enabled,
        minRating: Number(minRating),
        aiTone,
        customPrompt: customPrompt.trim() || null,
      };
      const res = await googleService.updateAutoReplySettings(payload);
      setGoogleStatus(res.status);
      toast.success("Auto-reply settings saved");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save settings"));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await workspaceService.syncGoogleReviews();
      setGoogleReviews(res.data.reviews);
      setLastSyncAt(new Date().toISOString());
      toast.success("Reviews synced successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to sync Google reviews"));
    } finally {
      setSyncing(false);
    }
  };

  const handleRunAutoReplyBatch = async () => {
    setConfirmAutoReply(false);
    try {
      setRunningAutoReply(true);
      const res = await googleService.runAutoReply();
      if (res.repliedCount > 0) {
        toast.success(
          `Posted replies to ${res.repliedCount} review${res.repliedCount !== 1 ? "s" : ""}`
        );
        const refresh = await workspaceService.getGoogleReviews();
        setGoogleReviews(refresh.data.reviews);
      } else {
        toast.info("No reviews matched your auto-reply settings, so nothing was posted.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't post the replies. Try again."));
    } finally {
      setRunningAutoReply(false);
    }
  };

  const handleOpenReplyModal = (review: GoogleReviewRecord) => {
    setSelectedReview(review);
    setReplyText(review.replyText || "");
  };

  const handleCloseReplyModal = () => {
    setSelectedReview(null);
    setReplyText("");
    setGeneratingAi(false);
  };

  const handleGenerateAiReply = async (review: GoogleReviewRecord, tone = draftTone) => {
    try {
      setGeneratingAi(true);
      if (!selectedReview || selectedReview.id !== review.id) setSelectedReview(review);
      const res = await googleService.generateAiReply(review.id, { tone });
      setReplyText(res.reply);

    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to generate AI reply"));
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!selectedReview || !replyText.trim()) {
      toast.warning("Please enter a reply before submitting.");
      return;
    }
    try {
      setSubmittingReply(true);
      const res = await googleService.replyToReview(selectedReview.id, replyText.trim());
      toast.success("Reply posted on Google");
      setGoogleReviews((prev) =>
        prev.map((r) => (r.id === selectedReview.id ? res.review : r))
      );
      handleCloseReplyModal();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to submit review reply"));
    } finally {
      setSubmittingReply(false);
    }
  };

  const reviewLink = workspace?.review?.googleReviewLink?.trim() || "";
  const hasReviewLink = reviewLink.length > 0;
  const isConnected = !!googleStatus?.isConnected;
  const totalReviews = googleReviews.length;
  const summary = summarizeReviews(googleReviews);
  const pendingCount = totalReviews - summary.replied;
  const visibleReviews = applyReviewView(googleReviews, { filter, rating: ratingFilter, query, sort });
  const filterCounts: Record<ReviewFilter, number> = {
    all: totalReviews,
    needs_reply: pendingCount,
    low: googleReviews.filter((r) => matchesFilter(r, "low")).length,
    featured: googleReviews.filter((r) => r.isFeatured).length,
  };
  const clearFilters = () => {
    setFilter("all");
    setRatingFilter(null);
    setQuery("");
  };
  const openQueue = () => setQueueReviews(sortReviews(googleReviews.filter(isUnreplied), "urgent"));

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* ── Header ── */}
      <PageHeader
        title="Reviews"
        description="What guests say about you on Google, and your replies."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {googlePlaceId && (
              <Button
                onClick={handleSync}
                loading={syncing}
                variant="secondary"
                size="sm"
                startIcon={<PiArrowsClockwiseBold size={14} />}
              >
                Sync
              </Button>
            )}
            {!hasReviewLink ? (
              <Link
                href="/admin/addreview"
                className={buttonVariants({ variant: "primary", size: "sm", className: "gap-2" })}
              >
                <PiPlusBold size={13} />
                Find your business on Google
              </Link>
            ) : !isConnected ? (
              <Button
                size="sm"
                loading={connecting}
                onClick={() => void handleConnect()}
                startIcon={<PiGoogleLogoBold size={14} />}
              >
                Connect Google
              </Button>
            ) : pendingCount > 0 ? (
              <Button size="sm" onClick={openQueue} startIcon={<PiSparkleBold size={14} />}>
                Draft {pendingCount} {pendingCount === 1 ? "reply" : "replies"}
              </Button>
            ) : null}
            {hasReviewLink ? (
              <ActionMenu
                items={[
                  {
                    label: `Website reviews (${googleReviews.filter((r) => r.isFeatured).length})`,
                    description: "Choose what guests see on your site",
                    icon: <PiGlobeBold size={14} />,
                    onSelect: () => setShowcaseOpen(true),
                  },
                  {
                    label: "Automatic replies",
                    description: !isConnected
                      ? "Connect Google first"
                      : googleStatus?.autoReplyEnabled
                        ? "On"
                        : "Off",
                    icon: <PiRobotBold size={14} />,
                    onSelect: () => setShowSettingsPanel(true),
                  },
                  {
                    label: "Change Google business",
                    icon: <PiPencilSimpleBold size={14} />,
                    onSelect: () => router.push("/admin/addreview"),
                  },
                ]}
              />
            ) : null}
          </div>
        }
      />

      {/* ── Google Business Connection + AI Engine Panel ── */}
      <AutoReplySettingsModal
        isOpen={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
        googleStatus={googleStatus}
        isConnected={isConnected}
        connecting={connecting}
        onConnect={handleConnect}
        onOpenDisconnectModal={() => setShowDisconnectModal(true)}
        enabled={enabled}
        setEnabled={setEnabled}
        minRating={minRating}
        setMinRating={setMinRating}
        aiTone={aiTone}
        setAiTone={setAiTone}
        customPrompt={customPrompt}
        setCustomPrompt={setCustomPrompt}
        runningAutoReply={runningAutoReply}
        onRunAutoReplyBatch={() => setConfirmAutoReply(true)}
        savingSettings={savingSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* ── Stats Bar ── */}
      <ReviewStatsBar
        summary={summary}
        lastSyncAt={lastSyncAt}
        selectedRating={ratingFilter}
        onSelectRating={setRatingFilter}
      />

      {!loading && totalReviews > 0 ? (
        <ReviewFilterBar
          filter={filter}
          onFilterChange={setFilter}
          counts={filterCounts}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          rating={ratingFilter}
          onClearRating={() => setRatingFilter(null)}
        />
      ) : null}

      {/* ── Body: Review Cards ── */}
      <div
        className={cn(
          "min-h-0 flex-1",
          (!googlePlaceId || totalReviews === 0) && !loading
            ? "flex flex-col"
            : "overflow-y-auto pr-0.5 pb-4"
        )}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : !googlePlaceId ? (
          <div className="h-full min-h-0 flex-1 rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiStarBold size={32} />}
              title="No business linked yet"
              description="Search and link your Google business profile to showcase real customer reviews."
              action={
                <Link
                  href="/admin/addreview"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  <PiPlusBold size={13} />
                  Link Google Business
                </Link>
              }
            />
          </div>
        ) : totalReviews === 0 ? (
          <div className="h-full min-h-0 flex-1 rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiStarBold size={32} />}
              title="No reviews synced yet"
              description="Click Sync Now above to pull your latest Google reviews."
            />
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <EmptyState
              icon={<PiStarBold size={32} />}
              title={filter === "needs_reply" && !query && ratingFilter === null ? "You're all caught up" : "No reviews match"}
              description={
                filter === "needs_reply" && !query && ratingFilter === null
                  ? "Every review has a reply."
                  : "Try a different filter or search."
              }
              action={
                <Button type="button" variant="secondary" size="sm" onClick={clearFilters}>
                  Show all reviews
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onOpenReplyModal={handleOpenReplyModal}
                canReply={isConnected}
                onToggleFeatured={(r) => void handleToggleFeatured(r)}
                togglingFeatured={togglingFeaturedId === review.id}
              />
            ))}
          </div>
        )}
      </div>

      <ReviewShowcaseModal
        isOpen={showcaseOpen}
        onClose={() => setShowcaseOpen(false)}
        featured={googleReviews.filter((r) => r.isFeatured)}
        suggestionCount={pickBestToFeature(googleReviews).length}
        busyId={togglingFeaturedId}
        featuringBest={featuringBest}
        onRemove={(r) => void handleToggleFeatured(r)}
        onFeatureBest={() => void handleFeatureBest()}
      />

      {/* ── Reply Modal ── */}
      <ReplyModal
        selectedReview={selectedReview}
        onClose={handleCloseReplyModal}
        replyText={replyText}
        setReplyText={setReplyText}
        generatingAi={generatingAi}
        onGenerateAiReply={handleGenerateAiReply}
        draftTone={draftTone}
        setDraftTone={setDraftTone}
        submittingReply={submittingReply}
        onSubmitReply={handleSubmitReply}
      />

      {queueReviews ? (
        <ReplyQueueModal
          reviews={queueReviews}
          initialTone={draftTone}
          onClose={() => setQueueReviews(null)}
          onPosted={(updated) =>
            setGoogleReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
          }
        />
      ) : null}

      <ConfirmationDialog
        isOpen={confirmAutoReply}
        onClose={() => setConfirmAutoReply(false)}
        onConfirm={() => void handleRunAutoReplyBatch()}
        loading={runningAutoReply}
        tone="default"
        title={`Post replies to ${pendingCount} review${pendingCount !== 1 ? "s" : ""}?`}
        description="A reply is written for each review that matches your auto-reply settings and posted publicly on Google straight away. You won't see them before they go live."
        confirmLabel="Post replies"
        cancelLabel="Not now"
      />

      {/* ── Disconnect Confirm Modal ── */}
      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        disconnecting={disconnecting}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}

export function ListReviewPage() {
  return (
    <PermissionGuard requiredUnit="reviews">
      <ListReviewPageContent />
    </PermissionGuard>
  );
}
