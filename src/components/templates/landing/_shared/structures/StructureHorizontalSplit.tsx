"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn, StaggerGroup, StaggerItem } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { ReviewCard } from "./sections";

/** Split on the HORIZONTAL axis instead of vertical: a full-width fixed
 * hero/CTA band across the top, then a two-column body below it (dishes,
 * popular items, offers, gallery on the left; hours/full
 * contact/FAQ on the right). Every section from the content model appears
 * — nothing is trimmed to "just a few" the way an early draft might. */
export default function StructureHorizontalSplit(p: LandingTemplateProps) {
  const c = getRichContent(p.data, (p.data.settings as any)?.landing_theme ?? "swiss");
  const t = buildTheme(c);
  const sectionBg = t.sectionBg ?? t.surface;
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      {c.announcement && (
        <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest">{c.announcement}</div>
      )}

      {/* ── Top band: full-width hero + CTA ── */}
      <section className="relative overflow-hidden px-6 py-16 text-center sm:px-10 sm:py-24">
        <div className="absolute inset-0">
          {(() => {
            const heroImg = c.bannerUrl || c.gallery[0]?.image_url;
            return heroImg
              ? <Image src={heroImg} alt="" fill sizes="100vw" className="object-cover opacity-30" />
              : <ImagePlaceholder aspect="wide" className="h-full text-current opacity-40" />;
          })()}
        </div>
        <div style={{ background: t.heroOverlay }} className="absolute inset-0" />
        <div className="relative z-10">
          <FadeIn>
            {t.badge && <span style={{ background: t.accent, color: t.accentText }} className="mb-4 inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em]">{t.badge}</span>}
            <h1 style={{ color: t.textPrimary }} className={`text-4xl font-bold sm:text-6xl ${t.headingClass ?? ""}`}>{c.businessName}</h1>
            {(t.heroTagline || c.slogan) && <p style={{ color: t.textSecondary }} className="mx-auto mt-3 max-w-lg text-lg">{t.heroTagline || c.slogan}</p>}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {c.cta.menuBtn && (
                <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-7 py-3 text-sm font-bold uppercase tracking-widest" onClick={() => p.track("click", "menu_button", {})}>
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              )}
              {c.cta.payBtn && c.cta.paymentLink && (
                <button onClick={p.onPay} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border-2 px-7 py-3 text-sm font-bold uppercase tracking-widest">
                  Pay Now
                </button>
              )}
              {c.cta.reviewBtn && c.cta.reviewLink && (
                <button onClick={p.onReview} style={{ borderColor: t.border, color: t.textSecondary }} className="rounded-full border-2 px-7 py-3 text-sm font-bold uppercase tracking-widest">
                  Leave Review
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-2 px-5 py-3 sm:px-10">
        {[c.cta.menuBtn && c.terms.catalogLabel, c.cta.payBtn && "Pay Online", c.cta.reviewBtn && "Reviews", c.offers.length > 0 && "Offers"]
          .filter(Boolean)
          .map((b) => <span key={b as string} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider">{b}</span>)}
      </div>

      {c.stats.length > 0 && (
        <div style={{ background: t.accent, color: t.accentText }} className="grid grid-cols-2 divide-x divide-white/20 py-6 sm:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom band: 2-column body ── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-10 lg:grid-cols-3">
        {/* Left: dishes (wider column) */}
        <div className="lg:col-span-2">
          {c.story && (
            <FadeIn>
              <div className="mb-10">
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">Our Story</p>
                {c.story.headline && <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold">{c.story.headline}</h2>}
                {c.story.body && <p style={{ color: t.textSecondary }} className="mt-2 leading-relaxed">{c.story.body}</p>}
              </div>
            </FadeIn>
          )}
          {c.signatureDishes.length > 0 && (
            <div className="mb-10">
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]">{c.terms.featuredSectionLabel}</p>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2">
                {c.signatureDishes.map((dish, i) => (
                  <StaggerItem key={`sig-${dish.name}-${i}`}>
                    <div style={{ background: sectionBg, borderColor: t.border }} className="overflow-hidden rounded-xl border p-4">
                      <div className="mb-3 h-28 overflow-hidden rounded-lg"><ImagePlaceholder aspect="wide" className="text-current" /></div>
                      {dish.price && <span style={{ background: t.accent, color: t.accentText }} className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold">{dish.price}</span>}
                      <h3 style={{ color: t.textPrimary }} className="text-sm font-bold">{dish.name}</h3>
                      {dish.description && <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-2">{dish.description}</p>}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}
          {c.popularItems.length > 0 && (
            <div className="mb-10">
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]">{c.terms.popularSectionSubhead}</p>
              <StaggerGroup className="grid gap-4 sm:grid-cols-3">
                {c.popularItems.map((item, i) => (
                  <StaggerItem key={`pop-${item.name}-${i}`}>
                    <div style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
                      <div className="relative h-24 overflow-hidden">{item.image ? <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}</div>
                      <div className="p-3">
                        <p style={{ color: t.textPrimary }} className="truncate text-xs font-bold">{item.name}</p>
                        {item.price && <p style={{ color: t.accent }} className="text-xs font-bold">{item.price}</p>}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}
          {c.offers.length > 0 && (
            <div className="mb-10">
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]">Offers</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {c.offers.map((o: any, i: number) => (
                  <div key={i} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                    {o.title && <p style={{ color: t.textPrimary }} className="font-bold">{o.title}</p>}
                    {o.description && <p style={{ color: t.textSecondary }} className="mt-1 text-sm">{o.description}</p>}
                    {(o.offer_value || o.badge_text) && <span style={{ background: t.accent, color: t.accentText }} className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {c.gallery.length > 0 && (
            <div className="mb-10">
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]">Gallery</p>
              <div className="grid grid-cols-3 gap-3">
                {c.gallery.map((g, i) => (
                  <div key={i} className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {c.googleReviews.length > 0 && (
            <div>
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]">Google Reviews</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {c.googleReviews.slice(0, 4).map((r) => (
                  <ReviewCard key={r.id} review={r} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: hours + full contact + faq, stacked narrow */}
        <div className="space-y-8">
          {c.hours.length > 0 && (
            <div>
              <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]">Hours</p>
              <div className="space-y-1.5">
                {c.hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-xs">
                    <span style={{ color: t.textPrimary }}>{h.day}</span>
                    <span style={{ color: t.textSecondary }}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasContact && (
            <div>
              <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]">Find Us</p>
              <div className="space-y-1.5 text-xs">
                {c.address && <p style={{ color: t.textSecondary }}>{c.address}</p>}
                {c.locationUrl && <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="block font-bold uppercase tracking-wider">Get Directions →</a>}
                {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="block">{c.phone}</a>}
                {c.email && <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="block">{c.email}</a>}
                {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="block">WhatsApp: {c.whatsapp}</a>}
                {c.social.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.social.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold"><span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>{getSocialPlatformLabel(s.platform, s.name)}</a>)}
                  </div>
                )}
                {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" width={112} height={112} style={{ borderColor: t.border }} className="mt-2 h-28 w-28 rounded-lg border object-contain p-1" />
                )}
              </div>
            </div>
          )}
          {c.faqs.length > 0 && (
            <div>
              <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]">FAQ</p>
              <div className="space-y-3">
                {c.faqs.map((f, i) => (
                  <div key={i}>
                    <p style={{ color: t.textPrimary }} className="text-xs font-bold">{f.q}</p>
                    <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-6 py-8 text-center sm:px-10">
        <p style={{ color: t.textPrimary }} className="font-bold">{c.businessName}</p>
        {c.slogan && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{c.slogan}</p>}
        {c.phone && <p style={{ color: t.textSecondary }} className="mt-1 text-sm">{c.phone}</p>}
      </footer>
    </div>
  );
}
