"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  workspaceService,
  type WorkspaceData,
  type GoogleReviewRecord,
} from "@/services/workspace.service";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
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

export default function ListReviewPage() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewRecord[]>([]);
  const [googlePlaceId, setGooglePlaceId] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviewPage = async () => {
    try {
      const [workspaceRes, googleReviewsRes] = await Promise.all([
        workspaceService.getWorkspace(),
        workspaceService.getGoogleReviews(),
      ]);
      setWorkspace(workspaceRes.data);
      setGoogleReviews(googleReviewsRes.data.reviews);
      setGooglePlaceId(googleReviewsRes.data.googlePlaceId);
      setLastSyncAt(googleReviewsRes.data.lastSyncAt);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load review settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReviewPage();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await workspaceService.syncGoogleReviews();
      setGoogleReviews(res.data.reviews);
      setLastSyncAt(new Date().toISOString());
      toast.success("Google reviews synced");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to sync Google reviews"));
    } finally {
      setSyncing(false);
    }
  };

  const reviewLink = workspace?.review?.googleReviewLink?.trim() || "";
  const hasReviewLink = reviewLink.length > 0;

  // Average rating
  const avgRating =
    googleReviews.length > 0
      ? googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length
      : 0;

  return (
    <div className="flex h-full flex-col gap-3 sm:gap-4">
      {/* Header */}
      <PageHeader
        title="Reviews"
        description="Sync and showcase real Google reviews for your business."
        actions={
          <div className="flex items-center gap-2">
            {googlePlaceId && (
              <Button
                onClick={handleSync}
                loading={syncing}
                variant="secondary"
                size="sm"
                leftIcon={<PiArrowsClockwiseBold size={14} />}
              >
                Sync Now
              </Button>
            )}
            <Link
              href="/admin/addreview"
              className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              {hasReviewLink ? <PiPencilSimpleBold size={13} /> : <PiPlusBold size={13} />}
              {hasReviewLink ? "Edit Link" : "Add Link"}
            </Link>
          </div>
        }
      />

      {/* Responsive Stats bar (2 cols on mobile, 3 cols on sm+) */}
      {googleReviews.length > 0 && (
        <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Reviews</p>
            <p className="mt-0.5 text-xl font-bold tabular-figures text-foreground sm:text-2xl">{googleReviews.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avg Rating</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <p className="text-xl font-bold tabular-figures text-foreground sm:text-2xl">{avgRating.toFixed(1)}</p>
              <StarRating rating={Math.round(avgRating)} />
            </div>
          </div>
          <div className="col-span-2 rounded-xl border border-border bg-card p-3 sm:col-span-1 sm:p-4 shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Last Synced</p>
            <p className="mt-0.5 text-xs font-bold text-foreground sm:text-sm">
              {lastSyncAt ? new Date(lastSyncAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Never"}
            </p>
          </div>
        </div>
      )}

      {/* Status bar (when linked) */}
      {googlePlaceId && googleReviews.length === 0 && !loading && (
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-muted/40 p-3.5 sm:p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <PiGoogleLogoBold size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Business linked</p>
            <p className="text-xs text-muted-foreground">
              {lastSyncAt ? `Last synced ${new Date(lastSyncAt).toLocaleString()}` : "Click Sync Now to pull your reviews"}
            </p>
          </div>
          {lastSyncAt && <PiCheckCircleFill size={18} className="shrink-0 text-emerald-500" />}
        </div>
      )}

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 pb-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : !googlePlaceId ? (
          <div className="flex h-full items-center justify-center p-4">
            <EmptyState
              icon={<PiStarBold size={24} />}
              title="No business linked yet"
              description="Search and link your Google business profile to showcase real customer reviews on your landing page."
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
        ) : googleReviews.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <EmptyState
              icon={<PiStarBold size={24} />}
              title="No reviews synced yet"
              description="Click Sync Now above to pull your business's latest Google reviews."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {googleReviews.map((review) => (
              <div
                key={review.id}
                className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
              >
                <PiQuotesFill size={22} className="absolute right-4 top-4 text-primary/10" />
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
                {review.text ? (
                  <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground">{review.text}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-2.5">
                  {review.relativePublishDescription ? (
                    <p className="text-[10px] text-muted-foreground/80">{review.relativePublishDescription}</p>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground/70">
                    <PiGoogleLogoBold size={11} className="text-primary" />
                    Google Review
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
