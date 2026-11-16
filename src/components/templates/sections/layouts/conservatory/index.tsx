"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import type { HoursRow } from "@/components/templates/landing/_shared/defaults";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { ActionRow, Container, ContactList, MenuCta, MotifBand, SectionShell, SocialLinks } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { SiteLottie } from "@/components/site-system/kit/lottie/SiteLottie";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Conservatory — a glasshouse restaurant. A floating pill for navigation,
 * the photo held in a leaf-edged shape while vines draw themselves around it
 * (once), soft organic cards, polaroids scattered on a table, and the day's
 * hours on a 24-hour dial. Structure and motion only — the look is the skin's.
 */

const LEAF = "62% 38% 54% 46% / 48% 56% 44% 52%";
const PEBBLE = "46% 54% 42% 58% / 56% 44% 56% 44%";
const SOFT = "calc(var(--site-radius, 16px) * 1.6)";
const card: CSSProperties = { background: tv.surface, borderRadius: SOFT, boxShadow: `0 18px 40px -28px ${mixv(tv.text, "transparent", 60)}` };

function Heading({ id, title, intro, align = "center" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span aria-hidden className={`inline-grid size-10 place-items-center ${center ? "" : ""}`} style={{ color: tv.accent, background: mixv(tv.accent, "transparent", 12), borderRadius: PEBBLE }}>
        <SiteIcon name="vegan" size={20} />
      </span>
      <h2 id={id} className="mt-4" style={displayStyle(fluid.h2)}>
        {title}
      </h2>
      {intro ? <p className="mt-4 leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{intro}</p> : null}
    </div>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Sits below an occasion banner while it's on screen (--occ-offset, set by OccasionOverlay). */}
      <div className="pointer-events-none fixed inset-x-0 z-50 px-3" style={{ top: "calc(var(--occ-offset, 0px) + 0.875rem)" }}>
        <header
          className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-3 py-2 pl-5 pr-2 backdrop-blur-md"
          style={{ background: mixv(tv.surface, "transparent", 86), borderRadius: 999, border: `1px solid ${mixv(tv.border, "transparent", 70)}`, boxShadow: `0 10px 30px -18px ${mixv(tv.text, "transparent", 50)}` }}
        >
          <a href="#" className="min-w-0 truncate rounded-full focus-visible:outline-2 focus-visible:outline-offset-4" style={{ ...displayStyle("1.2rem"), ...focusRing }}>
            {c.businessName}
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded-full px-3 py-2 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--site-accent)_10%,transparent)] focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <MenuCta ctx={ctx} radius="999px" className="!min-h-10 !px-4">{terms.catalogLabel}</MenuCta>
            {nav.length ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="conservatory-nav"
                aria-label={open ? "Close the section list" : "Open the section list"}
                onClick={() => setOpen((o) => !o)}
                className="grid size-10 place-items-center rounded-full focus-visible:outline-2 lg:hidden"
                style={{ color: tv.text, ...focusRing }}
              >
                <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 7h14M3 13h14" />}
                </svg>
              </button>
            ) : null}
          </div>
        </header>
        {open ? (
          <nav id="conservatory-nav" aria-label="Sections" className="pointer-events-auto mx-auto mt-2 max-w-5xl p-3 lg:hidden" style={{ ...card, background: tv.surface }}>
            <ul className="grid grid-cols-2 gap-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      {/* Clearance for the floating pill, whichever section the owner put first. */}
      <main className="pt-20 sm:pt-24">{children}</main>
    </>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  return (
    <section aria-labelledby="conservatory-title" className="relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-24">
      <Container size="xl" className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <div className="text-center lg:text-left">
          {t.badge ? (
            <p className="sk-fade inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm" style={{ background: mixv(tv.accent, "transparent", 12), color: tv.accent }}>
              <SiteIcon name="vegan" size={14} />
              {t.badge}
            </p>
          ) : null}
          <h1 id="conservatory-title" className="sk-fade mt-6" style={displayStyle(fluid.hero, { ["--sk-delay" as string]: "150ms" } as CSSProperties)}>
            {c.businessName}
          </h1>
          {tagline ? (
            <p className="sk-fade mx-auto mt-6 max-w-lg leading-relaxed lg:mx-0" style={{ fontSize: fluid.lead, color: tv.muted, ["--sk-delay" as string]: "300ms" } as CSSProperties}>
              {tagline}
            </p>
          ) : null}
          <div className="sk-fade mt-9" style={{ ["--sk-delay" as string]: "450ms" } as CSSProperties}>
            <ActionRow ctx={ctx} radius="999px" menuLabel={terms.ctaLabel} className="justify-center lg:justify-start" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <span aria-hidden className="sk-bob absolute -inset-6 -z-0" style={{ background: mixv(tv.accent, "transparent", 14), borderRadius: PEBBLE }} />
          <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: LEAF }}>
            <Image src={src} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div aria-hidden className="absolute -bottom-6 -left-8 size-40 sm:size-48">
            <SiteLottie name="vines" live={!p.isPreview} className="h-full w-full" />
          </div>
          <div aria-hidden className="absolute -right-6 -top-8 size-32 rotate-180 sm:size-36">
            <SiteLottie name="vines" live={!p.isPreview} className="h-full w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── About + food ─────────────────────────── */

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `cv-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto h-[26rem] w-full max-w-md">
          <div className="absolute left-0 top-0 h-[78%] w-[70%] overflow-hidden" style={{ borderRadius: LEAF }}>
            <Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 1024px) 28vw, 70vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 h-[52%] w-[50%] overflow-hidden border-8" style={{ borderRadius: PEBBLE, borderColor: tv.band }}>
            <Image src={c.gallery[2]?.image_url || img.dish} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
          </div>
        </div>
        <div>
          <Heading id={id} title={c.story.headline || "Our story"} align="left" />
          {c.story.body ? <p className="mt-6 max-w-prose leading-loose" style={{ fontSize: fluid.lead, color: tv.muted }}>{c.story.body}</p> : null}
        </div>
      </Container>
    </SectionShell>
  );
}

function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.signatureDishes.length === 0) return null;
  const id = `cv-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className={`group sk-lift p-4 ${i % 3 === 1 ? "lg:translate-y-10" : ""}`} style={card}>
              <div className="relative aspect-square overflow-hidden" style={{ borderRadius: i % 2 ? PEBBLE : LEAF }}>
                <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw" className="sk-zoom object-cover" />
              </div>
              <div className="px-2 pb-2 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 style={displayStyle(fluid.h3)}>{d.name}</h3>
                  {d.price ? <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
                </div>
                {d.description ? <p className="mt-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        <div className="h-10" aria-hidden />
      </Container>
    </SectionShell>
  );
}

function Popular({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `cv-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="md">
        <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {c.popularItems.map((d, i) => (
            <li key={`${d.name}-${i}`} className="flex items-center gap-4 p-3 pr-5" style={{ ...card, borderRadius: 999 }}>
              <span className="relative size-16 shrink-0 overflow-hidden rounded-full">
                <Image src={d.image || img.dish} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium" style={{ color: tv.text }}>{d.name}</span>
                {d.category ? <span className="block truncate text-sm" style={{ color: tv.muted }}>{d.category}</span> : null}
              </span>
              {d.price ? <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <MenuCta ctx={ctx} radius="999px">{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Gallery ─────────────────────────── */

const TILT = [-4, 3, -2, 5, -3, 2, -5, 3];

/** Polaroids scattered on a table; each straightens and lifts when you point at it. */
function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  const id = `cv-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="From the glasshouse" />
        <ul className="mt-14 grid grid grid-cols-1-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 md:grid-cols-4">
          {photos.map((src, i) => (
            <li
              key={src + i}
              className="p-2.5 pb-10 transition-transform duration-500 hover:z-10 hover:!rotate-0 hover:scale-105 motion-reduce:transition-none"
              style={{ background: tv.surface, transform: `rotate(${TILT[i % TILT.length]}deg)`, boxShadow: `0 16px 30px -18px ${mixv(tv.text, "transparent", 45)}` }}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="(min-width: 768px) 24vw, 46vw" className="object-cover" />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

const toMin = (s?: string) => {
  const m = s?.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Today's opening window drawn on a 24-hour dial (midnight at the top). */
function HoursDial({ hours, todayName }: { hours: HoursRow[]; todayName: string }) {
  const today = hours.find((h) => h.day.toLowerCase() === todayName.toLowerCase());
  const start = toMin(today?.startTime);
  let end = toMin(today?.endTime);
  const R = 84;
  const C = 2 * Math.PI * R;
  let arc: { len: number; rot: number } | null = null;
  if (start !== null && end !== null) {
    if (end <= start) end += 1440;
    arc = { len: ((end - start) / 1440) * C, rot: (start / 1440) * 360 - 90 };
  }
  return (
    <figure className="mx-auto w-full max-w-[15rem]">
      <svg viewBox="0 0 200 200" className="w-full" role="img" aria-label={arc ? `Today ${today!.startTime} to ${today!.endTime}` : "Closed today"}>
        <circle cx="100" cy="100" r={R} fill="none" stroke={mixv(tv.border, "transparent", 80)} strokeWidth="12" />
        {arc ? (
          <circle cx="100" cy="100" r={R} fill="none" stroke={tv.accent} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${arc.len} ${C}`} transform={`rotate(${arc.rot} 100 100)`} />
        ) : null}
        {[0, 6, 12, 18].map((h) => {
          const a = (h / 24) * 2 * Math.PI - Math.PI / 2;
          return (
            <text key={h} x={100 + Math.cos(a) * 62} y={100 + Math.sin(a) * 62 + 4} textAnchor="middle" fontSize="10" fill={tv.muted}>
              {String(h).padStart(2, "0")}
            </text>
          );
        })}
        <text x="100" y="96" textAnchor="middle" fontSize="12" fill={tv.muted}>Today</text>
        <text x="100" y="116" textAnchor="middle" fontSize="15" fill={tv.text} fontWeight="600">
          {arc ? `${today!.startTime}–${today!.endTime}` : "Closed"}
        </text>
      </svg>
    </figure>
  );
}

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `cv-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title="Come and visit" />
        <div className={`mt-14 grid gap-8 ${c.hours.length && hasContact ? "lg:grid-cols-2" : "mx-auto max-w-xl"}`}>
          {c.hours.length ? (
            <div className="grid grid-cols-1 items-center gap-8 p-8 sm:grid-cols-[15rem_1fr]" style={card}>
              <HoursDial hours={c.hours} todayName={site.todayName} />
              <ul className="space-y-1.5 text-sm">
                {c.hours.map((h) => {
                  const today = h.day.toLowerCase() === site.todayName.toLowerCase();
                  return (
                    <li key={h.day} className="flex justify-between gap-4 rounded-full px-3 py-1" style={{ background: today ? mixv(tv.accent, "transparent", 12) : undefined, color: today ? tv.text : tv.muted, fontWeight: today ? 600 : 400 }}>
                      <span>{h.day}</span>
                      <span className="whitespace-nowrap tabular-nums">{h.hours}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {hasContact ? (
            <div className="p-8" style={card}>
              <ContactList ctx={ctx} />
              <SocialLinks ctx={ctx} className="mt-8" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius="999px" className="mt-8" />
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="center" top={<div className="mx-auto max-w-6xl px-8 pt-10"><MotifBand variant="leaf" idPrefix="cv-foot" opacity={0.5} /></div>} />;
}

const std = standardSections({
  prefix: "cv",
  Heading,
  card,
  radius: "999px",
  teamFrame: "organic",
  titles: { team: "Who grows and cooks", amenities: "Good to know", events: "In season", reviews: "Kind words", awards: "Awards and press" },
});

export const layout: LayoutDefinition = {
  key: "conservatory",
  label: "Conservatory",
  description: "A glasshouse: a floating pill menu, leaf-shaped photos with vines that draw in, scattered polaroids and an hours dial.",
  menuStructure: "garden-cards",
  Frame,
  nativeOrder: [
    "intro", "hero", "announcement", "marquee", "story", "signature-dishes", "popular-items", "curated-list", "stats", "offers",
    "events", "gallery", "team", "reviews", "awards", "visit", "amenities", "faq", "divider", "footer",
  ],
  sections: {
    ...std,
    hero: Hero,
    story: Story,
    "signature-dishes": Signature,
    "popular-items": Popular,
    gallery: Gallery,
    visit: Visit,
    footer: Footer,
  },
};
