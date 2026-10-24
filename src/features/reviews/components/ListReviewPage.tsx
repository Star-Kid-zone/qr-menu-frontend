"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
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
  PiPencilSimpleBold,
  PiPlusBold,
  PiSparkleBold,
  PiStarBold,
} from "react-icons/pi";
import { GoogleAutoReplyPanel } from "./GoogleAutoReplyPanel";
import { ReviewStatsBar } from "./ReviewStatsBar";
import { ReviewCard } from "./ReviewCard";
import { ReplyModal } from "./ReplyModal";
import { DisconnectModal } from "./DisconnectModal";

function ListReviewPageContent() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewRecord[]>([]);
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Google Business OAuth + auto-reply state
  const [googleStatus, setGoogleStatus] = useState<GoogleBusinessStatus | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
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

  const fetchPageData = async () => {
    try {
      const [workspaceRes, googleReviewsRes, googleStatusRes] = await Promise.allSettled([
        workspaceService.getWorkspace(),
        workspaceService.getGoogleReviews(),
        googleService.getStatus(),
      ]);

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPageData();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("googleConnected") === "true") {
        const account = params.get("account");
        toast.success(
          account
            ? `Google Business connected: ${account}`
            : "Google Business Profile connected!"
        );
        setShowSettingsPanel(true);
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("googleError")) {
        toast.error(`Google connection error: ${params.get("googleError")}`);
        setShowSettingsPanel(true);
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
    try {
      setRunningAutoReply(true);
      const res = await googleService.runAutoReply();
      if (res.repliedCount > 0) {
        toast.success(
          `Replied to ${res.repliedCount} review${res.repliedCount !== 1 ? "s" : ""} with AI!`
        );
        const refresh = await workspaceService.getGoogleReviews();
        setGoogleReviews(refresh.data.reviews);
      } else {
        toast.info("No unreplied reviews matching your criteria.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Auto-reply batch run failed"));
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
      toast.success("AI draft ready!");
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
      toast.success("Reply submitted!");
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
  const avgRating =
    totalReviews > 0
      ? googleReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const repliedCount = googleReviews.filter((r) => !!r.replyText).length;
  const pendingCount = totalReviews - repliedCount;

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* ── Header ── */}
      <PageHeader
        title="Reviews & AI Auto-Reply"
        description="Sync Google reviews and automate responses with Gemini AI."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {isConnected && pendingCount > 0 && (
              <Button
                onClick={handleRunAutoReplyBatch}
                loading={runningAutoReply}
                variant="outline"
                size="sm"
                startIcon={<PiSparkleBold size={14} className="text-primary" />}
              >
                Auto-Reply ({pendingCount} pending)
              </Button>
            )}
            {googlePlaceId && (
              <Button
                onClick={handleSync}
                loading={syncing}
                variant="secondary"
                size="sm"
                startIcon={<PiArrowsClockwiseBold size={14} />}
              >
                Sync Now
              </Button>
            )}
            <Link
              href="/admin/addreview"
              className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              {hasReviewLink ? <PiPencilSimpleBold size={13} /> : <PiPlusBold size={13} />}
              {hasReviewLink ? "Edit Google Link" : "Add Google Link"}
            </Link>
          </div>
        }
      />

      {/* ── Google Business Connection + AI Engine Panel ── */}
      <GoogleAutoReplyPanel
        googleStatus={googleStatus}
        isConnected={isConnected}
        showSettingsPanel={showSettingsPanel}
        setShowSettingsPanel={setShowSettingsPanel}
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
        onRunAutoReplyBatch={handleRunAutoReplyBatch}
        savingSettings={savingSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* ── Stats Bar ── */}
      <ReviewStatsBar
        totalReviews={totalReviews}
        avgRating={avgRating}
        repliedCount={repliedCount}
        lastSyncAt={lastSyncAt}
      />

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
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
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
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {googleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onOpenReplyModal={handleOpenReplyModal}
                onGenerateAiReply={handleGenerateAiReply}
              />
            ))}
          </div>
        )}
      </div>

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
