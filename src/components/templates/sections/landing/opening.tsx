"use client";

import Image from "next/image";
import { FadeIn, Marquee, ParallaxImage } from "@/components/templates/landing/_shared/animations";
import type { LandingSectionProps } from "../types";

export function AnnouncementSection({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <div
      style={{ background: t.border, color: t.textPrimary }}
      className="px-4 py-2 text-center text-xs font-semibold tracking-widest uppercase"
    >
      {c.announcement}
    </div>
  );
}

/**
 * Variants: "full" (default, full-screen photo), "banner" (same, about half
 * height), "split" (text on the page colour beside the photo).
 */
export function HeroSection({ ctx, section }: LandingSectionProps) {
  if (section.variant === "split") return <SplitHero ctx={ctx} section={section} />;
  const { c, t, img, p } = ctx;
  const height = section.variant === "banner" ? "h-[55svh] min-h-[380px]" : "h-[100svh] min-h-[620px]";
  // Real tenant imagery (banner upload, then first gallery photo) always wins
  // over the theme's generic stock photo.
  return (
    <ParallaxImage
      src={c.bannerUrl || c.gallery[0]?.image_url || img.hero}
      alt={c.businessName}
      className={`relative ${height} w-full`}
      speed={0.45}
      scale={1.25}
      overlay={<div className="absolute inset-0" style={{ background: t.heroOverlay }} />}
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
              style={{ color: t.textPrimary === "#ffffff" || t.bg === "#000000" ? "#ffffff" : "white" }}
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
                  onClick={() => p.track("click", "menu_button", { destination: "menu" })}
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
  );
}

function SplitHero({ ctx: { c, t, img, p } }: LandingSectionProps) {
  return (
    <section style={{ background: t.bg }} className="px-5 py-14 sm:px-10 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <FadeIn>
          {c.logoUrl && (
            <div className="relative mb-5 h-16 w-16">
              <Image src={c.logoUrl} alt={`${c.businessName} logo`} fill className="rounded-full object-cover" />
            </div>
          )}
          {t.badge && (
            <span
              style={{ background: t.accent, color: t.accentText }}
              className="mb-4 inline-block rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em]"
            >
              {t.badge}
            </span>
          )}
          <h1 style={{ color: t.textPrimary }} className={`text-4xl font-bold leading-tight sm:text-6xl ${t.headingClass ?? ""}`}>
            {c.businessName}
          </h1>
          {(t.heroTagline || c.slogan) && (
            <p style={{ color: t.textSecondary }} className="mt-4 text-lg">
              {t.heroTagline || c.slogan}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {c.cta.menuBtn && (
              <p.LinkComponent
                to={p.menuHref}
                style={{ background: t.accent, color: t.accentText }}
                className="rounded-full px-7 py-3 text-sm font-bold uppercase tracking-widest transition hover:opacity-90"
                onClick={() => p.track("click", "menu_button", { destination: "menu" })}
              >
                {c.terms.ctaLabel}
              </p.LinkComponent>
            )}
            {c.cta.payBtn && c.cta.paymentLink && (
              <button
                onClick={p.onPay}
                style={{ borderColor: t.accent, color: t.accent }}
                className="rounded-full border-2 px-7 py-3 text-sm font-bold uppercase tracking-widest transition hover:opacity-80"
              >
                Pay bill
              </button>
            )}
            {c.cta.reviewBtn && c.cta.reviewLink && (
              <button
                onClick={p.onReview}
                style={{ borderColor: t.border, color: t.textPrimary }}
                className="rounded-full border-2 px-7 py-3 text-sm font-bold uppercase tracking-widest transition hover:opacity-80"
              >
                Leave Review
              </button>
            )}
          </div>
        </FadeIn>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/6]">
          <Image
            src={c.bannerUrl || c.gallery[0]?.image_url || img.hero}
            alt={c.businessName}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function MarqueeSection({ ctx: { c, t } }: LandingSectionProps) {
  return (
    <div style={{ background: t.accent, color: t.accentText }} className="py-3">
      <Marquee speed={28}>
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-8 text-sm font-bold uppercase tracking-widest">
            ✦ {t.marqueeText ?? c.businessName}{c.slogan ? ` ✦ ${c.slogan}` : ""}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
