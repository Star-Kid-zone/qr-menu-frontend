"use client";

import React from "react";
import { StarRating } from "./StarRating";

interface ReviewStatsBarProps {
  totalReviews: number;
  avgRating: number;
  repliedCount: number;
  lastSyncAt: string | null;
}

export function ReviewStatsBar({
  totalReviews,
  avgRating,
  repliedCount,
  lastSyncAt,
}: ReviewStatsBarProps) {
  if (totalReviews === 0) return null;

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Total Reviews
        </p>
        <p className="mt-0.5 text-xl font-bold tabular-figures text-foreground sm:text-2xl">
          {totalReviews}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Avg Rating
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className="text-xl font-bold tabular-figures text-foreground sm:text-2xl">
            {avgRating.toFixed(1)}
          </p>
          <StarRating rating={Math.round(avgRating)} />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Replied
        </p>
        <p className="mt-0.5 text-xl font-bold tabular-figures text-foreground sm:text-2xl">
          {repliedCount}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / {totalReviews}
          </span>
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Last Synced
        </p>
        <p className="mt-0.5 text-xs font-bold text-foreground sm:text-sm">
          {lastSyncAt
            ? new Date(lastSyncAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Never"}
        </p>
      </div>
    </div>
  );
}
