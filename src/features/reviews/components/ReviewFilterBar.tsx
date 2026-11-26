"use client";

import React from "react";
import { PiXBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { SearchInput } from "@/components/ui/SearchInput";
import { REVIEW_FILTER_CHIPS, REVIEW_SORT_OPTIONS } from "@/constants/reviews.constants";
import type { ReviewFilter, ReviewSort } from "../reviewFilters";

interface ReviewFilterBarProps {
  filter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
  counts: Record<ReviewFilter, number>;
  query: string;
  onQueryChange: (query: string) => void;
  sort: ReviewSort;
  onSortChange: (sort: ReviewSort) => void;
  rating: number | null;
  onClearRating: () => void;
}

const CHIPS: readonly { id: ReviewFilter; label: string }[] = REVIEW_FILTER_CHIPS;

const SORTS: readonly { id: ReviewSort; label: string }[] = REVIEW_SORT_OPTIONS;

export function ReviewFilterBar({
  filter,
  onFilterChange,
  counts,
  query,
  onQueryChange,
  sort,
  onSortChange,
  rating,
  onClearRating,
}: ReviewFilterBarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Filter reviews" className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const active = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={active}
              onClick={() => onFilterChange(chip.id)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-body transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              {chip.label}
              <span className={cn("tabular-figures text-caption", active ? "opacity-90" : "text-muted-foreground")}>
                {counts[chip.id]}
              </span>
            </button>
          );
        })}
        {rating !== null ? (
          <button
            type="button"
            onClick={onClearRating}
            aria-label={`Clear ${rating}-star filter`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary bg-accent px-3 text-body text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {rating}★ only
            <PiXBold size={11} aria-hidden />
          </button>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search name or review text"
          aria-label="Search reviews"
          className="max-w-none lg:w-64"
        />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as ReviewSort)}
          aria-label="Sort reviews"
          className="h-10 shrink-0 rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
