"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import {
  AnnouncementBar, BannerImage, FeatureBadges,
  PopularMenuSection, OffersSection, GoogleReviewsSection, ContactSection,
  FooterSection,
} from "./sections";

/** Narrow single-column narrative scroll: full-bleed alternating left/right
 * image-text blocks for the story and top dishes, a stats strip, then a
 * gallery — every remaining section (popular items, offers, full contact)
 * still appears via the shared blocks so nothing from the content model is
 * cut. */
export default function StructureStory(p: LandingTemplateProps) {
  const c = getRichContent(p.data, (p.data.settings as any)?.landing_theme ?? "swiss");
  const t = buildTheme(c);
  const sectionBg = t.sectionBg ?? t.surface;
  const ctx = { c, t, p };

  const blocks = [
    ...(c.story ? [{ kind: "story" as const }] : []),
    ...c.signatureDishes.slice(0, 3).map((d, i) => ({ kind: "dish" as const, dish: d, i })),
  ];

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      <AnnouncementBar c={c} t={t} />
      <BannerImage c={c} />

      {/* ── Full-bleed title block ── */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <FadeIn>
          {t.badge && <span style={{ background: t.accent, color: t.accentText }} className="mb-4 inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em]">{t.badge}</span>}
          <h1 style={{ color: t.textPrimary }} className={`text-4xl font-bold sm:text-6xl ${t.headingClass ?? ""}`}>{c.businessName}</h1>
          {(t.heroTagline || c.slogan) && <p style={{ color: t.textSecondary }} className="mx-auto mt-4 max-w-md text-lg">{t.heroTagline || c.slogan}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {c.cta.menuBtn && (
              <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest" onClick={() => p.track("click", "menu_button", {})}>
                {c.terms.ctaLabel}
              </p.LinkComponent>
            )}
            {c.cta.payBtn && c.cta.paymentLink && (
              <button onClick={p.onPay} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border-2 px-8 py-3 text-sm font-bold uppercase tracking-widest">
                Pay Now
              </button>
            )}
            {c.cta.reviewBtn && c.cta.reviewLink && (
              <button onClick={p.onReview} style={{ borderColor: t.border, color: t.textSecondary }} className="rounded-full border-2 px-8 py-3 text-sm font-bold uppercase tracking-widest">
                Leave Review
              </button>
            )}
          </div>
        </FadeIn>
      </section>

      <FeatureBadges c={c} p={p} t={t} />

      {c.stats.length > 0 && (
        <section style={{ background: t.accent, color: t.accentText }} className="py-10">
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-x-12 gap-y-6 px-6 text-center">
            {c.stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Alternating narrative blocks ── */}
      {blocks.map((block, idx) => {
        const flip = idx % 2 === 1;
        if (block.kind === "story" && c.story) {
          return (
            <section key="story" style={{ background: idx % 2 === 0 ? t.bg : sectionBg }} className="px-6 py-16 sm:px-10">
              <div className={`mx-auto flex max-w-4xl flex-col items-center gap-8 ${flip ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                <div className="w-full sm:w-1/2"><ImagePlaceholder aspect="portrait" label="Story image" className="rounded-2xl text-current" /></div>
                <div className="w-full sm:w-1/2">
                  <FadeIn>
                    <p style={{ color: t.accent }} className="mb-2 text-xs font-bold uppercase tracking-[0.3em]">Our Story</p>
                    {c.story.headline && <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold">{c.story.headline}</h2>}
                    {c.story.body && <p style={{ color: t.textSecondary }} className="mt-3 leading-relaxed">{c.story.body}</p>}
                  </FadeIn>
                </div>
              </div>
            </section>
          );
        }
        if (block.kind === "dish") {
          return (
            <section key={`dish-${block.i}`} style={{ background: idx % 2 === 0 ? t.bg : sectionBg }} className="px-6 py-16 sm:px-10">
              <div className={`mx-auto flex max-w-4xl flex-col items-center gap-8 ${flip ? "sm:flex-row-reverse" : "sm:flex-row"}`}>
                <div className="w-full sm:w-1/2"><ImagePlaceholder aspect="portrait" label={block.dish.name} className="rounded-2xl text-current" /></div>
                <div className="w-full sm:w-1/2">
                  <FadeIn>
                    {block.dish.price && <span style={{ background: t.accent, color: t.accentText }} className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold">{block.dish.price}</span>}
                    <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold">{block.dish.name}</h2>
                    {block.dish.description && <p style={{ color: t.textSecondary }} className="mt-3 leading-relaxed">{block.dish.description}</p>}
                  </FadeIn>
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}

      <PopularMenuSection {...ctx} />
      <OffersSection c={c} t={t} />

      {/* ── Gallery ── */}
      {c.gallery.length > 0 && (
        <section className="px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-4xl">
            <h2 style={{ color: t.textPrimary }} className="mb-6 text-center text-2xl font-bold">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {c.gallery.map((g, i) => (
                <div key={i} className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <GoogleReviewsSection c={c} t={t} />

      <ContactSection {...ctx} />

      {/* ── FAQ, still narrow-column ── */}
      {c.faqs.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
          <h3 style={{ color: t.textPrimary }} className="mb-6 text-center text-lg font-bold">Common Questions</h3>
          <div className="space-y-4">
            {c.faqs.map((f, i) => (
              <div key={i}>
                <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
                <p style={{ color: t.textSecondary }} className="mt-1 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <FooterSection {...ctx} />
    </div>
  );
}
