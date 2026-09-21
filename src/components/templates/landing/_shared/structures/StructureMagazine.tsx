"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import {
  AnnouncementBar, DecorativeMarquee, FeatureBadges,
  PopularMenuSection, OffersSection, GoogleReviewsSection, ContactSection,
  FooterSection,
} from "./sections";

/** Asymmetric editorial layout: big hero block beside a stacked story/stats
 * sidebar, a full-width dish carousel row, then a gallery grid — every other
 * section from the full content model is still present, just folded into
 * the shared blocks below the editorial spread. */
export default function StructureMagazine(p: LandingTemplateProps) {
  const c = getRichContent(p.data, (p.data.settings as any)?.landing_theme ?? "swiss");
  const t = buildTheme(c);
  const sectionBg = t.sectionBg ?? t.surface;
  // Real tenant imagery (banner upload, then first gallery photo, then logo)
  // — this is the only place the banner renders, so it never shows twice.
  const heroImg = c.bannerUrl || c.gallery[0]?.image_url || c.logoUrl;
  const ctx = { c, t, p };

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      <AnnouncementBar c={c} t={t} />

      {/* ── Editorial hero + sidebar ── */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FadeIn>
            {t.badge && (
              <span style={{ background: t.accent, color: t.accentText }} className="mb-4 inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em]">
                {t.badge}
              </span>
            )}
            <h1 style={{ color: t.textPrimary }} className={`text-4xl font-bold leading-tight sm:text-6xl ${t.headingClass ?? ""}`}>
              {c.businessName}
            </h1>
            {(t.heroTagline || c.slogan) && <p style={{ color: t.textSecondary }} className="mt-4 max-w-xl text-lg">{t.heroTagline || c.slogan}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {c.cta.menuBtn && (
                <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-85" onClick={() => p.track("click", "menu_button", {})}>
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              )}
              {c.cta.payBtn && c.cta.paymentLink && (
                <button onClick={p.onPay} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border-2 px-7 py-2.5 text-sm font-bold uppercase tracking-wider">
                  Pay Now
                </button>
              )}
              {c.cta.reviewBtn && c.cta.reviewLink && (
                <button onClick={p.onReview} style={{ borderColor: t.border, color: t.textSecondary }} className="rounded-full border-2 px-7 py-2.5 text-sm font-bold uppercase tracking-wider">
                  Leave Review
                </button>
              )}
            </div>
          </FadeIn>
          <div className="relative mt-8 h-72 overflow-hidden rounded-2xl sm:h-96">
            {heroImg ? (
              <Image src={heroImg} alt={c.businessName} fill className="object-cover" />
            ) : (
              <ImagePlaceholder aspect="wide" label="Hero image" className="text-current" />
            )}
          </div>
        </div>

        {/* Sidebar: story + stats + hours stacked */}
        <div className="flex flex-col gap-6">
          {c.story && (
            <FadeIn delay={0.1}>
              <div style={{ background: sectionBg, borderColor: t.border }} className={`rounded-xl border p-6 ${t.cardStyle ?? ""}`}>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">Our Story</p>
                {c.story.headline && <h3 style={{ color: t.textPrimary }} className="font-bold">{c.story.headline}</h3>}
                {c.story.body && <p style={{ color: t.textSecondary }} className="mt-2 text-sm leading-relaxed line-clamp-6">{c.story.body}</p>}
              </div>
            </FadeIn>
          )}
          {c.stats.length > 0 && (
            <FadeIn delay={0.15}>
              <div style={{ background: sectionBg, borderColor: t.border }} className={`grid grid-cols-2 gap-4 rounded-xl border p-6 ${t.cardStyle ?? ""}`}>
                {c.stats.slice(0, 4).map((s) => (
                  <div key={s.label}>
                    <p style={{ color: t.accent }} className="text-2xl font-bold">{s.value}</p>
                    <p style={{ color: t.textSecondary }} className="text-[10px] uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <FeatureBadges c={c} p={p} t={t} />

      {/* ── Full-width dish carousel row ── */}
      {c.signatureDishes.length > 0 && (
        <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-5 py-14 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <h2 style={{ color: t.textPrimary }} className="mb-8 text-2xl font-bold">{c.terms.featuredSectionLabel}</h2>
            </FadeIn>
            <div className="flex gap-5 overflow-x-auto pb-4">
              {c.signatureDishes.map((dish, i) => (
                <div key={`${dish.name}-${i}`} style={{ background: t.bg, borderColor: t.border }} className="w-56 shrink-0 overflow-hidden rounded-xl border">
                  <ImagePlaceholder aspect="square" className="text-current" />
                  <div className="p-4">
                    {dish.price && <span style={{ background: t.accent, color: t.accentText }} className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold">{dish.price}</span>}
                    <h3 style={{ color: t.textPrimary }} className="text-sm font-bold">{dish.name}</h3>
                    {dish.description && <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-2">{dish.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <PopularMenuSection {...ctx} />
      <OffersSection c={c} t={t} />

      {/* ── Gallery ── */}
      {c.gallery.length > 0 && (
        <section className="px-5 py-14 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <h2 style={{ color: t.textPrimary }} className="mb-8 text-center text-2xl font-bold">Gallery</h2>
            </FadeIn>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {c.gallery.slice(0, 12).map((g, i) => (
                <div key={i} className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <GoogleReviewsSection c={c} t={t} />

      <ContactSection {...ctx} />

      {/* ── FAQ ── */}
      {c.faqs.length > 0 && (
        <section className="px-5 py-14 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <h2 style={{ color: t.textPrimary }} className="mb-6 text-center text-2xl font-bold">Common Questions</h2>
            </FadeIn>
            <div className="space-y-3">
              {c.faqs.map((f, i) => (
                <div key={i} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                  <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
                  <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterSection {...ctx} />
    </div>
  );
}
