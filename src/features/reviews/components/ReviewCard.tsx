"use client";

import React from "react";
import { type GoogleReviewRecord } from "@/services/workspace.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import {
  PiChatCircleTextBold,
  PiGoogleLogoBold,
  PiQuotesFill,
  PiRobotBold,
  PiSparkleBold,
  PiUserCircleFill,
} from "react-icons/pi";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: GoogleReviewRecord;
  onOpenReplyModal: (review: GoogleReviewRecord) => void;
  onGenerateAiReply: (review: GoogleReviewRecord) => void;
}

export function ReviewCard({
  review,
  onOpenReplyModal,
  onGenerateAiReply,
}: ReviewCardProps) {
  const hasReply = !!review.replyText;

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-border/80 hover:shadow-sm">
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
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {review.text}
        </p>
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
                ? new Date(review.replyTime).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "Replied"}
            </span>
            <button
              type="button"
              onClick={() => onOpenReplyModal(review)}
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
            onClick={() => onGenerateAiReply(review)}
            className="flex-1 text-[11px] font-bold"
          >
            Draft AI Reply
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenReplyModal(review)}
            className="text-[11px]"
          >
            Manual
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-2.5">
        {review.relativePublishDescription ? (
          <p className="text-[10px] text-muted-foreground/80">
            {review.relativePublishDescription}
          </p>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground/70">
          <PiGoogleLogoBold size={11} className="text-primary" />
          Google
        </span>
      </div>
    </div>
  );
}
