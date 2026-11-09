"use client";

import React, { useState } from "react";
import { PiArrowDownBold, PiArrowUpBold, PiStarFill } from "react-icons/pi";
import { Modal } from "@/components/Modal";
import { cn } from "@/utils/cn";
import { StarRating } from "./StarRating";
import type { ReviewSummary } from "../reviewFilters";

interface ReviewStatsBarProps {
  summary: ReviewSummary;
  lastSyncAt: string | null;
  /** Star value currently filtering the list, if any. */
  selectedRating: number | null;
  onSelectRating: (rating: number | null) => void;
}

/** One slim line of numbers; the per-star breakdown lives in a dialog. */
export function ReviewStatsBar({ summary, lastSyncAt, selectedRating, onSelectRating }: ReviewStatsBarProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  if (summary.total === 0) return null;

  const { total, average, replied, responseRate, distribution, trend } = summary;
  const waiting = total - replied;
  const syncedLabel = lastSyncAt
    ? new Date(lastSyncAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "never";

  return (
    <>
      <section
        aria-label="Review summary"
        className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-xs"
      >
        <button
          type="button"
          onClick={() => setShowBreakdown(true)}
          aria-label="Open rating breakdown"
          className="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="text-xl font-bold tabular-figures text-foreground">{average.toFixed(1)}</span>
          <StarRating rating={Math.round(average)} />
          <span className="text-caption text-muted-foreground">{total} reviews</span>
          {trend !== null ? (
            <span
              className={cn(
                "flex items-center gap-0.5 text-caption",
                trend >= 0 ? "text-success" : "text-destructive"
              )}
              title="Average of the last 30 days compared with the 30 before"
            >
              {trend >= 0 ? <PiArrowUpBold size={10} aria-hidden /> : <PiArrowDownBold size={10} aria-hidden />}
              {Math.abs(trend).toFixed(1)}
            </span>
          ) : null}
        </button>

        <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />

        <div className="flex min-w-40 flex-1 items-center gap-3">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(responseRate * 100)}
            aria-label="Reviews replied to"
            className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-success" style={{ width: `${responseRate * 100}%` }} />
          </div>
          <span className="text-body text-foreground">
            <span className="font-bold tabular-figures">{Math.round(responseRate * 100)}%</span> replied
            <span className="text-muted-foreground">
              {waiting > 0 ? ` · ${waiting} waiting` : " · all caught up"}
            </span>
          </span>
        </div>

        <span className="text-caption text-muted-foreground">Synced {syncedLabel}</span>
      </section>

      <Modal isOpen={showBreakdown} onClose={() => setShowBreakdown(false)} title="Rating breakdown" maxWidth="max-w-sm">
        <ul className="space-y-1" aria-label="Filter by star rating">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star - 1];
            const active = selectedRating === star;
            return (
              <li key={star}>
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={count === 0}
                  onClick={() => {
                    onSelectRating(active ? null : star);
                    setShowBreakdown(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-body focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-60",
                    active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex w-8 items-center gap-1 tabular-figures">
                    {star}
                    <PiStarFill size={12} aria-hidden />
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${(count / total) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right tabular-figures">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-caption text-muted-foreground">Pick a row to show only those reviews.</p>
      </Modal>
    </>
  );
}
