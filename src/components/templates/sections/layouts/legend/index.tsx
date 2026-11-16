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
 * Legend — heritage-brand storytelling. Type is the hero: the restaurant's
 * name and section titles are set enormous, colour comes in whole blocks
 * mixed from the owner's accent, and food and photos are shown as round crops.
 * Everything else stays quiet so the scale reads.
 */

const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
const wrap = "mx-auto w-full max-w-7xl px-5 sm:px-10";

/** Display type that scales with the viewport. */
const display = (min: number, vw: number, max: number) => ({ fontSize: `clamp(${min}rem, ${vw}vw, ${max}rem)`, lineHeight: 0.95 });

/** A sunburst seal — the layout's recurring mark. */
function Seal({ className = "", color }: { className?: string; color: string }) {
  const rays = Array.from({ length: 24 });
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className} style={{ color }}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {rays.map((_, i) => (
          <line key={i} x1="50" y1="8" x2="50" y2={i % 2 ? 16 : 20} transform={`rotate(${i * 15} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
      <path d="M50 38 L53 47 L62 50 L53 53 L50 62 L47 53 L38 50 L47 47 Z" fill="currentColor" />
    </svg>
  );
}

function BigTitle({ t, children, align = "left", color }: { t: LandingSectionContext["t"]; children: React.ReactNode; align?: "left" | "center"; color?: string }) {
  return (
    <h2 style={{ ...display(2.6, 7, 6.5), color: color ?? t.textPrimary }} className={`${align === "center" ? "text-center" : ""} font-normal tracking-tight ${t.headingClass ?? ""}`}>
      {children}
    </h2>
  );
}

/* ── Frame ───────────────────────────────────────────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  return (
    <div style={{ background: t.bg }}>
      <header style={{ background: mix(t.bg, "transparent", 92), borderColor: t.border }} className="sticky top-0 z-40 border-b backdrop-blur">
        <div className={`${wrap} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex min-w-0 items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4" style={{ color: t.textPrimary, outlineColor: t.accent }}>
            {c.logoUrl ? (
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 2px ${t.accent}` }}>
                <Image src={c.logoUrl} alt="" fill sizes="40px" className="object-cover" />
              </span>
            ) : (
              <Seal className="h-10 w-10 shrink-0" color={t.accent} />
            )}
            <span className="truncate text-xl">{c.businessName}</span>
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} style={{ color: t.textSecondary, outlineColor: t.accent }} className="text-[15px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {c.cta.menuBtn ? (
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", "menu_button", {})}
                style={{ background: t.accent, color: t.accentText }}
                className="rounded-full px-5 py-2 text-sm font-semibold"
              >
                {c.terms.ctaLabel}
              </p.LinkComponent>
            ) : null}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close sections" : "Open sections"}
              onClick={() => setOpen((v) => !v)}
              style={{ color: t.textPrimary, borderColor: t.border, outlineColor: t.accent }}
              className="flex h-10 w-10 items-center justify-center rounded-full border lg:hidden focus-visible:outline-2"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                {open ? <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="2" /> : <path d="M3 6 H17 M3 10 H17 M3 14 H17" stroke="currentColor" strokeWidth="2" />}
              </svg>
            </button>
          </div>
        </div>
        <nav id={menuId} aria-label="Sections" className={`${open ? "block" : "hidden"} border-t lg:hidden`} style={{ borderColor: t.border }}>
          <ul className={`${wrap} grid grid-cols-2 gap-1 py-3`}>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)} style={{ color: t.textPrimary }} className="block py-2 text-lg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="top">{children}</main>
    </div>
  );
}

/* ── Sections ────────────────────────────────────────────────────────────── */

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <p role="note" style={{ background: t.accent, color: t.accentText }} className="px-4 py-2 text-center text-sm font-medium">
      {c.announcement}
    </p>
  );
}

function Hero({ ctx: { c, t, img, p } }: LandingSectionProps) {
  const photo = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  return (
    <section className={`${wrap} pb-16 pt-10 sm:pt-16`}>
      {t.badge ? (
        <p style={{ color: t.accent }} className="flex items-center gap-3 text-lg">
          <Seal className="h-8 w-8" color={t.accent} />
          {t.badge}
        </p>
      ) : null}
      <h1 style={{ ...display(3.2, 13, 12), color: t.textPrimary }} className={`mt-4 break-words font-normal tracking-tight ${t.headingClass ?? ""}`}>
        {c.businessName}
      </h1>
      <div className="mt-10 grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem]">
          <Image src={photo} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
        </div>
        <div>
          {t.heroTagline || c.slogan ? (
            <p style={{ color: t.textPrimary, ...display(1.6, 2.6, 2.4) }} className="leading-tight">
              {t.heroTagline || c.slogan}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {c.cta.menuBtn ? (
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", "menu_button", { destination: "menu" })}
                style={{ background: t.textPrimary, color: t.bg }}
                className="rounded-full px-7 py-3 font-semibold"
              >
                {c.terms.ctaLabel}
              </p.LinkComponent>
            ) : null}
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} style={{ borderColor: t.textPrimary, color: t.textPrimary }} className="rounded-full border-2 px-7 py-3 font-semibold">
                Pay bill
              </button>
            ) : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? (
              <button type="button" onClick={p.onReview} style={{ color: t.accent }} className="rounded-full px-4 py-3 font-semibold underline underline-offset-4">
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
    <div style={{ background: t.textPrimary, color: t.bg }} className="overflow-hidden py-5">
      <div className="flex w-max motion-safe:animate-[legend-scroll_32s_linear_infinite]">
        {[0, 1].map((k) => (
          <p key={k} aria-hidden={k === 1} className="flex shrink-0 items-center whitespace-nowrap" style={display(1.8, 3.2, 3)}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="px-8">{text}</span>
                <Seal className="h-10 w-10" color={t.accent} />
              </span>
            ))}
          </p>
        ))}
      </div>
      <style>{`@keyframes legend-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function Stats({ ctx: { c, t } }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  return (
    <section style={{ background: mix(t.accent, t.bg, 16) }} className="py-16">
      <dl className={`${wrap} grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4`}>
        {c.stats.map((s) => (
          <div key={s.label}>
            <dd style={{ ...display(3, 8, 7), color: t.accent }}><Counter value={s.value} /></dd>
            <dt style={{ color: t.textPrimary }} className="mt-3 text-lg">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Story({ ctx: { c, t, img } }: LandingSectionProps) {
  if (!c.story) return null;
  return (
    <section className={`${wrap} py-24`}>
      <BigTitle t={t}>{c.story.headline || "Our story"}</BigTitle>
      <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <Seal className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] opacity-30" color={t.accent} />
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image src={c.gallery[1]?.image_url || img.scene} alt={c.terms.heroAlt} fill sizes="(min-width: 768px) 30vw, 80vw" className="object-cover" />
          </div>
        </div>
        {c.story.body ? (
          <p style={{ color: t.textSecondary }} className="max-w-xl text-xl leading-relaxed">
            {c.story.body}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function RoundDish({ t, name, price, image, description }: { t: LandingSectionContext["t"]; name: string; price?: string; image: string; description?: string }) {
  return (
    <li className="w-44 shrink-0 snap-start text-center sm:w-52">
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 6px ${t.bg}, 0 0 0 7px ${mix(t.accent, t.bg, 50)}` }}>
        <Image src={image} alt={name} fill sizes="208px" className="object-cover" />
      </div>
      <h3 style={{ color: t.textPrimary }} className="mt-5 text-xl leading-tight">
        {name}
      </h3>
      {price ? (
        <p style={{ color: t.accent }} className="mt-1 text-lg">
          {price}
        </p>
      ) : null}
      {description ? (
        <p style={{ color: t.textSecondary }} className="mt-1 line-clamp-2 text-sm">
          {description}
        </p>
      ) : null}
    </li>
  );
}

function DishRow({ t, label, title, items, img }: { t: LandingSectionContext["t"]; label: string; title: string; items: Array<{ name: string; price?: string; image?: string | null; description?: string }>; img: string }) {
  return (
    <>
      <div className={wrap}>
        <p style={{ color: t.accent }} className="text-lg">
          {label}
        </p>
        <BigTitle t={t}>{title}</BigTitle>
      </div>
      <div role="region" aria-label={`${title}, scroll sideways`} tabIndex={0} className="mt-12 overflow-x-auto pb-4 focus-visible:outline-2" style={{ outlineColor: t.accent }}>
        <ul className={`${wrap} flex snap-x gap-8`}>
          {items.map((d, i) => (
            <RoundDish key={`${d.name}-${i}`} t={t} name={d.name} price={d.price} description={d.description} image={d.image || img} />
          ))}
        </ul>
      </div>
    </>
  );
}

function SignatureDishes({ ctx: { c, t, img } }: LandingSectionProps) {
  if (c.signatureDishes.length === 0) return null;
  return (
    <section style={{ background: mix(t.accent, t.bg, 10) }} className="py-24">
      <DishRow t={t} label={c.terms.featuredSectionLabel} title={c.terms.featuredSectionSubhead} items={c.signatureDishes} img={img.dish} />
    </section>
  );
}

function PopularItems({ ctx: { c, t, img, p } }: LandingSectionProps) {
  if (c.popularItems.length === 0) return null;
  return (
    <section className="py-24">
      <DishRow t={t} label={c.terms.popularSectionLabel} title={c.terms.popularSectionSubhead} items={c.popularItems} img={img.dish} />
      {c.cta.menuBtn ? (
        <div className={`${wrap} mt-10`}>
          <p.LinkComponent
            to={p.menuHref}
            onClick={() => p.track("click", "menu_button", { destination: "menu" })}
            style={{ color: t.textPrimary, borderColor: t.textPrimary }}
            className="inline-block rounded-full border-2 px-7 py-3 font-semibold"
          >
            See the whole {c.terms.catalogLabel.toLowerCase()}
          </p.LinkComponent>
        </div>
      ) : null}
    </section>
  );
}

function Offers({ ctx: { c, t, p } }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  return (
    <section style={{ background: t.accent, color: t.accentText }} className="relative overflow-hidden py-24">
      <Seal className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 opacity-20" color={t.accentText} />
      <div className={`${wrap} relative`}>
        <BigTitle t={t} color={t.accentText}>
          Join the regulars
        </BigTitle>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {c.offers.map((o, i) => (
            <li key={i} style={{ borderColor: mix(t.accentText, t.accent, 35) }} className="flex gap-5 rounded-3xl border p-6">
              {o.image_url ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                  <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="80px" className="object-cover" />
                </div>
              ) : null}
              <div>
                {o.badge_text || o.offer_value ? (
                  <p style={display(1.8, 3, 2.6)}>{o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off`}</p>
                ) : null}
                {o.title ? <h3 className="mt-2 text-xl">{o.title}</h3> : null}
                {o.description ? <p className="mt-1 opacity-85">{o.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <button type="button" onClick={p.onReview} style={{ background: t.accentText, color: t.accent }} className="mt-12 rounded-full px-8 py-3.5 text-lg font-semibold">
            Tell people about us
          </button>
        ) : null}
      </div>
    </section>
  );
}

function Gallery({ ctx: { c, t }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, section.variant === "strip" ? 12 : 8).map((g) => g.image_url as string);
  return (
    <section className="py-24">
      <div className={wrap}>
        <BigTitle t={t} align="center">
          Around the table
        </BigTitle>
      </div>
      <div role="region" aria-label="Photos, scroll sideways" tabIndex={0} className="mt-14 overflow-x-auto pb-4 focus-visible:outline-2" style={{ outlineColor: t.accent }}>
        <ul className={`${wrap} flex snap-x gap-6 md:justify-center`}>
          {photos.map((src, i) => (
            <li key={i} className={`relative shrink-0 snap-center overflow-hidden rounded-full ${i % 2 ? "mt-12 h-40 w-40" : "h-48 w-48"}`}>
              <Image src={src} alt={`Photo ${i + 1}`} fill sizes="192px" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reviews({ ctx: { c, t } }: LandingSectionProps) {
  if (c.googleReviews.length === 0) return null;
  return (
    <section style={{ background: mix(t.textPrimary, t.bg, 6) }} className="py-24">
      <div className={wrap}>
        <BigTitle t={t}>Said at our tables</BigTitle>
      </div>
      <div role="region" aria-label="Reviews, scroll sideways" tabIndex={0} className="mt-12 overflow-x-auto pb-6 focus-visible:outline-2" style={{ outlineColor: t.accent }}>
        <ul className={`${wrap} flex snap-x gap-6`}>
          {c.googleReviews.map((r) => (
            <li key={r.id} style={{ background: t.surface, borderColor: t.border }} className="flex w-80 shrink-0 snap-start flex-col rounded-[2rem] border p-8">
              <StarRating rating={r.rating} color={t.accent} />
              {r.text ? (
                <blockquote style={{ color: t.textPrimary }} className="mt-4 flex-1 text-xl leading-snug">
                  “{r.text}”
                </blockquote>
              ) : null}
              <p style={{ color: t.textSecondary }} className="mt-6">
                <span style={{ color: t.textPrimary }} className="font-semibold">
                  {r.authorName}
                </span>
                {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Visit({ ctx: { c, t, p } }: LandingSectionProps) {
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;
  // The left column also holds Pay bill; draw it only when something goes in it.
  const contactCol = Boolean(hasContact || (c.cta.payBtn && c.cta.paymentLink));
  if (c.hours.length === 0 && !contactCol) return null;
  return (
    <section className={`${wrap} py-24`}>
      <BigTitle t={t}>Come by</BigTitle>
      <div className={`mt-12 grid grid-cols-1 gap-12 ${contactCol && c.hours.length ? "md:grid-cols-2" : "max-w-2xl"}`}>
        {contactCol ? (
        <address className="not-italic">
          {c.address ? (
            <p style={{ color: t.textPrimary, ...display(1.6, 2.6, 2.4) }} className="leading-tight">
              {c.address}
            </p>
          ) : null}
          {c.locationUrl ? (
            <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="mt-6 inline-block rounded-full px-6 py-2.5 font-semibold">
              Get directions
            </a>
          ) : null}
          <ul className="mt-8 space-y-2 text-lg" style={{ color: t.textSecondary }}>
            {c.phone ? (
              <li>
                <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }} className="hover:underline">
                  {c.phone}
                </a>
              </li>
            ) : null}
            {c.email ? (
              <li>
                <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }} className="hover:underline">
                  {c.email}
                </a>
              </li>
            ) : null}
            {c.whatsapp ? (
              <li>
                <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }} className="hover:underline">
                  WhatsApp {c.whatsapp}
                </a>
              </li>
            ) : null}
          </ul>
          {c.cta.payBtn && c.cta.paymentLink ? (
            <button type="button" onClick={p.onPay} style={{ borderColor: t.textPrimary, color: t.textPrimary }} className="mt-8 rounded-full border-2 px-6 py-2.5 font-semibold">
              Pay bill
            </button>
          ) : null}
          {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
            <figure className="mt-6">
              <div className="relative h-36 w-36 overflow-hidden rounded-3xl border" style={{ borderColor: t.border, background: t.surface }}>
                <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-3" />
              </div>
              <figcaption style={{ color: t.textSecondary }} className="mt-2 text-sm">
                Scan to pay
              </figcaption>
            </figure>
          ) : null}
        </address>
        ) : null}
        {c.hours.length ? (
          <div style={{ background: mix(t.accent, t.bg, 12) }} className="rounded-[2rem] p-8">
            <h3 style={{ color: t.textPrimary }} className="text-2xl">
              Opening hours
            </h3>
            <dl className="mt-5 divide-y" style={{ borderColor: mix(t.accent, t.bg, 30) }}>
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4 py-3" style={{ borderColor: mix(t.accent, t.bg, 30) }}>
                  <dt style={{ color: t.textPrimary }}>{h.day}</dt>
                  <dd style={{ color: t.textSecondary }} className="tabular-nums">
                    {h.hours}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Faq({ ctx: { c, t } }: LandingSectionProps) {
  if (c.faqs.length === 0) return null;
  return (
    <section style={{ background: mix(t.accent, t.bg, 8) }} className="py-24">
      <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_1.4fr]`}>
        <BigTitle t={t}>Questions</BigTitle>
        <div className="divide-y" style={{ borderColor: t.border }}>
          {c.faqs.map((f, i) => (
            <details key={`${f.q}-${i}`} className="group py-5" style={{ borderColor: t.border }}>
              <summary style={{ color: t.textPrimary }} className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl">
                {f.q}
                <span aria-hidden="true" style={{ background: t.accent, color: t.accentText }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p style={{ color: t.textSecondary }} className="mt-3 text-lg">
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
  const id = `legend-div-${section.id}`;
  return (
    <div aria-hidden="true" className={`${wrap} flex items-center gap-4 py-10`} style={{ color: t.accent }}>
      <svg className="h-8 flex-1" style={{ height: motif.h }}>
        <defs>
          <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">
            {motif.tile}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <Seal className="h-14 w-14 shrink-0" color={t.accent} />
      <svg className="h-8 flex-1" style={{ height: motif.h }}>
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
  key: "cards",
  label: "Legend",
  description: "Heritage storytelling: huge type, colour blocks, round dish portraits.",
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
