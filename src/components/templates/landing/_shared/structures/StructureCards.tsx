"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent, getLandingThemeSlug } from "../defaults";
import { buildTheme } from "../buildTheme";
import { FadeIn, StaggerGroup, StaggerItem, Marquee } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { ReviewCard } from "./sections";

type CardProps = {
  children: React.ReactNode;
  surface: string;
  border: string;
  cardStyle: string;
};

function Card({ children, surface, border, cardStyle }: CardProps) {
  return (
    <div style={{ background: surface, borderColor: border }} className={`overflow-hidden border p-6 shadow-sm sm:p-8 ${cardStyle}`}>
      {children}
    </div>
  );
}

/** App-like stacked-cards layout: every section — including popular items,
 * offers, and full contact details — is
 * its own large rounded card with generous whitespace between, instead of
 * blended full-bleed sections. Nothing from the content model is dropped;
 * it's simply every section, each as its own card. */
export default function StructureCards(p: LandingTemplateProps) {
  const c = getRichContent(p.data, getLandingThemeSlug(p.data));
  const t = buildTheme(c);
  const cardStyle = t.cardStyle ?? "rounded-2xl";
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;

  return (
    <div style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }} className="min-h-screen">
      <div className="mx-auto max-w-2xl space-y-6 px-5 py-10 sm:px-6">
        {c.announcement && (
          <div style={{ background: t.accent, color: t.accentText }} className="rounded-xl px-4 py-3 text-center text-sm font-semibold">
            {c.announcement}
          </div>
        )}

        {c.bannerUrl && (
          <div className="relative h-32 w-full overflow-hidden rounded-2xl">
            <Image src={c.bannerUrl} alt={`${c.businessName} banner`} fill sizes="600px" className="object-cover" />
          </div>
        )}

        {/* Hero card */}
        <FadeIn>
          <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
            {t.badge && (
              <span style={{ background: t.accent, color: t.accentText }} className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {t.badge}
              </span>
            )}
            <h1 style={{ color: t.textPrimary }} className={`text-3xl font-bold ${t.headingClass ?? ""}`}>{c.businessName}</h1>
            {(t.heroTagline || c.slogan) && <p style={{ color: t.textSecondary }} className="mt-2">{t.heroTagline || c.slogan}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              {c.cta.menuBtn && (
                <p.LinkComponent to={p.menuHref} style={{ background: t.accent, color: t.accentText }} className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider" onClick={() => p.track("click", "menu_button", {})}>
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              )}
              {c.cta.payBtn && c.cta.paymentLink && (
                <button onClick={p.onPay} style={{ borderColor: t.accent, color: t.accent }} className="rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider">
                  Pay bill
                </button>
              )}
              {c.cta.reviewBtn && c.cta.reviewLink && (
                <button onClick={p.onReview} style={{ borderColor: t.border, color: t.textSecondary }} className="rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider">
                  Leave Review
                </button>
              )}
            </div>
          </Card>
        </FadeIn>

        {/* Decorative marquee card */}
        <div style={{ background: t.accent, color: t.accentText }} className={`overflow-hidden py-2.5 ${cardStyle}`}>
          <Marquee speed={26}>
            {[...Array(6)].map((_, i) => <span key={i} className="mx-6 text-xs font-bold uppercase tracking-widest">✦ {t.marqueeText ?? c.businessName}</span>)}
          </Marquee>
        </div>


        {c.story && (
          <FadeIn delay={0.05}>
            <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Our Story</p>
              {c.story.headline && <h2 style={{ color: t.textPrimary }} className="text-xl font-bold">{c.story.headline}</h2>}
              {c.story.body && <p style={{ color: t.textSecondary }} className="mt-2 text-sm leading-relaxed">{c.story.body}</p>}
            </Card>
          </FadeIn>
        )}

        {c.signatureDishes.length > 0 && (
          <FadeIn delay={0.1}>
            <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">{c.terms.featuredSectionLabel}</p>
              <StaggerGroup className="space-y-3">
                {c.signatureDishes.slice(0, 5).map((dish, i) => (
                  <StaggerItem key={`${dish.name}-${i}`}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        {dish.image ? (
                          <Image src={dish.image} alt={dish.name} fill sizes="60px" className="object-cover" />
                        ) : (
                          <ImagePlaceholder aspect="square" className="text-current" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p style={{ color: t.textPrimary }} className="truncate text-sm font-bold">{dish.name}</p>
                        {dish.description && <p style={{ color: t.textSecondary }} className="truncate text-xs">{dish.description}</p>}
                      </div>
                      {dish.price && <span style={{ color: t.accent }} className="shrink-0 text-sm font-bold">{dish.price}</span>}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </Card>
          </FadeIn>
        )}

        {c.popularItems.length > 0 && (
          <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
            <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">{c.terms.popularSectionSubhead}</p>
            <div className="grid grid-cols-2 gap-3">
              {c.popularItems.slice(0, 4).map((item, i) => (
                <div key={`${item.name}-${i}`} className="overflow-hidden rounded-lg" style={{ background: t.bg }}>
                  <div className="relative h-20 overflow-hidden">{item.image ? <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}</div>
                  <div className="p-2">
                    <p style={{ color: t.textPrimary }} className="truncate text-xs font-bold">{item.name}</p>
                    {item.price && <p style={{ color: t.accent }} className="text-xs font-bold">{item.price}</p>}
                  </div>
                </div>
              ))}
            </div>
            {c.cta.menuBtn && (
              <p.LinkComponent to={p.menuHref} style={{ color: t.accent }} className="mt-4 inline-block text-xs font-bold uppercase tracking-wider hover:underline" onClick={() => p.track("click", "menu_button", {})}>{c.terms.ctaLabel} →</p.LinkComponent>
            )}
          </Card>
        )}

        {c.offers.length > 0 && (
          <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
            <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">Current Offers</p>
            <div className="space-y-3">
              {c.offers.map((o, i: number) => (
                <div key={i} style={{ background: t.bg, borderColor: t.border }} className="rounded-lg border p-3">
                  {o.title && <p style={{ color: t.textPrimary }} className="text-sm font-bold">{o.title}</p>}
                  {o.description && <p style={{ color: t.textSecondary }} className="mt-1 text-xs">{o.description}</p>}
                  {(o.offer_value || o.badge_text) && (
                    <span style={{ background: t.accent, color: t.accentText }} className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold">{o.badge_text || o.offer_value}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {c.stats.length > 0 && (
          <FadeIn delay={0.15}>
            <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                {c.stats.map((s) => (
                  <div key={s.label}>
                    <p style={{ color: t.accent }} className="text-2xl font-bold">{s.value}</p>
                    <p style={{ color: t.textSecondary }} className="text-[10px] uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
        )}

        {c.gallery.length > 0 && (
          <FadeIn delay={0.2}>
            <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">Gallery</p>
              <div className="grid grid-cols-3 gap-2">
                {c.gallery.slice(0, 6).map((g, i) => (
                  <div key={i} className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
        )}

        {c.googleReviews.length > 0 && (
          <FadeIn delay={0.25}>
            <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">Google Reviews</p>
              <div className="space-y-4">
                {c.googleReviews.slice(0, 4).map((r) => (
                  <ReviewCard key={r.id} review={r} t={{ ...t, surface: t.bg }} />
                ))}
              </div>
            </Card>
          </FadeIn>
        )}

        {(c.hours.length > 0 || hasContact) && (
          <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
            {c.hours.length > 0 && (
              <div className="mb-5">
                <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-widest">Opening Hours</p>
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
              <div className="space-y-2 text-sm">
                <p style={{ color: t.accent }} className="mb-1 text-[10px] font-bold uppercase tracking-widest">Find Us</p>
                {c.address && <p style={{ color: t.textSecondary }}>{c.address}</p>}
                {c.locationUrl && <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="block text-xs font-bold uppercase tracking-wider">Get Directions →</a>}
                {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="block font-medium hover:underline">{c.phone}</a>}
                {c.email && <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="block font-medium hover:underline">{c.email}</a>}
                {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="block font-medium hover:underline">WhatsApp: {c.whatsapp}</a>}
                {c.social.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {c.social.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"><span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>{getSocialPlatformLabel(s.platform, s.name)}</a>)}
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {c.faqs.length > 0 && (
          <FadeIn delay={0.3}>
            <Card surface={t.surface} border={t.border} cardStyle={cardStyle}>
              <p style={{ color: t.accent }} className="mb-4 text-[10px] font-bold uppercase tracking-widest">FAQ</p>
              <div className="space-y-3">
                {c.faqs.map((f, i) => (
                  <div key={i}>
                    <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
                    <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
        )}

        <div className="pb-6 text-center text-xs opacity-60" style={{ color: t.textSecondary }}>
          © {new Date().getFullYear()} {c.businessName}
        </div>
      </div>
    </div>
  );
}
