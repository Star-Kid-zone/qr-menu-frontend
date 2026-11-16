"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { IntroSection } from "../../landing/intro";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import { StarRating } from "@/components/templates/landing/_shared/structures/sections";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";

/**
 * Café Notebook — a cosy café's notebook. Ruled paper, hand-drawn underlines,
 * taped polaroids, sticky-note offers and index-card reviews. On desktop a
 * sticky notecard (hours, address, call, pay) sits on the right while the
 * notebook scrolls on the left.
 */

const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Wobbly hand-drawn underline. */
function Scribble({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className={`block h-3 w-40 ${className}`} style={{ color }}>
      <path d="M2 9 C 30 3, 55 12, 85 7 S 140 3, 165 8 S 192 6, 198 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Strip of washi tape. */
function Tape({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 22" className="absolute h-5 w-20" style={style}>
      <path d="M3 2 L77 0 L79 20 L1 22 Z" fill={color} opacity="0.75" />
      <path d="M8 6 H72 M8 11 H72 M8 16 H72" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

function Heading({ ctx, children, sub }: { ctx: LandingSectionContext; children: ReactNode; sub?: string }) {
  const { t } = ctx;
  return (
    <div className="mb-8">
      {sub ? (
        <p className="mb-1 text-base italic" style={{ color: t.accent }}>
          {sub}
        </p>
      ) : null}
      <h2 className={`text-3xl leading-tight sm:text-4xl ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
        {children}
      </h2>
      <Scribble color={t.accent} className="mt-2" />
    </div>
  );
}

function Block({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`px-5 py-12 sm:px-10 md:py-16 ${className}`}>{children}</section>;
}

/** The sticky notecard (desktop sidebar / mobile card below the notebook). */
function Notecard({ ctx }: { ctx: LandingSectionContext }) {
  const { c, t, p } = ctx;
  return (
    <aside aria-label="Visit us" className="relative rotate-[0.6deg] p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]" style={{ background: t.surface, color: t.textSecondary }}>
      <Tape color={mix(t.accent, "white", 55)} style={{ top: -10, left: "50%", transform: "translateX(-50%) rotate(-3deg)" }} />
      <p className={`text-xl ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
        Drop by
      </p>
      <Scribble color={t.accent} className="mt-1 w-24" />
      {c.hours.length > 0 ? (
        <dl className="mt-4 space-y-1 text-sm">
          {c.hours.map((h) => (
            <div key={h.day} className="flex justify-between gap-3">
              <dt style={{ color: t.textPrimary }}>{h.day.slice(0, 3)}</dt>
              <dd className="tabular-nums">{h.hours}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {c.address ? <p className="mt-4 text-sm leading-relaxed">{c.address}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {c.phone ? (
          <a href={`tel:${c.phone}`} className="rounded-full border px-3 py-1" style={{ borderColor: t.border, color: t.textPrimary }}>
            Call
          </a>
        ) : null}
        {c.locationUrl ? (
          <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border px-3 py-1" style={{ borderColor: t.border, color: t.textPrimary }}>
            Directions
          </a>
        ) : null}
        {c.cta.payBtn && c.cta.paymentLink ? (
          <button type="button" onClick={p.onPay} className="rounded-full px-3 py-1" style={{ background: t.accent, color: t.accentText }}>
            Pay bill
          </button>
        ) : null}
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <button type="button" onClick={p.onReview} className="rounded-full border px-3 py-1" style={{ borderColor: t.accent, color: t.accent }}>
            Review us
          </button>
        ) : null}
      </div>
    </aside>
  );
}

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  // Ruled notebook paper with a margin line, all from theme colours.
  const paper: CSSProperties = {
    backgroundColor: t.bg,
    backgroundImage: `linear-gradient(to right, transparent 54px, ${mix(t.accent, "transparent", 25)} 54px, ${mix(t.accent, "transparent", 25)} 55px, transparent 55px), repeating-linear-gradient(to bottom, transparent 0, transparent 31px, ${mix(t.border, "transparent", 55)} 31px, ${mix(t.border, "transparent", 55)} 32px)`,
  };
  return (
    <div style={paper}>
      <header className="sticky top-0 z-40 border-b" style={{ background: mix(t.bg, "transparent", 94), borderColor: t.border }}>
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-10">
          <a href="#top" className="flex shrink-0 items-center gap-2" style={{ color: t.textPrimary }}>
            {c.logoUrl ? (
              <span className="relative h-9 w-9 overflow-hidden rounded-full border-2" style={{ borderColor: t.accent }}>
                <Image src={c.logoUrl} alt="" fill sizes="36px" className="object-cover" />
              </span>
            ) : (
              <CupDoodle className="h-8 w-8" color={t.accent} />
            )}
            <span className={`text-lg ${t.headingClass ?? ""}`}>{c.businessName}</span>
          </a>
          {/* Scrollable on small screens, never wider than the page */}
          <nav aria-label="Pages of the notebook" className="no-scrollbar ml-auto min-w-0 overflow-x-auto">
            <ul className="flex items-center gap-1 whitespace-nowrap">
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-black/5 focus-visible:outline-2" style={{ color: t.textSecondary, outlineColor: t.accent }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {c.cta.menuBtn ? (
            <p.LinkComponent
              to={p.menuHref}
              onClick={() => p.track("click", "menu_button", {})}
              className="hidden shrink-0 -rotate-2 rounded-md px-4 py-2 text-sm shadow-sm sm:inline-block"
              style={{ background: t.accent, color: t.accentText }}
            >
              See the menu
            </p.LinkComponent>
          ) : null}
        </div>
      </header>
      <div id="top" className="mx-auto grid max-w-6xl lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:pr-10">
        <main className="min-w-0">{children}</main>
        <div className="px-5 pb-12 sm:px-10 lg:px-0 lg:pb-0 lg:pt-12">
          <div className="lg:sticky lg:top-24">
            <Notecard ctx={ctx} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CupDoodle({ className = "", color }: { className?: string; color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className} style={{ color }}>
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 28 H46 V40 C46 49 39 54 30 54 C21 54 14 49 14 40 Z" />
        <path d="M46 32 C54 32 54 44 46 44" />
        <path d="M10 58 H52" />
        <path d="M24 22 C20 18 28 14 24 8 M32 22 C28 18 36 14 32 8" />
      </g>
    </svg>
  );
}

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <div className="px-5 pt-6 sm:px-10">
      <p className="inline-block -rotate-1 px-4 py-2 text-sm shadow-sm" style={{ background: mix(t.accent, t.bg, 18), color: t.textPrimary }}>
        {c.announcement}
      </p>
    </div>
  );
}

function Polaroid({ src, alt, caption, rotate, ctx, sizes, tall = false }: { src: string; alt: string; caption?: string; rotate: number; ctx: LandingSectionContext; sizes: string; tall?: boolean }) {
  const { t } = ctx;
  return (
    <figure className="relative bg-white p-3 pb-10 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.45)]" style={{ transform: `rotate(${rotate}deg)` }}>
      <Tape color={mix(t.accent, "white", 55)} style={{ top: -8, left: -14, transform: "rotate(-35deg)" }} />
      <Tape color={mix(t.accent, "white", 55)} style={{ top: -8, right: -14, transform: "rotate(35deg)" }} />
      <div className={`relative ${tall ? "aspect-[4/5]" : "aspect-square"} overflow-hidden`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      {caption ? (
        <figcaption className="absolute inset-x-3 bottom-2 truncate text-center text-base italic text-neutral-700">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  return (
    <section className="grid items-center gap-10 px-5 py-12 sm:px-10 md:grid-cols-[1.1fr_0.9fr] md:py-16">
      <div>
        {t.badge ? (
          <p className="mb-4 inline-block rotate-[-2deg] rounded-full border-2 border-dashed px-4 py-1 text-sm" style={{ borderColor: t.accent, color: t.accent }}>
            {t.badge}
          </p>
        ) : null}
        <h1 className={`text-5xl leading-[1.05] sm:text-6xl ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
          {c.businessName}
        </h1>
        <Scribble color={t.accent} className="mt-3 w-56" />
        {(t.heroTagline || c.slogan) && (
          <p className="mt-5 max-w-md text-xl leading-relaxed" style={{ color: t.textSecondary }}>
            {t.heroTagline || c.slogan}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {c.cta.menuBtn && (
            <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", "menu_button", { destination: "menu" })} className="rounded-md px-6 py-3 text-base shadow-[3px_3px_0_0_rgba(0,0,0,0.15)]" style={{ background: t.accent, color: t.accentText }}>
              {c.terms.ctaLabel}
            </p.LinkComponent>
          )}
          {c.cta.payBtn && c.cta.paymentLink && (
            <button type="button" onClick={p.onPay} className="rounded-md border-2 px-6 py-3 text-base" style={{ borderColor: t.textPrimary, color: t.textPrimary }}>
              Pay bill
            </button>
          )}
          {c.cta.reviewBtn && c.cta.reviewLink && (
            <button type="button" onClick={p.onReview} className="inline-flex items-center gap-1 px-2 py-3 text-base" style={{ color: t.accent }}>
              Leave a review
              <svg aria-hidden="true" viewBox="0 0 40 20" className="h-4 w-8">
                <path d="M2 14 C12 4 24 4 34 10 M28 4 L35 10 L27 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-sm">
        <Polaroid ctx={ctx} src={c.bannerUrl || c.gallery[0]?.image_url || img.hero} alt={c.businessName} caption={c.businessName} rotate={3} sizes="(min-width:768px) 380px, 90vw" tall />
        {c.logoUrl ? (
          <span className="absolute -bottom-4 -left-4 h-20 w-20 -rotate-6 overflow-hidden rounded-full border-4 bg-white shadow-md" style={{ borderColor: t.surface }}>
            <Image src={c.logoUrl} alt={`${c.businessName} logo`} fill sizes="80px" className="object-cover" />
          </span>
        ) : null}
      </div>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.businessName;
  return (
    <div className="-rotate-1 overflow-hidden py-3" style={{ background: t.accent, color: t.accentText }} aria-label={text}>
      <style>{`@keyframes cn-marquee { to { transform: translateX(-50%); } }`}</style>
      <div aria-hidden="true" className="flex w-max whitespace-nowrap text-lg motion-safe:animate-[cn-marquee_35s_linear_infinite]">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="mx-6">
            {text} <span className="mx-4">☕</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stats({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.stats.length === 0) return null;
  return (
    <Block>
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {c.stats.map((s, i) => (
          <li key={s.label} className="text-center">
            <span className="relative inline-block px-4 py-2">
              <svg aria-hidden="true" viewBox="0 0 120 70" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ color: t.accent }}>
                <path d="M8 38 C6 14 44 4 70 8 C102 12 118 26 112 44 C106 62 64 68 38 62 C18 58 9 50 12 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i % 2 ? 3 : -3} 60 35)`} />
              </svg>
              <span className="relative text-3xl" style={{ color: t.textPrimary }}>
                <Counter value={s.value} />
              </span>
            </span>
            <p className="mt-2 text-sm" style={{ color: t.textSecondary }}>
              {s.label}
            </p>
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
    <Block>
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto w-full max-w-[260px]">
          <Polaroid ctx={ctx} src={c.gallery[1]?.image_url || img.scene} alt={c.terms.heroAlt} caption="Our place" rotate={-4} sizes="260px" />
        </div>
        <div>
          <Heading ctx={ctx} sub="Our story">
            {c.story.headline || c.businessName}
          </Heading>
          {c.story.body ? (
            <p className="text-lg leading-8" style={{ color: t.textSecondary }}>
              {c.story.body}
            </p>
          ) : null}
        </div>
      </div>
    </Block>
  );
}

/** Notebook-style menu list with doodle bullets. */
function MenuList({ ctx, items, sub, title, track }: { ctx: LandingSectionContext; items: Array<{ name: string; description?: string; price?: string; image?: string | null }>; sub: string; title: string; track: string }) {
  const { c, t, p, img } = ctx;
  if (items.length === 0) return null;
  const bullets = ["M6 12 L10 16 L18 6", "M12 4 L14 10 L20 10 L15 14 L17 20 L12 16 L7 20 L9 14 L4 10 L10 10 Z", "M12 4 C18 4 20 10 18 14 C16 20 8 20 6 14 C4 8 8 4 12 4"];
  return (
    <Block>
      <Heading ctx={ctx} sub={sub}>
        {title}
      </Heading>
      <ul className="grid gap-x-10 sm:grid-cols-2">
        {items.slice(0, 6).map((it, i) => (
          <li key={`${it.name}-${i}`} className="flex gap-3 py-3">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0" style={{ color: t.accent }}>
              <path d={bullets[i % bullets.length]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <h3 className="text-lg" style={{ color: t.textPrimary }}>
                  {it.name}
                </h3>
                <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted" style={{ borderColor: mix(t.textSecondary, "transparent", 50) }} />
                {it.price ? (
                  <span className="text-lg tabular-nums" style={{ color: t.accent }}>
                    {it.price}
                  </span>
                ) : null}
              </div>
              {it.description ? (
                <p className="text-sm" style={{ color: t.textSecondary }}>
                  {it.description}
                </p>
              ) : null}
            </div>
            {i < 2 ? (
              <span className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 sm:block" style={{ borderColor: t.surface }}>
                <Image src={it.image || img.dish} alt="" fill sizes="56px" className="object-cover" />
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {c.cta.menuBtn ? (
        <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", track, {})} className="mt-6 inline-flex items-center gap-2 text-base" style={{ color: t.accent }}>
          {c.terms.ctaLabel}
          <svg aria-hidden="true" viewBox="0 0 40 20" className="h-4 w-8">
            <path d="M2 10 C12 4 24 16 34 10 M28 4 L35 10 L28 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </p.LinkComponent>
      ) : null}
    </Block>
  );
}

function Signature({ ctx }: LandingSectionProps) {
  return <MenuList ctx={ctx} items={ctx.c.signatureDishes} sub={ctx.c.terms.featuredSectionLabel} title={ctx.c.terms.featuredSectionSubhead} track="dish_card" />;
}

function Popular({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (c.popularItems.length === 0) return null;
  return (
    <Block>
      <Heading ctx={ctx} sub={c.terms.popularSectionLabel}>
        {c.terms.popularSectionSubhead}
      </Heading>
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {c.popularItems.slice(0, 4).map((it, i) => (
          <li key={`${it.name}-${i}`}>
            <Polaroid ctx={ctx} src={it.image || img.dish} alt={it.name} caption={it.name} rotate={[-3, 2, -1, 3][i % 4]} sizes="(min-width:768px) 180px, 45vw" />
            {it.price ? (
              <p className="mt-3 text-center text-base" style={{ color: t.accent }}>
                {it.price}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Offers({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.offers.length === 0) return null;
  const tints = [mix(t.accent, "white", 22), mix(t.accent, "white", 12), mix(t.textSecondary, "white", 12)];
  return (
    <Block>
      <Heading ctx={ctx} sub="Little treats">
        This week&apos;s specials
      </Heading>
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {c.offers.map((o, i) => (
          <li key={i} className="relative p-5 shadow-[0_10px_20px_-12px_rgba(0,0,0,0.4)]" style={{ background: tints[i % tints.length], transform: `rotate(${[-2, 1.5, -1][i % 3]}deg)`, color: "#2b2622" }}>
            <Tape color={mix(t.accent, "white", 40)} style={{ top: -9, left: "50%", transform: "translateX(-50%) rotate(2deg)" }} />
            {o.image_url ? (
              <div className="relative mb-3 aspect-[16/9] overflow-hidden">
                <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="300px" className="object-cover" />
              </div>
            ) : null}
            {(o.offer_value || o.badge_text) && (
              <p className="mb-1 inline-block rounded-full border border-current px-2 text-sm">{o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off`}</p>
            )}
            {o.title ? <h3 className="text-xl">{o.title}</h3> : null}
            {o.description ? <p className="mt-1 text-sm opacity-80">{o.description}</p> : null}
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Gallery({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.gallery.length === 0) return null;
  return (
    <Block>
      <Heading ctx={ctx} sub="Snapshots">
        Around the café
      </Heading>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
        {c.gallery.slice(0, 6).map((g, i) => (
          <li key={i}>
            <Polaroid ctx={ctx} src={g.image_url as string} alt={`Gallery ${i + 1}`} rotate={[-3, 2, -1.5, 3, -2, 1][i % 6]} sizes="(min-width:640px) 220px, 45vw" />
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.googleReviews.length === 0) return null;
  return (
    <Block>
      <Heading ctx={ctx} sub="Kind words">
        From our regulars
      </Heading>
      <ul className="grid gap-6 md:grid-cols-2">
        {c.googleReviews.slice(0, 4).map((r, i) => (
          <li
            key={r.id}
            className="relative p-5 shadow-[0_8px_18px_-12px_rgba(0,0,0,0.4)]"
            style={{
              background: t.surface,
              backgroundImage: `linear-gradient(to bottom, transparent 38px, ${mix(t.accent, "transparent", 45)} 38px, ${mix(t.accent, "transparent", 45)} 39px, transparent 39px), repeating-linear-gradient(to bottom, transparent 0, transparent 23px, ${mix(t.border, "transparent", 40)} 23px, ${mix(t.border, "transparent", 40)} 24px)`,
              transform: `rotate(${i % 2 ? 1 : -1}deg)`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p style={{ color: t.textPrimary }}>{r.authorName}</p>
              <StarRating rating={r.rating} color={t.accent} />
            </div>
            {r.text ? (
              <p className="mt-4 leading-6" style={{ color: t.textSecondary }}>
                {r.text}
              </p>
            ) : null}
            {r.relativePublishDescription ? (
              <p className="mt-3 text-sm italic" style={{ color: t.textSecondary }}>
                {r.relativePublishDescription}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  // Only draw a column when it has something in it, so neither half is ever left empty.
  const contactCol = Boolean(c.address || c.phone || c.email || c.whatsapp || c.social.length || (c.cta.payBtn && c.cta.paymentLink) || (c.cta.reviewBtn && c.cta.reviewLink));
  if (c.hours.length === 0 && !contactCol) return null;
  return (
    <Block>
      <Heading ctx={ctx} sub="Come say hi">
        Find us
      </Heading>
      <div className={`grid grid-cols-1 gap-8 ${c.hours.length > 0 && contactCol ? "sm:grid-cols-2" : ""}`} style={{ color: t.textSecondary }}>
        {c.hours.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg" style={{ color: t.textPrimary }}>
              Opening hours
            </h3>
            <dl className="space-y-1">
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <dt style={{ color: t.textPrimary }}>{h.day}</dt>
                  <dd className="tabular-nums">{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {contactCol ? (
        <div className="space-y-3">
          {c.address ? (
            <p>
              {c.address}
              {c.locationUrl ? (
                <>
                  {" "}
                  <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-wavy underline-offset-4" style={{ color: t.accent }}>
                    Get directions
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          {c.phone ? (
            <p>
              Call <a href={`tel:${c.phone}`} className="underline underline-offset-4" style={{ color: t.textPrimary }}>{c.phone}</a>
            </p>
          ) : null}
          {c.email ? (
            <p>
              Email <a href={`mailto:${c.email}`} className="underline underline-offset-4" style={{ color: t.textPrimary }}>{c.email}</a>
            </p>
          ) : null}
          {c.whatsapp ? (
            <p>
              WhatsApp{" "}
              <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: t.textPrimary }}>
                {c.whatsapp}
              </a>
            </p>
          ) : null}
          {c.social.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-1">
              {c.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm" style={{ borderColor: t.accent, color: t.accent }}>
                    <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                    {getSocialPlatformLabel(s.platform, s.name)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {c.cta.payBtn && c.cta.paymentLink && (
              <button type="button" onClick={p.onPay} className="rounded-md px-5 py-2.5" style={{ background: t.accent, color: t.accentText }}>
                Pay bill
              </button>
            )}
            {c.cta.reviewBtn && c.cta.reviewLink && (
              <button type="button" onClick={p.onReview} className="rounded-md border-2 px-5 py-2.5" style={{ borderColor: t.accent, color: t.accent }}>
                Write a review
              </button>
            )}
          </div>
          {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
            <figure className="w-40 rotate-2 bg-white p-2 pb-6 shadow-md">
              <div className="relative aspect-square">
                <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="160px" className="object-contain" />
              </div>
              <figcaption className="mt-1 text-center text-sm text-neutral-700">Scan to pay</figcaption>
            </figure>
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
    <Block>
      <Heading ctx={ctx} sub="Good to know">
        Questions
      </Heading>
      <div className="space-y-3">
        {c.faqs.map((f, i) => (
          <details key={`${f.q}-${i}`} className="group rounded-md p-4" style={{ background: mix(t.surface, "transparent", 75) }}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg focus-visible:outline-2" style={{ color: t.textPrimary, outlineColor: t.accent }}>
              {f.q}
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" style={{ color: t.accent }}>
                <path d="M5 9 C9 13 12 15 12 15 C12 15 16 12 19 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <p className="mt-2 leading-relaxed" style={{ color: t.textSecondary }}>
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </Block>
  );
}

function Divider({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `cn-divider-${section.id}`;
  return (
    <div aria-hidden="true" className="px-5 py-6 sm:px-10" style={{ color: t.accent }}>
      <svg className="block w-full rotate-[-0.6deg] opacity-70" style={{ height: motif.h }}>
        <defs>
          <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">
            {motif.tile}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="center" />;
}

export const layout: LayoutDefinition = {
  key: "sidebar-right",
  label: "Café Notebook",
  description: "A cosy café notebook: ruled paper, taped polaroids, sticky-note specials and a pinned notecard with your hours.",
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
