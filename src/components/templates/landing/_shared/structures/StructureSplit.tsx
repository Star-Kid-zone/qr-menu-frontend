"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent, getLandingThemeSlug } from "../defaults";
import { buildTheme } from "../buildTheme";
import { getThemeImages } from "../themeImages";
import { FadeIn, StaggerGroup, StaggerItem, Marquee } from "../animations";
import { ImagePlaceholder } from "@/components/templates/core/ImagePlaceholder";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { ReviewCard } from "./sections";

export default function StructureSplit(p: LandingTemplateProps) {
  const c = getRichContent(p.data, getLandingThemeSlug(p.data));
  const t = buildTheme(c);
  const img = getThemeImages(t.slug);

  const galleryImages = c.gallery.slice(0, 8).map((g) => g.image_url as string);

  const footerBg  = t.footerBg  ?? t.bg;
  const sectionBg = t.sectionBg ?? t.surface;
  const cardStyle = t.cardStyle  ?? "";

  return (
    <div
      style={{ fontFamily: t.fontFamily, backgroundColor: t.bg, color: t.textSecondary }}
      className="min-h-screen"
    >
      {/* ── Announcement ── */}
      {c.announcement && (
        <div
          style={{ background: t.border, color: t.textPrimary }}
          className="px-4 py-2 text-center text-xs font-semibold tracking-widest uppercase"
        >
          {c.announcement}
        </div>
      )}

      <div className="lg:flex lg:min-h-screen">
        {/* ── LEFT SIDEBAR (fixed on large screens) ── */}
        <aside
          style={{ background: footerBg, borderColor: t.border, color: t.accentText }}
          className="lg:sticky lg:top-0 lg:h-screen lg:w-[340px] lg:shrink-0 lg:overflow-y-auto
                     flex flex-col justify-between p-8 border-r"
        >
          <div>
            {/* Logo / Business Name */}
            <FadeIn>
              {t.badge && (
                <span
                  style={{ background: t.accent, color: t.accentText }}
                  className="inline-block mb-4 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em]"
                >
                  {t.badge}
                </span>
              )}
              <h1
                style={{ color: t.accentText }}
                className="text-4xl font-bold leading-tight"
              >
                {c.businessName}
              </h1>
              {c.slogan && (
                <p style={{ color: `${t.accentText}99` }} className="mt-3 text-sm leading-relaxed">
                  {c.slogan}
                </p>
              )}
            </FadeIn>

            {/* Divider */}
            <div style={{ borderColor: `${t.accentText}20` }} className="my-6 border-t" />

            {/* CTA Buttons */}
            <FadeIn delay={0.15}>
              <div className="flex flex-col gap-3">
                {c.cta.menuBtn && (
                  <p.LinkComponent
                    to={p.menuHref}
                    style={{ background: t.accent, color: t.accentText }}
                    className="rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest text-center transition hover:opacity-90"
                    onClick={() => p.track("click", "menu_button", {})}
                  >
                    {c.terms.ctaLabel}
                  </p.LinkComponent>
                )}
                {c.cta.payBtn && c.cta.paymentLink && (
                  <button
                    onClick={p.onPay}
                    style={{ borderColor: `${t.accentText}60`, color: t.accentText }}
                    className="rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-widest transition hover:bg-white/10"
                  >
                    Pay bill
                  </button>
                )}
                {c.cta.reviewBtn && c.cta.reviewLink && (
                  <button
                    onClick={p.onReview}
                    style={{ borderColor: `${t.accentText}40`, color: `${t.accentText}cc` }}
                    className="rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-widest transition hover:bg-white/5"
                  >
                    Leave Review
                  </button>
                )}
              </div>
            </FadeIn>


            {/* Divider */}
            <div style={{ borderColor: `${t.accentText}20` }} className="my-6 border-t" />

            {/* Hours snippet */}
            {c.hours.length > 0 && (
            <FadeIn delay={0.25}>
              <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em]">
                Hours
              </p>
              <div className="space-y-1">
                {c.hours.slice(0, 4).map((h) => (
                  <div key={h.day} className="flex justify-between text-xs" style={{ color: `${t.accentText}99` }}>
                    <span>{h.day}</span>
                    {h.startTime && h.endTime ? (
                      <span>
                        <time dateTime={h.startTime}>{h.hours.split(" — ")[0]}</time>
                        {" — "}
                        <time dateTime={h.endTime}>{h.hours.split(" — ")[1]}</time>
                      </span>
                    ) : (
                      <span>{h.hours}</span>
                    )}
                  </div>
                ))}
                <p style={{ color: `${t.accentText}55` }} className="text-[10px] mt-1">+ more…</p>
              </div>
            </FadeIn>
            )}
          </div>

          {/* Bottom contact */}
          <FadeIn delay={0.35}>
            <address style={{ borderColor: `${t.accentText}20` }} className="not-italic border-t pt-5 space-y-2">
              {c.address && (
                <p style={{ color: `${t.accentText}66` }} className="text-xs">
                  {c.address}
                </p>
              )}
              {c.locationUrl && (
                <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="block text-[10px] font-bold uppercase tracking-wider">
                  Get Directions →
                </a>
              )}
              {c.phone && (
                <a href={`tel:${c.phone}`} style={{ color: `${t.accentText}99` }} className="block text-xs hover:underline">
                  {c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} style={{ color: `${t.accentText}99` }} className="block text-xs hover:underline">
                  {c.email}
                </a>
              )}
              {c.whatsapp && (
                <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: `${t.accentText}99` }} className="block text-xs hover:underline">
                  WhatsApp: {c.whatsapp}
                </a>
              )}
              {c.social.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.social.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold">
                      <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                      {getSocialPlatformLabel(s.platform, s.name)}
                    </a>
                  ))}
                </div>
              )}
              {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                <div className="relative mt-2 h-24 w-24 rounded-lg border" style={{ borderColor: `${t.accentText}30` }}>
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill className="rounded-lg object-contain p-1" />
                </div>
              )}
            </address>
          </FadeIn>
        </aside>

        {/* ── RIGHT SCROLLABLE CONTENT ── */}
        <main className="flex-1 overflow-x-hidden">
          {/* Hero image strip — real tenant imagery (banner upload, then first
              gallery photo) wins over the theme's generic stock photo, and this
              is the only full-width hero image (no separate banner strip above
              it, so a banner never renders twice). */}
          <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
            <Image
              src={c.bannerUrl || c.gallery[0]?.image_url || img.hero}
              alt={c.businessName}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: t.heroOverlay }} />
          </div>

          {/* Marquee */}
          {t.marqueeText && (
            <div style={{ background: t.accent, color: t.accentText }} className="py-2.5">
              <Marquee speed={28}>
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="mx-8 text-xs font-bold uppercase tracking-widest">
                    ✦ {t.marqueeText}
                  </span>
                ))}
              </Marquee>
            </div>
          )}

          {/* Stats */}
          {c.stats.length > 0 && (
          <section style={{ background: sectionBg, borderColor: t.border }} className="border-b">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x" style={{ borderColor: t.border }}>
              {c.stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-6 px-4 text-center">
                  <span style={{ color: t.accent }} className="text-3xl font-bold">{s.value}</span>
                  <span style={{ color: t.textSecondary }} className="mt-1 text-[10px] uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Story */}
          {c.story && (
          <section style={{ background: t.bg }} className="px-6 py-16 sm:px-10">
            <div className="max-w-2xl">
              <FadeIn>
                <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]">
                  Our Story
                </p>
                {c.story.headline && (
                  <h2 style={{ color: t.textPrimary }} className="text-3xl font-bold leading-snug">
                    {c.story.headline}
                  </h2>
                )}
                {c.story.body && (
                  <p style={{ color: t.textSecondary }} className="mt-4 leading-relaxed">
                    {c.story.body}
                  </p>
                )}
              </FadeIn>
            </div>
          </section>
          )}

          {/* Signature Dishes */}
          {c.signatureDishes.length > 0 && (
          <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-16 sm:px-10">
            <FadeIn>
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.featuredSectionLabel}</p>
              <h2 style={{ color: t.textPrimary }} className="mb-10 text-2xl font-bold">{c.terms.featuredSectionSubhead}</h2>
            </FadeIn>
            <StaggerGroup className="grid gap-5 sm:grid-cols-2">
              {c.signatureDishes.map((dish) => (
                <StaggerItem key={dish.name}>
                  <div
                    style={{ background: t.bg, borderColor: t.border }}
                    className={`flex gap-4 overflow-hidden rounded-xl border p-4 ${cardStyle}`}
                  >
                    <div className="relative h-20 w-20 shrink-0">
                      <Image src={img.dish} alt={dish.name} fill className="rounded-lg object-cover" />
                    </div>
                    <div className="min-w-0">
                      {dish.price && (
                        <span style={{ background: t.accent, color: t.accentText }} className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                          {dish.price}
                        </span>
                      )}
                      <h3 style={{ color: t.textPrimary }} className="font-bold text-sm">{dish.name}</h3>
                      <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed line-clamp-2">{dish.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            {c.cta.menuBtn && (
              <div className="mt-8">
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

          {/* Popular Items */}
          {c.popularItems.length > 0 && (
          <section style={{ background: t.bg }} className="px-6 py-16 sm:px-10">
            <FadeIn>
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">{c.terms.popularSectionLabel}</p>
              <h2 style={{ color: t.textPrimary }} className="mb-8 text-2xl font-bold">{c.terms.popularSectionSubhead}</h2>
            </FadeIn>
            <StaggerGroup className="grid gap-4 sm:grid-cols-4">
              {c.popularItems.map((item, i) => (
                <StaggerItem key={`pop-${item.name}-${i}`}>
                  <div style={{ background: sectionBg, borderColor: t.border }} className="overflow-hidden rounded-xl border">
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
          <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-16 sm:px-10">
            <FadeIn>
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Current Offers</p>
              <h2 style={{ color: t.textPrimary }} className="mb-8 text-2xl font-bold">Something Special</h2>
            </FadeIn>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.offers.map((o, i: number) => (
                <div key={i} style={{ background: t.bg, borderColor: t.border }} className="overflow-hidden rounded-xl border p-5">
                  {o.title && <h3 style={{ color: t.textPrimary }} className="font-bold">{o.title}</h3>}
                  {o.description && <p style={{ color: t.textSecondary }} className="mt-2 text-sm">{o.description}</p>}
                  {(o.offer_value || o.badge_text) && <span style={{ background: t.accent, color: t.accentText }} className="mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold">{o.badge_text || `${o.offer_value} OFF`}</span>}
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Gallery */}
          {c.gallery.length > 0 && (
          <section style={{ background: t.bg }} className="px-6 py-16 sm:px-10">
            <FadeIn>
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Gallery</p>
              <h2 style={{ color: t.textPrimary }} className="mb-8 text-2xl font-bold">A Taste of the Experience</h2>
            </FadeIn>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {galleryImages.map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-xl aspect-square">
                  <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover transition-transform duration-500 hover:scale-110" />
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Google Reviews */}
          {c.googleReviews.length > 0 && (
          <section style={{ background: sectionBg, borderColor: t.border }} className="border-y px-6 py-16 sm:px-10">
            <FadeIn>
              <p style={{ color: t.accent }} className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]">Google Reviews</p>
              <h2 style={{ color: t.textPrimary }} className="mb-8 text-2xl font-bold">What People Are Saying</h2>
            </FadeIn>
            <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.googleReviews.slice(0, 6).map((r) => (
                <StaggerItem key={r.id}>
                  <ReviewCard review={r} t={{ ...t, surface: t.bg }} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
          )}

          {/* Hours full + FAQ */}
          {(c.hours.length > 0 || c.faqs.length > 0) && (
          <section style={{ background: t.bg }} className="px-6 py-16 sm:px-10">
            <div className="grid gap-12 sm:grid-cols-2">
              {c.hours.length > 0 && (
              <div>
                <FadeIn>
                  <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]">Opening Hours</p>
                  <h2 style={{ color: t.textPrimary }} className="mb-5 text-xl font-bold">When We&apos;re Open</h2>
                  <div className="space-y-2">
                    {c.hours.map((h) => (
                      <div key={h.day} className="flex justify-between border-b pb-2 text-sm" style={{ borderColor: t.border }}>
                        <span style={{ color: t.textPrimary }} className="font-medium">{h.day}</span>
                        {h.startTime && h.endTime ? (
                          <span style={{ color: t.textSecondary }}>
                            <time dateTime={h.startTime}>{h.hours.split(" — ")[0]}</time>
                            {" — "}
                            <time dateTime={h.endTime}>{h.hours.split(" — ")[1]}</time>
                          </span>
                        ) : (
                          <span style={{ color: t.textSecondary }}>{h.hours}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>
              )}
              {c.faqs.length > 0 && (
              <div>
                <FadeIn delay={0.1}>
                  <p style={{ color: t.accent }} className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]">FAQ</p>
                  <h2 style={{ color: t.textPrimary }} className="mb-5 text-xl font-bold">Common Questions</h2>
                  <div className="space-y-4">
                    {c.faqs.map((f, i) => (
                      <div key={`${f.q}-${i}`} style={{ background: sectionBg, borderColor: t.border }} className="rounded-xl border p-4">
                        <h3 style={{ color: t.textPrimary }} className="text-sm font-bold">{f.q}</h3>
                        <p style={{ color: t.textSecondary }} className="mt-1 text-xs leading-relaxed">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              </div>
              )}
            </div>
          </section>
          )}

          {/* Footer */}
          <footer style={{ background: footerBg, borderColor: t.border }} className="border-t px-6 py-8 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p style={{ color: t.accentText }} className="font-bold">{c.businessName}</p>
                {c.slogan && (
                  <p style={{ color: `${t.accentText}66` }} className="text-xs">{c.slogan}</p>
                )}
              </div>
              <p style={{ color: `${t.accentText}44` }} className="text-[10px]">
                © {new Date().getFullYear()} {c.businessName}
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
