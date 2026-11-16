"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { PiListBold, PiStarFill, PiXBold } from "react-icons/pi";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { IntroSection } from "../../landing/intro";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";

/*
 * Zen Grid — calm, exact, airy. A strict 12-column grid with hairline rules.
 * Each content section carries a numbered vertical label (CSS counter, so the
 * numbers always follow the owner's order). The one bold gesture: an
 * oversized name above a wide, cinematic photo strip.
 */

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
const hair = (t: LandingSectionContext["t"]) => mix(t.border, "transparent", 85);

/** Thin brush-like ensō circle. */
function Enso({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M50 14 A24 24 0 1 0 54 40" strokeWidth="3" />
      <path d="M52 18 A22 22 0 0 1 55 34" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/** Small stacked seigaiha waves used as a corner accent. */
function Waves({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 32" className={className} fill="none" stroke="currentColor" strokeWidth="1">
      {[0, 32, 64].map((x) => (
        <g key={x}>
          <path d={`M${x} 32 A16 16 0 0 1 ${x + 32} 32`} />
          <path d={`M${x + 5} 32 A11 11 0 0 1 ${x + 27} 32`} />
          <path d={`M${x + 10} 32 A6 6 0 0 1 ${x + 22} 32`} />
        </g>
      ))}
    </svg>
  );
}

/** A numbered content block: vertical label column + content on the 12-col grid. */
function Block({ ctx, label, children, id }: { ctx: LandingSectionContext; label: string; children: ReactNode; id?: string }) {
  const { t } = ctx;
  return (
    <section aria-labelledby={id} className={`${WRAP} zen-block`}>
      <div className="grid grid-cols-12 gap-x-6 border-t py-14 sm:py-20" style={{ borderColor: hair(t) }}>
        <div className="col-span-12 mb-6 lg:col-span-2 lg:mb-0">
          <p
            className="zen-num flex items-center gap-2 text-xs lg:[writing-mode:vertical-rl] lg:gap-3"
            style={{ color: t.textSecondary, letterSpacing: "0.18em" }}
          >
            <span>{label}</span>
          </p>
        </div>
        <div className="col-span-12 lg:col-span-10">{children}</div>
      </div>
    </section>
  );
}

function H2({ ctx, id, children }: { ctx: LandingSectionContext; id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={`text-3xl font-light leading-tight sm:text-4xl ${ctx.t.headingClass ?? ""}`} style={{ color: ctx.t.textPrimary }}>
      {children}
    </h2>
  );
}

/* ── Frame ─────────────────────────────────────────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh" style={{ background: t.bg }}>
      <style>{`
        [data-layout="horizontal-split"] main { counter-reset: zen; }
        [data-layout="horizontal-split"] .zen-num::before {
          counter-increment: zen;
          content: counter(zen, decimal-leading-zero);
          color: var(--site-accent);
        }
      `}</style>
      <header className="sticky top-0 z-30 backdrop-blur" style={{ background: mix(t.bg, "transparent", 90), borderBottom: `1px solid ${hair(t)}` }}>
        <div className={`${WRAP} flex h-16 items-center gap-6`}>
          <a href="#top" className="flex min-w-0 items-center gap-2.5" style={{ color: t.textPrimary }}>
            <Enso size={26} className="shrink-0" />
            <span className="truncate text-sm" style={{ letterSpacing: "0.12em" }}>
              {c.businessName}
            </span>
          </a>
          <nav aria-label="Page sections" className="ml-auto hidden md:block">
            <ul className="flex gap-6 text-sm">
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="underline-offset-8 hover:underline focus-visible:outline-1" style={{ color: t.textSecondary }}>
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
              className="ml-auto border px-4 py-1.5 text-sm md:ml-0"
              style={{ borderColor: t.textPrimary, color: t.textPrimary }}
            >
              {c.terms.ctaLabel}
            </p.LinkComponent>
          ) : null}
          {nav.length ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls="zen-mobile-nav"
              aria-label={open ? "Close sections" : "Open sections"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center md:hidden"
              style={{ color: t.textPrimary }}
            >
              {open ? <PiXBold aria-hidden="true" /> : <PiListBold aria-hidden="true" />}
            </button>
          ) : null}
        </div>
        {open ? (
          <nav id="zen-mobile-nav" aria-label="Page sections" className="md:hidden" style={{ borderTop: `1px solid ${hair(t)}` }}>
            <ul className={`${WRAP} divide-y py-1`} style={{ borderColor: hair(t) }}>
              {nav.map((item) => (
                <li key={item.id} style={{ borderColor: hair(t) }}>
                  <a href={`#${item.id}`} onClick={() => setOpen(false)} className="block py-3 text-sm" style={{ color: t.textPrimary }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <main id="top">{children}</main>
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────────────── */

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <p className="border-b py-2.5 text-center text-xs" style={{ borderColor: hair(t), color: t.textSecondary, letterSpacing: "0.08em" }}>
      {c.announcement}
    </p>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, p, img } = ctx;
  const tagline = t.heroTagline || c.slogan;
  const photo = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  return (
    <section aria-label="Welcome">
      <div className={`${WRAP} grid grid-cols-12 gap-x-6 pb-10 pt-14 sm:pt-24`}>
        <div className="col-span-12 lg:col-span-9">
          {t.badge ? (
            <p className="mb-6 text-xs" style={{ color: t.accent, letterSpacing: "0.2em" }}>
              {t.badge}
            </p>
          ) : null}
          <h1
            className={`text-[clamp(2.75rem,9vw,7.5rem)] font-light leading-[0.95] ${t.headingClass ?? ""}`}
            style={{ color: t.textPrimary, letterSpacing: "-0.02em" }}
          >
            {c.businessName}
          </h1>
        </div>
        <div className="col-span-12 mt-8 flex flex-col justify-end gap-6 lg:col-span-3 lg:mt-0">
          {tagline ? (
            <p className="max-w-[32ch] text-base leading-relaxed" style={{ color: t.textSecondary }}>
              {tagline}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 text-sm">
            {c.cta.menuBtn ? (
              <p.LinkComponent
                to={p.menuHref}
                onClick={() => p.track("click", "menu_button", { destination: "menu" })}
                className="px-5 py-2.5"
                style={{ background: t.textPrimary, color: t.bg }}
              >
                {c.terms.ctaLabel}
              </p.LinkComponent>
            ) : null}
            {c.cta.payBtn && c.cta.paymentLink ? (
              <button type="button" onClick={p.onPay} className="border px-5 py-2.5" style={{ borderColor: hair(t), color: t.textPrimary }}>
                Pay bill
              </button>
            ) : null}
            {c.cta.reviewBtn && c.cta.reviewLink ? (
              <button type="button" onClick={p.onReview} className="border px-5 py-2.5" style={{ borderColor: hair(t), color: t.textPrimary }}>
                Leave a review
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`${WRAP}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/8]">
          <Image src={photo} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1152px) 1088px, 100vw" className="object-cover" />
          {c.logoUrl ? (
            <div className="absolute bottom-4 left-4 h-14 w-14 overflow-hidden rounded-full border-2" style={{ borderColor: t.bg }}>
              <Image src={c.logoUrl} alt={`${c.businessName} logo`} fill sizes="56px" className="object-cover" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan;
  if (!text) return null;
  return (
    <div className={`${WRAP} py-8`}>
      <div className="flex items-center gap-5" style={{ color: t.textSecondary }}>
        <Waves className="hidden h-4 w-12 shrink-0 sm:block" />
        <p className="text-center text-sm sm:text-left" style={{ letterSpacing: "0.22em" }}>
          {text}
        </p>
        <span className="hidden h-px flex-1 sm:block" style={{ background: hair(t) }} />
      </div>
    </div>
  );
}

function Stats({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.stats.length === 0) return null;
  return (
    <div className={WRAP}>
      <dl className="grid grid-cols-2 border-t sm:grid-cols-4" style={{ borderColor: hair(t) }}>
        {c.stats.map((s, i) => (
          <div key={s.label} className={`py-8 pr-4 ${i % 2 ? "pl-6 sm:pl-6" : ""} ${i > 0 ? "sm:border-l sm:pl-6" : ""}`} style={{ borderColor: hair(t) }}>
            <dd className="text-4xl font-light" style={{ color: t.textPrimary }}>
              <Counter value={s.value} />
            </dd>
            <dt className="mt-2 text-xs" style={{ color: t.textSecondary, letterSpacing: "0.12em" }}>
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <Block ctx={ctx} label="Story" id="zen-story">
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-10 md:col-span-6">
          {c.story.headline ? (
            <H2 ctx={ctx} id="zen-story">
              {c.story.headline}
            </H2>
          ) : null}
          {c.story.body ? (
            <p className="mt-6 max-w-[60ch] text-lg leading-[1.8]" style={{ color: t.textSecondary }}>
              {c.story.body}
            </p>
          ) : null}
        </div>
        <div className="col-span-10 md:col-span-3 md:col-start-8">
          <div className="relative aspect-square w-full max-w-[260px] overflow-hidden">
            <Image src={img.scene} alt={c.terms.heroAlt} fill sizes="260px" className="object-cover" />
          </div>
          <Enso className="mt-4" size={36} />
        </div>
      </div>
    </Block>
  );
}

type Row = { name: string; description?: string; price?: string; image?: string | null };

function MenuTable({ ctx, rows, label, heading, trackKey }: { ctx: LandingSectionContext; rows: Row[]; label: string; heading: string; trackKey: string }) {
  const { c, t, p, img } = ctx;
  return (
    <Block ctx={ctx} label={label}>
      <div className="flex items-end justify-between gap-4">
        <H2 ctx={ctx}>{heading}</H2>
        {c.cta.menuBtn ? (
          <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", trackKey, {})} className="shrink-0 text-sm underline underline-offset-8" style={{ color: t.textPrimary }}>
            {c.terms.catalogLabel}
          </p.LinkComponent>
        ) : null}
      </div>
      <ul className="mt-10 border-t" style={{ borderColor: hair(t) }}>
        {rows.slice(0, 8).map((r, i) => (
          <li key={`${r.name}-${i}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-4 border-b py-4 sm:grid-cols-[72px_1fr_auto]" style={{ borderColor: hair(t) }}>
            <div className="relative aspect-square overflow-hidden">
              <Image src={r.image || img.dish} alt={r.name} fill sizes="72px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-base" style={{ color: t.textPrimary }}>
                {r.name}
              </p>
              {r.description ? (
                <p className="mt-0.5 line-clamp-2 text-sm" style={{ color: t.textSecondary }}>
                  {r.description}
                </p>
              ) : null}
            </div>
            <p className="text-base tabular-nums" style={{ color: t.textPrimary }}>
              {r.price ?? ""}
            </p>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function SignatureDishes({ ctx }: LandingSectionProps) {
  if (ctx.c.signatureDishes.length === 0) return null;
  return <MenuTable ctx={ctx} rows={ctx.c.signatureDishes} label={ctx.c.terms.featuredSectionLabel} heading={ctx.c.terms.featuredSectionSubhead} trackKey="dish_card" />;
}

function PopularItems({ ctx }: LandingSectionProps) {
  if (ctx.c.popularItems.length === 0) return null;
  return <MenuTable ctx={ctx} rows={ctx.c.popularItems} label={ctx.c.terms.popularSectionLabel} heading={ctx.c.terms.popularSectionSubhead} trackKey="popular_item" />;
}

function Offers({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.offers.length === 0) return null;
  return (
    <Block ctx={ctx} label="Offers">
      <H2 ctx={ctx}>Current offers</H2>
      <ul className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: hair(t) }}>
        {c.offers.map((o, i) => {
          const badge = o.badge_text || (o.offer_value ? `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off` : "");
          return (
            <li key={i} className="flex flex-col p-6" style={{ background: t.bg }}>
              {o.image_url ? (
                <div className="relative mb-5 aspect-[4/3] overflow-hidden">
                  <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="(min-width: 1024px) 340px, 100vw" className="object-cover" />
                </div>
              ) : null}
              {badge ? (
                <p className="text-xs" style={{ color: t.accent, letterSpacing: "0.14em" }}>
                  {badge}
                </p>
              ) : null}
              {o.title ? (
                <h3 className="mt-2 text-xl font-light" style={{ color: t.textPrimary }}>
                  {o.title}
                </h3>
              ) : null}
              {o.description ? (
                <p className="mt-2 text-sm leading-relaxed" style={{ color: t.textSecondary }}>
                  {o.description}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Block>
  );
}

function Gallery({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.gallery.length === 0) return null;
  return (
    <Block ctx={ctx} label="Gallery">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Photos">
        {c.gallery.slice(0, 8).map((g, i) => (
          <li key={i} className="relative aspect-square overflow-hidden">
            <Image src={g.image_url as string} alt={`${c.businessName} photo ${i + 1}`} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
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
    <Block ctx={ctx} label="Guests">
      <ul className="grid gap-12 md:grid-cols-3">
        {c.googleReviews.slice(0, 3).map((r) => (
          <li key={r.id}>
            <figure>
              <span className="inline-flex gap-0.5 text-xs" style={{ color: t.accent }} role="img" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: Math.round(r.rating) }, (_, i) => (
                  <PiStarFill key={i} aria-hidden="true" />
                ))}
              </span>
              {r.text ? (
                <blockquote className="mt-4 text-lg font-light leading-relaxed" style={{ color: t.textPrimary }}>
                  {r.text}
                </blockquote>
              ) : null}
              <figcaption className="mt-4 text-sm" style={{ color: t.textSecondary }}>
                {r.authorName}
                {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {c.cta.reviewBtn && c.cta.reviewLink ? (
        <button type="button" onClick={p.onReview} className="mt-12 border-b pb-1 text-sm" style={{ borderColor: t.textPrimary, color: t.textPrimary }}>
          Write a review
        </button>
      ) : null}
    </Block>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  const hasContact = c.address || c.phone || c.email || c.whatsapp || c.social.length > 0;
  const qr = c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage;
  if (c.hours.length === 0 && !hasContact && !qr) return null;
  const row = "grid grid-cols-[minmax(0,7rem)_1fr] gap-4 border-b py-3 text-sm";
  return (
    <Block ctx={ctx} label="Visit">
      <div className="grid gap-12 md:grid-cols-2">
        {c.hours.length ? (
          <div>
            <h2 className={`mb-6 text-2xl font-light ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
              Hours
            </h2>
            <dl className="border-t" style={{ borderColor: hair(t) }}>
              {c.hours.map((h) => (
                <div key={h.day} className={row} style={{ borderColor: hair(t) }}>
                  <dt style={{ color: t.textSecondary }}>{h.day}</dt>
                  <dd style={{ color: t.textPrimary }}>{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
        <div>
          <h2 className={`mb-6 text-2xl font-light ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
            Find us
          </h2>
          <dl className="border-t" style={{ borderColor: hair(t) }}>
            {c.address ? (
              <div className={row} style={{ borderColor: hair(t) }}>
                <dt style={{ color: t.textSecondary }}>Address</dt>
                <dd style={{ color: t.textPrimary }}>
                  {c.address}
                  {c.locationUrl ? (
                    <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block underline underline-offset-4" style={{ color: t.accent }}>
                      Directions
                    </a>
                  ) : null}
                </dd>
              </div>
            ) : null}
            {c.phone ? (
              <div className={row} style={{ borderColor: hair(t) }}>
                <dt style={{ color: t.textSecondary }}>Phone</dt>
                <dd>
                  <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }}>
                    {c.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {c.email ? (
              <div className={row} style={{ borderColor: hair(t) }}>
                <dt style={{ color: t.textSecondary }}>Email</dt>
                <dd className="break-all">
                  <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }}>
                    {c.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {c.whatsapp ? (
              <div className={row} style={{ borderColor: hair(t) }}>
                <dt style={{ color: t.textSecondary }}>WhatsApp</dt>
                <dd>
                  <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: t.textPrimary }}>
                    {c.whatsapp}
                  </a>
                </dd>
              </div>
            ) : null}
            {c.social.length ? (
              <div className={row} style={{ borderColor: hair(t) }}>
                <dt style={{ color: t.textSecondary }}>Follow</dt>
                <dd className="flex flex-wrap gap-4">
                  {c.social.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5" style={{ color: t.textPrimary }}>
                      <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                      {getSocialPlatformLabel(s.platform, s.name)}
                    </a>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
          {c.cta.payBtn && c.cta.paymentLink ? (
            <button type="button" onClick={p.onPay} className="mt-6 border px-5 py-2.5 text-sm" style={{ borderColor: t.textPrimary, color: t.textPrimary }}>
              Pay bill
            </button>
          ) : null}
          {qr ? (
            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-24 w-24 border bg-white" style={{ borderColor: hair(t) }}>
                <Image src={c.cta.paymentQrImage as string} alt="Payment QR code" fill sizes="96px" className="object-contain p-1.5" />
              </div>
              <p className="text-sm" style={{ color: t.textSecondary }}>
                Scan to pay
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Block>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <Block ctx={ctx} label="Questions">
      <div className="border-t" style={{ borderColor: hair(t) }}>
        {c.faqs.map((f, i) => (
          <details key={`${f.q}-${i}`} className="group border-b py-5" style={{ borderColor: hair(t) }}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-light" style={{ color: t.textPrimary }}>
              {f.q}
              <span aria-hidden="true" className="mt-1 text-sm transition-transform motion-safe:group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[64ch] text-base leading-relaxed" style={{ color: t.textSecondary }}>
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
  const id = `zen-div-${section.id}`;
  return (
    <div aria-hidden="true" className={`${WRAP} py-10`} style={{ color: t.textSecondary }}>
      <svg className="mx-auto block w-full max-w-md opacity-50" style={{ height: motif.h }}>
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
  key: "horizontal-split",
  label: "Zen Grid",
  description: "Calm and exact: a large name over a wide photo strip, numbered sections and fine lines.",
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
