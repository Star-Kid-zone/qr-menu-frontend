"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { LotterySection } from "./sections";

/** Bento/dashboard grid: variable-sized tiles for every section in the
 * content model (story, stats, dishes, popular items, offers, amenities,
 * gallery, testimonials, hours, full contact, lottery, FAQ) all
 * visible in one CSS grid without a long single scroll — the wireframe here
 * is the tile arrangement itself, not a linear reading order, but nothing
 * from the data model is left out. */
export default function StructureDashboard(p: LandingTemplateProps) {
  const c = getRichContent(p.data, (p.data.settings as any)?.landing_theme ?? "swiss");
  const t = buildTheme(c);
  const cardStyle = t.cardStyle ?? "rounded-2xl";
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;

  const Tile = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
    <div style={{ background: t.surface, borderColor: t.border }} className={`overflow-hidden border p-5 ${cardStyle} ${className}`}>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      <LotterySection c={c} p={p} t={t} />
      {c.announcement && (
        <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest">{c.announcement}</div>
      )}
      {c.bannerUrl && (
        <div className="relative h-24 w-full sm:h-36">
          <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill className="object-cover" />
        </div>
      )}

      {/* ── Hero banner ── */}
      <section style={{ background: t.accent, color: t.accentText }} className="px-5 py-12 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            {t.badge && <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{t.badge}</span>}
            <h1 className={`text-3xl font-bold sm:text-5xl ${t.headingClass ?? ""}`}>{c.businessName}</h1>
            {(t.heroTagline || c.slogan) && <p className="mt-2 opacity-80">{t.heroTagline || c.slogan}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              {c.cta.menuBtn && (
                <p.LinkComponent to={p.menuHref} style={{ background: t.accentText, color: t.accent }} className="rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wider" onClick={() => p.track("click", "menu_button", {})}>
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              )}
              {c.cta.payBtn && c.cta.paymentLink && (
                <button onClick={p.onPay} className="rounded-full border-2 border-white/60 px-6 py-2.5 text-sm font-bold uppercase tracking-wider">
                  Pay Now
                </button>
              )}
              {c.cta.reviewBtn && c.cta.reviewLink && (
                <button onClick={p.onReview} className="rounded-full border-2 border-white/40 px-6 py-2.5 text-sm font-bold uppercase tracking-wider opacity-90">
                  Leave Review
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-3 sm:px-10">
        <div className="flex flex-wrap justify-center gap-2">
          {[c.cta.menuBtn && c.terms.catalogLabel, c.cta.payBtn && "Pay Online", c.cta.reviewBtn && "Reviews", c.offers.length > 0 && "Offers", p.lotteryEnabled && "Lucky Draw"]
            .filter(Boolean)
            .map((b) => <span key={b as string} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider">{b}</span>)}
        </div>
      </div>

      {/* ── Bento grid ── */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-10">
        <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-4 sm:grid-cols-4">
          {c.stats.slice(0, 4).map((s) => (
            <Tile key={s.label}>
              <p style={{ color: t.accent }} className="text-2xl font-bold">{s.value}</p>
              <p style={{ color: t.textSecondary }} className="mt-1 text-[10px] uppercase tracking-wider">{s.label}</p>
            </Tile>
          ))}

          {c.story && (
            <Tile className="col-span-2 row-span-2">
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Our Story</p>
              {c.story.headline && <h3 style={{ color: t.textPrimary }} className="font-bold">{c.story.headline}</h3>}
              {c.story.body && <p style={{ color: t.textSecondary }} className="mt-2 text-sm leading-relaxed line-clamp-6">{c.story.body}</p>}
            </Tile>
          )}

          {c.amenities.length > 0 && (
            <Tile className="col-span-2">
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">What We Offer</p>
              <div className="flex flex-wrap gap-1.5">
                {c.amenities.map((a) => <span key={a} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-2.5 py-1 text-[10px] font-semibold">{a}</span>)}
              </div>
            </Tile>
          )}

          {c.gallery.slice(0, 2).map((g, i) => (
            <Tile key={i} className="relative col-span-2 row-span-2 p-0">
              <Image src={g.image_url as string} alt="Gallery" fill className="object-cover" />
            </Tile>
          ))}

          {c.signatureDishes.slice(0, 3).map((dish, i) => (
            <Tile key={`sig-${dish.name}-${i}`} className="col-span-2 sm:col-span-1">
              <div className="mb-3 h-24 overflow-hidden rounded-lg"><ImagePlaceholder aspect="wide" className="text-current" /></div>
              {dish.price && <span style={{ background: t.accent, color: t.accentText }} className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold">{dish.price}</span>}
              <p style={{ color: t.textPrimary }} className="text-sm font-bold">{dish.name}</p>
            </Tile>
          ))}

          {c.popularItems.slice(0, 3).map((item, i) => (
            <Tile key={`pop-${item.name}-${i}`} className="col-span-2 sm:col-span-1 p-0">
              <div className="relative h-20 overflow-hidden">{item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}</div>
              <div className="p-3">
                <p style={{ color: t.textPrimary }} className="truncate text-xs font-bold">{item.name}</p>
                {item.price && <p style={{ color: t.accent }} className="text-xs font-bold">{item.price}</p>}
              </div>
            </Tile>
          ))}

          {c.offers.slice(0, 2).map((o: any, i: number) => (
            <Tile key={`offer-${i}`} className="col-span-2">
              {o.title && <p style={{ color: t.textPrimary }} className="text-sm font-bold">{o.title}</p>}
              {o.description && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{o.description}</p>}
              {(o.offer_value || o.badge_text) && <span style={{ background: t.accent, color: t.accentText }} className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
            </Tile>
          ))}

          {c.testimonials.slice(0, 1).map((tst, i) => (
            <Tile key={i} className="col-span-2 row-span-2">
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Guest Review</p>
              <p style={{ color: t.textSecondary }} className="text-sm italic leading-relaxed">"{tst.text}"</p>
              <p style={{ color: t.textPrimary }} className="mt-2 text-xs font-bold">{tst.name}</p>
            </Tile>
          ))}

          {c.hours.length > 0 && (
            <Tile className="col-span-2">
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Hours</p>
              <div className="space-y-1">
                {c.hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-xs">
                    <span style={{ color: t.textPrimary }}>{h.day}</span>
                    <span style={{ color: t.textSecondary }}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </Tile>
          )}

          {hasContact && (
            <Tile className="col-span-2">
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Find Us</p>
              <div className="space-y-1 text-xs">
                {c.address && <p style={{ color: t.textSecondary }}>{c.address}</p>}
                {c.locationUrl && <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="block font-bold uppercase tracking-wider">Get Directions →</a>}
                {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="block">{c.phone}</a>}
                {c.email && <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="block">{c.email}</a>}
                {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="block">WhatsApp: {c.whatsapp}</a>}
                {c.social.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.social.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold"><span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>{getSocialPlatformLabel(s.platform, s.name)}</a>)}
                  </div>
                )}
              </div>
            </Tile>
          )}

          {c.faqs.slice(0, 4).map((f, i) => (
            <Tile key={i} className="col-span-2 sm:col-span-1">
              <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
              <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-3">{f.a}</p>
            </Tile>
          ))}
        </div>
      </section>

      <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-5 py-8 text-center sm:px-10">
        <p style={{ color: t.textPrimary }} className="font-bold">{c.businessName}</p>
        {c.slogan && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{c.slogan}</p>}
        {c.phone && <p style={{ color: t.textSecondary }} className="mt-1 text-sm">{c.phone}</p>}
      </footer>
    </div>
  );
}
