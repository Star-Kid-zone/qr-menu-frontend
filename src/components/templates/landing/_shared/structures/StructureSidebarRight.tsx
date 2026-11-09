"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent, getLandingThemeSlug } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn, StaggerGroup, StaggerItem } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { ReviewCard } from "./sections";

/** Mirror of the Split structure with the sticky identity/contact panel moved
 * to the RIGHT, and the main content reordered to lead with the menu/dishes
 * instead of a hero image — menu-first emphasis instead of brand-first.
 * Every section from the content model is present: both dish lists, stats,
 * offers, gallery, FAQ, and a
 * full contact block (hours/address/phone/email/whatsapp/social/QR) in the
 * sidebar rather than a separate contact section. */
export default function StructureSidebarRight(p: LandingTemplateProps) {
  const c = getRichContent(p.data, getLandingThemeSlug(p.data));
  const t = buildTheme(c);
  const sectionBg = t.sectionBg ?? t.surface;
  const cardStyle = t.cardStyle ?? "";
  const ctx = { c, t, p };

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      {c.announcement && (
        <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold tracking-widest uppercase">
          {c.announcement}
        </div>
      )}
      {c.bannerUrl && (
        <div className="relative h-28 w-full sm:h-40">
          <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill className="object-cover" />
        </div>
      )}

      <div className="lg:flex lg:min-h-screen lg:flex-row-reverse">
        {/* ── RIGHT SIDEBAR ── */}
        <aside style={{ background: t.footerBg ?? t.bg, borderColor: t.border, color: t.accentText }} className="flex flex-col justify-between border-l p-8 lg:sticky lg:top-0 lg:h-screen lg:w-[360px] lg:shrink-0 lg:overflow-y-auto">
          <div>
            <FadeIn>
              {t.badge && <span style={{ background: t.accent, color: t.accentText }} className="mb-4 inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em]">{t.badge}</span>}
              <h1 style={{ color: t.accentText }} className="text-4xl font-bold leading-tight">{c.businessName}</h1>
              {(t.heroTagline || c.slogan) && <p style={{ color: `${t.accentText}99` }} className="mt-3 text-sm leading-relaxed">{t.heroTagline || c.slogan}</p>}
            </FadeIn>
            <div style={{ borderColor: `${t.accentText}20` }} className="my-6 border-t" />
            <FadeIn delay={0.15}>
              <div className="flex flex-col gap-3">
                {c.cta.menuBtn && (
                  <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-6 py-3 text-center text-sm font-bold uppercase tracking-widest" onClick={() => p.track("click", "menu_button", {})}>
                    {c.terms.ctaLabel}
                  </p.LinkComponent>
                )}
                {c.cta.payBtn && c.cta.paymentLink && (
                  <button onClick={p.onPay} style={{ borderColor: `${t.accentText}60`, color: t.accentText }} className="rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-widest">
                    Pay bill
                  </button>
                )}
                {c.cta.reviewBtn && c.cta.reviewLink && (
                  <button onClick={p.onReview} style={{ borderColor: `${t.accentText}40`, color: `${t.accentText}cc` }} className="rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-widest">
                    Leave Review
                  </button>
                )}
              </div>
            </FadeIn>


            <div style={{ borderColor: `${t.accentText}20` }} className="my-6 border-t" />

            {c.stats.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {c.stats.slice(0, 4).map((s) => (
                    <div key={s.label}>
                      <p style={{ color: t.accentText }} className="text-xl font-bold">{s.value}</p>
                      <p style={{ color: `${t.accentText}99` }} className="text-[9px] uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {c.hours.length > 0 && (
              <FadeIn delay={0.25}>
                <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]">Hours</p>
                <div className="mb-6 space-y-1">
                  {c.hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-xs" style={{ color: `${t.accentText}99` }}>
                      <span>{h.day}</span><span>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>

          <FadeIn delay={0.35}>
            <div style={{ borderColor: `${t.accentText}20` }} className="space-y-2 border-t pt-5">
              <p style={{ color: t.accent }} className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em]">Find Us</p>
              {c.address && <p style={{ color: `${t.accentText}66` }} className="text-xs">{c.address}</p>}
              {c.locationUrl && <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="block text-[10px] font-bold uppercase tracking-wider">Get Directions →</a>}
              {c.phone && <a href={`tel:${c.phone}`} style={{ color: `${t.accentText}99` }} className="block text-xs">{c.phone}</a>}
              {c.email && <a href={`mailto:${c.email}`} style={{ color: `${t.accentText}99` }} className="block text-xs">{c.email}</a>}
              {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: `${t.accentText}99` }} className="block text-xs">WhatsApp: {c.whatsapp}</a>}
              {c.social.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.social.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"><span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>{getSocialPlatformLabel(s.platform, s.name)}</a>)}
                </div>
              )}
              {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                <div className="relative mt-3 h-24 w-24 rounded-lg border" style={{ borderColor: `${t.accentText}30` }}>
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill className="rounded-lg object-contain p-1" />
                </div>
              )}
            </div>
          </FadeIn>
        </aside>

        {/* ── LEFT: MAIN CONTENT, menu-first ── */}
        <main className="flex-1 overflow-x-hidden">
          {/* Signature dishes lead the page */}
          {c.signatureDishes.length > 0 && (
            <section style={{ background: t.bg }} className="px-6 py-14 sm:px-10">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.featuredSectionLabel}</p>
                <h2 style={{ color: t.textPrimary }} className="mb-8 text-3xl font-bold">{c.terms.featuredSectionSubhead}</h2>
              </FadeIn>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2">
                {c.signatureDishes.map((dish, i) => (
                  <StaggerItem key={`sig-${dish.name}-${i}`}>
                    <div style={{ background: sectionBg, borderColor: t.border }} className={`flex gap-4 overflow-hidden rounded-xl border p-4 ${cardStyle}`}>
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">{dish.image ? <Image src={dish.image} alt={dish.name} fill sizes="200px" className="object-cover" /> : <ImagePlaceholder aspect="square" className="text-current" />}</div>
                      <div className="min-w-0">
                        {dish.price && <span style={{ background: t.accent, color: t.accentText }} className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold">{dish.price}</span>}
                        <h3 style={{ color: t.textPrimary }} className="text-sm font-bold">{dish.name}</h3>
                        {dish.description && <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-2">{dish.description}</p>}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          )}

          {/* Popular items */}
          {c.popularItems.length > 0 && (
            <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-14 sm:px-10">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.popularSectionLabel}</p>
                <h2 style={{ color: t.textPrimary }} className="mb-8 text-3xl font-bold">{c.terms.popularSectionSubhead}</h2>
              </FadeIn>
              <StaggerGroup className="grid gap-4 sm:grid-cols-4">
                {c.popularItems.map((item, i) => (
                  <StaggerItem key={`pop-${item.name}-${i}`}>
                    <div style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                      <div className="relative h-24 overflow-hidden">{item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}</div>
                      <div className="p-3">
                        <p style={{ color: t.textPrimary }} className="truncate text-xs font-bold">{item.name}</p>
                        {item.price && <p style={{ color: t.accent }} className="text-xs font-bold">{item.price}</p>}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          )}

          {/* Offers */}
          {c.offers.length > 0 && (
            <section className="px-6 py-14 sm:px-10">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Offers</p>
                <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">Something Special</h2>
              </FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {c.offers.map((o, i: number) => (
                  <div key={i} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                    {o.title && <p style={{ color: t.textPrimary }} className="font-bold">{o.title}</p>}
                    {o.description && <p style={{ color: t.textSecondary }} className="mt-1 text-sm">{o.description}</p>}
                    {(o.offer_value || o.badge_text) && <span style={{ background: t.accent, color: t.accentText }} className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Story */}
          {c.story && (
            <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-14 sm:px-10">
              <div className="max-w-2xl">
                <FadeIn>
                  <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Our Story</p>
                  {c.story.headline && <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold">{c.story.headline}</h2>}
                  {c.story.body && <p style={{ color: t.textSecondary }} className="mt-3 leading-relaxed">{c.story.body}</p>}
                </FadeIn>
              </div>
            </section>
          )}

          {/* Gallery */}
          {c.gallery.length > 0 && (
            <section className="px-6 py-14 sm:px-10">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Gallery</p>
                <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">A Look Inside</h2>
              </FadeIn>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {c.gallery.map((g, i) => (
                  <div key={i} className="relative aspect-square w-full overflow-hidden rounded-xl">
                    <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Google Reviews */}
          {c.googleReviews.length > 0 && (
            <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-14 sm:px-10">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Google Reviews</p>
                <h2 style={{ color: t.textPrimary }} className="mb-8 text-3xl font-bold">What People Are Saying</h2>
              </FadeIn>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2">
                {c.googleReviews.slice(0, 6).map((r) => (
                  <StaggerItem key={r.id}>
                    <ReviewCard review={r} t={{ ...t, surface: t.bg }} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          )}

          {/* FAQ */}
          {c.faqs.length > 0 && (
            <section className="px-6 py-14 sm:px-10">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">FAQ</p>
                <h2 style={{ color: t.textPrimary }} className="mb-6 text-2xl font-bold">Common Questions</h2>
              </FadeIn>
              <div className="max-w-2xl space-y-3">
                {c.faqs.map((f, i) => (
                  <div key={i} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                    <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
                    <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-6 py-8 text-center sm:px-10">
            <p style={{ color: t.textPrimary }} className="font-bold">{c.businessName}</p>
            {c.slogan && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{c.slogan}</p>}
          </footer>
        </main>
      </div>
    </div>
  );
}
