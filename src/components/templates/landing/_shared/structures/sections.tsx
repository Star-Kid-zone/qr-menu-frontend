"use client";

import { useState } from "react";
import type { LandingTemplateProps } from "@/types/public/templates/rawPublicSiteData.types";
import type { RichContent, GoogleReviewItem } from "../defaults";
import type { ThemeConfig } from "../BaseTemplate";
import { FadeIn, StaggerGroup, StaggerItem } from "../animations";
import { HiStar } from "react-icons/hi";

/**
 * Shared, non-negotiable sections every landing "structure" must include
 * somewhere on the page (announcement, banner, decorative
 * marquee, feature-status badges, popular menu, offers, full
 * contact block, footer). Each structure still owns its
 * OWN distinctive treatment of hero / story / signature dishes / gallery /
 * stats / hours / FAQ — these helpers only guarantee the rest
 * of the content model is never silently dropped.
 */

type Ctx = { c: RichContent; t: ThemeConfig; p: LandingTemplateProps };

/** 5-star rating display, filled up to the rounded `rating` value. Shared by
 * `ReviewCard` and any structure that wants to render a review's rating
 * without pulling in the whole `GoogleReviewsSection` layout. */
export function StarRating({ rating, color }: { rating: number; color: string }) {
  const filled = Math.round(Math.max(0, Math.min(5, rating || 0)));
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <HiStar key={i} className="size-3.5" style={{ color: i < filled ? color : `${color}33` }} />
      ))}
    </div>
  );
}

/** Reviewer avatar — the real Google profile photo when present (loaded as a
 * plain `<img>`, since Google-hosted photo URLs aren't a configured
 * `next/image` remote pattern and typically require `referrerPolicy="no-referrer"`
 * to load at all), falling back to an initial-letter avatar when there's no
 * photo or it fails to load. */
function ReviewAvatar({ review, t, size = 40 }: { review: GoogleReviewItem; t: Pick<ThemeConfig, "accent" | "accentText">; size?: number }) {
  const [errored, setErrored] = useState(false);
  const initial = review.authorName?.trim()?.[0]?.toUpperCase() || "?";
  if (review.authorPhotoUrl && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={review.authorPhotoUrl}
        alt={review.authorName}
        referrerPolicy="no-referrer"
        onError={() => setErrored(true)}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ background: t.accent, color: t.accentText, width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full text-sm font-bold"
    >
      {initial}
    </div>
  );
}

/** Single review card — author, rating, review text, and relative publish
 * time. The reusable unit behind `GoogleReviewsSection`; structures with
 * their own card/tile conventions can embed this directly instead of
 * re-implementing avatars/star ratings. */
function ReviewCard({ review, t }: { review: GoogleReviewItem; t: Pick<ThemeConfig, "surface" | "border" | "textPrimary" | "textSecondary" | "accent" | "accentText"> }) {
  return (
    <div style={{ background: t.surface, borderColor: t.border }} className="flex h-full flex-col gap-3 rounded-xl border p-5">
      <div className="flex items-center gap-3">
        <ReviewAvatar review={review} t={t} />
        <div className="min-w-0 flex-1">
          <p style={{ color: t.textPrimary }} className="truncate text-sm font-bold">{review.authorName}</p>
          {review.relativePublishDescription && (
            <p style={{ color: t.textSecondary }} className="text-[11px] opacity-80">{review.relativePublishDescription}</p>
          )}
        </div>
      </div>
      <StarRating rating={review.rating} color={t.accent} />
      {review.text && (
        <p style={{ color: t.textSecondary }} className="line-clamp-4 text-sm leading-relaxed">{review.text}</p>
      )}
    </div>
  );
}

/** Shared "What People Are Saying" section: a responsive grid of real,
 * owner-featured Google reviews. Hidden entirely when there are none. */
export function GoogleReviewsSection({ c, t }: Pick<Ctx, "c" | "t">) {
  if (!c.googleReviews || c.googleReviews.length === 0) return null;
  return (
    <section style={{ background: t.sectionBg ?? t.surface, borderColor: t.border }} className="border-y px-5 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">Google Reviews</p>
          <h2 style={{ color: t.textPrimary }} className="mb-8 text-center text-2xl font-bold">What People Are Saying</h2>
        </FadeIn>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.googleReviews.slice(0, 6).map((r) => (
            <StaggerItem key={r.id}>
              <ReviewCard review={r} t={t} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

