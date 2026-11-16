"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { ActionRow, Container, ContactList, HoursList, MenuCta, SectionShell, SocialLinks, todayHoursLine } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { SiteLottie } from "@/components/site-system/kit/lottie/SiteLottie";
import { useOpenStatus } from "@/components/site-system/kit/openStatus";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Ember — the grill. A heavy bar on top and a Menu button that stays in reach,
 * the photo cut on a slant with embers rising over it, prices set large, a
 * slanted photo strip and a live "closes in…" countdown from the real hours.
 * Structure and motion only — the look is the skin's.
 */

const R = "calc(var(--site-radius, 8px) * 0.5)";
const SLANT = "polygon(14% 0, 100% 0, 100% 100%, 0 100%)";
const card: CSSProperties = { background: tv.surface, borderRadius: R, border: `1px solid ${mixv(tv.border, "transparent", 60)}` };

function Heading({ id, title, intro, align = "left" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 id={id} style={displayStyle(fluid.h2, { letterSpacing: "-0.01em" })}>{title}</h2>
      <span aria-hidden className={`mt-4 block h-1.5 w-20 -skew-x-[20deg] ${center ? "mx-auto" : ""}`} style={{ background: tv.accent }} />
      {intro ? <p className="mt-4 leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{intro}</p> : null}
    </div>
  );
}

/** "Open now" with the live countdown, or today's hours until the browser knows the time. */
function OpenBadge({ ctx, onDark = false }: { ctx: LandingSectionContext; onDark?: boolean }) {
  const { c, site } = ctx;
  const status = useOpenStatus(c.hours, site.timeZone);
  const fallback = todayHoursLine(c.hours, site.todayName);
  if (!status && !fallback) return null;
  const open = status?.open ?? null;
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium" style={{ background: onDark ? mixv(tv.bg, "transparent", 12) : mixv(tv.accent, "transparent", 12), color: onDark ? tv.bg : tv.text }} aria-live="polite">
      <span aria-hidden className="relative flex size-2.5">
        {open ? <span className="absolute inset-0 animate-ping rounded-full motion-reduce:animate-none" style={{ background: tv.accent, opacity: 0.6 }} /> : null}
        <span className="relative size-2.5 rounded-full" style={{ background: open === false ? tv.muted : tv.accent }} />
      </span>
      {status ? (
        <>
          <span style={{ fontWeight: 700 }}>{status.open ? "Open now" : "Closed now"}</span>
          <span>{status.label}</span>
        </>
      ) : (
        fallback
      )}
    </p>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: tv.text, color: tv.bg }}>
        <Container size="xl" className="flex items-center justify-between gap-4 py-3">
          <a href="#" className="min-w-0 truncate rounded focus-visible:outline-2 focus-visible:outline-offset-4" style={{ ...displayStyle("clamp(1.3rem, 1.1rem + 0.8vw, 1.7rem)", { color: tv.bg }), outlineColor: tv.bg }}>
            {c.businessName}
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded text-sm font-semibold hover:opacity-70 focus-visible:outline-2" style={{ color: tv.bg, outlineColor: tv.bg }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block"><MenuCta ctx={ctx} radius={R}>{terms.catalogLabel}</MenuCta></span>
            {nav.length ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="ember-nav"
                aria-label={open ? "Close the section list" : "Open the section list"}
                onClick={() => setOpen((o) => !o)}
                className="grid size-11 place-items-center rounded focus-visible:outline-2 lg:hidden"
                style={{ color: tv.bg, outlineColor: tv.bg }}
              >
                <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square">
                  {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 6h16M3 11h16M3 16h10" />}
                </svg>
              </button>
            ) : null}
          </div>
        </Container>
        {open ? (
          <nav id="ember-nav" aria-label="Sections" className="border-t lg:hidden" style={{ borderColor: mixv(tv.bg, "transparent", 20) }}>
            <Container className="grid grid-cols-2 gap-1 py-3">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="rounded py-2.5 font-semibold focus-visible:outline-2" style={{ color: tv.bg, outlineColor: tv.bg }}>
                  {n.label}
                </a>
              ))}
            </Container>
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
      {/* The menu stays one tap away on phones. */}
      {c.cta.menuBtn ? (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 sm:hidden">
          <MenuCta ctx={ctx} radius="999px" className="shadow-xl">
            <SiteIcon name="menu" size={18} />
            {terms.catalogLabel}
          </MenuCta>
        </div>
      ) : null}
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
    <section aria-labelledby="ember-title" className="relative overflow-hidden" style={{ background: tv.bg }}>
      <div className="grid grid-cols-1 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_1.05fr]">
        <div className="relative order-1 h-[46svh] lg:order-2 lg:h-auto">
          <div className="absolute inset-0 [clip-path:polygon(0_0,100%_0,100%_86%,0_100%)] lg:[clip-path:var(--ember-slant)]" style={{ ["--ember-slant" as string]: SLANT } as CSSProperties}>
            <Image src={src} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 52vw, 100vw" className="sk-zoom object-cover" />
          </div>
          <div aria-hidden className="absolute bottom-6 right-6 size-32 sm:size-40">
            <SiteLottie name="embers" live={!p.isPreview} className="h-full w-full" />
          </div>
        </div>
        {/* On laptops the text lines up with the header's container edge, not the half-column. */}
        <Container className="order-2 flex flex-col items-start justify-center py-12 lg:order-1 lg:!mx-0 lg:!max-w-none lg:!pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:py-20 lg:pr-10">
          <OpenBadge ctx={ctx} />
          {t.badge ? <p className="mt-6 text-sm font-semibold" style={{ color: tv.accent }}>{t.badge}</p> : null}
          <h1 id="ember-title" className="sk-slide-in mt-3" style={displayStyle("clamp(3rem, 1.6rem + 6vw, 7.5rem)", { lineHeight: 0.92, letterSpacing: "-0.025em" })}>
            {c.businessName}
          </h1>
          {tagline ? <p className="mt-6 max-w-md leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{tagline}</p> : null}
          <ActionRow ctx={ctx} radius={R} menuLabel={terms.ctaLabel} className="mt-9" />
        </Container>
      </div>
    </section>
  );
}

/* ─────────────────────────── About + food ─────────────────────────── */

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `em-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Heading id={id} title={c.story.headline || "Our story"} />
          {c.story.body ? <p className="mt-6 max-w-prose leading-loose" style={{ fontSize: fluid.lead, color: tv.muted }}>{c.story.body}</p> : null}
        </div>
        <div className="relative aspect-[4/5] w-full max-w-md justify-self-center [clip-path:polygon(0_6%,100%_0,100%_94%,0_100%)]">
          <Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
        </div>
      </Container>
    </SectionShell>
  );
}

/** A price tag cut on a slant, pinned to a photo's corner. */
function PriceTag({ price }: { price: string }) {
  return (
    <span className="absolute left-0 top-4 -skew-x-[12deg] px-4 py-1.5 text-lg font-bold tabular-nums" style={{ background: tv.accent, color: tv.accentText }}>
      <span className="inline-block skew-x-[12deg]">{price}</span>
    </span>
  );
}

function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.signatureDishes.length === 0) return null;
  const id = `em-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className={`group overflow-hidden ${i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}`} style={card}>
              <div className={`relative overflow-hidden ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-7rem)]" : "aspect-[4/3]"}`}>
                <Image src={d.image || img.dish} alt={d.name} fill sizes={i === 0 ? "(min-width: 1024px) 60vw, 92vw" : "(min-width: 1024px) 30vw, 46vw"} className="sk-zoom object-cover" />
                {d.price ? <PriceTag price={d.price} /> : null}
              </div>
              <div className="p-5">
                <h3 style={displayStyle(i === 0 ? "clamp(1.6rem, 1.3rem + 1vw, 2.2rem)" : fluid.h3)}>{d.name}</h3>
                {d.description ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/** Prices first, set large — how a grill board reads from across the room. */
function Popular({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `em-${section.id}-t`;
  return (
    <SectionShell tone="inverse" labelledBy={id}>
      <Container size="xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id={id} style={displayStyle(fluid.h2, { color: tv.bg })}>{terms.popularSectionLabel}</h2>
          <MenuCta ctx={ctx} radius={R}>{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: mixv(tv.bg, "transparent", 18) }}>
          {c.popularItems.map((d, i) => (
            <li key={`${d.name}-${i}`} className="flex items-center gap-5 p-5" style={{ background: tv.text }}>
              <span className="w-28 shrink-0 tabular-nums" style={displayStyle("clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem)", { color: tv.accent })}>{d.price}</span>
              <span className="min-w-0">
                <span className="block font-semibold" style={{ color: tv.bg }}>{d.name}</span>
                {d.description ? <span className="mt-0.5 block line-clamp-1 text-sm" style={{ color: mixv(tv.bg, "transparent", 70) }}>{d.description}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Gallery ─────────────────────────── */

/** A strip of photos cut on the same slant, side by side. */
function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  const id = `em-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title="From the fire" />
      </Container>
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 sm:px-8 lg:justify-center">
        {photos.map((src, i) => (
          <li key={src + i} className="group relative h-[22rem] w-[13rem] shrink-0 snap-center overflow-hidden sm:h-[26rem] sm:w-[15rem] [clip-path:polygon(18%_0,100%_0,82%_100%,0_100%)]">
            <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="15rem" className="sk-zoom object-cover" />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `em-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading id={id} title="Find the fire" />
          <OpenBadge ctx={ctx} />
        </div>
        <div className={`mt-12 grid gap-8 ${c.hours.length && hasContact ? "lg:grid-cols-2" : "max-w-xl"}`}>
          {c.hours.length ? (
            <div className="p-6 sm:p-8" style={card}>
              <HoursList hours={c.hours} todayName={site.todayName} />
            </div>
          ) : null}
          {hasContact ? (
            <div className="p-6 sm:p-8" style={card}>
              <ContactList ctx={ctx} />
              <SocialLinks ctx={ctx} className="mt-8" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius={R} className="mt-8" />
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} top={<span aria-hidden className="block h-2" style={{ background: tv.accent }} />} />;
}

const std = standardSections({
  prefix: "em",
  Heading,
  card,
  radius: R,
  align: "left",
  awardsVariant: "list",
  eventsVariant: "cards",
  titles: { team: "On the grill", events: "Fire nights", reviews: "What guests say", amenities: "Good to know" },
});

export const layout: LayoutDefinition = {
  key: "ember",
  label: "Ember",
  description: "The grill: a heavy bar, a slanted photo with rising embers, big prices, a slanted photo strip and a live closing countdown.",
  menuStructure: "grill-board",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "marquee", "signature-dishes", "popular-items", "story", "curated-list", "offers", "stats",
    "events", "gallery", "reviews", "team", "awards", "visit", "amenities", "faq", "divider", "footer",
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
