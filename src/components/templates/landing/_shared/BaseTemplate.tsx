"use client";

import Image from "next/image";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "./defaults";
import { getThemeImages } from "./themeImages";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { GoogleReviewsSection } from "./structures/sections";

function GoogleFont({ fontFamily }: { fontFamily: string }) {
  const name = fontFamily.match(/"([^"]+)"/)?.[1];
  if (!name) return null;
  const family = encodeURIComponent(name).replace(/%20/g, '+');
  return (
    <link
      rel="stylesheet"
      href={`https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`}
      // React 18 stylesheet hoisting
      precedence="default"
    />
  );
}
import {
  FadeIn,
  StaggerGroup,
  StaggerItem,
  ParallaxImage,
  Marquee,
  TiltCard,
  FloatingBlob,
} from "./animations";

export interface ThemeConfig {
  slug: string;
  // Colours
  bg: string; // page background
  surface: string; // card/section background
  border: string; // border colour
  textPrimary: string; // main heading colour
  textSecondary: string; // body text colour
  accent: string; // highlight / accent colour
  accentText: string; // text on accent background
  heroOverlay: string; // hero gradient overlay
  // Typography
  fontFamily: string;
  headingClass?: string;
  // Decoration
  marqueeText?: string;
  badge?: string; // small label above hero title
  heroTagline?: string;
  footerBg?: string;
  divider?: string; // decorative divider between sections
  cardStyle?: string; // extra classes for dish cards
  sectionBg?: string; // alternating section backgrounds
}

interface Props extends LandingTemplateProps {
  theme: ThemeConfig;
}

export default function BaseTemplate({ theme: themeConfig, ...p }: Props) {
  const c = getRichContent(p.data, themeConfig.slug);

  // Merge all user-saved values from DB over the template's hardcoded defaults.
  const t: ThemeConfig = {
    ...themeConfig,
    // Core colours (always present)
    accent:        c.colors.primary       || themeConfig.accent,
    surface:       c.colors.secondary     || themeConfig.surface,
    bg:            c.colors.accent        || themeConfig.bg,
    // Extended colours (use DB value when non-empty)
    textPrimary:   c.colors.textPrimary   || themeConfig.textPrimary,
    textSecondary: c.colors.textSecondary || themeConfig.textSecondary,
    accentText:    c.colors.accentText    || themeConfig.accentText,
    border:        c.colors.borderColor   || themeConfig.border,
    footerBg:      c.colors.footerBg      || (themeConfig.footerBg  ?? themeConfig.bg),
    sectionBg:     c.colors.sectionBg     || (themeConfig.sectionBg ?? themeConfig.surface),
    // Typography & decoration
    fontFamily:    c.theme.fontFamily     || themeConfig.fontFamily,
    cardStyle:     c.theme.cardStyle      || (themeConfig.cardStyle  ?? 'rounded-2xl'),
    heroOverlay:   c.theme.heroOverlay    || themeConfig.heroOverlay,
    headingClass:  c.theme.headingClass   || themeConfig.headingClass,
    badge:         c.theme.badge          || themeConfig.badge,
    marqueeText:   c.theme.marqueeText    || themeConfig.marqueeText,
    heroTagline:   c.theme.heroTagline    || themeConfig.heroTagline,
  };

  const img = getThemeImages(t.slug);
  const galleryImages = c.gallery.slice(0, 6).map((g) => g.image_url as string);
  const footerBg = t.footerBg ?? t.bg;
  const sectionBg = t.sectionBg ?? t.surface;
  const cardStyle = t.cardStyle ?? "";

  return (
    <>
    <GoogleFont fontFamily={t.fontFamily} />
    <div
      style={{
        fontFamily: t.fontFamily,
        backgroundColor: t.bg,
        color: t.textSecondary,
      }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* ── Announcement ──────────────────────────────────────────────── */}
      {c.announcement && (
        <div
          style={{ background: t.border, color: t.textPrimary }}
          className="px-4 py-2 text-center text-xs font-semibold tracking-widest uppercase"
        >
          {c.announcement}
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      {/* Real tenant imagery (banner upload, then first gallery photo) always wins
          over the theme's generic stock photo — and this is the only full-width
          hero image, so a banner never renders twice (once here, once in a
          separate strip above it). */}
      <ParallaxImage
        src={c.bannerUrl || c.gallery[0]?.image_url || img.hero}
        alt={c.businessName}
        className="relative h-[100svh] min-h-[620px] w-full"
        speed={0.45}
        scale={1.25}
        overlay={
          <div
            className="absolute inset-0"
            style={{ background: t.heroOverlay }}
          />
        }
      >
        <div className="flex h-full items-center px-5 sm:px-10">
          <div className="mx-auto w-full max-w-5xl text-center text-white">
            <FadeIn>
              {c.logoUrl && (
                <div className="relative mx-auto mb-4 h-16 w-16 sm:h-20 sm:w-20">
                  <Image
                    src={c.logoUrl}
                    alt={`${c.businessName} logo`}
                    fill
                    className="rounded-full border-2 border-white/70 object-cover shadow-lg"
                  />
                </div>
              )}
              {t.badge && (
                <span
                  style={{ background: t.accent, color: t.accentText }}
                  className="inline-block mb-4 rounded-full px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em]"
                >
                  {t.badge}
                </span>
              )}
            </FadeIn>
            <FadeIn delay={0.15} y={30}>
              <h1
                style={{
                  color:
                    t.textPrimary === "#ffffff" || t.bg === "#000000"
                      ? "#ffffff"
                      : "white",
                }}
                className={`text-5xl font-bold leading-tight sm:text-7xl md:text-8xl ${t.headingClass ?? ""}`}
              >
                {c.businessName}
              </h1>
            </FadeIn>
            {(t.heroTagline || c.slogan) && (
            <FadeIn delay={0.3}>
              <p className="mt-4 text-lg font-light tracking-widest text-white/80 uppercase sm:text-xl">
                {t.heroTagline || c.slogan}
              </p>
            </FadeIn>
            )}
            <FadeIn delay={0.5}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {c.cta.menuBtn && (
                  <p.LinkComponent
                    to={p.menuHref}
                    style={{ background: t.accent, color: t.accentText }}
                    className="rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest transition hover:opacity-90"
                    onClick={() =>
                      p.track("click", "menu_button", { destination: "menu" })
                    }
                  >
                    {c.terms.ctaLabel}
                  </p.LinkComponent>
                )}
                {c.cta.payBtn && c.cta.paymentLink && (
                  <button
                    onClick={p.onPay}
                    className="rounded-full border-2 border-white/60 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Pay bill
                  </button>
                )}
                {c.cta.reviewBtn && c.cta.reviewLink && (
                  <button
                    onClick={p.onReview}
                    className="rounded-full border-2 border-white/40 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white/80 backdrop-blur transition hover:bg-white/15"
                  >
                    Leave Review
                  </button>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </ParallaxImage>

      {/* ── Marquee Banner ────────────────────────────────────────────── */}
      <div
        style={{ background: t.accent, color: t.accentText }}
        className="py-3"
      >
        <Marquee speed={28}>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-sm font-bold uppercase tracking-widest"
            >
              ✦ {t.marqueeText ?? c.businessName}{c.slogan ? ` ✦ ${c.slogan}` : ""}
            </span>
          ))}
        </Marquee>
      </div>

      

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      {c.stats.length > 0 && (
      <section
        style={{ background: sectionBg, borderColor: t.border }}
        className="border-y"
      >
        <div
          className="mx-auto grid max-w-5xl grid-cols-2 divide-x sm:grid-cols-4"
          style={{ borderColor: t.border }}
        >
          {c.stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-6 px-4 text-center"
            >
              <span
                style={{ color: t.accent }}
                className="text-3xl font-bold sm:text-4xl"
              >
                {s.value}
              </span>
              <span
                style={{ color: t.textSecondary }}
                className="mt-1 text-xs uppercase tracking-widest"
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      {c.story && (
      <section style={{ background: t.bg }} className="px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl lg:flex lg:items-center lg:gap-14">
          <div className="lg:w-1/2">
            <FadeIn>
              <p
                style={{ color: t.accent }}
                className="mb-3 text-xs font-bold uppercase tracking-[0.4em]"
              >
                Our Story
              </p>
              {c.story.headline && (
              <h2
                style={{ color: t.textPrimary }}
                className={`text-3xl font-bold leading-snug sm:text-4xl ${t.headingClass ?? ""}`}
              >
                {c.story.headline}
              </h2>
              )}
              {c.story.body && (
              <p
                style={{ color: t.textSecondary }}
                className="mt-5 leading-relaxed"
              >
                {c.story.body}
              </p>
              )}
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-4">
                {c.cta.menuBtn && (
                  <p.LinkComponent
                    to={p.menuHref}
                    style={{ background: t.accent, color: t.accentText }}
                    className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-85"
                    onClick={() =>
                      p.track("click", "menu_button", { destination: "menu" })
                    }
                  >
                    {c.terms.ctaLabel}
                  </p.LinkComponent>
                )}
              </div>
            </FadeIn>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
              <Image
                src={img.scene}
                alt={c.terms.heroAlt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── Featured Items ────────────────────────────────────────────── */}
      {c.signatureDishes.length > 0 && (
      <section
        style={{ background: sectionBg, borderColor: t.border }}
        className="border-y px-5 py-20 sm:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p
              style={{ color: t.accent }}
              className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]"
            >
              {c.terms.featuredSectionLabel}
            </p>
            <h2
              style={{ color: t.textPrimary }}
              className={`text-center text-3xl font-bold sm:text-4xl ${t.headingClass ?? ""}`}
            >
              {c.terms.featuredSectionSubhead}
            </h2>
          </FadeIn>
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.signatureDishes.slice(0, 4).map((dish, i) => (
              <StaggerItem key={`${dish.name}-${i}`}>
                <TiltCard>
                  <div
                    style={{ background: t.bg, borderColor: t.border }}
                    className={`flex h-full flex-col overflow-hidden rounded-xl border p-5 ${cardStyle}`}
                  >
                    <div className="relative mb-4 h-36 overflow-hidden rounded-lg">
                      <Image
                        src={dish.image || img.dish}
                        alt={dish.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    {dish.price && (
                      <span
                        style={{ background: t.accent, color: t.accentText }}
                        className="mb-2 self-start rounded-full px-3 py-0.5 text-xs font-bold"
                      >
                        {dish.price}
                      </span>
                    )}
                    <h3 style={{ color: t.textPrimary }} className="font-bold">
                      {dish.name}
                    </h3>
                    <p
                      style={{ color: t.textSecondary }}
                      className="mt-1 text-sm leading-relaxed"
                    >
                      {dish.description}
                    </p>
                    {c.cta.menuBtn && (
                      <p.LinkComponent
                        to={p.menuHref}
                        style={{ color: t.accent }}
                        className="mt-auto pt-3 text-xs font-bold uppercase tracking-wider hover:underline"
                        onClick={() =>
                          p.track("click", "dish_card", { dish: dish.name })
                        }
                      >
                        {c.terms.ctaLabel} →
                      </p.LinkComponent>
                    )}
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
      )}

      {/* ── Popular Items ─────────────────────────────────────────────── */}
      {c.popularItems.length > 0 && (
        <section style={{ background: t.bg }} className="px-5 py-20 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <p
                style={{ color: t.accent }}
                className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]"
              >
                {c.terms.popularSectionLabel}
              </p>
              <h2
                style={{ color: t.textPrimary }}
                className={`text-center text-3xl font-bold sm:text-4xl ${t.headingClass ?? ""}`}
              >
                {c.terms.popularSectionSubhead}
              </h2>
            </FadeIn>
            <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.popularItems.slice(0, 4).map((item, i) => (
                <StaggerItem key={`${item.name}-${i}`}>
                  <TiltCard>
                    <div
                      style={{ background: sectionBg, borderColor: t.border }}
                      className={`flex h-full flex-col overflow-hidden rounded-xl border p-5 ${cardStyle}`}
                    >
                      <div className="relative mb-4 h-36 overflow-hidden rounded-lg">
                        <Image
                          src={item.image || img.dish}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      {item.price && (
                        <span
                          style={{ background: t.accent, color: t.accentText }}
                          className="mb-2 self-start rounded-full px-3 py-0.5 text-xs font-bold"
                        >
                          {item.price}
                        </span>
                      )}
                      <h3 style={{ color: t.textPrimary }} className="font-bold">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p
                          style={{ color: t.textSecondary }}
                          className="mt-1 text-sm leading-relaxed"
                        >
                          {item.description}
                        </p>
                      )}
                      {c.cta.menuBtn && (
                        <p.LinkComponent
                          to={p.menuHref}
                          style={{ color: t.accent }}
                          className="mt-auto pt-3 text-xs font-bold uppercase tracking-wider hover:underline"
                          onClick={() =>
                            p.track("click", "popular_item", { item: item.name })
                          }
                        >
                          Order This →
                        </p.LinkComponent>
                      )}
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── Offers ────────────────────────────────────────────────────── */}
      {c.offers.length > 0 && (
        <section style={{ background: t.bg }} className="px-5 py-16 sm:px-10">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <p
                style={{ color: t.accent }}
                className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]"
              >
                Current Offers
              </p>
              <h2
                style={{ color: t.textPrimary }}
                className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}
              >
                Something Special
              </h2>
            </FadeIn>
            <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.offers.map((o, i: number) => (
                <StaggerItem key={i}>
                  <div
                    style={{ background: sectionBg, borderColor: t.border }}
                    className="overflow-hidden rounded-xl border"
                  >
                    {o.image_url && (
                      <div className="relative h-36 w-full">
                        <Image
                          src={o.image_url}
                          alt={o.title ?? "Offer"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {o.title && (
                        <h3
                          style={{ color: t.textPrimary }}
                          className="font-bold"
                        >
                          {o.title}
                        </h3>
                      )}
                      {o.description && (
                        <p
                          style={{ color: t.textSecondary }}
                          className="mt-2 text-sm"
                        >
                          {o.description}
                        </p>
                      )}
                      {(o.offer_value || o.badge_text) && (
                        <span
                          style={{ background: t.accent, color: t.accentText }}
                          className="mt-3 inline-block rounded-full px-4 py-1 text-xs font-bold"
                        >
                          {o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} OFF`}
                        </span>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── Gallery ───────────────────────────────────────────────────── */}
      {c.gallery.length > 0 && (
      <section
        style={{ background: sectionBg, borderColor: t.border }}
        className="border-y px-5 py-20 sm:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p
              style={{ color: t.accent }}
              className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]"
            >
              Gallery
            </p>
            <h2
              style={{ color: t.textPrimary }}
              className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}
            >
              A Taste of the Experience
            </h2>
          </FadeIn>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryImages.slice(0, 6).map((src, i) => {
              return (
                <div key={i} className="overflow-hidden rounded-xl">
                  <div className="relative h-40 w-full sm:h-56">
                    <Image
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ── Google Reviews ────────────────────────────────────────────── */}
      <GoogleReviewsSection c={c} t={t} />

      {/* ── Hours + Contact ───────────────────────────────────────────── */}
      <section
        style={{ background: sectionBg, borderColor: t.border }}
        className="border-y px-5 py-20 sm:px-10"
      >
        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-14">
          {/* Hours */}
          {c.hours.length > 0 && (
          <FadeIn>
            <p
              style={{ color: t.accent }}
              className="mb-3 text-xs font-bold uppercase tracking-[0.4em]"
            >
              Opening Hours
            </p>
            <h2
              style={{ color: t.textPrimary }}
              className={`mb-6 text-2xl font-bold ${t.headingClass ?? ""}`}
            >
              When We&apos;re Open
            </h2>
            <div className="space-y-2">
              {c.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between border-b pb-2 text-sm"
                  style={{ borderColor: t.border }}
                >
                  <span
                    style={{ color: t.textPrimary }}
                    className="font-medium"
                  >
                    {h.day}
                  </span>
                  <span style={{ color: t.textSecondary }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          )}
          {/* Contact */}
          <FadeIn delay={0.2}>
            <div className="mt-12 lg:mt-0">
              <p
                style={{ color: t.accent }}
                className="mb-3 text-xs font-bold uppercase tracking-[0.4em]"
              >
                Find Us
              </p>
              <h2
                style={{ color: t.textPrimary }}
                className={`mb-6 text-2xl font-bold ${t.headingClass ?? ""}`}
              >
                Come Say Hello
              </h2>
              <div className="space-y-4">
                {c.address && (
                  <div>
                    <p
                      style={{ color: t.accent }}
                      className="mb-1 text-xs font-bold uppercase tracking-wider"
                    >
                      Address
                    </p>
                    <p style={{ color: t.textSecondary }} className="text-sm">
                      {c.address}
                    </p>
                    {c.locationUrl && (
                      <a
                        href={c.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: t.accent }}
                        className="mt-1 inline-block text-xs font-bold uppercase tracking-wider hover:underline"
                      >
                        Get Directions →
                      </a>
                    )}
                  </div>
                )}
                {c.phone && (
                  <div>
                    <p
                      style={{ color: t.accent }}
                      className="mb-1 text-xs font-bold uppercase tracking-wider"
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${c.phone}`}
                      style={{ color: t.textPrimary }}
                      className="text-sm font-medium hover:underline"
                    >
                      {c.phone}
                    </a>
                  </div>
                )}
                {c.email && (
                  <div>
                    <p
                      style={{ color: t.accent }}
                      className="mb-1 text-xs font-bold uppercase tracking-wider"
                    >
                      Email
                    </p>
                    <a
                      href={`mailto:${c.email}`}
                      style={{ color: t.textPrimary }}
                      className="text-sm font-medium hover:underline"
                    >
                      {c.email}
                    </a>
                  </div>
                )}
                {c.whatsapp && (
                  <div>
                    <p
                      style={{ color: t.accent }}
                      className="mb-1 text-xs font-bold uppercase tracking-wider"
                    >
                      WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: t.textPrimary }}
                      className="text-sm font-medium hover:underline"
                    >
                      {c.whatsapp}
                    </a>
                  </div>
                )}
                {c.social.length > 0 && (
                  <div>
                    <p
                      style={{ color: t.accent }}
                      className="mb-2 text-xs font-bold uppercase tracking-wider"
                    >
                      Follow Us
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {c.social.map((s) => (
                        <a
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: t.accent, color: t.accentText }}
                          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider hover:opacity-80"
                        >
                          <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                          {getSocialPlatformLabel(s.platform, s.name)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                {c.cta.payBtn && c.cta.paymentLink && (
                  <button
                    onClick={p.onPay}
                    style={{ background: t.accent, color: t.accentText }}
                    className="rounded-full px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-85"
                  >
                    Pay bill
                  </button>
                )}
                {c.cta.reviewBtn && c.cta.reviewLink && (
                  <button
                    onClick={p.onReview}
                    style={{ borderColor: t.accent, color: t.accent }}
                    className="rounded-full border-2 px-7 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:opacity-70"
                  >
                    Write a Review
                  </button>
                )}
              </div>
              {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage && (
                <div className="mt-6">
                  <p
                    style={{ color: t.accent }}
                    className="mb-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Scan to Pay
                  </p>
                  <div
                    className="relative h-40 w-40 rounded-lg border object-contain p-2"
                    style={{ borderColor: t.border, background: t.bg }}
                  >
                    <Image
                      src={c.cta.paymentQrImage}
                      alt="Payment QR code"
                      fill
                      className="rounded-lg object-contain p-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      {c.faqs.length > 0 && (
      <section style={{ background: t.bg }} className="px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p
              style={{ color: t.accent }}
              className="mb-2 text-center text-xs font-bold uppercase tracking-[0.4em]"
            >
              FAQ
            </p>
            <h2
              style={{ color: t.textPrimary }}
              className={`text-center text-3xl font-bold ${t.headingClass ?? ""}`}
            >
              Common Questions
            </h2>
          </FadeIn>
          <div className="mt-10 space-y-4">
            {c.faqs.map((f, i) => (
              <FadeIn key={`${f.q}-${i}`} delay={i * 0.07}>
                <div
                  style={{ background: sectionBg, borderColor: t.border }}
                  className="rounded-xl border p-6"
                >
                  <h3 style={{ color: t.textPrimary }} className="font-bold">
                    {f.q}
                  </h3>
                  <p
                    style={{ color: t.textSecondary }}
                    className="mt-2 text-sm leading-relaxed"
                  >
                    {f.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer
        style={{ background: footerBg, borderColor: t.border }}
        className="border-t px-5 py-10 sm:px-10"
      >
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div>
            <p
              style={{ color: t.textPrimary }}
              className={`text-lg font-bold ${t.headingClass ?? ""}`}
            >
              {c.businessName}
            </p>
            {c.slogan && (
              <p style={{ color: t.textSecondary }} className="mt-1 text-xs">
                {c.slogan}
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs">
            {c.cta.menuBtn && (
              <p.LinkComponent
                to={p.menuHref}
                style={{ color: t.accent }}
                className="font-bold uppercase tracking-wider hover:underline"
                onClick={() => p.track("click", "footer_menu", {})}
              >
                {c.terms.catalogLabel}
              </p.LinkComponent>
            )}
            {c.phone && (
              <a
                href={`tel:${c.phone}`}
                style={{ color: t.textSecondary }}
                className="hover:underline"
              >
                {c.phone}
              </a>
            )}
            {c.websiteHref && (
              <a
                href={c.websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.textSecondary }}
                className="hover:underline"
              >
                Website
              </a>
            )}
          </div>
        </div>
        <p
          style={{ color: t.textSecondary }}
          className="mt-8 text-center text-[10px] opacity-50"
        >
          © {new Date().getFullYear()} {c.businessName}. All rights reserved.
        </p>
      </footer>
    </div>
    </>
  );
}
