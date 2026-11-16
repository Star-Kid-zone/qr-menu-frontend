"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  PiArrowSquareOutBold,
  PiChatCircleTextBold,
  PiCreditCardBold,
  PiForkKnifeBold,
  PiListBold,
  PiMapPinBold,
  PiPhoneBold,
  PiStarFill,
  PiStarBold,
  PiWhatsappLogoBold,
  PiXBold,
} from "react-icons/pi";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import { IntroSection } from "../../landing/intro";
import { ART_MOTIF_MAP, ART_MOTIFS } from "../../art/motifs";
import type { LandingSectionProps, LandingSectionContext } from "../../types";
import { SITE_CONTENT_SECTIONS } from "../../landing/siteContent";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter } from "@/components/site-system/kit/motion";
import type { LayoutDefinition, LayoutFrameProps } from "../types";

/*
 * Link Card — a "link in bio" storefront. One narrow column of tactile cards on a
 * softly tinted, dotted page. The memorable element is the stack of big link
 * buttons under the profile; everything else is quiet, compact cards.
 */

const COL = "mx-auto w-full max-w-[540px] px-4";
const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

function Card({ ctx, children, className = "" }: { ctx: LandingSectionContext; children: ReactNode; className?: string }) {
  const { t } = ctx;
  return (
    <div
      className={`rounded-[22px] border p-5 ${className}`}
      style={{ background: t.surface, borderColor: mix(t.border, "transparent", 80), boxShadow: `0 1px 0 ${mix(t.border, "transparent", 60)}, 0 10px 30px -18px rgba(0,0,0,0.25)` }}
    >
      {children}
    </div>
  );
}

function CardTitle({ ctx, children, icon }: { ctx: LandingSectionContext; children: ReactNode; icon?: ReactNode }) {
  const { t } = ctx;
  return (
    <h2 className={`mb-3 flex items-center gap-2 text-lg font-semibold ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
      {icon ? (
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full text-sm" style={{ background: mix(t.accent, "transparent", 14), color: t.accent }}>
          {icon}
        </span>
      ) : null}
      {children}
    </h2>
  );
}

/** Big, full-width tap target — the signature element of this layout. */
function LinkButton({
  ctx,
  icon,
  label,
  primary,
  href,
  onClick,
  external,
}: {
  ctx: LandingSectionContext;
  icon: ReactNode;
  label: string;
  primary?: boolean;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}) {
  const { t } = ctx;
  const cls =
    "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] font-semibold transition-transform motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2";
  const style = primary
    ? { background: t.accent, color: t.accentText, borderColor: t.accent, outlineColor: t.accent }
    : { background: t.surface, color: t.textPrimary, borderColor: mix(t.border, "transparent", 90), outlineColor: t.accent };
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg"
        style={primary ? { background: mix(t.accentText, "transparent", 18) } : { background: mix(t.accent, "transparent", 12), color: t.accent }}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <PiArrowSquareOutBold aria-hidden="true" className="opacity-50 transition-opacity group-hover:opacity-90" />
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} style={style} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {inner}
    </button>
  );
}

function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <span className="inline-flex" style={{ color }} aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (i <= Math.round(rating) ? <PiStarFill key={i} aria-hidden="true" /> : <PiStarBold key={i} aria-hidden="true" />))}
    </span>
  );
}

/* ── Frame ─────────────────────────────────────────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, t, p } = ctx;
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative min-h-dvh pb-10"
      style={{
        background: `radial-gradient(1200px 600px at 50% -10%, ${mix(t.accent, t.bg, 16)}, transparent 70%), ${t.bg}`,
      }}
    >
      {/* Dotted paper texture, in the theme's border colour. */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ color: t.border, opacity: 0.55 }}>
        <defs>
          <pattern id="lc-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lc-dots)" />
      </svg>

      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: mix(t.bg, "transparent", 82), borderBottom: `1px solid ${mix(t.border, "transparent", 70)}` }}>
        <div className={`${COL} flex items-center gap-3 py-2.5`}>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold" style={{ color: t.textPrimary }}>
            {c.businessName}
          </span>
          {c.cta.menuBtn ? (
            <p.LinkComponent
              to={p.menuHref}
              onClick={() => p.track("click", "menu_button", {})}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style={{ background: t.accent, color: t.accentText }}
            >
              {c.terms.ctaLabel}
            </p.LinkComponent>
          ) : null}
          {nav.length ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls="lc-nav"
              aria-label={open ? "Close sections" : "Open sections"}
              onClick={() => setOpen((v) => !v)}
              className="grid h-8 w-8 place-items-center rounded-full border sm:hidden"
              style={{ borderColor: t.border, color: t.textPrimary }}
            >
              {open ? <PiXBold aria-hidden="true" /> : <PiListBold aria-hidden="true" />}
            </button>
          ) : null}
        </div>
        {nav.length ? (
          <nav id="lc-nav" aria-label="Page sections" className={`${open ? "block" : "hidden"} sm:block`}>
            <ul className={`${COL} flex flex-wrap gap-1.5 pb-2.5`}>
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2"
                    style={{ borderColor: mix(t.border, "transparent", 90), color: t.textSecondary, background: t.surface, outlineColor: t.accent }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main className={`${COL} relative space-y-4 pt-6`}>{children}</main>
    </div>
  );
}

/* ── Sections ──────────────────────────────────────────────────────────── */

function Announcement({ ctx: { c, t } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <p className="rounded-full px-4 py-2 text-center text-[13px] font-medium" style={{ background: mix(t.accent, t.surface, 14), color: t.textPrimary }}>
      {c.announcement}
    </p>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, p, img } = ctx;
  const tagline = t.heroTagline || c.slogan;
  const cover = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const avatar = c.logoUrl || img.dish;
  return (
    <section aria-label="About and links" className="text-center">
      <div className="relative h-36 overflow-hidden rounded-[26px]">
        <Image src={cover} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="540px" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35))" }} />
      </div>
      <div className="relative mx-auto -mt-12 h-24 w-24 rounded-full p-1" style={{ background: `conic-gradient(${t.accent}, ${mix(t.accent, t.surface, 40)}, ${t.accent})` }}>
        <div className="relative h-full w-full overflow-hidden rounded-full border-4" style={{ borderColor: t.surface }}>
          <Image src={avatar} alt={`${c.businessName} logo`} fill sizes="96px" className="object-cover" />
        </div>
      </div>
      <h1 className={`mt-3 text-[28px] font-bold leading-tight ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
        {c.businessName}
      </h1>
      {t.badge ? (
        <p className="mt-1.5 inline-block rounded-full px-3 py-0.5 text-xs font-medium" style={{ background: mix(t.accent, "transparent", 14), color: t.accent }}>
          {t.badge}
        </p>
      ) : null}
      {tagline ? (
        <p className="mx-auto mt-2 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: t.textSecondary }}>
          {tagline}
        </p>
      ) : null}
      {c.social.length ? (
        <ul className="mt-4 flex justify-center gap-2" aria-label="Social media">
          {c.social.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={getSocialPlatformLabel(s.platform, s.name)}
                className="grid h-10 w-10 place-items-center rounded-full border text-lg focus-visible:outline-2"
                style={{ borderColor: mix(t.border, "transparent", 90), color: t.textPrimary, background: t.surface, outlineColor: t.accent }}
              >
                <span aria-hidden="true">{getSocialPlatformIcon(s.platform ?? s.name)}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 space-y-2.5">
        {c.cta.menuBtn ? (
          <p.LinkComponent
            to={p.menuHref}
            onClick={() => p.track("click", "menu_button", { destination: "menu" })}
            className="group flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] font-semibold motion-safe:active:scale-[0.98]"
            style={{ background: t.accent, color: t.accentText, borderColor: t.accent }}
          >
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg" style={{ background: mix(t.accentText, "transparent", 18) }}>
              <PiForkKnifeBold />
            </span>
            <span className="flex-1">{c.terms.ctaLabel}</span>
            <PiArrowSquareOutBold aria-hidden="true" className="opacity-60" />
          </p.LinkComponent>
        ) : null}
        {c.cta.payBtn && c.cta.paymentLink ? <LinkButton ctx={ctx} icon={<PiCreditCardBold />} label="Pay bill" onClick={p.onPay} /> : null}
        {c.cta.reviewBtn && c.cta.reviewLink ? <LinkButton ctx={ctx} icon={<PiChatCircleTextBold />} label="Leave a review" onClick={p.onReview} /> : null}
        {c.phone ? <LinkButton ctx={ctx} icon={<PiPhoneBold />} label={`Call ${c.phone}`} href={`tel:${c.phone}`} /> : null}
        {c.whatsapp ? (
          <LinkButton ctx={ctx} icon={<PiWhatsappLogoBold />} label="Message on WhatsApp" href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} external />
        ) : null}
        {c.locationUrl ? <LinkButton ctx={ctx} icon={<PiMapPinBold />} label="Get directions" href={c.locationUrl} external /> : null}
      </div>
    </section>
  );
}

function MarqueeStrip({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan;
  if (!text) return null;
  const words = text.split("·").map((w) => w.trim()).filter(Boolean);
  return (
    <div className="overflow-hidden rounded-2xl py-2.5" style={{ background: t.accent, color: t.accentText }}>
      <div className="flex w-max gap-6 whitespace-nowrap px-4 text-sm font-semibold motion-safe:animate-[lc-scroll_28s_linear_infinite]">
        {[0, 1].map((rep) => (
          <span key={rep} className="flex gap-6" aria-hidden={rep === 1 ? "true" : undefined}>
            {words.map((w, i) => (
              <span key={i} className="flex items-center gap-6">
                {w}
                <span aria-hidden="true">✺</span>
              </span>
            ))}
          </span>
        ))}
      </div>
      <style>{`@keyframes lc-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function Stats({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.stats.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-2.5">
      {c.stats.map((s) => (
        <div key={s.label} className="rounded-2xl border p-4" style={{ background: t.surface, borderColor: mix(t.border, "transparent", 80) }}>
          <dt className="text-xs" style={{ color: t.textSecondary }}>
            {s.label}
          </dt>
          <dd className="mt-1 text-2xl font-bold" style={{ color: t.accent }}>
            <Counter value={s.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Story({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  if (!c.story) return null;
  return (
    <Card ctx={ctx}>
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
          <Image src={img.scene} alt={c.terms.heroAlt} fill sizes="80px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium" style={{ color: t.accent }}>
            Our story
          </p>
          {c.story.headline ? (
            <h2 className={`text-lg font-semibold leading-snug ${t.headingClass ?? ""}`} style={{ color: t.textPrimary }}>
              {c.story.headline}
            </h2>
          ) : null}
        </div>
      </div>
      {c.story.body ? (
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: t.textSecondary }}>
          {c.story.body}
        </p>
      ) : null}
    </Card>
  );
}

function DishRail({ ctx, title, items, trackKey }: { ctx: LandingSectionContext; title: string; items: { name: string; description?: string; price?: string; image?: string | null }[]; trackKey: string }) {
  const { c, t, p, img } = ctx;
  return (
    <Card ctx={ctx} className="!px-0">
      <div className="flex items-baseline justify-between px-5">
        <CardTitle ctx={ctx} icon={<PiForkKnifeBold />}>
          {title}
        </CardTitle>
        {c.cta.menuBtn ? (
          <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", trackKey, {})} className="text-sm font-semibold underline-offset-4 hover:underline" style={{ color: t.accent }}>
            See all
          </p.LinkComponent>
        ) : null}
      </div>
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]" aria-label={title}>
        {items.slice(0, 8).map((d, i) => (
          <li key={`${d.name}-${i}`} className="w-40 shrink-0 snap-start">
            <div className="relative h-28 overflow-hidden rounded-2xl">
              <Image src={d.image || img.dish} alt={d.name} fill sizes="160px" className="object-cover" />
              {d.price ? (
                <span className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: t.surface, color: t.textPrimary }}>
                  {d.price}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: t.textPrimary }}>
              {d.name}
            </p>
            {d.description ? (
              <p className="line-clamp-2 text-xs leading-relaxed" style={{ color: t.textSecondary }}>
                {d.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SignatureDishes({ ctx }: LandingSectionProps) {
  if (ctx.c.signatureDishes.length === 0) return null;
  return <DishRail ctx={ctx} title={ctx.c.terms.featuredSectionLabel} items={ctx.c.signatureDishes} trackKey="dish_card" />;
}

function PopularItems({ ctx }: LandingSectionProps) {
  if (ctx.c.popularItems.length === 0) return null;
  return <DishRail ctx={ctx} title={ctx.c.terms.popularSectionLabel} items={ctx.c.popularItems} trackKey="popular_item" />;
}

function Offers({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.offers.length === 0) return null;
  return (
    <Card ctx={ctx}>
      <CardTitle ctx={ctx} icon={<span>%</span>}>
        Offers
      </CardTitle>
      <ul className="space-y-2.5">
        {c.offers.map((o, i) => {
          const badge = o.badge_text || (o.offer_value ? `${o.offer_value}${o.offer_type === "percentage" ? "%" : ""} off` : "");
          return (
            <li key={i} className="flex items-center gap-3 rounded-full border p-1.5 pr-4" style={{ borderColor: mix(t.border, "transparent", 90), background: mix(t.accent, t.surface, 6) }}>
              {o.image_url ? (
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image src={o.image_url} alt={o.title ?? "Offer"} fill sizes="48px" className="object-cover" />
                </span>
              ) : (
                <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold" style={{ background: t.accent, color: t.accentText }}>
                  %
                </span>
              )}
              <span className="min-w-0 flex-1">
                {o.title ? (
                  <span className="block truncate text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {o.title}
                  </span>
                ) : null}
                {o.description ? (
                  <span className="block truncate text-xs" style={{ color: t.textSecondary }}>
                    {o.description}
                  </span>
                ) : null}
              </span>
              {badge ? (
                <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: t.accent, color: t.accentText }}>
                  {badge}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Gallery({ ctx }: LandingSectionProps) {
  const { c } = ctx;
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 9);
  return (
    <Card ctx={ctx}>
      <CardTitle ctx={ctx}>Photos</CardTitle>
      <ul className="grid grid-cols-3 gap-1.5" aria-label="Photos">
        {photos.map((g, i) => (
          <li key={i} className="relative aspect-square overflow-hidden rounded-xl" style={{ background: ctx.sectionBg }}>
            <Image src={g.image_url as string} alt={`${c.businessName} photo ${i + 1}`} fill sizes="(min-width: 540px) 170px, 33vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Reviews({ ctx }: LandingSectionProps) {
  const { c, t, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  return (
    <Card ctx={ctx}>
      <CardTitle ctx={ctx} icon={<PiStarFill />}>
        What guests say
      </CardTitle>
      <ul className="space-y-3">
        {c.googleReviews.slice(0, 4).map((r) => (
          <li key={r.id} className="rounded-2xl p-4" style={{ background: mix(ctx.sectionBg, t.surface, 60) }}>
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full text-sm font-bold" style={{ background: t.accent, color: t.accentText }}>
                {r.authorName.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {r.authorName}
                </span>
                {r.relativePublishDescription ? (
                  <span className="block text-xs" style={{ color: t.textSecondary }}>
                    {r.relativePublishDescription}
                  </span>
                ) : null}
              </span>
              <Stars rating={r.rating} color={t.accent} />
            </div>
            {r.text ? (
              <p className="mt-2 text-sm leading-relaxed" style={{ color: t.textSecondary }}>
                {r.text}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      {c.cta.reviewBtn && c.cta.reviewLink ? (
        <button type="button" onClick={p.onReview} className="mt-3 w-full rounded-xl border py-2.5 text-sm font-semibold" style={{ borderColor: t.accent, color: t.accent }}>
          Write a review
        </button>
      ) : null}
    </Card>
  );
}

function Visit({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const hasContact = c.address || c.phone || c.email || c.whatsapp;
  const qr = c.cta.payBtn && (c.cta.paymentType === "qr_image" || c.cta.paymentType === "both") && c.cta.paymentQrImage;
  if (c.hours.length === 0 && !hasContact && !qr) return null;
  return (
    <Card ctx={ctx}>
      <CardTitle ctx={ctx} icon={<PiMapPinBold />}>
        Visit us
      </CardTitle>
      {c.hours.length ? (
        <ul className="mb-4 divide-y rounded-2xl border" style={{ borderColor: mix(t.border, "transparent", 80) }}>
          {c.hours.map((h) => {
            const isToday = h.day === today;
            return (
              <li
                key={h.day}
                className="flex justify-between px-4 py-2 text-sm"
                style={{ borderColor: mix(t.border, "transparent", 80), background: isToday ? mix(t.accent, t.surface, 10) : undefined, color: isToday ? t.textPrimary : t.textSecondary }}
              >
                <span className={isToday ? "font-semibold" : undefined}>
                  {h.day}
                  {isToday ? <span className="ml-2 text-xs" style={{ color: t.accent }}>Today</span> : null}
                </span>
                <span>{h.hours}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
      <div className="space-y-1.5 text-sm" style={{ color: t.textSecondary }}>
        {c.address ? <p>{c.address}</p> : null}
        {c.locationUrl ? (
          <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold underline-offset-4 hover:underline" style={{ color: t.accent }}>
            Open in Maps
          </a>
        ) : null}
        {c.phone ? (
          <p>
            <a href={`tel:${c.phone}`} style={{ color: t.textPrimary }}>
              {c.phone}
            </a>
          </p>
        ) : null}
        {c.email ? (
          <p>
            <a href={`mailto:${c.email}`} style={{ color: t.textPrimary }}>
              {c.email}
            </a>
          </p>
        ) : null}
        {c.whatsapp ? <p>WhatsApp {c.whatsapp}</p> : null}
      </div>
      {qr ? (
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-white p-1" style={{ borderColor: t.border }}>
            <Image src={c.cta.paymentQrImage as string} alt="Payment QR code" fill sizes="96px" className="object-contain p-1" />
          </div>
          <p className="text-sm" style={{ color: t.textSecondary }}>
            Scan to pay your bill.
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function Faq({ ctx }: LandingSectionProps) {
  const { c, t } = ctx;
  if (c.faqs.length === 0) return null;
  return (
    <Card ctx={ctx}>
      <CardTitle ctx={ctx}>Questions</CardTitle>
      <div className="space-y-2">
        {c.faqs.map((f, i) => (
          <details key={`${f.q}-${i}`} className="group rounded-2xl border px-4 py-3" style={{ borderColor: mix(t.border, "transparent", 80) }}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold" style={{ color: t.textPrimary }}>
              {f.q}
              <span aria-hidden="true" className="transition-transform group-open:rotate-45" style={{ color: t.accent }}>
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: t.textSecondary }}>
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </Card>
  );
}

function Divider({ ctx: { t }, section }: LandingSectionProps) {
  const motif = ART_MOTIF_MAP.get(section.variant ?? "") ?? ART_MOTIFS[0];
  const id = `lc-div-${section.id}`;
  return (
    <div aria-hidden="true" className="flex items-center gap-3 py-1" style={{ color: t.accent }}>
      <span className="h-px flex-1" style={{ background: mix(t.border, "transparent", 90) }} />
      <svg className="w-28 opacity-80" style={{ height: motif.h }}>
        <defs>
          <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">
            {motif.tile}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <span className="h-px flex-1" style={{ background: mix(t.border, "transparent", 90) }} />
    </div>
  );
}


/** Footer v2 (site system): name, menu QR, visit + contact, today's hours, links, social, amenities, credit. */
function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="columns" />;
}

export const layout: LayoutDefinition = {
  key: "compact",
  label: "Link Card",
  description: "A tidy link-in-bio page: big buttons up top, compact cards below. Feels like an app on phones.",
  Frame,
  sections: {
    intro: IntroSection,
    announcement: Announcement,
    hero: Hero,
    marquee: MarqueeStrip,
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
