"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { IntroSection } from "../../landing/intro";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import { StarRating } from "@/components/templates/landing/_shared/structures/sections";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";

/**
 * Trattoria — a classic Italian-American dining room on paper: centred and
 * symmetrical, small-caps navigation, a woven damask band between the big
 * movements of the page, and food set like a printed menu card with dotted
 * price leaders. Every colour comes from the owner's theme.
 */

const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
const smallCaps = { fontVariant: "all-small-caps", letterSpacing: "0.14em" } as const;
const wrap = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/* ── Ornaments ───────────────────────────────────────────────────────────── */

/** The layout's signature: a woven damask band in the accent colour. */
function DamaskBand({ t, height = 30 }: { t: LandingSectionContext["t"]; height?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <div aria-hidden="true" style={{ background: mix(t.accent, t.bg, 14), color: t.accent }}>
      <svg className="block w-full" style={{ height }}>
        <defs>
          <pattern id={`damask-${id}`} width="40" height={height} patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.75">
              <path d={`M20 4 C 26 ${height / 2 - 4}, 26 ${height / 2 + 4}, 20 ${height - 4} C 14 ${height / 2 + 4}, 14 ${height / 2 - 4}, 20 4 Z`} />
              <path d={`M0 ${height / 2} Q 10 ${height / 2 - 7} 20 ${height / 2} Q 30 ${height / 2 + 7} 40 ${height / 2}`} />
            </g>
            <circle cx="20" cy={height / 2} r="1.8" fill="currentColor" />
            <circle cx="0" cy="4" r="1.2" fill="currentColor" opacity="0.6" />
            <circle cx="40" cy={height - 4} r="1.2" fill="currentColor" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#damask-${id})`} />
      </svg>
    </div>
  );
}

/** A small centred flourish used under section titles. */
function Flourish({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 14" className="mx-auto mt-3 h-3.5 w-28" style={{ color }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M2 7 H44" />
        <path d="M76 7 H118" />
        <path d="M50 7 C 54 1, 58 1, 60 7 C 62 13, 66 13, 70 7" />
      </g>
      <circle cx="60" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}

function SectionTitle({ t, title, sub }: { t: LandingSectionContext["t"]; title: string; sub?: string }) {
  return (
    <header className="mb-10 text-center">
      <h2 style={{ color: t.textPrimary }} className={`text-3xl font-semibold sm:text-4xl ${t.headingClass ?? ""}`}>
        {title}
      </h2>
      <Flourish color={t.accent} />
      {sub ? (
        <p style={{ color: t.textSecondary }} className="mx-auto mt-3 max-w-xl text-base italic">
          {sub}
        </p>
      ) : null}
    </header>
  );
}

/* ── Frame ───────────────────────────────────────────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const contactLine = [c.address, c.phone].filter(Boolean);

  return (
    <div style={{ background: t.bg }}>
      {contactLine.length ? (
        <div style={{ background: t.footerBg ?? t.textPrimary, color: mix(t.textPrimary, t.footerBg ?? t.bg, 85) }} className="px-4 py-1.5 text-center text-xs">
          <span style={smallCaps}>
            {c.address}
            {c.address && c.phone ? <span aria-hidden="true" className="mx-2 opacity-60">|</span> : null}
            {c.phone ? (
              <a href={`tel:${c.phone}`} className="hover:underline">
                {c.phone}
              </a>
            ) : null}
          </span>
        </div>
      ) : null}

      <header style={{ background: t.bg, borderColor: t.border }} className="sticky top-0 z-40 border-b">
        <div className={`${wrap} flex flex-col items-center py-4`}>
          <div className="flex w-full items-center justify-between gap-3 md:justify-center">
            <a href="#top" className="flex items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4" style={{ color: t.textPrimary, outlineColor: t.accent }}>
              {c.logoUrl ? (
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                  <Image src={c.logoUrl} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ) : null}
              <span className="text-xl sm:text-2xl" style={{ letterSpacing: "0.32em", fontVariant: "small-caps" }}>
                {c.businessName}
              </span>
            </a>
            <button
              type="button"
              className="rounded px-3 py-1.5 text-sm md:hidden focus-visible:outline-2"
              style={{ color: t.textPrimary, border: `1px solid ${t.border}`, outlineColor: t.accent }}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
          <nav aria-label="Sections" id={menuId} className={`${open ? "flex" : "hidden"} mt-3 w-full flex-col items-center gap-1 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-x-7`}>
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                style={{ ...smallCaps, color: t.textSecondary, outlineColor: t.accent }}
                className="py-1 text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {item.label}
              </a>
            ))}
            {c.cta.menuBtn ? (
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", "menu_button", {})}
                style={{ ...smallCaps, background: t.textPrimary, color: t.bg }}
                className="mt-2 px-5 py-2 text-sm md:mt-0"
              >
                View the {c.terms.catalogLabel.toLowerCase()}
              </p.LinkComponent>
            ) : null}
          </nav>
        </div>
      </header>

      <main id="top">{children}</main>
    </div>
  );
}

/* ── Sections ────────────────────────────────────────────────────────────── */

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <p role="note" style={{ background: mix(t.accent, t.bg, 12), color: t.textPrimary, borderColor: t.border }} className="border-b px-4 py-2.5 text-center text-sm italic">
      {c.announcement}
    </p>
  );
}

function Hero({ ctx: { c, t, img, p } }: LandingSectionProps) {
  const photo = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  return (
    <section className="relative">
      <div className="relative h-[78svh] min-h-[480px] w-full">
        <Image src={photo} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 55%)" }} />
      </div>
      <div className={`${wrap} relative -mt-40 pb-4 sm:-mt-48`}>
        <div style={{ background: t.bg, borderColor: t.border, boxShadow: `0 30px 60px -30px ${mix(t.textPrimary, "transparent", 45)}` }} className="mx-auto max-w-2xl border px-6 py-10 text-center sm:px-12">
          {t.badge ? (
            <p style={{ ...smallCaps, color: t.accent }} className="text-sm">
              {t.badge}
            </p>
          ) : null}
          <h1 style={{ color: t.textPrimary }} className={`mt-2 text-4xl leading-tight sm:text-6xl ${t.headingClass ?? ""}`}>
            {c.businessName}
          </h1>
          <Flourish color={t.accent} />
          {t.heroTagline || c.slogan ? (
            <p style={{ color: t.textSecondary }} className="mt-4 text-lg italic">
              {t.heroTagline || c.slogan}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {c.cta.menuBtn ? (
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", "menu_button", { destination: "menu" })}
                style={{ ...smallCaps, background: t.accent, color: t.accentText }}
                className="px-6 py-2.5 text-sm"
              >
                {c.terms.ctaLabel}
              </p.LinkComponent>
            ) : null}
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} style={{ ...smallCaps, color: t.textPrimary, border: `1px solid ${t.textPrimary}` }} className="px-6 py-2.5 text-sm">
                Pay your bill
              </button>
            ) : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? (
              <button type="button" onClick={p.onReview} style={{ ...smallCaps, color: t.textSecondary, border: `1px solid ${t.border}` }} className="px-6 py-2.5 text-sm">
                Leave a review
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || [c.businessName, c.slogan].filter(Boolean).join(" · ");
  if (!text) return null;
  return (
    <div style={{ color: t.textPrimary, borderColor: t.border }} className="overflow-hidden border-y py-3">
      <div className="flex w-max motion-safe:animate-[trattoria-scroll_40s_linear_infinite]">
        {[0, 1].map((k) => (
          <p key={k} aria-hidden={k === 1} className="flex shrink-0 items-center whitespace-nowrap text-lg italic">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6">{text}</span>
                <span aria-hidden="true" style={{ color: t.accent }}>
                  ❦
                </span>
              </span>
            ))}
          </p>
        ))}
      </div>
      <style>{`@keyframes trattoria-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function Stats({ ctx: { c, t } }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  return (
    <section className={`${wrap} py-14`}>
      <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4" style={{ borderColor: t.border }}>
        {c.stats.map((s, i) => (
          <div key={s.label} className="px-4 text-center" style={{ borderLeft: i % 4 ? `1px solid ${t.border}` : undefined }}>
            <dd style={{ color: t.accent }} className="text-4xl sm:text-5xl">
              <Counter value={s.value} />
            </dd>
            <dt style={{ ...smallCaps, color: t.textSecondary }} className="mt-2 text-sm">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Image one side, text the other — the editorial block. */
function Editorial({
  t,
  image,
  imageAlt,
  flip,
  children,
}: {
  t: LandingSectionContext["t"];
  image: string;
  imageAlt: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${wrap} grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16`}>
      <div className={`relative aspect-[4/5] w-full ${flip ? "md:order-2" : ""}`}>
        <div className="absolute inset-0 translate-x-3 translate-y-3 border" style={{ borderColor: t.accent }} aria-hidden="true" />
        <div className="relative h-full w-full overflow-hidden">
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="max-w-prose">{children}</div>
    </div>
  );
}

function Story({ ctx: { c, t, img, p } }: LandingSectionProps) {
  if (!c.story) return null;
  return (
    <section style={{ background: t.bg }}>
      <Editorial t={t} image={c.gallery[1]?.image_url || img.scene} imageAlt={c.terms.heroAlt}>
        <h2 style={{ color: t.textPrimary }} className={`text-3xl leading-snug sm:text-4xl ${t.headingClass ?? ""}`}>
          {c.story.headline || "Our story"}
        </h2>
        <svg aria-hidden="true" viewBox="0 0 80 10" className="mt-4 h-2.5 w-20" style={{ color: t.accent }}>
          <path d="M0 5 H34 M46 5 H80" stroke="currentColor" strokeWidth="1.2" />
          <rect x="37" y="2" width="6" height="6" transform="rotate(45 40 5)" fill="currentColor" />
        </svg>
        {c.story.body ? (
          <p style={{ color: t.textSecondary }} className="mt-5 text-lg leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:leading-none">
            {c.story.body}
          </p>
        ) : null}
        {c.cta.menuBtn ? (
          <p.LinkComponent
            to={p.menuHref}
            onClick={() => p.track("click", "menu_button", { destination: "menu" })}
            style={{ ...smallCaps, color: t.accent, borderColor: t.accent }}
            className="mt-8 inline-block border-b pb-0.5 text-sm"
          >
            Read the {c.terms.catalogLabel.toLowerCase()}
          </p.LinkComponent>
        ) : null}
      </Editorial>
    </section>
  );
}

function MenuLine({ t, name, price, description }: { t: LandingSectionContext["t"]; name: string; price?: string; description?: string }) {
  return (
    <li className="py-3">
      <div className="flex items-baseline gap-2">
        <span style={{ color: t.textPrimary }} className="text-lg">
          {name}
        </span>
        <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: mix(t.textSecondary, "transparent", 60) }} />
        {price ? (
          <span style={{ color: t.accent }} className="text-lg tabular-nums">
            {price}
          </span>
        ) : null}
      </div>
      {description ? (
        <p style={{ color: t.textSecondary }} className="mt-1 text-sm italic">
          {description}
        </p>
      ) : null}
    </li>
  );
}

function SignatureDishes({ ctx: { c, t, img } }: LandingSectionProps) {
  if (c.signatureDishes.length === 0) return null;
  const lead = c.signatureDishes[0];
  return (
    <section style={{ background: mix(t.sectionBg ?? t.surface, t.bg, 60) }}>
      <Editorial t={t} image={lead.image || img.dish} imageAlt={lead.name} flip>
        <h2 style={{ color: t.textPrimary }} className={`text-3xl sm:text-4xl ${t.headingClass ?? ""}`}>
          {c.terms.featuredSectionSubhead}
        </h2>
        <p style={{ color: t.textSecondary }} className="mt-2 italic">
          {c.terms.featuredSectionLabel}
        </p>
        <ul className="mt-6 divide-y" style={{ borderColor: t.border }}>
          {c.signatureDishes.slice(0, 5).map((d, i) => (
            <MenuLine key={`${d.name}-${i}`} t={t} name={d.name} price={d.price} description={d.description} />
          ))}
        </ul>
      </Editorial>
    </section>
  );
}

function PopularItems({ ctx: { c, t, p } }: LandingSectionProps) {
  if (c.popularItems.length === 0) return null;
  const groups = new Map<string, typeof c.popularItems>();
  for (const it of c.popularItems.slice(0, 8)) {
    const k = it.category || c.terms.catalogLabel;
    groups.set(k, [...(groups.get(k) ?? []), it]);
  }
  return (
    <section className={`${wrap} py-20`}>
      <div style={{ background: t.surface, borderColor: t.border }} className="mx-auto max-w-3xl border p-2 shadow-sm">
        <div style={{ borderColor: mix(t.accent, t.border, 50) }} className="border px-5 py-10 sm:px-12">
          <SectionTitle t={t} title={c.terms.popularSectionLabel} sub={c.terms.popularSectionSubhead} />
          {[...groups.entries()].map(([cat, items]) => (
            <div key={cat} className="mt-8 first:mt-0">
              <h3 style={{ ...smallCaps, color: t.accent }} className="text-center text-base">
                {cat}
              </h3>
              <ul>
                {items.map((it, i) => (
                  <MenuLine key={`${it.name}-${i}`} t={t} name={it.name} price={it.price} description={it.description} />
                ))}
              </ul>
            </div>
          ))}
          {c.cta.menuBtn ? (
            <div className="mt-10 text-center">
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", "menu_button", { destination: "menu" })}
                style={{ ...smallCaps, background: t.textPrimary, color: t.bg }}
                className="inline-block px-6 py-2.5 text-sm"
              >
                The full {c.terms.catalogLabel.toLowerCase()}
              </p.LinkComponent>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Offers({ ctx: { c, t } }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: mix(t.accent, t.bg, 8) }} className="py-20">
      <div className={wrap}>
        <SectionTitle t={t} title="From the house" sub="A few reasons to come back this week." />
        <ul className="grid gap-6 md:grid-cols-3">
          {c.offers.map((o, i) => (
            <li key={i} style={{ background: t.bg, borderColor: t.border }} className="flex flex-col border">
              {o.image_url ? (
                <div className="relative aspect-[3/2]">
                  <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6 text-center">
                {o.badge_text || o.offer_value ? (
                  <p style={{ ...smallCaps, color: t.accent }} className="text-sm">
                    {o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off`}
                  </p>
                ) : null}
                {o.title ? (
                  <h3 style={{ color: t.textPrimary }} className="mt-1 text-xl">
                    {o.title}
                  </h3>
                ) : null}
                {o.description ? (
                  <p style={{ color: t.textSecondary }} className="mt-2 text-sm italic">
                    {o.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gallery({ ctx: { c, t }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, section.variant === "strip" ? 12 : 7).map((g) => g.image_url as string);
  if (section.variant === "strip") {
    return (
      <section className="py-16">
        <SectionTitle t={t} title="Around the dining room" />
        <div role="region" aria-label="Photos, scroll sideways" tabIndex={0} className="overflow-x-auto px-5 focus-visible:outline-2" style={{ outlineColor: t.accent }}>
          <ul className="flex snap-x gap-4">
            {photos.map((src, i) => (
              <li key={i} className="relative h-64 w-56 shrink-0 snap-center overflow-hidden">
                <Image src={src} alt={`Photo ${i + 1}`} fill sizes="224px" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  return (
    <section className={`${wrap} py-20`}>
      <SectionTitle t={t} title="Around the dining room" />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
        {photos.map((src, i) => (
          <li key={i} className={`relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
            <Image src={src} alt={`Photo ${i + 1}`} fill sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className="object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Reviews({ ctx: { c, t, p } }: LandingSectionProps) {
  if (c.googleReviews.length === 0) return null;
  const [first, ...rest] = c.googleReviews.slice(0, 4);
  return (
    <section style={{ background: t.sectionBg ?? t.surface }} className="py-20">
      <div className={`${wrap} max-w-4xl text-center`}>
        <svg aria-hidden="true" viewBox="0 0 40 30" className="mx-auto h-8 w-10" style={{ color: t.accent }}>
          <path fill="currentColor" d="M0 30V17C0 7 6 1 16 0v6c-5 1-8 4-8 9h8v15H0Zm24 0V17C24 7 30 1 40 0v6c-5 1-8 4-8 9h8v15H24Z" />
        </svg>
        <blockquote className="mt-6">
          <p style={{ color: t.textPrimary }} className="text-2xl italic leading-relaxed sm:text-3xl">
            {first.text}
          </p>
          <footer className="mt-5 flex flex-col items-center gap-1">
            <StarRating rating={first.rating} color={t.accent} />
            <cite style={{ ...smallCaps, color: t.textSecondary }} className="text-sm not-italic">
              {first.authorName}
              {first.relativePublishDescription ? `, ${first.relativePublishDescription}` : ""}
            </cite>
          </footer>
        </blockquote>
        {rest.length ? (
          <ul className="mt-14 flex flex-col gap-8 text-left md:flex-row md:justify-center">
            {rest.map((r) => (
              <li key={r.id} style={{ borderColor: t.border }} className="border-t pt-5 md:w-72">
                <StarRating rating={r.rating} color={t.accent} />
                {r.text ? (
                  <p style={{ color: t.textSecondary }} className="mt-2 italic">
                    “{r.text}”
                  </p>
                ) : null}
                <p style={{ ...smallCaps, color: t.textPrimary }} className="mt-3 text-sm">
                  {r.authorName}
                  {r.relativePublishDescription ? <span style={{ color: t.textSecondary }}> · {r.relativePublishDescription}</span> : null}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <button type="button" onClick={p.onReview} style={{ ...smallCaps, color: t.accent, borderColor: t.accent }} className="mt-12 border px-6 py-2.5 text-sm">
            Write a review on Google
          </button>
        ) : null}
      </div>
    </section>
  );
}

function Visit({ ctx: { c, t, p } }: LandingSectionProps) {
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;
  if (c.hours.length === 0 && !hasContact) return null;
  return (
    <section className={`${wrap} py-20`}>
      <SectionTitle t={t} title="Come and visit" />
      <div className="grid gap-10 md:grid-cols-2">
        {c.hours.length ? (
          <div>
            <h3 style={{ ...smallCaps, color: t.accent }} className="text-base">
              Opening hours
            </h3>
            <table className="mt-3 w-full text-left">
              <tbody>
                {c.hours.map((h) => (
                  <tr key={h.day} style={{ borderColor: t.border }} className="border-b">
                    <th scope="row" style={{ color: t.textPrimary }} className="py-2.5 font-normal">
                      {h.day}
                    </th>
                    <td style={{ color: t.textSecondary }} className="py-2.5 text-right tabular-nums">
                      {h.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {hasContact ? (
          <address style={{ background: t.surface, borderColor: t.border }} className="border p-7 not-italic">
            {c.address ? (
              <>
                <h3 style={{ ...smallCaps, color: t.accent }} className="text-base">
                  Find us
                </h3>
                <p style={{ color: t.textPrimary }} className="mt-2 text-lg">
                  {c.address}
                </p>
                {c.locationUrl ? (
                  <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="mt-1 inline-block underline underline-offset-4">
                    Get directions
                  </a>
                ) : null}
              </>
            ) : null}
            <ul className="mt-5 space-y-1.5" style={{ color: t.textSecondary }}>
              {c.phone ? (
                <li>
                  Telephone <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="underline-offset-4 hover:underline">{c.phone}</a>
                </li>
              ) : null}
              {c.email ? (
                <li>
                  Email <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="underline-offset-4 hover:underline">{c.email}</a>
                </li>
              ) : null}
              {c.whatsapp ? (
                <li>
                  WhatsApp{" "}
                  <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="underline-offset-4 hover:underline">
                    {c.whatsapp}
                  </a>
                </li>
              ) : null}
            </ul>
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} style={{ ...smallCaps, background: t.accent, color: t.accentText }} className="mt-6 px-5 py-2 text-sm">
                Pay your bill
              </button>
            ) : null}
            {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
              <figure className="mt-6">
                <div className="relative h-36 w-36 border p-2" style={{ borderColor: t.border, background: t.bg }}>
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-2" />
                </div>
                <figcaption style={{ color: t.textSecondary }} className="mt-2 text-sm italic">
                  Scan to pay
                </figcaption>
              </figure>
            ) : null}
          </address>
        ) : null}
      </div>
    </section>
  );
}

function Faq({ ctx: { c, t } }: LandingSectionProps) {
  if (c.faqs.length === 0) return null;
  return (
    <section style={{ background: mix(t.sectionBg ?? t.surface, t.bg, 50) }} className="py-20">
      <div className={`${wrap} max-w-3xl`}>
        <SectionTitle t={t} title="Good to know" />
        <div className="divide-y" style={{ borderColor: t.border }}>
          {c.faqs.map((f, i) => (
            <details key={`${f.q}-${i}`} className="group py-4" style={{ borderColor: t.border }}>
              <summary style={{ color: t.textPrimary }} className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg focus-visible:outline-2" >
                {f.q}
                <span aria-hidden="true" style={{ color: t.accent }} className="text-2xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p style={{ color: t.textSecondary }} className="mt-2 italic">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Divider({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `trattoria-div-${section.id}`;
  return (
    <div aria-hidden="true" className="py-4" style={{ background: t.bg }}>
      <div style={{ background: mix(t.accent, t.bg, 10), color: t.accent, borderColor: mix(t.accent, t.bg, 40) }} className="border-y">
        <svg className="block w-full" style={{ height: motif.h + 8 }}>
          <defs>
            <pattern id={id} width={motif.w} height={motif.h + 8} patternUnits="userSpaceOnUse">
              <g transform="translate(0 4)">{motif.tile}</g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
      </div>
    </div>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="columns" top={<DamaskBand t={ctx.t} />} />;
}

export const layout: LayoutDefinition = {
  key: "magazine",
  label: "Trattoria",
  description: "Classic dining room: centred wordmark, damask bands, a printed menu card.",
  Frame,
  sections: {
    intro: IntroSection,
    announcement: Announcement,
    hero: Hero,
    marquee: Marquee,
    stats: Stats,
    story: Story,
    "signature-dishes": SignatureDishes,
    "popular-items": PopularItems,
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
