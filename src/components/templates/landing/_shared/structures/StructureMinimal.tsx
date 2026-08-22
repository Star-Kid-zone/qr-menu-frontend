"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "../defaults";
import { buildTheme } from "../buildTheme";
import { getThemeImages } from "../themeImages";
import { FadeIn, StaggerGroup, StaggerItem, Marquee } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { LotterySection } from "./sections";

export default function StructureMinimal(p: LandingTemplateProps) {
  const c = getRichContent(p.data, (p.data.settings as any)?.landing_theme ?? "swiss");
  const t = buildTheme(c);
  const img = getThemeImages(t.slug);

  const sectionBg = t.sectionBg ?? t.surface;
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;

  return (
    <div
      style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }}
      className="min-h-screen"
    >
      {c.announcement && (
        <div style={{ background: t.border, color: t.textPrimary }} className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest">{c.announcement}</div>
      )}

      {/* ── Full-screen Hero ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center">
        {c.bannerUrl ? (
          <Image src={c.bannerUrl} alt={c.businessName} fill priority className="object-cover" />
        ) : (
          <Image src={img.hero} alt={c.businessName} fill priority className="object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: t.heroOverlay }} />

        <div className="relative z-10 px-6">
          <FadeIn>
            {c.logoUrl && (
              <div className="relative mx-auto mb-5 h-16 w-16">
                <Image src={c.logoUrl} alt={`${c.businessName} logo`} fill className="rounded-full border-2 border-white/70 object-cover" />
              </div>
            )}
            {t.badge && (
              <span
                style={{ background: t.accent, color: t.accentText }}
                className="mb-6 inline-block rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.5em]"
              >
                {t.badge}
              </span>
            )}
            <h1 className="text-5xl font-bold leading-none text-white sm:text-7xl">
              {c.businessName}
            </h1>
            {(t.heroTagline || c.slogan) && (
              <p className="mt-4 text-lg text-white/70 max-w-md mx-auto">{t.heroTagline || c.slogan}</p>
            )}
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {c.cta.menuBtn && (
                <p.LinkComponent
                  to={p.menuHref}
                  style={{ background: t.accent, color: t.accentText }}
                  className="rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition hover:opacity-90"
                  onClick={() => p.track("click", "menu_button", {})}
                >
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              )}
              {c.cta.payBtn && c.cta.paymentLink && (
                <button
                  onClick={p.onPay}
                  className="rounded-full border border-white/50 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white/10"
                >
                  Pay Now
                </button>
              )}
              {c.cta.reviewBtn && c.cta.reviewLink && (
                <button
                  onClick={p.onReview}
                  className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white/70 transition hover:bg-white/5"
                >
                  Leave Review
                </button>
              )}
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
            <div className="h-1.5 w-1 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {t.marqueeText && (
        <div style={{ background: t.accent, color: t.accentText }} className="py-2.5">
          <Marquee speed={28}>
            {[...Array(6)].map((_, i) => <span key={i} className="mx-8 text-xs font-bold uppercase tracking-widest">✦ {t.marqueeText}</span>)}
          </Marquee>
        </div>
      )}

      {(c.cta.menuBtn || c.cta.payBtn || c.cta.reviewBtn || c.offers.length > 0 || p.lotteryEnabled) && (
        <div className="flex flex-wrap justify-center gap-2 px-6 py-6">
          {[c.cta.menuBtn && c.terms.catalogLabel, c.cta.payBtn && "Pay Online", c.cta.reviewBtn && "Reviews", c.offers.length > 0 && "Offers", p.lotteryEnabled && "Lucky Draw"]
            .filter(Boolean)
            .map((b) => <span key={b as string} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider">{b}</span>)}
        </div>
      )}

      {/* ── Signature Dishes ── */}
      {c.signatureDishes.length > 0 && (
      <section style={{ background: t.bg }} className="px-6 py-20 sm:px-10">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">
            Today's Picks
          </p>
          <h2 style={{ color: t.textPrimary }} className="mb-12 text-center text-3xl font-bold">
            {c.terms.featuredSectionLabel}
          </h2>
        </FadeIn>
        <StaggerGroup className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {c.signatureDishes.map((dish, i) => (
            <StaggerItem key={`${dish.name}-${i}`}>
              <div
                style={{ background: sectionBg, borderColor: t.border }}
                className="overflow-hidden rounded-2xl border group"
              >
                <div className="relative overflow-hidden h-44">
                  <Image
                    src={img.dish}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  {dish.price && (
                    <span
                      style={{ background: t.accent, color: t.accentText }}
                      className="mb-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold"
                    >
                      {dish.price}
                    </span>
                  )}
                  <h3 style={{ color: t.textPrimary }} className="font-bold">{dish.name}</h3>
                  {dish.description && (
                    <p style={{ color: t.textSecondary }} className="mt-1 text-sm leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
        {c.cta.menuBtn && (
          <div className="mt-10 text-center">
            <p.LinkComponent
              to={p.menuHref}
              style={{ color: t.accent }}
              className="text-sm font-bold uppercase tracking-wider hover:underline"
              onClick={() => p.track("click", "menu_button", {})}
            >
              {c.terms.ctaLabel} →
            </p.LinkComponent>
          </div>
        )}
      </section>
      )}

      {/* ── Popular Items ── */}
      {c.popularItems.length > 0 && (
      <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-20 sm:px-10">
        <FadeIn>
          <p style={{ color: t.accent }} className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.popularSectionLabel}</p>
          <h2 style={{ color: t.textPrimary }} className="mb-12 text-center text-3xl font-bold">{c.terms.popularSectionSubhead}</h2>
        </FadeIn>
        <StaggerGroup className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-4">
          {c.popularItems.map((item, i) => (
            <StaggerItem key={`${item.name}-${i}`}>
              <div style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-2xl border">
                <div className="relative h-28 overflow-hidden">{item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <ImagePlaceholder aspect="wide" className="text-current" />}</div>
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

      {/* ── Single highlight stat strip ── */}
      {c.stats.length > 0 && (
        <section style={{ background: t.accent }} className="py-12">
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-16 gap-y-6 px-6 text-center">
            {c.stats.map((s) => (
              <div key={s.label}>
                <p style={{ color: t.accentText }} className="text-4xl font-bold">{s.value}</p>
                <p style={{ color: `${t.accentText}aa` }} className="mt-1 text-[10px] uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Story (centered, minimal) ── */}
      {c.story && (
      <section style={{ background: sectionBg }} className="px-6 py-20 text-center sm:px-10">
        <div className="mx-auto max-w-xl">
          <FadeIn>
            <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]">
              Our Story
            </p>
            {c.story.headline && (
              <h2 style={{ color: t.textPrimary }} className="text-2xl font-bold leading-snug">
                {c.story.headline}
              </h2>
            )}
            {c.story.body && (
              <p style={{ color: t.textSecondary }} className="mt-4 leading-relaxed text-sm">
                {c.story.body}
              </p>
            )}
          </FadeIn>
        </div>
      </section>
      )}

      {/* ── Amenities ── */}
      {c.amenities.length > 0 && (
        <section className="px-6 py-10 text-center sm:px-10">
          <div className="flex flex-wrap justify-center gap-2">
            {c.amenities.map((a) => (
              <span key={a} style={{ borderColor: t.border, color: t.textPrimary }} className="rounded-full border px-3.5 py-1.5 text-xs font-semibold">{a}</span>
            ))}
          </div>
        </section>
      )}

      {/* ── Offers ── */}
      {c.offers.length > 0 && (
        <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-20 text-center sm:px-10">
          <FadeIn>
            <h2 style={{ color: t.textPrimary }} className="mb-10 text-3xl font-bold">Something Special</h2>
          </FadeIn>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.offers.map((o: any, i: number) => (
              <div key={i} style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-xl border p-5 text-left">
                {o.title && <h3 style={{ color: t.textPrimary }} className="font-bold">{o.title}</h3>}
                {o.description && <p style={{ color: t.textSecondary }} className="mt-2 text-sm">{o.description}</p>}
                {(o.offer_value || o.badge_text) && <span style={{ background: t.accent, color: t.accentText }} className="mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {c.gallery.length > 0 && (
        <section className="px-6 py-20 text-center sm:px-10">
          <FadeIn>
            <h2 style={{ color: t.textPrimary }} className="mb-10 text-3xl font-bold">Gallery</h2>
          </FadeIn>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {c.gallery.map((g, i) => (
              <div key={i} className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image src={g.image_url as string} alt={`Gallery ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {c.testimonials.length > 0 && (
        <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-20 text-center sm:px-10">
          <FadeIn>
            <h2 style={{ color: t.textPrimary }} className="mb-10 text-3xl font-bold">What Guests Say</h2>
          </FadeIn>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {c.testimonials.map((tst, i) => (
              <div key={i} style={{ background: t.bg, borderColor: t.border }} className="rounded-2xl border p-5 text-left">
                <p style={{ color: t.textSecondary }} className="text-sm italic leading-relaxed">"{tst.text}"</p>
                <p style={{ color: t.textPrimary }} className="mt-3 text-xs font-bold">{tst.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Hours + Contact ── */}
      {(c.hours.length > 0 || hasContact) && (
        <section className="px-6 py-20 text-center sm:px-10">
          <div className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-2 sm:text-left">
            {c.hours.length > 0 && (
              <div>
                <h3 style={{ color: t.textPrimary }} className="mb-4 text-lg font-bold">Opening Hours</h3>
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
                <h3 style={{ color: t.textPrimary }} className="mb-4 text-lg font-bold">Find Us</h3>
                <div className="space-y-1.5 text-sm">
                  {c.address && <p style={{ color: t.textSecondary }}>{c.address}</p>}
                  {c.locationUrl && <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="block text-xs font-bold uppercase tracking-wider">Get Directions →</a>}
                  {c.phone && <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }}>{c.phone}</a>}
                  {c.email && <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }}>{c.email}</a>}
                  {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }}>WhatsApp: {c.whatsapp}</a>}
                  {c.social.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {c.social.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"><span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>{getSocialPlatformLabel(s.platform, s.name)}</a>)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Lottery (modal, triggered by a floating button) ── */}
      <LotterySection c={c} p={p} t={t} />

      {/* ── FAQ ── */}
      {c.faqs.length > 0 && (
        <section style={{ background: sectionBg }} className="px-6 py-20 text-center sm:px-10">
          <FadeIn>
            <h2 style={{ color: t.textPrimary }} className="mb-10 text-3xl font-bold">Common Questions</h2>
          </FadeIn>
          <div className="mx-auto max-w-2xl space-y-4 text-left">
            {c.faqs.map((f, i) => (
              <div key={i} style={{ background: t.bg, borderColor: t.border }} className="rounded-xl border p-4">
                <p style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</p>
                <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Compact footer ── */}
      <footer style={{ background: t.footerBg ?? t.bg, borderColor: t.border }} className="border-t px-6 py-10 text-center">
        <FadeIn>
          <p style={{ color: t.accentText }} className="font-bold text-lg">{c.businessName}</p>
          {c.slogan && <p style={{ color: `${t.accentText}80` }} className="mt-1 text-sm">{c.slogan}</p>}
          {c.phone && (
            <a href={`tel:${c.phone}`} style={{ color: `${t.accentText}80` }} className="mt-2 block text-sm hover:underline">
              {c.phone}
            </a>
          )}
          {c.address && (
            <p style={{ color: `${t.accentText}55` }} className="mt-1 text-xs">{c.address}</p>
          )}
          <p style={{ color: `${t.accentText}33` }} className="mt-6 text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} {c.businessName}
          </p>
        </FadeIn>
      </footer>
    </div>
  );
}
