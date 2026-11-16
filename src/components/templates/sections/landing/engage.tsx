"use client";

import Image from "next/image";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/templates/landing/_shared/animations";
import { GoogleReviewsSection } from "@/components/templates/landing/_shared/structures/sections";
import type { LandingSectionProps } from "../types";

export function OffersSection({ ctx: { c, t, sectionBg } }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]">
            Current Offers
          </p>
          <h2 style={{ color: t.textPrimary }} className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}>
            Something Special
          </h2>
        </FadeIn>
        <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.offers.map((o, i: number) => (
            <StaggerItem key={i}>
              <div style={{ background: sectionBg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                {o.image_url && (
                  <div className="relative h-36 w-full">
                    <Image src={o.image_url} alt={o.title ?? "Offer"} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  {o.title && (
                    <h3 style={{ color: t.textPrimary }} className="font-bold">
                      {o.title}
                    </h3>
                  )}
                  {o.description && (
                    <p style={{ color: t.textSecondary }} className="mt-2 text-sm">
                      {o.description}
                    </p>
                  )}
                  {(o.offer_value || o.badge_text) && (
                    <span
                      style={{ background: t.accent, color: t.accentText }}
                      className="mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold"
                    >
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

/** Variants: "grid" (default, up to 6 photos) or "strip" (one row that scrolls sideways, up to 12). */
export function GallerySection({ ctx: { c, t, sectionBg }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  if (section.variant === "strip") {
    const photos = c.gallery.slice(0, 12).map((g) => g.image_url as string);
    return (
      <section style={{ background: sectionBg, borderColor: t.border }} className="border-y py-16">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]">
            Gallery
          </p>
          <h2 style={{ color: t.textPrimary }} className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}>
            A Taste of the Experience
          </h2>
        </FadeIn>
        {/* Focusable so keyboard users can scroll it with the arrow keys. */}
        <div
          role="region"
          aria-label="Photos, scroll sideways"
          tabIndex={0}
          className="no-scrollbar mt-10 overflow-x-auto px-5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-10"
          style={{ outlineColor: t.accent }}
        >
          <ul className="flex snap-x snap-mandatory gap-3">
            {photos.map((src, i) => (
              <li key={i} className="relative h-56 w-72 shrink-0 snap-center overflow-hidden rounded-xl sm:h-72 sm:w-96">
                <Image src={src} alt={`Gallery ${i + 1}`} fill sizes="384px" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  const galleryImages = c.gallery.slice(0, 6).map((g) => g.image_url as string);
  return (
    <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]">
            Gallery
          </p>
          <h2 style={{ color: t.textPrimary }} className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}>
            A Taste of the Experience
          </h2>
        </FadeIn>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {galleryImages.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl">
              <div className="relative h-40 w-full sm:h-56">
                <Image
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ ctx: { c, t } }: LandingSectionProps) {
  return <GoogleReviewsSection c={c} t={t} />;
}
