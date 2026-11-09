"use client";

import React from "react";
import { PiSparkleBold, PiXBold } from "react-icons/pi";
import { type GoogleReviewRecord } from "@/services/workspace.service";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";

interface ReviewShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  featured: GoogleReviewRecord[];
  /** How many more reviews "Feature my best" would add. */
  suggestionCount: number;
  busyId: string | null;
  featuringBest: boolean;
  onRemove: (review: GoogleReviewRecord) => void;
  onFeatureBest: () => void;
}

/** Manage which reviews guests see on the website. */
export function ReviewShowcaseModal({
  isOpen,
  onClose,
  featured,
  suggestionCount,
  busyId,
  featuringBest,
  onRemove,
  onFeatureBest,
}: ReviewShowcaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reviews on your website" maxWidth="max-w-lg">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-body text-muted-foreground">
            {featured.length === 0 ? "Nothing is shown yet." : `${featured.length} shown to guests.`}
          </p>
          {suggestionCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={featuringBest}
              onClick={onFeatureBest}
              startIcon={<PiSparkleBold size={13} className="text-primary" />}
            >
              Feature my best reviews
            </Button>
          ) : null}
        </div>

        {featured.length > 0 ? (
          <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
            {featured.map((review) => (
              <li key={review.id} className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <StarRating rating={review.rating} />
                  <p className="line-clamp-3 text-body text-foreground">“{review.text ?? ""}”</p>
                  <p className="truncate text-caption text-muted-foreground">{review.authorName}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${review.authorName}'s review from your website`}
                  disabled={busyId === review.id}
                  onClick={() => onRemove(review)}
                  className="flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
                >
                  <PiXBold size={13} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-body text-muted-foreground">
            Switch on “Show on my website” for a review, or let us pick your newest 5-star reviews.
          </p>
        )}
      </div>
    </Modal>
  );
}
