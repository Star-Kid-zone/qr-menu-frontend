"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  workspaceService,
  type WorkspaceData,
  type GoogleReviewRecord,
} from "@/services/workspace.service";
import { fadeInUp } from "@/lib/motion";
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
} from "react-icons/pi";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <PiStarFill key={i} size={14} className="text-warning" />
        ) : (
          <PiStarBold key={i} size={14} className="text-border" />
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

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Reviews"
        description="Sync and display the real Google reviews for your business."
        actions={
          <Link
            href="/admin/addreview"
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.98] sm:w-auto"
          >
            {hasReviewLink ? <PiPencilSimpleBold size={16} /> : <PiPlusBold size={16} />}
            {hasReviewLink ? "Edit Review Link" : "Add Review Link"}
          </Link>
        }
      />

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="min-h-0 flex-1">
        <Card className="h-full overflow-y-auto">
          <CardContent className="flex flex-col gap-5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-4 shadow-neu-inset-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-clay-gradient text-primary-foreground shadow-neu-sm">
                  <PiGoogleLogoBold size={20} />
                </span>
                <div>
                  <p className="text-body font-semibold text-foreground">Google Reviews</p>
                  <p className="text-caption text-muted-foreground">
                    {lastSyncAt
                      ? `Last synced ${new Date(lastSyncAt).toLocaleString()}`
                      : "Not synced yet"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSync}
                loading={syncing}
                disabled={!googlePlaceId}
                className="gap-2"
              >
                <PiArrowsClockwiseBold size={16} />
                Sync Now
              </Button>
            </div>

            {!googlePlaceId ? (
              <EmptyState
                icon={<PiStarBold size={28} />}
                title="No business linked yet"
                description="Search and select your business on the Add Review page to enable syncing real Google reviews."
                className="rounded-md py-8"
              />
            ) : googleReviews.length === 0 ? (
              <EmptyState
                icon={<PiStarBold size={28} />}
                title="No reviews synced yet"
                description="Click Sync Now to pull your business's latest Google reviews."
                className="rounded-md py-8"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {googleReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04 }}
                    className="clay group relative flex flex-col gap-3 border border-border/60 bg-card p-4 shadow-neu-sm transition-all hover:-translate-y-0.5 hover:shadow-neu"
                  >
                    <PiQuotesFill size={28} className="absolute right-4 top-4 text-primary/10" />
                    <div className="flex items-center gap-3">
                      {review.authorPhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.authorPhotoUrl}
                          alt=""
                          className="size-10 shrink-0 rounded-full object-cover ring-2 ring-primary/15"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-primary/15">
                          <PiUserCircleFill size={22} />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-caption font-semibold text-foreground">{review.authorName}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    {review.text ? (
                      <p className="line-clamp-4 text-caption leading-relaxed text-muted-foreground">{review.text}</p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                      {review.relativePublishDescription ? (
                        <p className="text-caption text-muted-foreground/70">{review.relativePublishDescription}</p>
                      ) : (
                        <span />
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                        <PiGoogleLogoBold size={11} />
                        Google
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
