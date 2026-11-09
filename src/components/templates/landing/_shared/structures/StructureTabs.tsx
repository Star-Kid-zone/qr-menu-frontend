"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent, getLandingThemeSlug } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { ReviewCard } from "./sections";

type TabId = "menu" | "about" | "gallery" | "reviews" | "visit";

/** The only non-scroll-everything structure: a compact hero followed by a
 * horizontal tab bar that swaps the section shown below instead of stacking
 * every section on one long page. Every section from the content model gets
 * its own tab or a clearly labelled sub-block — nothing is dropped, it's
 * just organized behind navigation instead of one continuous scroll. */
export default function StructureTabs(p: LandingTemplateProps) {
  const c = getRichContent(p.data, getLandingThemeSlug(p.data));
  const t = buildTheme(c);
  const sectionBg = t.sectionBg ?? t.surface;
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;

  const tabs = useMemo(() => {
    const list: { id: TabId; label: string }[] = [];
    if (c.signatureDishes.length > 0 || c.popularItems.length > 0 || c.offers.length > 0) list.push({ id: "menu", label: c.terms.catalogLabel });
    if (c.story || c.stats.length > 0) list.push({ id: "about", label: "About" });
    if (c.gallery.length > 0) list.push({ id: "gallery", label: "Gallery" });
    if (c.googleReviews.length > 0 || c.faqs.length > 0) list.push({ id: "reviews", label: "Reviews" });
    list.push({ id: "visit", label: "Visit" });
    return list;
  }, [c, p]);

  const [active, setActive] = useState<TabId>(tabs[0]?.id ?? "visit");
  const currentTab = tabs.some((tb) => tb.id === active) ? active : tabs[0]?.id ?? "visit";

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      {c.announcement && (
        <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest">{c.announcement}</div>
      )}
      {c.bannerUrl && (
        <div className="relative h-28 w-full sm:h-40">
          <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill className="object-cover" />
        </div>
      )}

      {/* ── Compact hero ── */}
      <section style={{ background: t.surface, borderColor: t.border }} className="border-b px-5 py-10 text-center sm:px-10">
        <FadeIn>
          {t.badge && <span style={{ background: t.accent, color: t.accentText }} className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{t.badge}</span>}
          <h1 style={{ color: t.textPrimary }} className={`text-3xl font-bold sm:text-4xl ${t.headingClass ?? ""}`}>{c.businessName}</h1>
          {(t.heroTagline || c.slogan) && <p style={{ color: t.textSecondary }} className="mt-2">{t.heroTagline || c.slogan}</p>}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {c.cta.menuBtn && (
              <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wider" onClick={() => p.track("click", "menu_button", {})}>
                {c.terms.ctaLabel}
              </p.LinkComponent>
            )}
            {c.cta.payBtn && c.cta.paymentLink && (
              <button onClick={p.onPay} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wider">
                Pay bill
              </button>
            )}
            {c.cta.reviewBtn && c.cta.reviewLink && (
              <button onClick={p.onReview} style={{ borderColor: t.border, color: t.textSecondary }} className="rounded-full border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wider">
                Leave Review
              </button>
            )}
          </div>
        </FadeIn>
      </section>


      {/* ── Tab bar ── */}
      <div style={{ borderColor: t.border, background: t.bg }} className="sticky top-0 z-10 flex justify-start sm:justify-center gap-1 overflow-x-auto border-b px-5 py-2 sm:px-10">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActive(tb.id)}
            style={currentTab === tb.id ? { background: t.accent, color: t.accentText } : { color: t.textSecondary }}
            className="shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition"
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-10">
        {currentTab === "menu" && (
          <FadeIn>
            {c.signatureDishes.length > 0 && (
              <div className="mb-10">
                <h3 style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">{c.terms.featuredSectionLabel}</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  {c.signatureDishes.map((dish, i) => (
                    <div key={`sig-${dish.name}-${i}`} style={{ background: sectionBg, borderColor: t.border }} className="flex gap-4 overflow-hidden rounded-xl border p-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">{dish.image ? <Image src={dish.image} alt={dish.name} fill sizes="200px" className="object-cover" /> : <ImagePlaceholder aspect="square" className="text-current" />}</div>
                      <div className="min-w-0">
                        {dish.price && <span style={{ background: t.accent, color: t.accentText }} className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold">{dish.price}</span>}
                        <h3 style={{ color: t.textPrimary }} className="text-sm font-bold">{dish.name}</h3>
                        {dish.description && <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-2">{dish.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {c.popularItems.length > 0 && (
              <div className="mb-10">
                <h3 style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">{c.terms.popularSectionSubhead}</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {c.popularItems.slice(0, 6).map((item, i) => (
                    <div key={`pop-${item.name}-${i}`} style={{ background: sectionBg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                      <div className="relative h-24 overflow-hidden">{item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}</div>
                      <div className="p-3">
                        <p style={{ color: t.textPrimary }} className="truncate text-xs font-bold">{item.name}</p>
                        {item.price && <p style={{ color: t.accent }} className="text-xs font-bold">{item.price}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {c.offers.length > 0 && (
              <div>
                <h3 style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">Current Offers</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {c.offers.map((o, i: number) => (
                    <div key={i} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                      {o.title && <p style={{ color: t.textPrimary }} className="font-bold">{o.title}</p>}
                      {o.description && <p style={{ color: t.textSecondary }} className="mt-1 text-sm">{o.description}</p>}
                      {(o.offer_value || o.badge_text) && <span style={{ background: t.accent, color: t.accentText }} className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
        )}

        {currentTab === "about" && (
          <FadeIn>
            {c.story && (
              <div className="mb-8">
                {c.story.headline && <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold">{c.story.headline}</h2>}
                {c.story.body && <p style={{ color: t.textSecondary }} className="mt-3 leading-relaxed">{c.story.body}</p>}
              </div>
            )}
            {c.stats.length > 0 && (
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {c.stats.map((s) => (
                  <div key={s.label} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4 text-center">
                    <p style={{ color: t.accent }} className="text-xl font-bold">{s.value}</p>
                    <p style={{ color: t.textSecondary }} className="text-[10px] uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        )}

        {currentTab === "gallery" && (
          <FadeIn>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {c.gallery.map((g, i) => (
                <div key={i} className="relative aspect-square w-full overflow-hidden rounded-xl">
                  <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {currentTab === "reviews" && (
          <FadeIn>
            {c.googleReviews.length > 0 && (
              <div className={c.faqs.length > 0 ? "mb-10" : undefined}>
                <h3 style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">Google Reviews</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {c.googleReviews.slice(0, 6).map((r) => (
                    <ReviewCard key={r.id} review={r} t={t} />
                  ))}
                </div>
              </div>
            )}
            {c.faqs.length > 0 && (
              <div>
                {c.googleReviews.length > 0 && (
                  <h3 style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">FAQ</h3>
                )}
                <div className="space-y-3">
                  {c.faqs.map((f, i) => (
                    <div key={i} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                      <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
                      <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
        )}

        {currentTab === "visit" && (
          <FadeIn>
            <div className="grid gap-8 sm:grid-cols-2">
              {c.hours.length > 0 && (
                <div>
                  <h3 style={{ color: t.textPrimary }} className="mb-3 font-bold">Opening Hours</h3>
                  <div className="space-y-2">
                    {c.hours.map((h) => (
                      <div key={h.day} className="flex justify-between border-b pb-2 text-sm" style={{ borderColor: t.border }}>
                        <span style={{ color: t.textPrimary }}>{h.day}</span>
                        <span style={{ color: t.textSecondary }}>{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {hasContact && (
                <div>
                  <h3 style={{ color: t.textPrimary }} className="mb-3 font-bold">Find Us</h3>
                  {c.address && <p style={{ color: t.textSecondary }} className="text-sm">{c.address}</p>}
                  {c.locationUrl && <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="mt-1 block text-xs font-bold uppercase tracking-wider">Get Directions →</a>}
                  {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.accent }} className="mt-2 block text-sm font-semibold">{c.phone}</a>}
                  {c.email && <a href={`mailto:${c.email}`} style={{ color: t.accent }} className="mt-1 block text-sm font-semibold">{c.email}</a>}
                  {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="mt-1 block text-sm font-semibold">WhatsApp: {c.whatsapp}</a>}
                  {c.social.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.social.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"><span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>{getSocialPlatformLabel(s.platform, s.name)}</a>)}
                    </div>
                  )}
                  {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                    <div className="relative mt-4 h-32 w-32 rounded-lg border" style={{ borderColor: t.border }}>
                      <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill className="rounded-lg object-contain p-2" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        )}
      </div>

      <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-5 py-8 text-center sm:px-10">
        <p style={{ color: t.textPrimary }} className="font-bold">{c.businessName}</p>
        {c.slogan && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{c.slogan}</p>}
      </footer>
    </div>
  );
}
