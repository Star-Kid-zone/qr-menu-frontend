"use client";

import React from "react";
import { type GoogleReviewRecord } from "@/services/workspace.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { PiUserCircleFill } from "react-icons/pi";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: GoogleReviewRecord;
  onOpenReplyModal: (review: GoogleReviewRecord) => void;
  /** @deprecated Suggesting a reply now happens inside the reply dialog. */
  onGenerateAiReply?: (review: GoogleReviewRecord) => void;
  /** Replying needs a connected Google account. */
  canReply?: boolean;
  /** Whether this review appears on the restaurant's website. */
  onToggleFeatured?: (review: GoogleReviewRecord) => void;
  togglingFeatured?: boolean;
}

export function ReviewCard({
  review,
  onOpenReplyModal,
  canReply = true,
  onToggleFeatured,
  togglingFeatured = false,
}: ReviewCardProps) {
  const hasReply = !!review.replyText;
  const switchId = `show-${review.id}`;

  return (
    <article
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <header className="flex items-center gap-3">
        {review.authorPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={review.authorPhotoUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <PiUserCircleFill aria-hidden className="size-9 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-medium text-foreground">{review.authorName}</p>
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <StarRating rating={review.rating} />
            {review.relativePublishDescription ? <span>{review.relativePublishDescription}</span> : null}
          </div>
        </div>
        {!hasReply ? <Badge tone="primary" className="gap-1.5"><span aria-hidden className="size-1.5 rounded-full bg-primary" />Needs reply</Badge> : null}
      </header>

      {review.text ? (
        <p className="line-clamp-4 text-body text-foreground">{review.text}</p>
      ) : (
        <p className="text-body text-muted-foreground">No written review.</p>
      )}

      {hasReply ? (
        <div className="rounded-md bg-muted/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-caption font-medium text-foreground">
              Your reply
              {review.replyTime ? <span className="font-normal text-muted-foreground"> · {formatDate(review.replyTime, { day: "numeric", month: "short" })}</span> : null}
            </p>
            {review.isAutoReplied ? <Badge tone="neutral">Automatic</Badge> : null}
          </div>
          <p className="mt-1 line-clamp-4 text-body text-muted-foreground">{review.replyText}</p>
        </div>
      ) : null}

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        {onToggleFeatured ? (
          <label htmlFor={switchId} className="flex cursor-pointer items-center gap-2 text-body text-foreground">
            <button
              id={switchId}
              type="button"
              role="switch"
              aria-checked={review.isFeatured}
              disabled={togglingFeatured}
              onClick={() => onToggleFeatured(review)}
              className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
                review.isFeatured ? "bg-primary" : "bg-input"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-0.5 left-0.5 size-4 rounded-full bg-card shadow-sm transition-transform motion-reduce:transition-none",
                  review.isFeatured && "translate-x-4"
                )}
              />
            </button>
            Show on my website
          </label>
        ) : (
          <span />
        )}
        {canReply ? (
          <Button type="button" variant="secondary" size="sm" onClick={() => onOpenReplyModal(review)}>
            {hasReply ? "Edit reply" : "Reply"}
          </Button>
        ) : null}
      </footer>
    </article>
  );
}
