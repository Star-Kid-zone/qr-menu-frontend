"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { IntroSection } from "../../landing/intro";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";

/**
 * Royal Luxe — grand hotel dining. Deep photo hero, a calligraphic flourish
 * rule under every heading, double-framed photographs, ticket-stub offers.
 * All colours come from the owner's theme (ctx.t); tints via color-mix.
 */

const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** The signature ornament: a lozenge flanked by tapering scrolls. */
function Flourish({ className = "", width = 180 }: { className?: string; width?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 18" width={width} height={(width / 180) * 18} className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M2 9 H62 C70 9 72 3 78 3 C84 3 84 9 78 9" strokeWidth="1" />
      <path d="M178 9 H118 C110 9 108 15 102 15 C96 15 96 9 102 9" strokeWidth="1" />
      <path d="M90 2 L97 9 L90 16 L83 9 Z" strokeWidth="1.2" />
      <circle cx="90" cy="9" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Heading({ t, title, sub, align = "center", light = false }: { t: LandingSectionContext["t"]; title: string; sub?: string; align?: "center" | "left"; light?: boolean }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 style={{ color: light ? "#fff" : t.textPrimary }} className={`text-3xl leading-tight sm:text-4xl ${t.headingClass ?? ""}`}>
        {title}
      </h2>
      <div className={`mt-3 ${align === "center" ? "flex justify-center" : ""}`} style={{ color: t.accent }}>
        <Flourish />
      </div>
      {sub ? (
        <p style={{ color: light ? "rgba(255,255,255,.8)" : t.textSecondary }} className={`mt-4 max-w-xl leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/** A photo inside a thin outer frame and an inset inner frame. */
function Framed({ src, alt, t, className = "", sizes = "(min-width: 1024px) 40vw, 100vw" }: { src: string; alt: string; t: LandingSectionContext["t"]; className?: string; sizes?: string }) {
  return (
    <div className={`relative p-2 ${className}`} style={{ border: `1px solid ${mix(t.accent, "transparent", 60)}` }}>
      <div className="relative h-full w-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        <div className="pointer-events-none absolute inset-3" style={{ border: "1px solid rgba(255,255,255,.55)" }} />
      </div>
    </div>
  );
}

function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 20 20" width="14" height="14" fill={i <= Math.round(rating) ? color : "none"} stroke={color} strokeWidth="1.2">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.8l-5.1 2.6 1-5.6-4.1-4 5.7-.8z" />
        </svg>
      ))}
    </span>
  );
}

const btnBase =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2";

function MenuButton({ ctx, children, variant = "solid" }: { ctx: LandingSectionContext; children?: ReactNode; variant?: "solid" | "outline" }) {
  const { c, t, p } = ctx;
  if (!c.cta.menuBtn) return null;
  return (
    <p.LinkComponent
      to={p.menuHref}
      onClick={() => p.track("click", "menu_button", {})}
      style={
        variant === "solid"
          ? { background: t.accent, color: t.accentText, outlineColor: t.accent }
          : { border: `1px solid ${t.accent}`, color: t.accent, outlineColor: t.accent }
      }
      className={btnBase}
    >
      {children ?? c.terms.ctaLabel}
    </p.LinkComponent>
  );
}

const Wrap = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
);

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t } = ctx;
  const [open, setOpen] = useState(false);
  const rated = c.googleReviews.length ? c.googleReviews.reduce((s, r) => s + r.rating, 0) / c.googleReviews.length : 0;
  return (
    <>
      {/* Text colour on page colour, inverted: always readable whatever the theme. */}
      <div style={{ background: t.textPrimary, color: t.bg }} className="text-xs">
        <Wrap className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
          <span className="flex items-center gap-2">
            {rated ? (
              <>
                <Stars rating={rated} color={t.bg} />
                <span>{rated.toFixed(1)} on Google</span>
              </>
            ) : (
              <span>{c.address || c.businessName}</span>
            )}
          </span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {c.phone ? <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a> : null}
            {c.whatsapp ? (
              <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp
              </a>
            ) : null}
          </span>
        </Wrap>
      </div>
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{ background: mix(t.bg, "transparent", 92), borderBottom: `1px solid ${mix(t.accent, "transparent", 35)}` }}
      >
        <Wrap className="flex items-center justify-between gap-4 py-3">
          <a href="#" className="flex min-w-0 items-center gap-3" style={{ color: t.textPrimary }}>
            {c.logoUrl ? (
              <span className="relative h-10 w-10 shrink-0 overflow-hidden" style={{ border: `1px solid ${t.accent}` }}>
                <Image src={c.logoUrl} alt="" fill sizes="40px" className="object-cover" />
              </span>
            ) : null}
            <span className={`truncate text-lg ${t.headingClass ?? ""}`}>{c.businessName}</span>
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-sm hover:opacity-70" style={{ color: t.textPrimary }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <MenuButton ctx={ctx} variant="outline" />
            </span>
            <button
              type="button"
              className="p-2 lg:hidden"
              aria-expanded={open}
              aria-controls="royal-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              style={{ color: t.textPrimary }}
            >
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="1.5">
                {open ? <path d="M4 4l14 14M18 4L4 18" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
              </svg>
            </button>
          </div>
        </Wrap>
        {open ? (
          <nav id="royal-mobile-nav" aria-label="Sections" className="lg:hidden" style={{ borderTop: `1px solid ${mix(t.accent, "transparent", 30)}` }}>
            <Wrap className="flex flex-col py-2">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="py-2.5 text-base" style={{ color: t.textPrimary }}>
                  {n.label}
                </a>
              ))}
              <span className="py-3 sm:hidden">
                <MenuButton ctx={ctx} />
              </span>
            </Wrap>
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
    </>
  );
}

/* ─────────────────────────── Sections ─────────────────────────── */

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <div style={{ background: t.accent, color: t.accentText }} className="px-4 py-2.5 text-center text-sm">
      {c.announcement}
    </div>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  const cards = c.hours.length
    ? c.hours.filter((h) => h.hours !== "Closed").slice(0, 3).map((h) => ({ k: h.day, v: h.hours }))
    : c.stats.slice(0, 3).map((s) => ({ k: s.label, v: s.value }));
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(100deg, rgba(0,0,0,.86) 0%, rgba(0,0,0,.62) 45%, rgba(0,0,0,.15) 100%)" }} />
      <Wrap className="py-24 sm:py-32">
        <div className="max-w-2xl text-white">
          {t.badge ? (
            <p className="flex items-center gap-3 text-sm" style={{ color: mix(t.accent, "#fff", 70) }}>
              <span aria-hidden="true" className="h-px w-10" style={{ background: "currentColor" }} />
              {t.badge}
            </p>
          ) : null}
          <h1 className={`mt-5 text-5xl leading-[1.05] sm:text-7xl ${t.headingClass ?? ""}`}>{c.businessName}</h1>
          <div className="mt-5" style={{ color: mix(t.accent, "#fff", 75) }}>
            <Flourish width={220} />
          </div>
          {tagline ? <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">{tagline}</p> : null}
          {cards.length ? (
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cards.map((card) => (
                <li key={card.k} className="px-4 py-3 backdrop-blur-sm" style={{ border: `1px solid ${mix(t.accent, "transparent", 55)}`, background: "rgba(0,0,0,.35)" }}>
                  <p className="text-xs text-white/70">{card.k}</p>
                  <p className="mt-1 text-base">{card.v}</p>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-9 flex flex-wrap gap-3">
            <MenuButton ctx={ctx} />
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} className={btnBase} style={{ border: "1px solid rgba(255,255,255,.7)", color: "#fff" }}>
                Pay bill
              </button>
            ) : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? (
              <button type="button" onClick={p.onReview} className={btnBase} style={{ border: "1px solid rgba(255,255,255,.4)", color: "rgba(255,255,255,.85)" }}>
                Leave a review
              </button>
            ) : null}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan || c.businessName;
  const items = text.split(/\s*[·•|]\s*/).filter(Boolean);
  return (
    <div style={{ background: t.surface, borderBlock: `1px solid ${mix(t.accent, "transparent", 40)}`, color: t.textPrimary }} className="overflow-hidden py-4">
      <div className="flex w-max motion-safe:animate-[royalMarquee_40s_linear_infinite]">
        {[0, 1].map((dup) => (
          <ul key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
            {[...items, ...items].map((it, i) => (
              <li key={i} aria-hidden={i >= items.length || undefined} className="flex items-center gap-6 px-6 text-lg italic">
                {it}
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" style={{ color: t.accent }}>
                  <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <style>{"@keyframes royalMarquee{to{transform:translateX(-50%)}}"}</style>
    </div>
  );
}

function Stats({ ctx: { c, t } }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="py-14">
      <Wrap>
        <dl className="grid grid-cols-2 gap-px sm:grid-cols-4" style={{ background: mix(t.accent, "transparent", 30) }}>
          {c.stats.map((s) => (
            <div key={s.label} style={{ background: t.bg }} className="px-4 py-8 text-center">
              <dd style={{ color: t.accent }} className={`text-4xl ${t.headingClass ?? ""}`}><Counter value={s.value} /></dd>
              <dt style={{ color: t.textSecondary }} className="mt-2 text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Wrap>
    </section>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <section style={{ background: t.bg }} className="py-20 sm:py-28">
      <Wrap className="grid items-center gap-12 lg:grid-cols-2">
        <Framed src={c.gallery[1]?.image_url || img.scene} alt={c.terms.heroAlt} t={t} className="aspect-[4/5] w-full max-w-md justify-self-center" />
        <div>
          <Heading t={t} title={c.story.headline || "Our story"} align="left" />
          {c.story.body ? <p style={{ color: t.textSecondary }} className="mt-6 max-w-prose text-lg leading-loose">{c.story.body}</p> : null}
          <div className="mt-8">
            <MenuButton ctx={ctx} variant="outline" />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function DishGrid({ ctx, items, title, sub, band }: { ctx: LandingSectionContext; items: { name: string; description?: string; price?: string; image?: string | null }[]; title: string; sub: string; band: boolean }) {
  const { t, img } = ctx;
  return (
    <section style={{ background: band ? ctx.sectionBg : t.bg }} className="py-20 sm:py-24">
      <Wrap>
        <Heading t={t} title={title} sub={sub} />
        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="text-center">
              <Framed src={d.image || img.dish} alt={d.name} t={t} className="mx-auto aspect-square w-full max-w-xs" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
              <h3 style={{ color: t.textPrimary }} className={`mt-6 text-xl ${t.headingClass ?? ""}`}>{d.name}</h3>
              {d.description ? <p style={{ color: t.textSecondary }} className="mx-auto mt-2 max-w-xs text-sm leading-relaxed">{d.description}</p> : null}
              {d.price ? <p style={{ color: t.accent }} className="mt-3 text-lg">{d.price}</p> : null}
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <MenuButton ctx={ctx} variant="outline" />
        </div>
      </Wrap>
    </section>
  );
}

function Signature({ ctx }: LandingSectionProps) {
  if (ctx.c.signatureDishes.length === 0) return null;
  return <DishGrid ctx={ctx} items={ctx.c.signatureDishes} title={ctx.c.terms.featuredSectionLabel} sub={ctx.c.terms.featuredSectionSubhead} band />;
}

function Popular({ ctx }: LandingSectionProps) {
  if (ctx.c.popularItems.length === 0) return null;
  return <DishGrid ctx={ctx} items={ctx.c.popularItems} title={ctx.c.terms.popularSectionLabel} sub={ctx.c.terms.popularSectionSubhead} band={false} />;
}

function Offers({ ctx: { c, t } }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="py-20 sm:py-24">
      <Wrap>
        <Heading t={t} title="Offers" sub="Current offers at the restaurant." />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {c.offers.map((o, i) => {
            const value = o.badge_text || (o.offer_value ? `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off` : "");
            return (
              <li key={i} className="relative flex overflow-hidden" style={{ background: t.surface, border: `1px solid ${mix(t.accent, "transparent", 45)}` }}>
                {o.image_url ? (
                  <div className="relative hidden w-36 shrink-0 sm:block">
                    <Image src={o.image_url} alt="" fill sizes="144px" className="object-cover" />
                  </div>
                ) : null}
                <div className="flex-1 p-6">
                  {o.title ? <h3 style={{ color: t.textPrimary }} className={`text-xl ${t.headingClass ?? ""}`}>{o.title}</h3> : null}
                  {o.description ? <p style={{ color: t.textSecondary }} className="mt-2 text-sm leading-relaxed">{o.description}</p> : null}
                </div>
                {value ? (
                  <div
                    className="flex w-28 shrink-0 items-center justify-center px-3 text-center text-lg"
                    style={{ background: mix(t.accent, t.surface, 14), color: t.accent, borderLeft: `2px dashed ${mix(t.accent, "transparent", 55)}` }}
                  >
                    {value}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}

function Gallery({ ctx: { c, t } }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  return (
    <section style={{ background: mix(t.footerBg ?? t.bg, "#000", 90) }} className="py-20 sm:py-24">
      <Wrap>
        <Heading t={t} title="Gallery" light />
        <ul className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4">
          {photos.map((src, i) => (
            <li key={src + i} className={`relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`} style={{ outline: `1px solid ${mix(t.accent, "transparent", 40)}`, outlineOffset: 4 }}>
              <Image src={src} alt={`${c.businessName} photo ${i + 1}`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  return (
    <section style={{ background: ctx.sectionBg }} className="py-20 sm:py-24">
      <Wrap>
        <Heading t={t} title="What our guests say" />
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {c.googleReviews.slice(0, 6).map((r) => (
            <li key={r.id} className="relative px-6 pb-6 pt-12" style={{ background: t.surface, border: `1px solid ${mix(t.accent, "transparent", 30)}` }}>
              <svg aria-hidden="true" viewBox="0 0 40 32" width="40" height="32" className="absolute left-6 top-4" style={{ color: mix(t.accent, "transparent", 70) }}>
                <path fill="currentColor" d="M0 32V18C0 8 6 1 16 0l2 4C11 6 9 10 9 16h7v16H0zm22 0V18C22 8 28 1 38 0l2 4c-7 2-9 6-9 12h7v16H22z" />
              </svg>
              {r.text ? <p style={{ color: t.textPrimary }} className="text-base italic leading-relaxed">{r.text}</p> : null}
              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p style={{ color: t.textPrimary }} className="text-sm font-semibold">{r.authorName}</p>
                  {r.relativePublishDescription ? <p style={{ color: t.textSecondary }} className="text-xs">{r.relativePublishDescription}</p> : null}
                </div>
                <Stars rating={r.rating} color={t.accent} />
              </div>
            </li>
          ))}
        </ul>
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <div className="mt-10 text-center">
            <button type="button" onClick={p.onReview} className={btnBase} style={{ border: `1px solid ${t.accent}`, color: t.accent }}>
              Write a review on Google
            </button>
          </div>
        ) : null}
      </Wrap>
    </section>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  const row = (label: string, body: ReactNode) => (
    <div className="py-3" style={{ borderBottom: `1px solid ${mix(t.border, "transparent", 70)}` }}>
      <dt style={{ color: t.accent }} className="text-sm">{label}</dt>
      <dd style={{ color: t.textPrimary }} className="mt-1">{body}</dd>
    </div>
  );
  return (
    <section style={{ background: t.bg }} className="py-20 sm:py-28">
      <Wrap className="grid gap-12 lg:grid-cols-2">
        <div>
          <Heading t={t} title="Visit us" align="left" />
          {c.hours.length ? (
            <table className="mt-8 w-full text-left">
              <caption className="sr-only">Opening hours</caption>
              <tbody>
                {c.hours.map((h) => (
                  <tr key={h.day} style={{ borderBottom: `1px solid ${mix(t.border, "transparent", 70)}` }}>
                    <th scope="row" style={{ color: t.textPrimary }} className="py-3 font-normal">{h.day}</th>
                    <td style={{ color: h.hours === "Closed" ? t.textSecondary : t.textPrimary }} className="py-3 text-right">{h.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
        <div className="relative p-8" style={{ background: t.surface, border: `1px solid ${mix(t.accent, "transparent", 45)}` }}>
          {/* A map-like backdrop: faint street grid drawn in the accent colour. */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ color: mix(t.accent, "transparent", 12) }}>
            <defs>
              <pattern id="royal-streets" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0 30 H60 M30 0 V60 M0 0 L60 60" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#royal-streets)" />
          </svg>
          <dl className="relative">
            {c.address ? row("Address", (
              <>
                {c.address}
                {c.locationUrl ? (
                  <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="mt-1 block text-sm underline underline-offset-4">
                    Get directions
                  </a>
                ) : null}
              </>
            )) : null}
            {c.phone ? row("Phone", <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>) : null}
            {c.email ? row("Email", <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>) : null}
            {c.whatsapp ? row("WhatsApp", (
              <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.whatsapp}</a>
            )) : null}
          </dl>
          {c.social.length ? (
            <ul className="relative mt-6 flex flex-wrap gap-2">
              {c.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm" style={{ border: `1px solid ${mix(t.accent, "transparent", 50)}`, color: t.textPrimary }}>
                    <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                    {getSocialPlatformLabel(s.platform, s.name)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="relative mt-8 flex flex-wrap gap-3">
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} className={btnBase} style={{ background: t.accent, color: t.accentText }}>Pay bill</button>
            ) : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? (
              <button type="button" onClick={p.onReview} className={btnBase} style={{ border: `1px solid ${t.accent}`, color: t.accent }}>Write a review</button>
            ) : null}
          </div>
          {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
            <figure className="relative mt-6">
              <div className="relative h-36 w-36 p-2" style={{ background: "#fff", border: `1px solid ${t.accent}` }}>
                <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-2" />
              </div>
              <figcaption style={{ color: t.textSecondary }} className="mt-2 text-sm">Scan to pay</figcaption>
            </figure>
          ) : null}
        </div>
      </Wrap>
    </section>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <section style={{ background: ctx.sectionBg }} className="py-20 sm:py-24">
      <Wrap className="max-w-3xl">
        <Heading t={t} title="Questions" />
        <div className="mt-10">
          {c.faqs.map((f, i) => (
            <details key={`${f.q}-${i}`} className="group py-5" style={{ borderBottom: `1px solid ${mix(t.accent, "transparent", 35)}` }} open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg" style={{ color: t.textPrimary }}>
                {f.q}
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="shrink-0 transition-transform group-open:rotate-45" style={{ color: t.accent }}>
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </summary>
              <p style={{ color: t.textSecondary }} className="mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function Divider({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `royal-divider-${section.id}`;
  return (
    <div aria-hidden="true" style={{ background: t.bg, color: t.accent }} className="py-8">
      <Wrap className="flex items-center gap-4">
        <span className="h-px flex-1" style={{ background: mix(t.accent, "transparent", 45) }} />
        <svg width="220" height={motif.h} className="shrink-0 opacity-80">
          <defs>
            <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">{motif.tile}</pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
        <span className="h-px flex-1" style={{ background: mix(t.accent, "transparent", 45) }} />
      </Wrap>
    </div>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="center" />;
}

export const layout: LayoutDefinition = {
  key: "split",
  label: "Royal Luxe",
  description: "Grand hotel dining: deep photo hero, ornamental rules and framed photographs.",
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
