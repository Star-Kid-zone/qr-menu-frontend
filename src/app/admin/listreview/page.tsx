"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
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
  PiGoogleLogoBold,
  PiPencilSimpleBold,
  PiPlusBold,
  PiQuotesFill,
  PiStarBold,
  PiStarFill,
  PiUserCircleFill,
  PiCheckCircleFill,
  PiRobotBold,
  PiSparkleBold,
  PiChatCircleTextBold,
  PiXBold,
  PiSlidersBold,
  PiCaretDownBold,
  PiWarningCircleBold,
} from "react-icons/pi";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <PiStarFill key={i} size={13} className="text-amber-400" />
        ) : (
          <PiStarBold key={i} size={13} className="text-border" />
        )
      )}
    </div>
  );
}

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

  // Sync status from status object into form fields
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

    // Handle OAuth redirect-back params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("googleConnected") === "true") {
        const account = params.get("account");
        toast.success(account ? `Google Business connected: ${account}` : "Google Business Profile connected!");
        setShowSettingsPanel(true);
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("googleError")) {
        toast.error(`Google connection error: ${params.get("googleError")}`);
        setShowSettingsPanel(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  // --- Actions ---
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
        toast.success(`Replied to ${res.repliedCount} review${res.repliedCount !== 1 ? "s" : ""} with AI!`);
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
  const avgRating = totalReviews > 0
    ? googleReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;
  const repliedCount = googleReviews.filter((r) => !!r.replyText).length;
  const pendingCount = totalReviews - repliedCount;

  const toneOptions = [
    { id: "warm_professional", label: "Warm & Professional", icon: "✨" },
    { id: "friendly", label: "Friendly & Casual", icon: "👋" },
    { id: "enthusiastic", label: "Enthusiastic & Grateful", icon: "🎉" },
    { id: "concise", label: "Concise & Direct", icon: "🎯" },
  ];

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
      <div className="shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        {/* Panel Header / Toggle row */}
        <button
          type="button"
          onClick={() => setShowSettingsPanel((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-muted/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
              <PiGoogleLogoBold size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Google Business & AI Auto-Reply
                </span>
                <Badge tone={isConnected ? "success" : "neutral"}>
                  {isConnected ? "Connected" : "Not Connected"}
                </Badge>
                {isConnected && googleStatus?.autoReplyEnabled && (
                  <Badge tone="primary" className="gap-1">
                    <PiRobotBold size={11} /> Auto-Reply ON
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {isConnected
                  ? googleStatus?.autoReplyEnabled
                    ? `AI replies to reviews ≥ ${googleStatus.autoReplyMinRating} stars via Gemini`
                    : `Connected as ${googleStatus?.accountName || "Google Business"} — auto-reply paused`
                  : "Connect your Google account to enable AI-powered automated review replies"}
              </p>
            </div>
          </div>
          <PiCaretDownBold
            size={14}
            className={cn(
              "shrink-0 text-muted-foreground transition-transform duration-200",
              showSettingsPanel && "rotate-180"
            )}
          />
        </button>

        {/* Expandable Settings Panel */}
        {showSettingsPanel && (
          <div className="border-t border-border px-4 pb-5 pt-4 space-y-5">
            {/* Connection row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {isConnected ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <PiCheckCircleFill size={15} className="text-emerald-500 shrink-0" />
                  <span>
                    Signed in as{" "}
                    <span className="font-bold text-foreground">
                      {googleStatus?.accountName || "Google Business Profile"}
                    </span>
                  </span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Sign in with Google to start auto-replying to reviews.
                </p>
              )}
              <div className="flex items-center gap-2 shrink-0">
                {isConnected ? (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    startIcon={<PiXBold className="size-3.5" />}
                    onClick={() => setShowDisconnectModal(true)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    loading={connecting}
                    onClick={handleConnect}
                    startIcon={<PiGoogleLogoBold className="size-4" />}
                    className="bg-[#4285F4] hover:bg-[#4285F4]/90 text-white font-semibold"
                  >
                    Connect Google Account
                  </Button>
                )}
              </div>
            </div>

            {/* AI Auto-Reply settings — only shown when connected */}
            {isConnected && (
              <div className="space-y-4 rounded-xl border border-border/70 bg-muted/20 p-4">
                {/* Header + master toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiRobotBold size={16} className="text-primary" />
                    <span className="text-xs font-bold text-foreground">AI Auto-Reply Engine</span>
                    <span className="text-[11px] text-muted-foreground">Powered by Gemini 2.5 Flash</span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:top-[2px] after:start-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </label>
                </div>

                <div className={cn("space-y-4 transition-opacity", !enabled && "opacity-50 pointer-events-none")}>
                  {/* Rating threshold */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Auto-Reply Threshold</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={1}>All reviews (1 to 5 stars)</option>
                      <option value={3}>3 stars and above</option>
                      <option value={4}>4 stars and above</option>
                      <option value={5}>5 stars only</option>
                    </select>
                  </div>

                  {/* Tone selector */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">AI Voice & Tone</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {toneOptions.map((t) => {
                        const selected = aiTone === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setAiTone(t.id)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-xs font-medium transition-all cursor-pointer",
                              selected
                                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                                : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                            )}
                          >
                            <span className="text-base">{t.icon}</span>
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom prompt */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Custom Business Context <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={2}
                      placeholder="e.g. We are known for our wood-fired pizzas. For complaints, invite guests to email care@restaurant.com."
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Save + Run Now */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    loading={runningAutoReply}
                    onClick={handleRunAutoReplyBatch}
                    startIcon={<PiSparkleBold className="size-4 text-primary" />}
                    className="text-xs font-semibold"
                  >
                    Run Auto-Reply on Pending Reviews Now
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    loading={savingSettings}
                    onClick={handleSaveSettings}
                    className="text-xs font-bold"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Stats Bar ── */}
      {totalReviews > 0 && (
        <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Reviews</p>
            <p className="mt-0.5 text-xl font-bold tabular-figures text-foreground sm:text-2xl">{totalReviews}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avg Rating</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <p className="text-xl font-bold tabular-figures text-foreground sm:text-2xl">{avgRating.toFixed(1)}</p>
              <StarRating rating={Math.round(avgRating)} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Replied</p>
            <p className="mt-0.5 text-xl font-bold tabular-figures text-foreground sm:text-2xl">
              {repliedCount}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ {totalReviews}</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Synced</p>
            <p className="mt-0.5 text-xs font-bold text-foreground sm:text-sm">
              {lastSyncAt
                ? new Date(lastSyncAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                : "Never"}
            </p>
          </div>
        </div>
      )}

      {/* ── Body: Review Cards ── */}
      <div className={cn("min-h-0 flex-1", (!googlePlaceId || totalReviews === 0) && !loading ? "flex flex-col" : "overflow-y-auto pr-0.5 pb-4")}>
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
            {googleReviews.map((review) => {
              const hasReply = !!review.replyText;
              return (
                <div
                  key={review.id}
                  className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-border/80 hover:shadow-sm"
                >
                  <PiQuotesFill size={22} className="absolute right-4 top-4 text-primary/10" />

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {review.authorPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.authorPhotoUrl}
                        alt=""
                        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                        <PiUserCircleFill size={22} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-foreground">{review.authorName}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>

                  {/* Review text */}
                  {review.text ? (
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">{review.text}</p>
                  ) : (
                    <p className="text-[11px] italic text-muted-foreground/70">(No written review)</p>
                  )}

                  {/* Existing reply */}
                  {hasReply ? (
                    <div className="mt-1 rounded-lg border border-border/80 bg-muted/40 p-2.5 text-xs">
                      <div className="flex items-center justify-between pb-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                          <PiChatCircleTextBold size={13} />
                          Owner Response
                        </span>
                        {review.isAutoReplied && (
                          <Badge tone="primary" className="gap-1 text-[9px] px-1.5 py-0">
                            <PiRobotBold className="size-3" /> AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
                        {review.replyText}
                      </p>
                      <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-1.5 text-[10px]">
                        <span className="text-muted-foreground/70">
                          {review.replyTime
                            ? new Date(review.replyTime).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            : "Replied"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenReplyModal(review)}
                          className="font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* No reply yet → action buttons */
                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        startIcon={<PiSparkleBold size={12} />}
                        onClick={() => handleGenerateAiReply(review)}
                        className="flex-1 text-[11px] font-bold"
                      >
                        Draft AI Reply
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReplyModal(review)}
                        className="text-[11px]"
                      >
                        Manual
                      </Button>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-2.5">
                    {review.relativePublishDescription ? (
                      <p className="text-[10px] text-muted-foreground/80">{review.relativePublishDescription}</p>
                    ) : <span />}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground/70">
                      <PiGoogleLogoBold size={11} className="text-primary" />
                      Google
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Reply Modal ── */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <PiChatCircleTextBold size={16} />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Reply to {selectedReview.authorName}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseReplyModal}
                className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
              >
                <PiXBold size={14} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
              {/* Review summary */}
              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground">{selectedReview.authorName}</span>
                  <StarRating rating={selectedReview.rating} />
                </div>
                {selectedReview.text && (
                  <p className="text-xs text-muted-foreground leading-relaxed">&ldquo;{selectedReview.text}&rdquo;</p>
                )}
              </div>

              {/* AI Generate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <PiSparkleBold size={14} className="text-primary" />
                    Generate with Gemini AI
                  </label>
                  <select
                    value={draftTone}
                    onChange={(e) => setDraftTone(e.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {toneOptions.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={generatingAi}
                  onClick={() => handleGenerateAiReply(selectedReview, draftTone)}
                  className="w-full text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10"
                >
                  {replyText ? "Regenerate Draft" : "Generate AI Draft"}
                </Button>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Write your response to this customer..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-3.5 bg-muted/20">
              <Button type="button" variant="outline" size="sm" onClick={handleCloseReplyModal} disabled={submittingReply}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                loading={submittingReply}
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
              >
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Disconnect Confirm Modal ── */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <PiWarningCircleBold size={24} />
              <h3 className="text-sm font-bold text-foreground">Disconnect Google Account?</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Disconnecting will pause automatic review syncing and AI auto-replies until you reconnect.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowDisconnectModal(false)} disabled={disconnecting}>
                Cancel
              </Button>
              <Button type="button" variant="danger" size="sm" loading={disconnecting} onClick={handleDisconnect}>
                Confirm Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListReviewPage() {
  return (
    <PermissionGuard requiredUnit="reviews">
      <ListReviewPageContent />
    </PermissionGuard>
  );
}
