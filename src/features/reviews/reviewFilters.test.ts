import { describe, expect, it } from "vitest";
import type { GoogleReviewRecord } from "@/services/workspace.service";
import { applyReviewView, pickBestToFeature, summarizeReviews } from "./reviewFilters";

const NOW = new Date("2026-11-05T00:00:00Z").getTime();
const daysAgo = (d: number) => new Date(NOW - d * 86_400_000).toISOString();

const make = (id: string, rating: number, extra: Partial<GoogleReviewRecord> = {}): GoogleReviewRecord => ({
  id,
  workspaceId: "w",
  googleReviewId: id,
  authorName: `Author ${id}`,
  authorPhotoUrl: null,
  rating,
  text: `text ${id}`,
  relativePublishDescription: null,
  publishTime: daysAgo(1),
  createdAt: daysAgo(1),
  isFeatured: false,
  ...extra,
});

describe("applyReviewView", () => {
  const reviews = [
    make("a", 5, { replyText: "thanks", publishTime: daysAgo(2) }),
    make("b", 1, { publishTime: daysAgo(5) }),
    make("c", 5, { publishTime: daysAgo(3), isFeatured: true }),
    make("d", 2, { replyText: "sorry", publishTime: daysAgo(1), text: "Slow biryani" }),
  ];
  const base = { filter: "all" as const, rating: null, query: "", sort: "urgent" as const };

  it("urgent sort puts unreplied low ratings first, replied last", () => {
    expect(applyReviewView(reviews, base).map((r) => r.id)).toEqual(["b", "c", "d", "a"]);
  });

  it("filters by needs_reply, low, featured", () => {
    expect(applyReviewView(reviews, { ...base, filter: "needs_reply" }).map((r) => r.id).sort()).toEqual(["b", "c"]);
    expect(applyReviewView(reviews, { ...base, filter: "low" }).map((r) => r.id).sort()).toEqual(["b", "d"]);
    expect(applyReviewView(reviews, { ...base, filter: "featured" }).map((r) => r.id)).toEqual(["c"]);
  });

  it("combines star filter and text search", () => {
    expect(applyReviewView(reviews, { ...base, rating: 5 }).map((r) => r.id).sort()).toEqual(["a", "c"]);
    expect(applyReviewView(reviews, { ...base, query: "BIRYANI" }).map((r) => r.id)).toEqual(["d"]);
  });
});

describe("summarizeReviews", () => {
  it("handles an empty list", () => {
    expect(summarizeReviews([], NOW)).toMatchObject({ total: 0, average: 0, responseRate: 0, trend: null });
  });

  it("computes distribution, response rate and trend", () => {
    const s = summarizeReviews(
      [
        make("1", 5, { replyText: "x", publishTime: daysAgo(3) }),
        make("2", 5, { publishTime: daysAgo(10) }),
        make("3", 3, { publishTime: daysAgo(40) }),
      ],
      NOW
    );
    expect(s.distribution).toEqual([0, 0, 1, 0, 2]);
    expect(s.responseRate).toBeCloseTo(1 / 3);
    expect(s.trend).toBeCloseTo(2);
  });
});

describe("pickBestToFeature", () => {
  const long = "Lovely food and wonderful service all evening.";
  it("returns newest unfeatured 5-star reviews with real text, capped", () => {
    const picked = pickBestToFeature(
      [
        make("old", 5, { text: long, publishTime: daysAgo(30) }),
        make("new", 5, { text: long, publishTime: daysAgo(1) }),
        make("short", 5, { text: "great" }),
        make("four", 4, { text: long }),
        make("on", 5, { text: long, isFeatured: true }),
      ],
      1
    );
    expect(picked.map((r) => r.id)).toEqual(["new"]);
  });
});
