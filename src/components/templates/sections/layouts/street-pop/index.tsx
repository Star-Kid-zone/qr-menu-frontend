"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { IntroSection } from "../../landing/intro";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";

/*
 * Street Pop — loud street-food energy: chunky uppercase type, thick outlines,
 * hard offset shadows, tilted stickers, zigzag edges, halftone dots, coupons.
 * All colour comes from the owner's theme; outlines and shadows use the
 * theme's primary text colour so they hold up on light and dark palettes.
 */

const ink = (ctx: LandingSectionContext) => ctx.t.textPrimary;
const hard = (ctx: LandingSectionContext, n = 6) => `${n}px ${n}px 0 ${ink(ctx)}`;
const H = "uppercase font-black tracking-tight leading-[0.9]";

/* ── ornaments ──────────────────────────────────────────────────────────── */
function Zigzag({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" className={`block h-3 w-full ${flip ? "rotate-180" : ""}`}>
      <path d="M0 12 L0 6 L5 0 L10 6 L15 0 L20 6 L25 0 L30 6 L35 0 L40 6 L45 0 L50 6 L55 0 L60 6 L65 0 L70 6 L75 0 L80 6 L85 0 L90 6 L95 0 L100 6 L105 0 L110 6 L115 0 L120 6 L120 12 Z" fill={color} />
    </svg>
  );
}

function Halftone({ id, color, opacity = 0.18 }: { id: string; color: string; opacity?: number }) {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ color, opacity }}>
      <defs>
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Burst({ className = "", children, ctx }: { className?: string; children: ReactNode; ctx: LandingSectionContext }) {
  // Starburst sticker: SVG shape behind centred text.
  const pts = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 ? 38 : 50;
    const a = (i / 24) * Math.PI * 2;
    // Rounded: trig results can differ in the last digit between Node and the browser (hydration mismatch).
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <polygon points={pts} fill={ctx.t.accent} stroke={ink(ctx)} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span className={`relative px-4 text-center text-sm ${H}`} style={{ color: ctx.t.accentText }}>{children}</span>
    </div>
  );
}

function Scissors() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.6 7.6L20 18M8.6 16.4L20 6" />
    </svg>
  );
}

function StarRow({ rating, color }: { rating: number; color: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill={i <= Math.round(rating) ? color : "none"} stroke={color} strokeWidth={2} strokeLinejoin="round">
          <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.8 6.6 19.6l1.1-6L3.2 9.4l6.1-.8z" />
        </svg>
      ))}
    </span>
  );
}

/* ── building blocks ────────────────────────────────────────────────────── */
function Block({ ctx, children, bg, className = "", id }: { ctx: LandingSectionContext; children: ReactNode; bg?: string; className?: string; id?: string }) {
  return (
    <section className={`relative px-4 py-14 sm:px-8 ${className}`} style={{ background: bg ?? ctx.t.bg }} aria-labelledby={id}>
      <div className="relative mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function Title({ ctx, children, id, sticker }: { ctx: LandingSectionContext; children: ReactNode; id?: string; sticker?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      <h2 id={id} className={`text-4xl sm:text-6xl ${H} ${ctx.t.headingClass ?? ""}`} style={{ color: ink(ctx) }}>{children}</h2>
      {sticker ? (
        <span className={`-rotate-3 rounded-md border-[3px] px-3 py-1 text-sm ${H}`} style={{ borderColor: ink(ctx), background: ctx.t.accent, color: ctx.t.accentText, boxShadow: hard(ctx, 3) }}>
          {sticker}
        </span>
      ) : null}
    </div>
  );
}

function Chunky({ ctx, children, onClick, to, tone = "accent", track }: { ctx: LandingSectionContext; children: ReactNode; onClick?: () => void; to?: string; tone?: "accent" | "paper"; track?: string }) {
  const { t, p } = ctx;
  const style = {
    background: tone === "accent" ? t.accent : t.surface,
    color: tone === "accent" ? t.accentText : ink(ctx),
    borderColor: ink(ctx),
    boxShadow: hard(ctx, 4),
  };
  const cls = `inline-flex items-center gap-2 rounded-lg border-[3px] px-5 py-3 text-base ${H} motion-safe:transition-transform hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4`;
  if (to) {
    return (
      <p.LinkComponent to={to} style={style} className={cls} onClick={() => track && p.track("click", track, {})}>
        {children}
      </p.LinkComponent>
    );
  }
  return (
    <button type="button" onClick={onClick} style={style} className={cls}>
      {children}
    </button>
  );
}

/* ── frame ──────────────────────────────────────────────────────────────── */
function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: t.bg }}>
      <header className="sticky top-0 z-40 border-b-[3px]" style={{ background: t.surface, borderColor: ink(ctx) }}>
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-8">
          <a href="#top" className={`mr-auto flex min-w-0 items-center gap-2 text-xl ${H} focus-visible:outline-2`} style={{ color: ink(ctx) }}>
            {c.logoUrl ? (
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full border-[3px]" style={{ borderColor: ink(ctx) }}>
                <Image src={c.logoUrl} alt="" fill sizes="40px" className="object-cover" />
              </span>
            ) : null}
            <span className="truncate">{c.businessName}</span>
          </a>
          <ul className="hidden items-center gap-2 lg:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block rounded-md border-2 px-3 py-1.5 text-sm ${H} hover:-translate-y-0.5 motion-safe:transition-transform focus-visible:outline-2`}
                  style={{ borderColor: ink(ctx), color: ink(ctx), background: t.bg }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {c.cta.menuBtn ? (
            <p.LinkComponent
              to={p.menuHref}
              onClick={() => p.track("click", "menu_button", {})}
              className={`hidden rounded-md border-[3px] px-4 py-2 text-sm sm:inline-block ${H}`}
              style={{ background: t.accent, color: t.accentText, borderColor: ink(ctx), boxShadow: hard(ctx, 3) }}
            >
              {c.terms.ctaLabel}
            </p.LinkComponent>
          ) : null}
          <button
            type="button"
            className={`rounded-md border-[3px] px-3 py-2 text-sm lg:hidden ${H}`}
            style={{ borderColor: ink(ctx), color: ink(ctx), background: t.bg }}
            aria-expanded={open}
            aria-controls="pop-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
        {open ? (
          <ul id="pop-mobile-nav" className="grid grid-cols-2 gap-2 border-t-[3px] p-3 lg:hidden" style={{ borderColor: ink(ctx), background: t.surface }}>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)} className={`block rounded-md border-2 px-3 py-2 text-sm ${H}`} style={{ borderColor: ink(ctx), color: ink(ctx), background: t.bg }}>
                  {item.label}
                </a>
              </li>
            ))}
            {c.cta.menuBtn ? (
              <li className="col-span-2">
                <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", "menu_button", {})} className={`block rounded-md border-[3px] px-3 py-2 text-center text-sm ${H}`} style={{ background: t.accent, color: t.accentText, borderColor: ink(ctx) }}>
                  {c.terms.ctaLabel}
                </p.LinkComponent>
              </li>
            ) : null}
          </ul>
        ) : null}
      </header>
      <main id="top">{children}</main>
    </div>
  );
}

/* ── sections ───────────────────────────────────────────────────────────── */
function Announcement({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (!c.announcement) return null;
  return (
    <p className={`border-b-[3px] px-4 py-2 text-center text-sm ${H}`} style={{ background: t.accent, color: t.accentText, borderColor: ink(ctx) }}>
      {c.announcement}
    </p>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const photo = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-8 sm:pt-14" style={{ background: t.sectionBg ?? t.surface }}>
      <Halftone id="pop-hero-dots" color={ink(ctx)} opacity={0.12} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          {c.logoUrl ? (
            <span className="relative mb-5 block size-16 overflow-hidden rounded-full border-[3px]" style={{ borderColor: ink(ctx), boxShadow: hard(ctx, 3) }}>
              <Image src={c.logoUrl} alt={`${c.businessName} logo`} fill sizes="64px" className="object-cover" />
            </span>
          ) : null}
          <h1 className={`break-words text-6xl sm:text-8xl lg:text-9xl ${H} ${t.headingClass ?? ""}`} style={{ color: ink(ctx), textShadow: `4px 4px 0 ${t.accent}` }}>
            {c.businessName}
          </h1>
          {tagline ? <p className="mt-6 max-w-lg text-xl font-semibold" style={{ color: t.textSecondary }}>{tagline}</p> : null}
          <div className="mt-8 flex flex-wrap gap-4">
            {c.cta.menuBtn ? <Chunky ctx={ctx} to={p.menuHref} track="menu_button">{c.terms.ctaLabel}</Chunky> : null}
            {c.cta.payBtn && c.cta.paymentLink ? <Chunky ctx={ctx} tone="paper" onClick={p.onPay}>Pay bill</Chunky> : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? <Chunky ctx={ctx} tone="paper" onClick={p.onReview}>Leave a review</Chunky> : null}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] rotate-2 overflow-hidden rounded-2xl border-[4px]" style={{ borderColor: ink(ctx), boxShadow: hard(ctx, 10) }}>
            <Image src={photo} alt={c.businessName} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          {t.badge ? <Burst ctx={ctx} className="absolute -left-4 -top-6 size-32 -rotate-12 sm:-left-10 sm:size-36">{t.badge}</Burst> : null}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0"><Zigzag color={t.bg} /></div>
    </section>
  );
}

function Marquee({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  const text = t.marqueeText || c.slogan || c.businessName;
  const reps = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="-rotate-1 overflow-hidden border-y-[3px] py-3" style={{ background: t.accent, borderColor: ink(ctx) }}>
      <div className="flex w-max gap-8 whitespace-nowrap motion-safe:animate-[pop-marquee_28s_linear_infinite]">
        {[...reps, ...reps].map((_, i) => (
          <span key={i} className={`flex items-center gap-8 text-3xl sm:text-4xl ${H}`} style={{ color: t.accentText }} aria-hidden={i >= reps.length || undefined}>
            {text}
            <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true" fill="currentColor"><path d="M12 2l2.5 7H22l-6 4.5 2.3 7.5L12 16.5 5.7 21l2.3-7.5L2 9h7.5z" /></svg>
          </span>
        ))}
      </div>
      <style>{`@keyframes pop-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

function Stats({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.stats.length === 0) return null;
  return (
    <Block ctx={ctx}>
      <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {c.stats.map((s, i) => (
          <li
            key={s.label}
            className={`rounded-xl border-[3px] p-5 text-center ${i % 2 ? "rotate-1" : "-rotate-1"}`}
            style={{ background: i === 0 ? t.accent : t.surface, borderColor: ink(ctx), boxShadow: hard(ctx, 5) }}
          >
            <p className={`text-5xl ${H}`} style={{ color: i === 0 ? t.accentText : ink(ctx) }}><Counter value={s.value} /></p>
            <p className="mt-2 text-sm font-bold" style={{ color: i === 0 ? t.accentText : t.textSecondary }}>{s.label}</p>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <Block ctx={ctx} id="pop-story">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative order-2 md:order-1">
          <div className="relative aspect-square -rotate-2 overflow-hidden rounded-2xl border-[4px]" style={{ borderColor: ink(ctx), boxShadow: hard(ctx, 8) }}>
            <Image src={c.gallery[1]?.image_url || img.scene} alt={c.terms.heroAlt} fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Title ctx={ctx} id="pop-story" sticker="Our story">{c.story.headline || "Who we are"}</Title>
          {c.story.body ? (
            <p className="max-w-prose rounded-xl border-[3px] p-5 text-lg font-medium leading-relaxed" style={{ borderColor: ink(ctx), background: t.surface, color: t.textSecondary }}>
              {c.story.body}
            </p>
          ) : null}
        </div>
      </div>
    </Block>
  );
}

type Dish = { name: string; description?: string; price?: string; image?: string | null };
function StickerGrid({ ctx, items, title, sticker, track, bg }: { ctx: LandingSectionContext; items: Dish[]; title: string; sticker: string; track: string; bg?: string }) {
  const { t, img, p } = ctx;
  return (
    <Block ctx={ctx} bg={bg}>
      <Title ctx={ctx} sticker={sticker}>{title}</Title>
      <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((d, i) => (
          <li
            key={`${d.name}-${i}`}
            className={`relative overflow-visible rounded-2xl border-[3px] ${["-rotate-1", "rotate-1", "rotate-0"][i % 3]}`}
            style={{ background: t.surface, borderColor: ink(ctx), boxShadow: hard(ctx, 6) }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-[13px] border-b-[3px]" style={{ borderColor: ink(ctx) }}>
              <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
            {d.price ? (
              <span
                className={`absolute -right-3 -top-3 rotate-6 rounded-md border-[3px] px-3 py-1 text-lg ${H}`}
                style={{ background: t.accent, color: t.accentText, borderColor: ink(ctx), boxShadow: hard(ctx, 3) }}
              >
                {d.price}
              </span>
            ) : null}
            <div className="p-5">
              <h3 className={`text-2xl ${H}`} style={{ color: ink(ctx) }}>{d.name}</h3>
              {d.description ? <p className="mt-2 text-sm font-medium" style={{ color: t.textSecondary }}>{d.description}</p> : null}
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", track, { item: d.name })}
                className={`mt-4 inline-block border-b-[3px] text-sm ${H}`}
                style={{ color: ink(ctx), borderColor: t.accent }}
              >
                Grab it
              </p.LinkComponent>
            </div>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Signature({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.signatureDishes.length === 0) return null;
  return <StickerGrid ctx={ctx} items={c.signatureDishes} title={c.terms.featuredSectionLabel} sticker={c.terms.featuredSectionSubhead} track="dish_card" />;
}

function Popular({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.popularItems.length === 0) return null;
  return <StickerGrid ctx={ctx} items={c.popularItems} title={c.terms.popularSectionLabel} sticker={c.terms.popularSectionSubhead} track="popular_item" bg={t.sectionBg ?? t.surface} />;
}

function Offers({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.offers.length === 0) return null;
  return (
    <Block ctx={ctx}>
      <Title ctx={ctx} sticker="Clip it">Deals</Title>
      <ul className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {c.offers.map((o, i) => (
          <li key={i} className="relative flex overflow-hidden rounded-xl border-[3px]" style={{ background: t.surface, borderColor: ink(ctx), boxShadow: hard(ctx, 5) }}>
            <div className={`grid w-24 shrink-0 place-items-center border-r-[3px] border-dashed px-2 text-center ${H}`} style={{ background: t.accent, color: t.accentText, borderColor: ink(ctx) }}>
              {(() => {
                const stub = o.badge_text || (o.offer_value ? `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""}` : "Deal");
                // The stub is narrow: long words ("Tuesdays") step down a size and may wrap instead of clipping.
                const size = stub.length <= 5 ? "text-2xl" : stub.length <= 8 ? "text-base" : "text-sm";
                return <span className={`${size} leading-tight [overflow-wrap:anywhere]`}>{stub}</span>;
              })()}
            </div>
            <div className="min-w-0 flex-1 p-5">
              {o.image_url ? (
                <div className="relative mb-3 h-28 overflow-hidden rounded-md border-2" style={{ borderColor: ink(ctx) }}>
                  <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="(min-width: 1024px) 25vw, 70vw" className="object-cover" />
                </div>
              ) : null}
              {o.title ? <h3 className={`text-xl ${H}`} style={{ color: ink(ctx) }}>{o.title}</h3> : null}
              {o.description ? <p className="mt-2 text-sm font-medium" style={{ color: t.textSecondary }}>{o.description}</p> : null}
            </div>
            <span className="absolute left-[5.4rem] top-1 -rotate-90" style={{ color: ink(ctx) }}><Scissors /></span>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Gallery({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.gallery.length === 0) return null;
  const rot = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
  return (
    <Block ctx={ctx} bg={t.sectionBg ?? t.surface} className="overflow-hidden">
      <Halftone id="pop-gallery-dots" color={ink(ctx)} opacity={0.08} />
      <Title ctx={ctx} sticker="Snaps">Gallery</Title>
      <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {c.gallery.slice(0, 8).map((g, i) => (
          <li key={i} className={`relative aspect-square overflow-hidden rounded-xl border-[3px] ${rot[i % 4]}`} style={{ borderColor: ink(ctx), boxShadow: hard(ctx, 4) }}>
            <Image src={g.image_url as string} alt={`${c.businessName} photo ${i + 1}`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  return (
    <Block ctx={ctx}>
      <Title ctx={ctx} sticker="Real talk">Word on the street</Title>
      <ul className="grid gap-8 md:grid-cols-3">
        {c.googleReviews.slice(0, 6).map((r, i) => (
          <li key={r.id} className={i % 2 ? "md:translate-y-6" : ""}>
            <figure>
              <blockquote className="relative rounded-2xl border-[3px] p-5" style={{ background: i === 0 ? t.accent : t.surface, borderColor: ink(ctx), boxShadow: hard(ctx, 4) }}>
                <StarRow rating={r.rating} color={i === 0 ? t.accentText : t.accent} />
                {r.text ? <p className="mt-3 text-lg font-bold leading-snug" style={{ color: i === 0 ? t.accentText : ink(ctx) }}>{r.text}</p> : null}
                <svg aria-hidden="true" viewBox="0 0 30 20" className="absolute -bottom-[18px] left-8 h-5 w-8">
                  <path d="M0 0 L30 0 L6 20 Z" fill={i === 0 ? t.accent : t.surface} stroke={ink(ctx)} strokeWidth="3" strokeLinejoin="round" />
                  <path d="M2 0 L28 0" stroke={i === 0 ? t.accent : t.surface} strokeWidth="4" />
                </svg>
              </blockquote>
              <figcaption className="mt-6 pl-4 text-sm font-bold" style={{ color: t.textSecondary }}>
                <span style={{ color: ink(ctx) }}>{r.authorName}</span>
                {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {c.cta.reviewBtn && c.cta.reviewLink ? (
        <div className="mt-12"><Chunky ctx={ctx} onClick={p.onReview}>Write a review</Chunky></div>
      ) : null}
    </Block>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  const box = { borderColor: ink(ctx), boxShadow: hard(ctx, 5), background: t.surface };
  const link = "font-bold underline decoration-[3px] underline-offset-4 focus-visible:outline-2";
  // Each box only when it has something in it; the grid takes as many columns as there are boxes.
  const findUs = Boolean(c.address || c.locationUrl || c.phone || c.email || c.whatsapp);
  const qr = c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage;
  const extras = Boolean(c.social.length || (c.cta.payBtn && c.cta.paymentLink) || (c.cta.reviewBtn && c.cta.reviewLink) || qr);
  const boxes = (c.hours.length > 0 ? 1 : 0) + (findUs ? 1 : 0) + (extras ? 1 : 0);
  if (boxes === 0) return null;
  const cols = boxes === 3 ? "md:grid-cols-3" : boxes === 2 ? "md:grid-cols-2" : "max-w-xl";
  return (
    <Block ctx={ctx} bg={t.sectionBg ?? t.surface}>
      <Title ctx={ctx} sticker="Pull up">Come eat</Title>
      <div className={`grid grid-cols-1 gap-6 ${cols}`}>
        {c.hours.length > 0 ? (
          <div className="rounded-xl border-[3px] p-5" style={box}>
            <h3 className={`mb-3 text-2xl ${H}`} style={{ color: ink(ctx) }}>Hours</h3>
            <dl className="space-y-1.5 font-semibold">
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-3" style={{ color: t.textSecondary }}>
                  <dt style={{ color: ink(ctx) }}>{h.day}</dt>
                  <dd>{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        {findUs ? (
        <div className="rounded-xl border-[3px] p-5" style={{ ...box, background: t.accent, color: t.accentText }}>
          <h3 className={`mb-3 text-2xl ${H}`}>Find us</h3>
          {c.address ? <p className="text-lg font-bold">{c.address}</p> : null}
          {c.locationUrl ? (
            <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block ${link}`}>Get directions</a>
          ) : null}
          <ul className="mt-4 space-y-1">
            {c.phone ? <li><a href={`tel:${c.phone}`} className={link}>{c.phone}</a></li> : null}
            {c.email ? <li><a href={`mailto:${c.email}`} className={link}>{c.email}</a></li> : null}
            {c.whatsapp ? (
              <li><a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp {c.whatsapp}</a></li>
            ) : null}
          </ul>
        </div>
        ) : null}
        {extras ? (
        <div className="space-y-4 rounded-xl border-[3px] p-5" style={box}>
          {c.social.length > 0 ? (
            <div>
              <h3 className={`mb-3 text-2xl ${H}`} style={{ color: ink(ctx) }}>Follow</h3>
              <ul className="flex flex-wrap gap-2">
                {c.social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-sm ${H}`} style={{ borderColor: ink(ctx), color: ink(ctx) }}>
                      <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                      {getSocialPlatformLabel(s.platform, s.name)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {c.cta.payBtn && c.cta.paymentLink ? <Chunky ctx={ctx} onClick={p.onPay}>Pay bill</Chunky> : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? <Chunky ctx={ctx} tone="paper" onClick={p.onReview}>Review us</Chunky> : null}
          </div>
          {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
            <div>
              <p className={`mb-2 text-sm ${H}`} style={{ color: ink(ctx) }}>Scan to pay</p>
              <div className="relative size-36 overflow-hidden rounded-md border-[3px] bg-white" style={{ borderColor: ink(ctx) }}>
                <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-2" />
              </div>
            </div>
          ) : null}
        </div>
        ) : null}
      </div>
    </Block>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <Block ctx={ctx}>
      <Title ctx={ctx} sticker="FYI">Questions</Title>
      <div className="space-y-4">
        {c.faqs.map((f, i) => (
          <details key={`${f.q}-${i}`} className="group rounded-xl border-[3px] p-5" style={{ background: t.surface, borderColor: ink(ctx), boxShadow: hard(ctx, 4) }}>
            <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 text-xl ${H} focus-visible:outline-2 [&::-webkit-details-marker]:hidden`} style={{ color: ink(ctx) }}>
              {f.q}
              <span className="grid size-9 shrink-0 place-items-center rounded-md border-[3px] text-xl motion-safe:transition-transform group-open:rotate-45" style={{ borderColor: ink(ctx), background: t.accent, color: t.accentText }} aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 text-lg font-medium" style={{ color: t.textSecondary }}>{f.a}</p>
          </details>
        ))}
      </div>
    </Block>
  );
}

function Divider({ ctx, section }: LandingSectionProps) {
  const { t } = ctx;
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `pop-divider-${section.id}`;
  return (
    <div aria-hidden="true" className="border-y-[3px] py-3" style={{ background: t.accent, borderColor: ink(ctx), color: t.accentText }}>
      <svg className="block w-full" style={{ height: motif.h }}>
        <defs>
          <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">{motif.tile}</pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="columns" />;
}

export const layout: LayoutDefinition = {
  key: "tabs",
  label: "Street Pop",
  description: "Loud street-food style: chunky type, stickers, coupons and bold outlines.",
  Frame,
  sections: {
    intro: IntroSection,
    announcement: Announcement,
    hero: Hero,
    marquee: Marquee,
    stats: Stats,
    story: Story,
    "signature-dishes": Signature,
    "popular-items": Popular,
    offers: Offers,
    gallery: Gallery,
    reviews: Reviews,
    visit: Visit,
    faq: Faq,
    divider: Divider,
    footer: Footer,
    // Owner content sections (shared design until Step 6 restyles them per layout).
    ...SITE_CONTENT_SECTIONS,
  },
};
