"use client";

import { useState } from "react";
import Image from "@/components/ui/Image";
import type { LandingTemplateProps } from "@/types/public/templates/rawPublicSiteData.types";
import type { RichContent, GoogleReviewItem } from "../defaults";
import type { ThemeConfig } from "../BaseTemplate";
import { FadeIn, StaggerGroup, StaggerItem, Marquee } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
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

export function AnnouncementBar({ c, t }: Pick<Ctx, "c" | "t">) {
  if (!c.announcement) return null;
  return (
    <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest">
      {c.announcement}
    </div>
  );
}

export function BannerImage({ c }: Pick<Ctx, "c">) {
  if (!c.bannerUrl) return null;
  return (
    <div className="relative h-28 w-full overflow-hidden sm:h-40">
      <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill sizes="100vw" className="object-cover" />
    </div>
  );
}

export function DecorativeMarquee({ c, t }: Pick<Ctx, "c" | "t">) {
  return (
    <div style={{ background: t.accent, color: t.accentText }} className="py-2.5">
      <Marquee speed={28}>
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-8 text-xs font-bold uppercase tracking-widest">
            ✦ {t.marqueeText ?? c.businessName}{c.slogan ? ` ✦ ${c.slogan}` : ""}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/** Removed: these were non-clickable labels that looked like a second navigation row. */
export function FeatureBadges(_props: Ctx) {
  return null;
}

export function PopularMenuSection({ c, t, p }: Ctx) {
  if (c.popularItems.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-5 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.popularSectionLabel}</p>
          <h2 style={{ color: t.textPrimary }} className="mb-8 text-center text-2xl font-bold">{c.terms.popularSectionSubhead}</h2>
        </FadeIn>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.popularItems.slice(0, 8).map((item, i) => (
            <StaggerItem key={`${item.name}-${i}`}>
              <div style={{ background: t.surface, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                <div className="relative h-28 overflow-hidden">
                  {item.image ? <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 style={{ color: t.textPrimary }} className="truncate text-sm font-bold">{item.name}</h3>
                    {item.price && <span style={{ color: t.accent }} className="shrink-0 text-xs font-bold">{item.price}</span>}
                  </div>
                  {item.description && <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-xs">{item.description}</p>}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        {c.cta.menuBtn && (
          <div className="mt-6 text-center">
            <p.LinkComponent to={p.menuHref} style={{ color: t.accent }} className="text-xs font-bold uppercase tracking-wider hover:underline" onClick={() => p.track("click", "menu_button", {})}>
              {c.terms.ctaLabel} →
            </p.LinkComponent>
          </div>
        )}
      </div>
    </section>
  );
}

export function OffersSection({ c, t }: Pick<Ctx, "c" | "t">) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: t.sectionBg ?? t.surface, borderColor: t.border }} className="border-y px-5 py-14 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">Current Offers</p>
          <h2 style={{ color: t.textPrimary }} className="mb-8 text-center text-2xl font-bold">Something Special</h2>
        </FadeIn>
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.offers.map((o, i: number) => (
            <StaggerItem key={i}>
              <div style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                {o.image_url ? (
                  <div className="relative h-32 w-full">
                    <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="400px" className="object-cover" />
                  </div>
                ) : <ImagePlaceholder aspect="wide" className="text-current" />}
                <div className="p-5">
                  {o.title && <h3 style={{ color: t.textPrimary }} className="font-bold">{o.title}</h3>}
                  {o.description && <p style={{ color: t.textSecondary }} className="mt-2 text-sm">{o.description}</p>}
                  {(o.offer_value || o.badge_text) && (
                    <span style={{ background: t.accent, color: t.accentText }} className="mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold">
                      {o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} OFF`}
                    </span>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

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
export function ReviewAvatar({ review, t, size = 40 }: { review: GoogleReviewItem; t: Pick<ThemeConfig, "accent" | "accentText">; size?: number }) {
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
export function ReviewCard({ review, t }: { review: GoogleReviewItem; t: Pick<ThemeConfig, "surface" | "border" | "textPrimary" | "textSecondary" | "accent" | "accentText"> }) {
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

export function ContactSection({ c, t, p }: Ctx) {
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;
  if (c.hours.length === 0 && !hasContact) return null;
  return (
    <section style={{ background: t.sectionBg ?? t.surface, borderColor: t.border }} className="border-y px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-14">
        {c.hours.length > 0 && (
          <FadeIn>
            <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">Opening Hours</p>
            <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">When We&apos;re Open</h2>
            <div className="space-y-2">
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between border-b pb-2 text-sm" style={{ borderColor: t.border }}>
                  <span style={{ color: t.textPrimary }} className="font-medium">{h.day}</span>
                  <span style={{ color: t.textSecondary }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
        {hasContact && (
          <FadeIn delay={0.15}>
            <div className="mt-10 lg:mt-0">
              <p style={{ color: t.accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.4em]">Find Us</p>
              <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">Come Say Hello</h2>
              <div className="space-y-4">
                {c.address && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">Address</p>
                    <p style={{ color: t.textSecondary }} className="text-sm">{c.address}</p>
                    {c.locationUrl && (
                      <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="mt-1 inline-block text-xs font-bold uppercase tracking-wider hover:underline">Get Directions →</a>
                    )}
                  </div>
                )}
                {c.phone && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">Phone</p>
                    <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">{c.phone}</a>
                  </div>
                )}
                {c.email && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">Email</p>
                    <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">{c.email}</a>
                  </div>
                )}
                {c.whatsapp && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-1 text-xs font-bold uppercase tracking-wider">WhatsApp</p>
                    <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="text-sm font-medium hover:underline">{c.whatsapp}</a>
                  </div>
                )}
                {c.social.length > 0 && (
                  <div>
                    <p style={{ color: t.accent }} className="mb-2 text-xs font-bold uppercase tracking-wider">Follow Us</p>
                    <div className="flex flex-wrap gap-3">
                      {c.social.map((s) => (
                        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider hover:opacity-80">
                          <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                          {getSocialPlatformLabel(s.platform, s.name)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {c.cta.payBtn && c.cta.paymentLink && (
                  <button onClick={p.onPay} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider">Pay bill</button>
                )}
                {c.cta.reviewBtn && c.cta.reviewLink && (
                  <button onClick={p.onReview} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border-2 px-7 py-2.5 text-sm font-bold uppercase tracking-wider">Write a Review</button>
                )}
              </div>
              {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                <div className="mt-6">
                  <p style={{ color: t.accent }} className="mb-2 text-xs font-bold uppercase tracking-wider">Scan to Pay</p>
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" width={144} height={144} style={{ borderColor: t.border, background: t.bg }} className="h-36 w-36 rounded-lg border object-contain p-2" />
                </div>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

export function FooterSection({ c, t, p }: Ctx) {
  return (
    <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-5 py-10 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p style={{ color: t.textPrimary }} className="text-lg font-bold">{c.businessName}</p>
          {c.slogan && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{c.slogan}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
          {c.cta.menuBtn && (
            <p.LinkComponent to={p.menuHref} style={{ color: t.accent }} className="font-bold uppercase tracking-wider hover:underline" onClick={() => p.track("click", "footer_menu", {})}>{c.terms.catalogLabel}</p.LinkComponent>
          )}
          {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.textSecondary }} className="hover:underline">{c.phone}</a>}
          {c.websiteHref && (
            <a href={c.websiteHref} target="_blank" rel="noopener noreferrer" style={{ color: t.textSecondary }} className="hover:underline">Website</a>
          )}
        </div>
      </div>
      <p style={{ color: t.textSecondary }} className="mt-6 text-center text-[10px] uppercase tracking-widest opacity-50">
        © {new Date().getFullYear()} {c.businessName}
      </p>
    </footer>
  );
}
