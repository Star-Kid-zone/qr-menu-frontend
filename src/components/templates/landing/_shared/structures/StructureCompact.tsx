"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { LotterySection } from "./sections";

/** A "link-in-bio" style compact storefront: one narrow centered column, a
 * small non-fullscreen avatar/hero, and everything else stacked tight as
 * short rows/blocks — the most condensed of all the structures, but every
 * section from the content model still gets its own compact block; nothing
 * is skipped, it's just small. */
export default function StructureCompact(p: LandingTemplateProps) {
  const c = getRichContent(p.data, (p.data.settings as any)?.landing_theme ?? "swiss");
  const t = buildTheme(c);
  const sectionBg = t.sectionBg ?? t.surface;
  const hasContact = c.address || c.phone || c.email || c.whatsapp;

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      <LotterySection c={c} p={p} t={t} />
      {c.announcement && (
        <div style={{ background: t.border, color: t.textPrimary }} className="px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-widest">{c.announcement}</div>
      )}
      {c.bannerUrl && (
        <div className="relative h-20 w-full">
          <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill className="object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-md px-5 py-10">
        {/* ── Small avatar-style hero ── */}
        <FadeIn>
          <div className="flex flex-col items-center text-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              {c.logoUrl ? <Image src={c.logoUrl} alt={c.businessName} fill className="object-cover" /> : <ImagePlaceholder aspect="square" className="rounded-full text-current" />}
            </div>
            <h1 style={{ color: t.textPrimary }} className={`mt-4 text-xl font-bold ${t.headingClass ?? ""}`}>{c.businessName}</h1>
            {(t.heroTagline || c.slogan) && <p style={{ color: t.textSecondary }} className="mt-1 text-sm">{t.heroTagline || c.slogan}</p>}
          </div>
        </FadeIn>

        {(c.offers.length > 0 || p.lotteryEnabled) && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {[c.offers.length > 0 && "Offers", p.lotteryEnabled && "Lucky Draw"]
              .filter(Boolean)
              .map((b) => <span key={b as string} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider">{b}</span>)}
          </div>
        )}

        {/* ── Stacked link/CTA rows ── */}
        <div className="mt-6 space-y-3">
          {c.cta.menuBtn && (
            <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="block rounded-xl py-3 text-center text-sm font-bold uppercase tracking-wider" onClick={() => p.track("click", "menu_button", {})}>
              {c.terms.ctaLabel}
            </p.LinkComponent>
          )}
          {c.cta.payBtn && c.cta.paymentLink && (
            <button onClick={p.onPay} style={{ borderColor: t.accent, color: t.accent }} className="block w-full rounded-xl border-2 py-3 text-center text-sm font-bold uppercase tracking-wider">
              Pay Now
            </button>
          )}
          {c.cta.reviewBtn && c.cta.reviewLink && (
            <button onClick={p.onReview} style={{ borderColor: t.border, color: t.textSecondary }} className="block w-full rounded-xl border py-3 text-center text-sm font-bold uppercase tracking-wider">
              Leave a Review
            </button>
          )}
          {c.locationUrl && (
            <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ borderColor: t.border, color: t.textSecondary }} className="block w-full rounded-xl border py-3 text-center text-sm font-bold uppercase tracking-wider">
              Get Directions
            </a>
          )}
        </div>

        {/* ── Compact stat row ── */}
        {c.stats.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="mt-6 flex flex-wrap justify-between gap-2 rounded-xl px-4 py-3" style={{ background: sectionBg }}>
              {c.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p style={{ color: t.accent }} className="text-sm font-bold">{s.value}</p>
                  <p style={{ color: t.textSecondary }} className="text-[9px] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* ── Short story blurb ── */}
        {c.story && (c.story.headline || c.story.body) && (
          <FadeIn delay={0.15}>
            <div className="mt-6 rounded-xl p-4 text-center" style={{ background: sectionBg }}>
              {c.story.headline && <p style={{ color: t.textPrimary }} className="text-sm font-bold">{c.story.headline}</p>}
              {c.story.body && <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-4">{c.story.body}</p>}
            </div>
          </FadeIn>
        )}

        {/* ── Amenities ── */}
        {c.amenities.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {c.amenities.map((a) => <span key={a} style={{ background: sectionBg, color: t.textPrimary }} className="rounded-full px-2.5 py-1 text-[10px] font-semibold">{a}</span>)}
          </div>
        )}

        {/* ── Dish list rows (compact) ── */}
        {c.signatureDishes.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="mt-6">
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">{c.terms.featuredSectionLabel}</p>
              <div className="space-y-2">
                {c.signatureDishes.map((dish, i) => (
                  <div key={`sig-${dish.name}-${i}`} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: sectionBg }}>
                    <span style={{ color: t.textPrimary }} className="truncate text-sm font-medium">{dish.name}</span>
                    {dish.price && <span style={{ color: t.accent }} className="shrink-0 text-sm font-bold">{dish.price}</span>}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Popular items ── */}
        {c.popularItems.length > 0 && (
          <div className="mt-6">
            <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">{c.terms.popularSectionSubhead}</p>
            <div className="space-y-2">
              {c.popularItems.map((item, i) => (
                <div key={`pop-${item.name}-${i}`} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: sectionBg }}>
                  <span style={{ color: t.textPrimary }} className="truncate text-sm font-medium">{item.name}</span>
                  {item.price && <span style={{ color: t.accent }} className="shrink-0 text-sm font-bold">{item.price}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Offers ── */}
        {c.offers.length > 0 && (
          <div className="mt-6">
            <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Offers</p>
            <div className="space-y-2">
              {c.offers.map((o: any, i: number) => (
                <div key={i} className="rounded-lg px-3 py-2" style={{ background: sectionBg }}>
                  {o.title && <p style={{ color: t.textPrimary }} className="text-sm font-bold">{o.title}</p>}
                  {(o.offer_value || o.badge_text) && <span style={{ color: t.accent }} className="text-xs font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gallery ── */}
        {c.gallery.length > 0 && (
          <div className="mt-6">
            <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Gallery</p>
            <div className="grid grid-cols-3 gap-1.5">
              {c.gallery.slice(0, 9).map((g, i) => (
                <div key={i} className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Testimonials ── */}
        {c.testimonials.length > 0 && (
          <div className="mt-6">
            <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Guest Reviews</p>
            <div className="space-y-2">
              {c.testimonials.map((tst, i) => (
                <div key={i} className="rounded-lg px-3 py-2" style={{ background: sectionBg }}>
                  <p style={{ color: t.textSecondary }} className="text-xs italic">"{tst.text}"</p>
                  <p style={{ color: t.textPrimary }} className="mt-1 text-xs font-bold">{tst.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Hours ── */}
        {c.hours.length > 0 && (
          <div className="mt-6">
            <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Opening Hours</p>
            <div className="space-y-1 rounded-lg px-3 py-2" style={{ background: sectionBg }}>
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between text-xs">
                  <span style={{ color: t.textPrimary }}>{h.day}</span>
                  <span style={{ color: t.textSecondary }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Contact ── */}
        {hasContact && (
          <div className="mt-6 space-y-1.5 text-center text-xs" style={{ color: t.textSecondary }}>
            {c.phone && <a href={`tel:${c.phone}`} className="block hover:underline">{c.phone}</a>}
            {c.email && <a href={`mailto:${c.email}`} className="block hover:underline">{c.email}</a>}
            {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="block hover:underline">WhatsApp: {c.whatsapp}</a>}
          </div>
        )}

        {/* ── FAQ ── */}
        {c.faqs.length > 0 && (
          <div className="mt-6">
            <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">FAQ</p>
            <div className="space-y-2">
              {c.faqs.map((f, i) => (
                <div key={i} className="rounded-lg px-3 py-2" style={{ background: sectionBg }}>
                  <p style={{ color: t.textPrimary }} className="text-xs font-bold">{f.q}</p>
                  <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Socials row ── */}
        {c.social.length > 0 && (
          <div className="mt-6 flex justify-center gap-3">
            {c.social.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: sectionBg, color: t.textPrimary }} className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold">
                <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                {getSocialPlatformLabel(s.platform, s.name)}
              </a>
            ))}
          </div>
        )}

        <p style={{ color: t.textSecondary }} className="mt-8 text-center text-[10px] uppercase tracking-widest opacity-50">
          © {new Date().getFullYear()} {c.businessName}
        </p>
      </div>
    </div>
  );
}
