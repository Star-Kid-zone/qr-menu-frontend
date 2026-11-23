"use client";

import Image from "@/components/ui/Image";
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
 * Odyssey Classic — calm Italian editorial. Everything centred; widely
 * letter-spaced type does the decorating; full-bleed photo bands between
 * chapters; the menu reads like a printed price list with dotted leaders.
 * All colours come from the owner's theme (ctx.t).
 */

const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** A small olive sprig — the layout's only ornament. */
function Sprig({ color, size = 44 }: { color: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 20" width={size} height={(size / 64) * 20} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M2 10 H62" />
      <path d="M20 10 C22 4 28 3 30 4 C29 8 25 10 20 10 Z" />
      <path d="M34 10 C36 16 42 17 44 16 C43 12 39 10 34 10 Z" />
      <circle cx="12" cy="10" r="1.6" fill={color} stroke="none" />
      <circle cx="52" cy="10" r="1.6" fill={color} stroke="none" />
    </svg>
  );
}

function Title({ t, children, light = false }: { t: LandingSectionContext["t"]; children: ReactNode; light?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 style={{ color: light ? "#fff" : t.textPrimary, letterSpacing: "0.32em" }} className={`text-xl sm:text-2xl ${t.headingClass ?? ""}`}>
        {children}
      </h2>
      <span className="mt-4">
        <Sprig color={light ? "rgba(255,255,255,.8)" : t.accent} />
      </span>
    </div>
  );
}

const outline =
  "inline-flex items-center justify-center px-8 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

function MenuLink({ ctx, light = false, label }: { ctx: LandingSectionContext; light?: boolean; label?: string }) {
  const { c, t, p } = ctx;
  if (!c.cta.menuBtn) return null;
  return (
    <p.LinkComponent
      to={p.menuHref}
      onClick={() => p.track("click", "menu_button", {})}
      style={{ border: `1px solid ${light ? "rgba(255,255,255,.85)" : t.textPrimary}`, color: light ? "#fff" : t.textPrimary, letterSpacing: "0.2em" }}
      className={outline}
    >
      {label ?? c.terms.ctaLabel}
    </p.LinkComponent>
  );
}

/** Full-bleed photo with a short line of text over it — used between chapters. */
function PhotoBand({ src, text }: { src: string; text: string }) {
  return (
    <div className="relative isolate flex min-h-[44vh] items-center justify-center overflow-hidden px-6 py-20 text-center">
      <Image src={src} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <p className="max-w-3xl text-2xl leading-snug text-white sm:text-4xl">{text}</p>
    </div>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t } = ctx;
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: mix(t.bg, "transparent", 94), backdropFilter: "blur(8px)", borderBottom: `1px solid ${mix(t.border, "transparent", 70)}` }}>
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 py-4">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="odyssey-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="justify-self-start p-2"
            style={{ color: t.textPrimary }}
          >
            <svg aria-hidden="true" width="26" height="18" viewBox="0 0 26 18" stroke="currentColor" strokeWidth="1.2">
              {open ? <path d="M5 1l16 16M21 1L5 17" /> : <path d="M0 2h26M0 9h26M0 16h26" />}
            </svg>
          </button>
          <a href="#" className="flex flex-col items-center text-center" style={{ color: t.textPrimary }}>
            {c.logoUrl ? (
              <span className="relative mb-1 h-9 w-9 overflow-hidden rounded-full">
                <Image src={c.logoUrl} alt="" fill sizes="36px" className="object-cover" />
              </span>
            ) : null}
            <span className={`text-lg sm:text-xl ${t.headingClass ?? ""}`} style={{ letterSpacing: "0.3em" }}>{c.businessName}</span>
          </a>
          <div className="hidden justify-self-end sm:block">
            <MenuLink ctx={ctx} />
          </div>
        </div>
        {open ? (
          <nav id="odyssey-nav" aria-label="Sections" style={{ borderTop: `1px solid ${mix(t.border, "transparent", 60)}` }}>
            <ul className="mx-auto flex max-w-4xl flex-col items-center gap-1 px-5 py-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block py-2 text-sm hover:opacity-70" style={{ color: t.textPrimary, letterSpacing: "0.25em" }}>
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="pt-3 sm:hidden">
                <MenuLink ctx={ctx} />
              </li>
            </ul>
          </nav>
        ) : (
          // Desktop keeps a quiet row of links visible; mobile uses the menu button above.
          <nav aria-label="Sections" className="hidden pb-3 md:block">
            <ul className="flex justify-center gap-8">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-xs hover:opacity-70" style={{ color: t.textSecondary, letterSpacing: "0.25em" }}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <main>{children}</main>
    </>
  );
}

/* ─────────────────────────── Sections ─────────────────────────── */

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <p style={{ background: t.textPrimary, color: t.bg, letterSpacing: "0.12em" }} className="px-4 py-2 text-center text-xs">
      {c.announcement}
    </p>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const tagline = t.heroTagline || c.slogan;
  return (
    <section className="relative isolate flex min-h-[86vh] items-center justify-center overflow-hidden px-6 text-center text-white">
      <Image src={c.bannerUrl || c.gallery[0]?.image_url || img.hero} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="max-w-4xl">
        {t.badge ? <p className="text-sm text-white/80" style={{ letterSpacing: "0.3em" }}>{t.badge}</p> : null}
        <h1 className={`mt-6 text-3xl leading-snug sm:text-5xl ${t.headingClass ?? ""}`} style={{ letterSpacing: "0.32em" }}>
          <span className="block text-base text-white/80 sm:text-lg" style={{ letterSpacing: "0.5em" }}>Welcome to</span>
          {c.businessName}
        </h1>
        {tagline ? <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">{tagline}</p> : null}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <MenuLink ctx={ctx} light />
          {c.cta.payBtn && c.cta.paymentLink ? (
            <button type="button" onClick={p.onPay} className={outline} style={{ border: "1px solid rgba(255,255,255,.5)", color: "#fff", letterSpacing: "0.2em" }}>
              Pay bill
            </button>
          ) : null}
          {c.cta.reviewBtn && c.cta.reviewLink ? (
            <button type="button" onClick={p.onReview} className={outline} style={{ border: "1px solid rgba(255,255,255,.35)", color: "rgba(255,255,255,.85)", letterSpacing: "0.2em" }}>
              Leave a review
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan || c.businessName;
  return (
    <div style={{ background: t.bg, color: t.textSecondary, borderBlock: `1px solid ${mix(t.border, "transparent", 70)}` }} className="overflow-hidden py-5">
      <div className="flex w-max motion-safe:animate-[odysseyMarquee_50s_linear_infinite]">
        {[0, 1].map((dup) => (
          <p key={dup} aria-hidden={dup === 1} className="shrink-0 whitespace-nowrap px-8 text-sm" style={{ letterSpacing: "0.4em" }}>
            {Array.from({ length: 4 }, () => text).join("     ✦     ")}
          </p>
        ))}
      </div>
      <style>{"@keyframes odysseyMarquee{to{transform:translateX(-50%)}}"}</style>
    </div>
  );
}

function Stats({ ctx: { c, t } }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-6 py-16">
      <dl className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-14 gap-y-8 text-center">
        {c.stats.map((s) => (
          <div key={s.label}>
            <dd style={{ color: t.textPrimary }} className={`text-4xl font-light ${t.headingClass ?? ""}`}><Counter value={s.value} /></dd>
            <dt style={{ color: t.textSecondary, letterSpacing: "0.2em" }} className="mt-2 text-xs">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <>
      <section style={{ background: t.bg }} className="px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-3xl">
          {c.story.headline ? <Title t={t}>{c.story.headline}</Title> : <Title t={t}>Our story</Title>}
          {c.story.body ? <p style={{ color: t.textSecondary }} className="mt-10 text-lg leading-loose sm:text-xl">{c.story.body}</p> : null}
          <div className="mt-12">
            <MenuLink ctx={ctx} label="Read the menu" />
          </div>
        </div>
      </section>
      <PhotoBand src={c.gallery[1]?.image_url || img.scene} text={c.slogan || c.terms.featuredSectionSubhead} />
    </>
  );
}

/** Printed-menu price list: name, dotted leader, price; description beneath. */
function PriceList({ ctx, items, title }: { ctx: LandingSectionContext; items: { name: string; description?: string; price?: string }[]; title: string }) {
  const { t } = ctx;
  return (
    <section style={{ background: ctx.sectionBg }} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Title t={t}>{title}</Title>
        <ul className="mt-14 grid gap-x-16 gap-y-9 md:grid-cols-2">
          {items.slice(0, 8).map((d, i) => (
            <li key={`${d.name}-${i}`}>
              <div className="flex items-baseline gap-3" style={{ color: t.textPrimary }}>
                <h3 className={`text-lg ${t.headingClass ?? ""}`}>{d.name}</h3>
                <span aria-hidden="true" className="flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: mix(t.textSecondary, "transparent", 60) }} />
                {d.price ? <span className="text-lg">{d.price}</span> : null}
              </div>
              {d.description ? <p style={{ color: t.textSecondary }} className="mt-1 text-sm italic">{d.description}</p> : null}
            </li>
          ))}
        </ul>
        <div className="mt-14 text-center">
          <MenuLink ctx={ctx} />
        </div>
      </div>
    </section>
  );
}

function Signature({ ctx }: LandingSectionProps) {
  if (ctx.c.signatureDishes.length === 0) return null;
  return <PriceList ctx={ctx} items={ctx.c.signatureDishes} title={ctx.c.terms.featuredSectionLabel} />;
}

/** Popular items get photographs: a calm three-up row of plates. */
function Popular({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (c.popularItems.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Title t={t}>{c.terms.popularSectionLabel}</Title>
        <ul className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {c.popularItems.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="text-center">
              <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-full">
                <Image src={d.image || img.dish} alt={d.name} fill sizes="280px" className="object-cover" />
              </div>
              <h3 style={{ color: t.textPrimary, letterSpacing: "0.15em" }} className={`mt-6 text-base ${t.headingClass ?? ""}`}>{d.name}</h3>
              {d.price ? <p style={{ color: t.accent }} className="mt-2">{d.price}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Offers({ ctx: { c, t } }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: t.bg }} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Title t={t}>Offers</Title>
        <ul className="mt-14 grid gap-px md:grid-cols-3" style={{ background: mix(t.border, "transparent", 70) }}>
          {c.offers.map((o, i) => {
            const value = o.badge_text || (o.offer_value ? `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off` : "");
            return (
              <li key={i} style={{ background: t.bg }} className="flex flex-col items-center px-6 py-10 text-center">
                {o.image_url ? (
                  <div className="relative mb-6 h-24 w-24 overflow-hidden rounded-full">
                    <Image src={o.image_url} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                ) : null}
                {value ? <p style={{ color: t.accent }} className={`text-3xl ${t.headingClass ?? ""}`}>{value}</p> : null}
                {o.title ? <h3 style={{ color: t.textPrimary, letterSpacing: "0.15em" }} className="mt-3 text-base">{o.title}</h3> : null}
                {o.description ? <p style={{ color: t.textSecondary }} className="mt-2 text-sm leading-relaxed">{o.description}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Gallery({ ctx: { c, t } }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  return (
    <section style={{ background: t.bg }} className="pt-24">
      <Title t={t}>Gallery</Title>
      {/* Edge-to-edge mosaic, no gutters at the page edges. */}
      <ul className="mt-14 grid grid-cols-2 gap-1 md:grid-cols-4">
        {photos.map((src, i) => (
          <li key={src + i} className={`relative overflow-hidden ${i % 5 === 0 ? "aspect-[4/5] md:row-span-2 md:aspect-auto" : "aspect-square"}`}>
            <Image src={src} alt={`${c.businessName} photo ${i + 1}`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  return (
    <section style={{ background: ctx.sectionBg }} className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Title t={t}>Kind words</Title>
        <ul className="mt-14 space-y-16 text-center">
          {c.googleReviews.slice(0, 3).map((r) => (
            <li key={r.id}>
              {r.text ? (
                <blockquote style={{ color: t.textPrimary }} className="text-xl italic leading-relaxed sm:text-2xl">
                  “{r.text}”
                </blockquote>
              ) : null}
              <p style={{ color: t.textSecondary, letterSpacing: "0.2em" }} className="mt-5 text-xs">
                {r.authorName} <span aria-hidden="true" style={{ color: t.accent }}>{"★".repeat(Math.round(r.rating))}</span>
                <span className="sr-only">{r.rating} out of 5 stars</span>
                {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
              </p>
            </li>
          ))}
        </ul>
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <div className="mt-14 text-center">
            <button type="button" onClick={p.onReview} className={outline} style={{ border: `1px solid ${t.textPrimary}`, color: t.textPrimary, letterSpacing: "0.2em" }}>
              Write a review
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p, img } = ctx;
  return (
    <>
      <PhotoBand src={c.gallery[2]?.image_url || img.hero} text={c.address ? `Find us at ${c.address}` : "We look forward to your visit"} />
      <section style={{ background: t.bg }} className="px-6 py-24 text-center">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2">
          {c.hours.length ? (
            <div>
              <Title t={t}>Hours</Title>
              <dl className="mx-auto mt-10 max-w-xs space-y-3">
                {c.hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-6" style={{ color: t.textPrimary }}>
                    <dt>{h.day}</dt>
                    <dd style={{ color: h.hours === "Closed" ? t.textSecondary : t.textPrimary }}>{h.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          <div>
            <Title t={t}>Contact</Title>
            <address style={{ color: t.textPrimary }} className="mt-10 space-y-3 not-italic">
              {c.address ? <p>{c.address}</p> : null}
              {c.locationUrl ? (
                <p>
                  <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: t.accent }} className="underline underline-offset-4">
                    Get directions
                  </a>
                </p>
              ) : null}
              {c.phone ? <p><a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a></p> : null}
              {c.email ? <p><a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a></p> : null}
              {c.whatsapp ? (
                <p>
                  <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    WhatsApp {c.whatsapp}
                  </a>
                </p>
              ) : null}
            </address>
            {c.social.length ? (
              <ul className="mt-6 flex flex-wrap justify-center gap-4">
                {c.social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm" style={{ color: t.textSecondary }}>
                      <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                      {getSocialPlatformLabel(s.platform, s.name)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {c.cta.payBtn && c.cta.paymentLink ? (
                <button type="button" onClick={p.onPay} className={outline} style={{ background: t.accent, color: t.accentText, letterSpacing: "0.2em" }}>
                  Pay bill
                </button>
              ) : null}
              {c.cta.reviewBtn && c.cta.reviewLink ? (
                <button type="button" onClick={p.onReview} className={outline} style={{ border: `1px solid ${t.textPrimary}`, color: t.textPrimary, letterSpacing: "0.2em" }}>
                  Write a review
                </button>
              ) : null}
            </div>
            {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
              <figure className="mt-8 flex flex-col items-center">
                <div className="relative h-36 w-36 bg-white p-2" style={{ border: `1px solid ${t.border}` }}>
                  <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-2" />
                </div>
                <figcaption style={{ color: t.textSecondary }} className="mt-2 text-sm">Scan to pay</figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <section style={{ background: ctx.sectionBg }} className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <Title t={t}>Questions</Title>
        <dl className="mt-12 space-y-10 text-center">
          {c.faqs.map((f, i) => (
            <div key={`${f.q}-${i}`}>
              <dt style={{ color: t.textPrimary }} className="text-lg">{f.q}</dt>
              <dd style={{ color: t.textSecondary }} className="mt-2 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Divider({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `odyssey-divider-${section.id}`;
  return (
    <div aria-hidden="true" style={{ background: t.bg, color: mix(t.accent, "transparent", 70) }} className="flex justify-center py-10">
      <svg width="160" height={motif.h}>
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
  return <FooterV2 ctx={ctx} align="center" />;
}

export const layout: LayoutDefinition = {
  key: "minimal",
  label: "Odyssey Classic",
  description: "Calm Italian editorial: centred wordmark, full-bleed photo bands, a printed price list.",
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
