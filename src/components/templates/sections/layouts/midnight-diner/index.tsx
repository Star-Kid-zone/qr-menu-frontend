"use client";

import Image from "@/components/ui/Image";
import { useState, type CSSProperties } from "react";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { ActionRow, Container, ContactList, HoursList, MenuCta, SectionShell, SocialLinks, todayHoursLine } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { useOpenStatus } from "@/components/site-system/kit/openStatus";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Midnight Diner — a chrome-and-vinyl diner after dark. A chunky bar over a
 * checkerboard strip, the name lit as a neon sign that flickers on once, a
 * neon "Open" sign driven by the real hours, and chunky cards with offset
 * shadows. Structure and motion only — the look is the skin's.
 */

const R = "18px";
const chunky: CSSProperties = { background: tv.surface, border: `3px solid ${tv.text}`, borderRadius: R, boxShadow: `6px 6px 0 ${tv.text}` };

/** Glow for neon text drawn in `color` on the dark sign board. */
const neon = (color: string): CSSProperties => ({
  color,
  textShadow: `0 0 2px ${color}, 0 0 10px ${color}, 0 0 28px ${mixv(color, "transparent", 60)}`,
});

const checker = (size = 14): CSSProperties => ({
  height: size * 2,
  backgroundColor: tv.bg,
  backgroundImage: `conic-gradient(${tv.text} 25%, transparent 0 50%, ${tv.text} 0 75%, transparent 0)`,
  backgroundSize: `${size * 2}px ${size * 2}px`,
});

function Heading({ id, title, intro, align = "left" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 id={id} className="inline-block -rotate-1 px-4 py-1" style={{ ...displayStyle(fluid.h2), background: tv.accent, color: tv.accentText, borderRadius: 10 }}>
        {title}
      </h2>
      {intro ? <p className="mt-5 leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{intro}</p> : null}
    </div>
  );
}

/** The neon "Open" sign: lit when the diner is open now, dark when it isn't. */
function OpenSign({ ctx }: { ctx: LandingSectionContext }) {
  const { c, site } = ctx;
  const status = useOpenStatus(c.hours, site.timeZone);
  const fallback = todayHoursLine(c.hours, site.todayName);
  if (!status && !fallback) return null;
  const lit = status?.open ?? true;
  return (
    <div className="inline-flex flex-col items-center gap-2 px-6 py-4" style={{ background: tv.footer, borderRadius: R, border: `2px solid ${mixv(tv.footerText, "transparent", 25)}` }} aria-live="polite">
      <span className={lit ? "sk-flicker" : ""} style={{ ...displayStyle("clamp(2rem, 1.6rem + 1.6vw, 3rem)", { lineHeight: 1 }), ...(lit ? neon(tv.footerAccent) : { color: mixv(tv.footerText, "transparent", 35) }) }}>
        {status ? (status.open ? "Open" : "Closed") : "Open today"}
      </span>
      <span className="text-sm" style={{ color: tv.footerMuted }}>{status ? status.label : fallback}</span>
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
      <header className="sticky top-0 z-40">
        <div style={{ background: tv.text, color: tv.bg }}>
          <Container size="xl" className="flex items-center justify-between gap-4 py-3.5">
            <a href="#" className="min-w-0 truncate rounded focus-visible:outline-2" style={{ ...displayStyle("clamp(1.3rem, 1.1rem + 0.8vw, 1.75rem)", { color: tv.bg }), outlineColor: tv.bg }}>
              {c.businessName}
            </a>
            <nav aria-label="Sections" className="hidden items-center gap-2 lg:flex">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--site-bg)_14%,transparent)] focus-visible:outline-2" style={{ color: tv.bg, outlineColor: tv.bg }}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <MenuCta ctx={ctx} radius="999px" className="!min-h-10 !px-4">{terms.catalogLabel}</MenuCta>
              {nav.length ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls="diner-nav"
                  aria-label={open ? "Close the section list" : "Open the section list"}
                  onClick={() => setOpen((o) => !o)}
                  className="grid size-10 place-items-center rounded-full focus-visible:outline-2 lg:hidden"
                  style={{ color: tv.bg, outlineColor: tv.bg }}
                >
                  <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M4 6h14M4 11h14M4 16h14" />}
                  </svg>
                </button>
              ) : null}
            </div>
          </Container>
          {open ? (
            <nav id="diner-nav" aria-label="Sections" className="lg:hidden">
              <Container className="grid grid-cols-2 gap-1 pb-4">
                {nav.map((n) => <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="rounded py-2.5 font-semibold focus-visible:outline-2" style={{ color: tv.bg, outlineColor: tv.bg }}>{n.label}</a>)}
              </Container>
            </nav>
          ) : null}
        </div>
        <div aria-hidden style={checker(7)} />
      </header>
      <main>{children}</main>
    </>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  return (
    <section aria-labelledby="diner-title" className="py-12 sm:py-16">
      <Container size="xl" className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          {/* The sign board: the footer colour, with the name lit in neon. */}
          <div className="px-6 py-10 sm:px-10 sm:py-14" style={{ background: tv.footer, borderRadius: R, border: `3px solid ${tv.text}`, boxShadow: `8px 8px 0 ${tv.text}` }}>
            {t.badge ? <p className="text-sm" style={{ color: tv.footerMuted }}>{t.badge}</p> : null}
            <h1 id="diner-title" className="sk-flicker mt-3" style={{ ...displayStyle(fluid.hero, { lineHeight: 1 }), ...neon(tv.footerAccent) }}>
              {c.businessName}
            </h1>
            {tagline ? <p className="mt-5 max-w-lg leading-relaxed" style={{ fontSize: fluid.lead, color: tv.footerText }}>{tagline}</p> : null}
          </div>
          <ActionRow ctx={ctx} radius="999px" menuLabel={terms.ctaLabel} className="mt-8" />
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden" style={chunky}>
            <Image src={src} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-4 sm:-left-8">
            <OpenSign ctx={ctx} />
          </div>
        </div>
      </Container>
      <div className="h-6" aria-hidden />
    </section>
  );
}

/* ─────────────────────────── About + food ─────────────────────────── */

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `md-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden" style={{ ...chunky, borderRadius: "50%" }}>
          <Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 1024px) 28vw, 80vw" className="object-cover" />
        </div>
        <div>
          <Heading id={id} title={c.story.headline || "Our story"} />
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
  const id = `md-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="group overflow-hidden transition-transform hover:-translate-x-1 hover:-translate-y-1 motion-reduce:transition-none" style={chunky}>
              <div className="relative aspect-[4/3] overflow-hidden" style={{ borderBottom: `3px solid ${tv.text}` }}>
                <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="sk-zoom object-cover" />
                {d.price ? <span className="absolute right-3 top-3 rounded-full px-3 py-1 font-bold tabular-nums" style={{ background: tv.accent, color: tv.accentText, border: `2px solid ${tv.text}` }}>{d.price}</span> : null}
              </div>
              <div className="p-5">
                <h3 style={displayStyle(fluid.h3)}>{d.name}</h3>
                {d.description ? <p className="mt-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

function Popular({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `md-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="md">
        <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
        <ul className="mt-10 p-5 sm:p-8" style={chunky}>
          {c.popularItems.map((d, i) => (
            <li key={`${d.name}-${i}`} className="flex items-baseline gap-3 border-b-2 border-dashed py-3 last:border-b-0" style={{ borderColor: mixv(tv.text, "transparent", 20) }}>
              <span className="min-w-0 flex-1">
                <span className="block font-bold" style={{ color: tv.text }}>{d.name}</span>
                {d.description ? <span className="block text-sm" style={{ color: tv.muted }}>{d.description}</span> : null}
              </span>
              {d.price ? <span className="shrink-0 font-bold tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
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

function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  const id = `md-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="Booths and counter" />
        <ul className="mt-12 grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-4">
          {photos.map((src, i) => (
            <li key={src + i} className={`group relative overflow-hidden ${i % 5 === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`} style={chunky}>
              <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="(min-width: 768px) 25vw, 46vw" className="sk-zoom object-cover" />
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `md-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading id={id} title="Pull up a stool" />
          <OpenSign ctx={ctx} />
        </div>
        <div className={`mt-12 grid grid-cols-1 gap-8 ${c.hours.length && hasContact ? "lg:grid-cols-2" : "max-w-xl"}`}>
          {c.hours.length ? <div className="p-6" style={chunky}><HoursList hours={c.hours} todayName={site.todayName} /></div> : null}
          {hasContact ? (
            <div className="p-6" style={chunky}>
              <ContactList ctx={ctx} />
              <SocialLinks ctx={ctx} className="mt-6" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius="999px" className="mt-6" />
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} top={<div aria-hidden style={checker(7)} />} />;
}

const std = standardSections({
  prefix: "md",
  Heading,
  card: chunky,
  radius: "999px",
  align: "left",
  eventsVariant: "cards",
  awardsVariant: "list",
  titles: { team: "The crew", events: "Late nights", reviews: "Regulars say", amenities: "Good to know" },
});

export const layout: LayoutDefinition = {
  key: "midnight-diner",
  label: "Midnight Diner",
  description: "A diner after dark: a chunky bar and checkerboard, the name lit in neon, a live Open sign and chunky cards.",
  menuStructure: "jukebox",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "marquee", "signature-dishes", "popular-items", "curated-list", "offers", "story", "stats",
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
