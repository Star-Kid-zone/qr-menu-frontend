import type { GoogleReviewRecord } from "@/services/workspace.service";
import { LOW_RATING_MAX } from "@/constants/reviews.constants";


export type ReviewFilter = "all" | "needs_reply" | "low" | "featured";
export type ReviewSort = "urgent" | "newest" | "oldest" | "highest" | "lowest";

export const isUnreplied = (r: GoogleReviewRecord) => !r.replyText;

const time = (r: GoogleReviewRecord) =>
  new Date(r.publishTime ?? r.createdAt).getTime() || 0;

export function matchesFilter(r: GoogleReviewRecord, filter: ReviewFilter): boolean {
  switch (filter) {
    case "needs_reply":
      return isUnreplied(r);
    case "low":
      return r.rating <= LOW_RATING_MAX;
    case "featured":
      return r.isFeatured;
    default:
      return true;
  }
}

/** Lower score sorts first: unreplied low ratings, unreplied others, then replied. */
function urgencyScore(r: GoogleReviewRecord): number {
  if (!isUnreplied(r)) return 2;
  return r.rating <= LOW_RATING_MAX ? 0 : 1;
}

export function sortReviews(reviews: GoogleReviewRecord[], sort: ReviewSort): GoogleReviewRecord[] {
  const copy = [...reviews];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => time(b) - time(a));
    case "oldest":
      return copy.sort((a, b) => time(a) - time(b));
    case "highest":
      return copy.sort((a, b) => b.rating - a.rating || time(b) - time(a));
    case "lowest":
      return copy.sort((a, b) => a.rating - b.rating || time(b) - time(a));
    default:
      return copy.sort((a, b) => urgencyScore(a) - urgencyScore(b) || time(b) - time(a));
  }
}

export function applyReviewView(
  reviews: GoogleReviewRecord[],
  opts: { filter: ReviewFilter; rating: number | null; query: string; sort: ReviewSort }
): GoogleReviewRecord[] {
  const q = opts.query.trim().toLowerCase();
  const filtered = reviews.filter((r) => {
    if (!matchesFilter(r, opts.filter)) return false;
    if (opts.rating !== null && r.rating !== opts.rating) return false;
    if (q && !`${r.authorName} ${r.text ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });
  return sortReviews(filtered, opts.sort);
}

export interface ReviewSummary {
  total: number;
  average: number;
  replied: number;
  responseRate: number;
  /** Index 0 = 1 star … index 4 = 5 stars. */
  distribution: number[];
  /** Average of reviews from the last 30 days minus the 30 days before; null if either side is empty. */
  trend: number | null;
}

export function summarizeReviews(reviews: GoogleReviewRecord[], now = Date.now()): ReviewSummary {
  const total = reviews.length;
  const distribution = [0, 0, 0, 0, 0];
  let sum = 0;
  let replied = 0;
  for (const r of reviews) {
    sum += r.rating;
    if (r.rating >= 1 && r.rating <= 5) distribution[r.rating - 1] += 1;
    if (!isUnreplied(r)) replied += 1;
  }

  const DAY = 86_400_000;
  const recent: number[] = [];
  const previous: number[] = [];
  for (const r of reviews) {
    const age = now - time(r);
    if (!time(r) || age < 0) continue;
    if (age <= 30 * DAY) recent.push(r.rating);
    else if (age <= 60 * DAY) previous.push(r.rating);
  }
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

  return {
    total,
    average: total ? sum / total : 0,
    replied,
    responseRate: total ? replied / total : 0,
    distribution,
    trend: recent.length && previous.length ? mean(recent) - mean(previous) : null,
  };
}

/** Newest 5-star reviews with a real written comment that aren't on the website yet. */
export function pickBestToFeature(reviews: GoogleReviewRecord[], limit = 5): GoogleReviewRecord[] {
  return reviews
    .filter((r) => !r.isFeatured && r.rating === 5 && (r.text?.trim().length ?? 0) >= 30)
    .sort((a, b) => time(b) - time(a))
    .slice(0, limit);
}
