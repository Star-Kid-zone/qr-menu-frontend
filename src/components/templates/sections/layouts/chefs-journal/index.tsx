"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
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
 * Chef's Journal — the restaurant told as a book. Each content section is a
 * chapter numbered with a CSS counter (so the numbering follows the owner's
 * order), hung on a thin timeline rail. Long-form serif rhythm, tasting-menu
 * courses, a filmstrip gallery and a colophon footer.
 */

const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Chapter wrapper: a numeral from the page counter, a small-caps label and the rail node. */
function Chapter({ ctx, label, title, children, wide = false }: { ctx: LandingSectionContext; label: string; title?: ReactNode; children: ReactNode; wide?: boolean }) {
  const { t } = ctx;
  return (
    <section className="relative px-5 py-16 sm:px-10 md:py-24 [counter-increment:chapter]">
      {/* Rail node */}
      <span aria-hidden="true" className="absolute left-5 top-16 hidden h-3 w-3 -translate-x-[5px] rounded-full border-2 sm:left-10 md:top-24 lg:block" style={{ borderColor: t.accent, background: t.bg }} />
      <div className={`mx-auto ${wide ? "max-w-5xl" : "max-w-3xl"} lg:pl-16`}>
        <div className="mb-8 flex items-end gap-5">
          <span
            aria-hidden="true"
            className="font-light leading-none before:content-[counter(chapter,upper-roman)]"
            style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)", color: "transparent", WebkitTextStroke: `1.5px ${t.accent}` }}
          />
          <div className="pb-2">
            <p className="text-sm [font-variant:small-caps] tracking-[0.18em]" style={{ color: t.accent }}>
              {label}
            </p>
            {title ? (
              <h2 className={`mt-1 text-2xl leading-snug sm:text-4xl ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
                {title}
              </h2>
            ) : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  const [open, setOpen] = useState(false);
  return (
    <div className="relative [counter-reset:chapter]">
      <style>{`
        @keyframes cj-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @supports (animation-timeline: scroll()) {
          .cj-progress { animation: cj-progress linear both; animation-timeline: scroll(root); }
        }
      `}</style>
      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ background: mix(t.bg, "transparent", 88), borderColor: mix(t.border, "transparent", 70) }}>
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-10">
          <a href="#top" className="flex min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4" style={{ color: t.textPrimary, outlineColor: t.accent }}>
            {c.logoUrl ? (
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <Image src={c.logoUrl} alt="" fill sizes="32px" className="object-cover" />
              </span>
            ) : null}
            <span className={`truncate text-lg italic ${t.headingClass ?? ""}`}>{c.businessName}</span>
          </a>
          <nav aria-label="Chapters" className="ml-auto hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm [font-variant:small-caps] tracking-[0.14em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4" style={{ color: t.textSecondary, outlineColor: t.accent }}>
                {item.label}
              </a>
            ))}
          </nav>
          {c.cta.menuBtn ? (
            <p.LinkComponent
              to={p.menuHref}
              onClick={() => p.track("click", "menu_button", {})}
              className="ml-auto hidden rounded-full border px-4 py-1.5 text-sm transition-colors sm:inline-block md:ml-0"
              style={{ borderColor: t.accent, color: t.accent }}
            >
              Read the menu
            </p.LinkComponent>
          ) : null}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="cj-nav-mobile"
            onClick={() => setOpen((o) => !o)}
            className="ml-auto rounded-md p-2 focus-visible:outline-2 md:hidden"
            style={{ color: t.textPrimary, outlineColor: t.accent }}
          >
            <span className="sr-only">{open ? "Close chapters" : "Open chapters"}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h10" />}
            </svg>
          </button>
        </div>
        {open ? (
          <nav id="cj-nav-mobile" aria-label="Chapters" className="border-t px-5 pb-4 pt-2 md:hidden" style={{ borderColor: mix(t.border, "transparent", 70) }}>
            <ol className="space-y-1">
              {nav.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={() => setOpen(false)} className="flex gap-3 py-1.5 text-base" style={{ color: t.textPrimary }}>
                    <span style={{ color: t.accent }}>{["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][i] ?? i + 1}</span>
                    {item.label}
                  </a>
                </li>
              ))}
              {c.cta.menuBtn ? (
                <li className="pt-2">
                  <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", "menu_button", {})} className="inline-block rounded-full px-4 py-2 text-sm" style={{ background: t.accent, color: t.accentText }}>
                    Read the menu
                  </p.LinkComponent>
                </li>
              ) : null}
            </ol>
          </nav>
        ) : null}
        <span aria-hidden="true" className="cj-progress absolute bottom-0 left-0 block h-[2px] w-full origin-left" style={{ background: t.accent, transform: "scaleX(0)" }} />
      </header>
      <div id="top" className="relative">
        {/* The timeline rail every chapter hangs on */}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-5 top-0 hidden w-px sm:left-10 lg:block" style={{ background: mix(t.accent, "transparent", 35) }} />
        {children}
      </div>
    </div>
  );
}

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <p className="px-5 py-3 text-center text-sm italic" style={{ background: mix(t.accent, t.bg, 12), color: t.textPrimary }}>
      {c.announcement}
    </p>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const photo = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  return (
    <section className="relative grid min-h-[88svh] lg:grid-cols-2">
      <div className="relative order-2 flex flex-col justify-center px-5 py-16 sm:px-10 lg:order-1 lg:px-16">
        {t.badge ? (
          <p className="mb-6 text-sm [font-variant:small-caps] tracking-[0.18em]" style={{ color: t.accent }}>
            {t.badge}
          </p>
        ) : null}
        <h1 className={`text-5xl leading-[1.02] sm:text-7xl ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
          {c.businessName}
        </h1>
        {(t.heroTagline || c.slogan) && (
          <p className="mt-6 max-w-md text-lg italic leading-relaxed" style={{ color: t.textSecondary }}>
            {t.heroTagline || c.slogan}
          </p>
        )}
        <svg aria-hidden="true" viewBox="0 0 220 20" className="mt-10 h-5 w-56" style={{ color: t.accent }}>
          <path d="M2 10 H96" stroke="currentColor" strokeWidth="1" />
          <path d="M110 3 L117 10 L110 17 L103 10 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M124 10 H218" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="mt-10 flex flex-wrap gap-3">
          {c.cta.menuBtn && (
            <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", "menu_button", { destination: "menu" })} className="rounded-full px-7 py-3 text-sm tracking-wide" style={{ background: t.accent, color: t.accentText }}>
              {c.terms.ctaLabel}
            </p.LinkComponent>
          )}
          {c.cta.payBtn && c.cta.paymentLink && (
            <button type="button" onClick={p.onPay} className="rounded-full border px-7 py-3 text-sm tracking-wide" style={{ borderColor: t.border, color: t.textPrimary }}>
              Pay bill
            </button>
          )}
          {c.cta.reviewBtn && c.cta.reviewLink && (
            <button type="button" onClick={p.onReview} className="px-2 py-3 text-sm underline decoration-1 underline-offset-4" style={{ color: t.textSecondary }}>
              Leave a review
            </button>
          )}
        </div>
      </div>
      <div className="relative order-1 min-h-[52svh] lg:order-2 lg:min-h-full">
        <Image src={photo} alt={c.businessName} fill loading="eager" fetchPriority="high" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent 40%)" }} />
        {c.logoUrl ? (
          <span className="absolute bottom-6 left-6 h-16 w-16 overflow-hidden rounded-full border-2 border-white/80 shadow-lg">
            <Image src={c.logoUrl} alt={`${c.businessName} logo`} fill sizes="64px" className="object-cover" />
          </span>
        ) : null}
      </div>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.businessName;
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: mix(t.border, "transparent", 80) }} aria-label={text}>
      <div aria-hidden="true" className="flex w-max gap-10 whitespace-nowrap text-2xl italic motion-safe:animate-[cj-marquee_40s_linear_infinite]" style={{ color: mix(t.textPrimary, "transparent", 60) }}>
        <style>{`@keyframes cj-marquee { to { transform: translateX(-50%); } }`}</style>
        {[0, 1].map((k) => (
          <span key={k} className="flex gap-10">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                {text}
                <span className="mx-10" style={{ color: t.accent }}>
                  ❦
                </span>
              </span>
            ))}
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
    <Chapter ctx={ctx} label="By the numbers">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        {c.stats.map((s) => (
          <div key={s.label} className="border-t pt-4" style={{ borderColor: mix(t.accent, "transparent", 50) }}>
            <dd className="text-4xl" style={{ color: t.textPrimary }}>
              <Counter value={s.value} />
            </dd>
            <dt className="mt-2 text-sm" style={{ color: t.textSecondary }}>
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <Chapter ctx={ctx} label="Our story" title={c.story.headline || undefined} wide>
      <div className="grid items-start gap-10 md:grid-cols-[1.1fr_0.9fr]">
        {c.story.body ? (
          <p
            className="text-lg leading-[1.85] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-[var(--site-accent)]"
            style={{ color: t.textSecondary }}
          >
            {c.story.body}
          </p>
        ) : null}
        <figure className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={c.gallery[1]?.image_url || img.scene} alt={c.terms.heroAlt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm italic" style={{ color: t.textSecondary }}>
            {c.businessName}
          </figcaption>
        </figure>
      </div>
    </Chapter>
  );
}

/** Tasting-menu style course list. */
function Courses({ ctx, items, label, title, track }: { ctx: LandingSectionContext; items: Array<{ name: string; description?: string; price?: string; image?: string | null }>; label: string; title: string; track: string }) {
  const { c, t, p } = ctx;
  if (items.length === 0) return null;
  return (
    <Chapter ctx={ctx} label={label} title={title}>
      <ol className="divide-y" style={{ borderColor: mix(t.border, "transparent", 60) }}>
        {items.slice(0, 6).map((it, i) => (
          <li key={`${it.name}-${i}`} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6" style={{ borderColor: mix(t.border, "transparent", 60) }}>
            <span className="text-sm" style={{ color: t.accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-xl" style={{ color: t.textPrimary }}>
                {it.name}
              </h3>
              {it.description ? (
                <p className="mt-1 italic" style={{ color: t.textSecondary }}>
                  {it.description}
                </p>
              ) : null}
            </div>
            {it.price ? (
              <span className="text-base tabular-nums" style={{ color: t.textPrimary }}>
                {it.price}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {c.cta.menuBtn ? (
        <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", track, {})} className="mt-8 inline-block border-b pb-1 text-sm" style={{ borderColor: t.accent, color: t.accent }}>
          {c.terms.ctaLabel}
        </p.LinkComponent>
      ) : null}
    </Chapter>
  );
}

function Signature({ ctx }: LandingSectionProps) {
  return <Courses ctx={ctx} items={ctx.c.signatureDishes} label="The tasting menu" title={ctx.c.terms.featuredSectionSubhead} track="dish_card" />;
}

function Popular({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (c.popularItems.length === 0) return null;
  return (
    <Chapter ctx={ctx} label={c.terms.popularSectionLabel} title={c.terms.popularSectionSubhead} wide>
      <div className="grid gap-10 sm:grid-cols-2">
        {c.popularItems.slice(0, 4).map((it, i) => (
          <article key={`${it.name}-${i}`} className={i % 2 === 1 ? "sm:mt-16" : ""}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={it.image || img.dish} alt={it.name} fill sizes="(min-width:640px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="text-xl" style={{ color: t.textPrimary }}>
                {it.name}
              </h3>
              {it.price ? <span style={{ color: t.accent }}>{it.price}</span> : null}
            </div>
            {it.description ? (
              <p className="mt-1 italic" style={{ color: t.textSecondary }}>
                {it.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Chapter>
  );
}

function Offers({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.offers.length === 0) return null;
  return (
    <Chapter ctx={ctx} label="For our guests" title="Invitations">
      <ul className="space-y-6">
        {c.offers.map((o, i) => (
          <li key={i} className="grid gap-5 border p-6 sm:grid-cols-[auto_1fr]" style={{ borderColor: mix(t.accent, "transparent", 40), background: mix(t.surface, "transparent", 60) }}>
            {o.image_url ? (
              <div className="relative h-28 w-full overflow-hidden sm:w-36">
                <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="144px" className="object-cover" />
              </div>
            ) : null}
            <div>
              {(o.offer_value || o.badge_text) && (
                <p className="text-sm italic" style={{ color: t.accent }}>
                  {o.badge_text || `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off`}
                </p>
              )}
              {o.title ? (
                <h3 className="mt-1 text-xl" style={{ color: t.textPrimary }}>
                  {o.title}
                </h3>
              ) : null}
              {o.description ? (
                <p className="mt-2" style={{ color: t.textSecondary }}>
                  {o.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

function Gallery({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  return (
    <Chapter ctx={ctx} label="Moments" title="From the dining room" wide>
      <div role="region" aria-label="Photos, scroll sideways" tabIndex={0} className="overflow-x-auto pb-4 focus-visible:outline-2" style={{ outlineColor: t.accent }}>
        <ul className="flex gap-3 p-3" style={{ background: t.textPrimary }}>
          {photos.map((src, i) => (
            <li key={i} className="shrink-0">
              {/* film sprocket holes */}
              <div aria-hidden="true" className="mb-2 flex gap-2">
                {Array.from({ length: 8 }, (_, k) => (
                  <span key={k} className="h-2 w-3 rounded-sm" style={{ background: t.bg, opacity: 0.85 }} />
                ))}
              </div>
              <div className="relative h-52 w-64 overflow-hidden sm:h-60 sm:w-80">
                <Image src={src} alt={`Gallery ${i + 1}`} fill sizes="320px" className="object-cover" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Chapter>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.googleReviews.length === 0) return null;
  return (
    <Chapter ctx={ctx} label="Letters from guests" title="What they wrote">
      <div className="space-y-14">
        {c.googleReviews.slice(0, 4).map((r) => (
          <figure key={r.id} className="relative pl-12">
            <svg aria-hidden="true" viewBox="0 0 40 32" className="absolute left-0 top-0 h-8 w-10" style={{ color: mix(t.accent, "transparent", 70) }}>
              <path fill="currentColor" d="M0 32V18C0 8 6 1 16 0l2 4c-6 2-9 6-9 12h7v16H0zm22 0V18c0-10 6-17 16-18l2 4c-6 2-9 6-9 12h7v16H22z" />
            </svg>
            {r.text ? (
              <blockquote className="text-2xl italic leading-snug" style={{ color: t.textPrimary }}>
                {r.text}
              </blockquote>
            ) : null}
            <figcaption className="mt-4 flex flex-wrap items-center gap-3 text-sm" style={{ color: t.textSecondary }}>
              <span style={{ color: t.textPrimary }}>{r.authorName}</span>
              <StarRating rating={r.rating} color={t.accent} />
              {r.relativePublishDescription ? <span>{r.relativePublishDescription}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </Chapter>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  // Only draw a column when it has something in it, so neither half is ever left empty.
  const contactCol = Boolean(c.address || c.phone || c.email || c.whatsapp || c.social.length || (c.cta.payBtn && c.cta.paymentLink) || (c.cta.reviewBtn && c.cta.reviewLink));
  if (c.hours.length === 0 && !contactCol) return null;
  return (
    <Chapter ctx={ctx} label="The final chapter" title="Come and find us" wide>
      <div className={`grid grid-cols-1 gap-12 ${c.hours.length > 0 && contactCol ? "md:grid-cols-2" : "max-w-2xl"}`}>
        {c.hours.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg italic" style={{ color: t.textPrimary }}>
              Opening hours
            </h3>
            <dl>
              {c.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4 border-b py-2" style={{ borderColor: mix(t.border, "transparent", 60) }}>
                  <dt style={{ color: t.textPrimary }}>{h.day}</dt>
                  <dd className="tabular-nums" style={{ color: t.textSecondary }}>
                    {h.hours}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {contactCol ? (
        <div className="space-y-5" style={{ color: t.textSecondary }}>
          {c.address ? (
            <div>
              <h3 className="text-lg italic" style={{ color: t.textPrimary }}>
                Address
              </h3>
              <p className="mt-1">{c.address}</p>
              {c.locationUrl ? (
                <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block border-b text-sm" style={{ borderColor: t.accent, color: t.accent }}>
                  Get directions
                </a>
              ) : null}
            </div>
          ) : null}
          <ul className="space-y-1">
            {c.phone ? (
              <li>
                Call <a href={`tel:${c.phone}`} className="underline underline-offset-4" style={{ color: t.textPrimary }}>{c.phone}</a>
              </li>
            ) : null}
            {c.email ? (
              <li>
                Write to <a href={`mailto:${c.email}`} className="underline underline-offset-4" style={{ color: t.textPrimary }}>{c.email}</a>
              </li>
            ) : null}
            {c.whatsapp ? (
              <li>
                WhatsApp{" "}
                <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: t.textPrimary }}>
                  {c.whatsapp}
                </a>
              </li>
            ) : null}
          </ul>
          {c.social.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {c.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm" style={{ borderColor: t.border, color: t.textPrimary }}>
                    <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
                    {getSocialPlatformLabel(s.platform, s.name)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {c.cta.payBtn && c.cta.paymentLink && (
              <button type="button" onClick={p.onPay} className="rounded-full px-6 py-2.5 text-sm" style={{ background: t.accent, color: t.accentText }}>
                Pay bill
              </button>
            )}
            {c.cta.reviewBtn && c.cta.reviewLink && (
              <button type="button" onClick={p.onReview} className="rounded-full border px-6 py-2.5 text-sm" style={{ borderColor: t.accent, color: t.accent }}>
                Write a review
              </button>
            )}
          </div>
          {c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage ? (
            <figure>
              <div className="relative h-36 w-36 border p-2" style={{ borderColor: t.border, background: t.surface }}>
                <Image src={c.cta.paymentQrImage} alt="Payment QR code" fill sizes="144px" className="object-contain p-2" />
              </div>
              <figcaption className="mt-2 text-sm italic">Scan to pay</figcaption>
            </figure>
          ) : null}
        </div>
        ) : null}
      </div>
    </Chapter>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <Chapter ctx={ctx} label="Notes in the margin" title="Questions guests ask">
      <div className="divide-y" style={{ borderColor: mix(t.border, "transparent", 60) }}>
        {c.faqs.map((f, i) => (
          <details key={`${f.q}-${i}`} className="group py-5" style={{ borderColor: mix(t.border, "transparent", 60) }}>
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 text-lg focus-visible:outline-2" style={{ color: t.textPrimary, outlineColor: t.accent }}>
              {f.q}
              <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45" style={{ color: t.accent }}>
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed" style={{ color: t.textSecondary }}>
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </Chapter>
  );
}

function Divider({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `cj-divider-${section.id}`;
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4 px-5 py-10" style={{ color: t.accent }}>
      <span className="h-px w-16 sm:w-32" style={{ background: mix(t.accent, "transparent", 50) }} />
      <svg width={motif.w * 3} height={motif.h} className="opacity-80">
        <defs>
          <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">
            {motif.tile}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <span className="h-px w-16 sm:w-32" style={{ background: mix(t.accent, "transparent", 50) }} />
    </div>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="center" />;
}

export const layout: LayoutDefinition = {
  key: "story",
  label: "Chef's Journal",
  description: "The restaurant told as a book: numbered chapters on a timeline, a tasting-menu list and a filmstrip of photos.",
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
