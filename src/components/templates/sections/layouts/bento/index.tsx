"use client";

import Image from "@/components/ui/Image";
import { useState, type CSSProperties, type ReactNode } from "react";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { IntroSection } from "../../landing/intro";
import { todayIn } from "../../document";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";

/*
 * Bento — an app-like grid of mixed-size tiles. Radius follows hierarchy
 * (hero 28px, tiles 20px, chips full). Tile tints are mixed from the owner's
 * accent so any palette works; each kind of tile carries its own line glyph.
 */

const mix = (c: string, pct: number, base = "transparent") => `color-mix(in srgb, ${c} ${pct}%, ${base})`;

/* ── glyphs ─────────────────────────────────────────────────────────────── */
type GlyphName = "flame" | "clock" | "pin" | "star" | "chat" | "spark" | "plate" | "tag" | "camera" | "phone" | "question" | "chart";
const GLYPH_PATHS: Record<GlyphName, ReactNode> = {
  flame: <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 0-6 1-9z" />,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  pin: <><path d="M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11z" /><circle cx="12" cy="10" r="2" /></>,
  star: <path d="M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16.3 7 19l1.2-5.6L4 9.6l5.6-.6z" />,
  chat: <path d="M5 5h14v10H9l-4 4z" />,
  spark: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
  plate: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></>,
  tag: <><path d="M4 12V4h8l8 8-8 8z" /><circle cx="8.5" cy="8.5" r="1.2" /></>,
  camera: <><rect x="3" y="7" width="18" height="12" rx="2" /><circle cx="12" cy="13" r="3.5" /><path d="M8 7l1.5-2h5L16 7" /></>,
  phone: <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  question: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5M12 16.5v.5" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};
function Glyph({ name, className = "size-5" }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {GLYPH_PATHS[name]}
    </svg>
  );
}

function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill={i <= Math.round(rating) ? color : "none"} stroke={color} strokeWidth={1.5}>
          <path d="M12 4l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 16.3 7 19l1.2-5.6L4 9.6l5.6-.6z" />
        </svg>
      ))}
    </span>
  );
}

/* ── building blocks ────────────────────────────────────────────────────── */
function Tile({
  ctx,
  children,
  className = "",
  tone = "surface",
  style,
}: {
  ctx: LandingSectionContext;
  children: ReactNode;
  className?: string;
  tone?: "surface" | "accent" | "tint" | "plain";
  style?: CSSProperties;
}) {
  const { t } = ctx;
  const bg =
    tone === "accent"
      ? t.accent
      : tone === "tint"
        ? `linear-gradient(145deg, ${mix(t.accent, 16, t.surface)}, ${mix(t.accent, 4, t.surface)})`
        : tone === "plain"
          ? "transparent"
          : t.surface;
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border p-5 ${className}`}
      style={{ background: bg, borderColor: mix(t.border, 80), color: tone === "accent" ? t.accentText : t.textSecondary, ...style }}
    >
      {children}
    </div>
  );
}

function TileLabel({ ctx, glyph, children, onAccent = false }: { ctx: LandingSectionContext; glyph: GlyphName; children: ReactNode; onAccent?: boolean }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-sm font-medium" style={{ color: onAccent ? ctx.t.accentText : ctx.t.textSecondary }}>
      <span className="grid size-8 place-items-center rounded-full" style={{ background: onAccent ? mix(ctx.t.accentText, 18) : mix(ctx.t.accent, 14), color: onAccent ? ctx.t.accentText : ctx.t.accent }}>
        <Glyph name={glyph} className="size-4" />
      </span>
      {children}
    </div>
  );
}

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 ${className}`}>{children}</section>;
}

function SectionTitle({ ctx, children, sub }: { ctx: LandingSectionContext; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4 mt-6 flex flex-wrap items-end justify-between gap-2 px-1">
      <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${ctx.t.headingClass ?? ""}`} style={{ color: ctx.t.textPrimary }}>
        {children}
      </h2>
      {sub ? <p className="text-sm" style={{ color: ctx.t.textSecondary }}>{sub}</p> : null}
    </div>
  );
}

function MenuButton({ ctx, children, variant = "solid" }: { ctx: LandingSectionContext; children?: ReactNode; variant?: "solid" | "onAccent" }) {
  const { c, t, p } = ctx;
  if (!c.cta.menuBtn) return null;
  const style = variant === "onAccent" ? { background: t.accentText, color: t.accent } : { background: t.accent, color: t.accentText };
  return (
    <p.LinkComponent
      to={p.menuHref}
      onClick={() => p.track("click", "menu_button", {})}
      style={style}
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children ?? c.terms.ctaLabel}
    </p.LinkComponent>
  );
}

/** Today's row of the opening hours (by weekday name), for the "open now" tile. */
function todayHours(ctx: LandingSectionContext) {
  // Restaurant-local date, so the server render and the browser agree.
  const ymd = todayIn(ctx.p.data.settings?.timezone);
  const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date(`${ymd}T12:00:00Z`).getUTCDay()];
  return ctx.c.hours.find((h) => h.day.toLowerCase().startsWith(day));
}

/* ── frame ──────────────────────────────────────────────────────────────── */
function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t } = ctx;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: `radial-gradient(1200px 600px at 85% -10%, ${mix(t.accent, 10, t.bg)}, ${t.bg} 60%)` }}>
      <header className="sticky top-3 z-40 mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6">
        <nav
          aria-label="Main"
          className="flex items-center gap-3 rounded-full border px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          style={{ background: mix(t.surface, 78), borderColor: mix(t.border, 70) }}
        >
          <a href="#top" className="flex min-w-0 items-center gap-2 rounded-full pr-2 focus-visible:outline-2" style={{ color: t.textPrimary }}>
            {c.logoUrl ? (
              <span className="relative size-8 shrink-0 overflow-hidden rounded-full">
                <Image src={c.logoUrl} alt="" fill sizes="32px" className="object-cover" />
              </span>
            ) : (
              <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: t.accent, color: t.accentText }}>
                <Glyph name="plate" className="size-4" />
              </span>
            )}
            <span className="truncate font-semibold">{c.businessName}</span>
          </a>
          <ul className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-[var(--bento-hover)] focus-visible:outline-2"
                  style={{ color: t.textSecondary, ["--bento-hover" as string]: mix(t.accent, 10) }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2 md:ml-2">
            <MenuButton ctx={ctx} />
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border md:hidden"
              style={{ borderColor: mix(t.border, 80), color: t.textPrimary }}
              aria-expanded={open}
              aria-controls="bento-mobile-nav"
              aria-label={open ? "Close sections" : "Open sections"}
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
        {open ? (
          <ul id="bento-mobile-nav" className="mt-2 grid grid-cols-2 gap-2 rounded-[20px] border p-2 md:hidden" style={{ background: t.surface, borderColor: mix(t.border, 80) }}>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm" style={{ color: t.textPrimary, background: mix(t.accent, 6) }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <main id="top" className="pb-6">{children}</main>
    </div>
  );
}

/* ── sections ───────────────────────────────────────────────────────────── */
function Announcement({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (!c.announcement) return null;
  return (
    <Shell className="pb-0">
      <p className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-center text-sm" style={{ background: mix(t.accent, 12, t.surface), color: t.textPrimary }}>
        <Glyph name="spark" className="size-4 shrink-0" />
        {c.announcement}
      </p>
    </Shell>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const photo = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const today = todayHours(ctx);
  const tagline = t.heroTagline || c.slogan;
  const avg = c.googleReviews.length ? c.googleReviews.reduce((s, r) => s + r.rating, 0) / c.googleReviews.length : 0;
  return (
    <Shell>
      <div className="grid gap-3 md:grid-cols-4 md:grid-rows-[auto_auto]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[28px] md:col-span-3 md:row-span-2">
          <Image src={photo} alt={c.businessName} fill loading="eager" fetchPriority="high" sizes="(min-width: 768px) 75vw, 100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.72))" }} />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
            {t.badge ? (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
                <Glyph name="spark" className="size-3.5" />
                {t.badge}
              </span>
            ) : null}
            <h1 className={`max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl ${t.headingClass ?? ""}`}>{c.businessName}</h1>
            {tagline ? <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">{tagline}</p> : null}
          </div>
        </div>

        <Tile ctx={ctx} tone="accent" className="flex flex-col justify-between">
          <TileLabel ctx={ctx} glyph="plate" onAccent>Hungry?</TileLabel>
          <p className="text-lg font-semibold leading-snug">See today&apos;s {c.terms.catalogLabel.toLowerCase()} and order at your table.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <MenuButton ctx={ctx} variant="onAccent" />
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: mix(t.accentText, 50), color: t.accentText }}>
                Pay bill
              </button>
            ) : null}
          </div>
        </Tile>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <Tile ctx={ctx} tone="tint">
            <TileLabel ctx={ctx} glyph="clock">Today</TileLabel>
            <p className="text-xl font-semibold" style={{ color: t.textPrimary }}>{today ? today.hours : "See hours below"}</p>
          </Tile>
          {avg ? (
            <Tile ctx={ctx}>
              <TileLabel ctx={ctx} glyph="star">Guests say</TileLabel>
              <p className="text-xl font-semibold" style={{ color: t.textPrimary }}>{avg.toFixed(1)} / 5</p>
              <Stars rating={avg} color={t.accent} />
            </Tile>
          ) : c.cta.reviewBtn && c.cta.reviewLink ? (
            <Tile ctx={ctx}>
              <TileLabel ctx={ctx} glyph="chat">Been here?</TileLabel>
              <button type="button" onClick={p.onReview} className="text-sm font-semibold underline underline-offset-4" style={{ color: t.accent }}>
                Leave a review
              </button>
            </Tile>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

function Marquee({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  const text = t.marqueeText || c.slogan || c.businessName;
  const items = Array.from({ length: 6 }, (_, i) => i);
  return (
    <Shell>
      <div className="overflow-hidden rounded-full border py-3" style={{ borderColor: mix(t.border, 80), background: t.surface }}>
        <div className="flex w-max gap-10 whitespace-nowrap motion-safe:animate-[bento-marquee_40s_linear_infinite]">
          {[...items, ...items].map((_, i) => (
            <span key={i} className="flex items-center gap-10 text-base font-medium" style={{ color: t.textPrimary }} aria-hidden={i >= items.length || undefined}>
              {text}
              <span style={{ color: t.accent }}><Glyph name="spark" className="size-4" /></span>
            </span>
          ))}
        </div>
        <style>{`@keyframes bento-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>
    </Shell>
  );
}

function Stats({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.stats.length === 0) return null;
  return (
    <Shell>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {c.stats.map((s, i) => (
          <Tile key={s.label} ctx={ctx} tone={i === 0 ? "tint" : "surface"}>
            <TileLabel ctx={ctx} glyph="chart">{s.label}</TileLabel>
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: t.textPrimary }}><Counter value={s.value} /></p>
          </Tile>
        ))}
      </div>
    </Shell>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <Shell>
      <div className="grid gap-3 md:grid-cols-5">
        <Tile ctx={ctx} className="md:col-span-3 sm:p-8">
          <TileLabel ctx={ctx} glyph="flame">Our story</TileLabel>
          {c.story.headline ? (
            <h2 className={`text-2xl font-semibold leading-tight tracking-tight sm:text-4xl ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>{c.story.headline}</h2>
          ) : null}
          {c.story.body ? <p className="mt-4 max-w-prose leading-relaxed">{c.story.body}</p> : null}
        </Tile>
        <div className="relative min-h-[260px] overflow-hidden rounded-[20px] md:col-span-2">
          <Image src={c.gallery[1]?.image_url || img.scene} alt={c.terms.heroAlt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
      </div>
    </Shell>
  );
}

type Dish = { name: string; description?: string; price?: string; image?: string | null };
function DishBento({ ctx, items, title, sub, glyph, track }: { ctx: LandingSectionContext; items: Dish[]; title: string; sub: string; glyph: GlyphName; track: string }) {
  const { t, img, p } = ctx;
  const list = items.slice(0, 5);
  return (
    <Shell>
      <SectionTitle ctx={ctx} sub={sub}>{title}</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((d, i) => {
          const big = i === 0;
          return (
            <article
              key={`${d.name}-${i}`}
              className={`group relative overflow-hidden rounded-[20px] border ${big ? "sm:col-span-2 sm:row-span-2 min-h-[320px]" : "min-h-[200px]"}`}
              style={{ borderColor: mix(t.border, 80), background: t.surface }}
            >
              <Image src={d.image || img.dish} alt={d.name} fill sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75))" }} />
              {d.price ? (
                <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-semibold" style={{ background: t.accent, color: t.accentText }}>{d.price}</span>
              ) : null}
              <span className="absolute left-3 top-3 grid size-8 place-items-center rounded-full backdrop-blur" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                <Glyph name={glyph} className="size-4" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className={`font-semibold text-white ${big ? "text-2xl" : "text-base"}`}>{d.name}</h3>
                {d.description ? <p className={`mt-1 text-sm text-white/80 ${big ? "" : "line-clamp-2"}`}>{d.description}</p> : null}
                <p.LinkComponent
                  to={p.menuHref}
                  onClick={() => p.track("click", track, { item: d.name })}
                  className="mt-2 inline-block text-sm font-semibold text-white underline underline-offset-4"
                >
                  View on {ctx.c.terms.catalogLabel.toLowerCase()}
                </p.LinkComponent>
              </div>
            </article>
          );
        })}
      </div>
    </Shell>
  );
}

function Signature({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.signatureDishes.length === 0) return null;
  return <DishBento ctx={ctx} items={c.signatureDishes} title={c.terms.featuredSectionLabel} sub={c.terms.featuredSectionSubhead} glyph="flame" track="dish_card" />;
}

function Popular({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.popularItems.length === 0) return null;
  return <DishBento ctx={ctx} items={c.popularItems} title={c.terms.popularSectionLabel} sub={c.terms.popularSectionSubhead} glyph="star" track="popular_item" />;
}

function Offers({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.offers.length === 0) return null;
  return (
    <Shell>
      <SectionTitle ctx={ctx} sub="Running now">Offers</SectionTitle>
      <div className="grid gap-3 md:grid-cols-3">
        {c.offers.map((o, i) => (
          <Tile key={i} ctx={ctx} tone={i === 0 ? "accent" : "tint"} className={i === 0 ? "md:row-span-2" : ""}>
            {o.image_url && i === 0 ? (
              <div className="relative -mx-5 -mt-5 mb-4 h-44">
                <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            ) : null}
            <TileLabel ctx={ctx} glyph="tag" onAccent={i === 0}>
              {o.badge_text || (o.offer_value ? `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off` : "Offer")}
            </TileLabel>
            {o.title ? <h3 className="text-xl font-semibold" style={{ color: i === 0 ? t.accentText : t.textPrimary }}>{o.title}</h3> : null}
            {o.description ? <p className="mt-2 text-sm">{o.description}</p> : null}
          </Tile>
        ))}
      </div>
    </Shell>
  );
}

function Gallery({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8);
  const span = ["sm:col-span-2 sm:row-span-2", "", "", "sm:row-span-2", "", "sm:col-span-2", "", ""];
  return (
    <Shell>
      <SectionTitle ctx={ctx} sub={`${photos.length} photos`}>Gallery</SectionTitle>
      <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((g, i) => (
          <div key={i} className={`relative overflow-hidden rounded-[20px] ${span[i] ?? ""}`}>
            <Image src={g.image_url as string} alt={`${c.businessName} photo ${i + 1}`} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  const avg = c.googleReviews.reduce((s, r) => s + r.rating, 0) / c.googleReviews.length;
  return (
    <Shell>
      <SectionTitle ctx={ctx} sub="From Google">What guests say</SectionTitle>
      <div className="grid gap-3 md:grid-cols-3">
        <Tile ctx={ctx} tone="accent" className="flex flex-col justify-between">
          <TileLabel ctx={ctx} glyph="star" onAccent>Average rating</TileLabel>
          <p className="text-6xl font-semibold tracking-tight">{avg.toFixed(1)}</p>
          <div className="mt-3"><Stars rating={avg} color={t.accentText} /></div>
          {c.cta.reviewBtn && c.cta.reviewLink ? (
            <button type="button" onClick={p.onReview} className="mt-5 self-start rounded-full px-4 py-2 text-sm font-semibold" style={{ background: t.accentText, color: t.accent }}>
              Write a review
            </button>
          ) : null}
        </Tile>
        {c.googleReviews.slice(0, 4).map((r) => (
          <Tile key={r.id} ctx={ctx}>
            <div className="mb-3 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full text-sm font-semibold" style={{ background: mix(t.accent, 16), color: t.accent }}>
                {r.authorName.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{r.authorName}</p>
                {r.relativePublishDescription ? <p className="text-xs">{r.relativePublishDescription}</p> : null}
              </div>
            </div>
            <Stars rating={r.rating} color={t.accent} />
            {r.text ? <p className="mt-2 text-sm leading-relaxed">{r.text}</p> : null}
          </Tile>
        ))}
      </div>
    </Shell>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  const linkCls = "font-medium underline-offset-4 hover:underline focus-visible:outline-2";
  return (
    <Shell>
      <SectionTitle ctx={ctx}>Visit us</SectionTitle>
      <div className="grid gap-3 md:grid-cols-3">
        {c.hours.length > 0 ? (
          <Tile ctx={ctx} className="md:row-span-2">
            <TileLabel ctx={ctx} glyph="clock">Opening hours</TileLabel>
            <dl className="space-y-1.5 text-sm">
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4 border-b border-dashed pb-1.5" style={{ borderColor: mix(t.border, 80) }}>
                  <dt style={{ color: t.textPrimary }}>{h.day}</dt>
                  <dd>{h.hours}</dd>
                </div>
              ))}
            </dl>
          </Tile>
        ) : null}
        {c.address ? (
          <Tile ctx={ctx} tone="tint">
            <TileLabel ctx={ctx} glyph="pin">Find us</TileLabel>
            <p style={{ color: t.textPrimary }}>{c.address}</p>
            {c.locationUrl ? (
              <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className={`mt-2 inline-block text-sm ${linkCls}`} style={{ color: t.accent }}>
                Get directions
              </a>
            ) : null}
          </Tile>
        ) : null}
        {c.phone || c.email || c.whatsapp ? (
          <Tile ctx={ctx}>
            <TileLabel ctx={ctx} glyph="phone">Get in touch</TileLabel>
            <ul className="space-y-1 text-sm">
              {c.phone ? <li><a href={`tel:${c.phone}`} className={linkCls} style={{ color: t.textPrimary }}>{c.phone}</a></li> : null}
              {c.email ? <li><a href={`mailto:${c.email}`} className={linkCls} style={{ color: t.textPrimary }}>{c.email}</a></li> : null}
              {c.whatsapp ? (
                <li><a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className={linkCls} style={{ color: t.textPrimary }}>WhatsApp {c.whatsapp}</a></li>
              ) : null}
            </ul>
          </Tile>
        ) : null}
        {c.social.length > 0 ? (
          <Tile ctx={ctx}>
            <TileLabel ctx={ctx} glyph="camera">Follow along</TileLabel>
            <div className="flex flex-wrap gap-2">
              {c.social.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: mix(t.border, 80), color: t.textPrimary }}>
                  <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                  {getSocialPlatformLabel(s.platform, s.name)}
                </a>
              ))}
            </div>
          </Tile>
        ) : null}
        {(c.cta.payBtn && c.cta.paymentLink) || (c.cta.reviewBtn && c.cta.reviewLink) ? (
          <Tile ctx={ctx} tone="accent">
            <TileLabel ctx={ctx} glyph="spark" onAccent>After your meal</TileLabel>
            <div className="flex flex-wrap gap-2">
              {c.cta.payBtn && c.cta.paymentLink ? (
                <button type="button" onClick={p.onPay} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: t.accentText, color: t.accent }}>Pay bill</button>
              ) : null}
              {c.cta.reviewBtn && c.cta.reviewLink ? (
                <button type="button" onClick={p.onReview} className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: mix(t.accentText, 50), color: t.accentText }}>Write a review</button>
              ) : null}
            </div>
          </Tile>
        ) : null}
        {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
          <Tile ctx={ctx}>
            <TileLabel ctx={ctx} glyph="tag">Scan to pay</TileLabel>
            <div className="relative mx-auto size-36 overflow-hidden rounded-xl bg-white">
              <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-2" />
            </div>
          </Tile>
        ) : null}
      </div>
    </Shell>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <Shell>
      <SectionTitle ctx={ctx}>Questions</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">
        {c.faqs.map((f, i) => (
          <details key={`${f.q}-${i}`} className="group rounded-[20px] border p-5" style={{ background: t.surface, borderColor: mix(t.border, 80) }}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold focus-visible:outline-2 [&::-webkit-details-marker]:hidden" style={{ color: t.textPrimary }}>
              <span className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: mix(t.accent, 14), color: t.accent }}>
                  <Glyph name="question" className="size-4" />
                </span>
                {f.q}
              </span>
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 motion-safe:transition-transform group-open:rotate-45" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="mt-3 pl-11 text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </Shell>
  );
}

function Divider({ ctx, section }: LandingSectionProps) {
  const { t } = ctx;
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `bento-divider-${section.id}`;
  return (
    <Shell>
      <div aria-hidden="true" className="flex items-center gap-3" style={{ color: t.accent }}>
        <span className="h-px flex-1" style={{ background: mix(t.border, 90) }} />
        <div className="overflow-hidden rounded-full border px-4 py-2" style={{ borderColor: mix(t.border, 80), background: t.surface }}>
          <svg className="block w-48 opacity-80" style={{ height: motif.h }}>
            <defs>
              <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">{motif.tile}</pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
          </svg>
        </div>
        <span className="h-px flex-1" style={{ background: mix(t.border, 90) }} />
      </div>
    </Shell>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="columns" />;
}

export const layout: LayoutDefinition = {
  key: "dashboard",
  label: "Bento",
  description: "App-like grid of mixed-size tiles: photo, hours, rating and menu at a glance.",
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
