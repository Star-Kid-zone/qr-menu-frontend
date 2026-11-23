"use client";

import Image from "@/components/ui/Image";
import { useState, type CSSProperties } from "react";
import type { LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { ActionRow, Container, ContactList, MenuCta, SectionShell, SocialLinks, todayHoursLine } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Bazaar — a market hall. A striped awning hangs under the header; the photo
 * sits in a tiled frame and is revealed tile by tile (once); dishes are
 * stalls under their own awnings; hours hang on a stall board; photos are a
 * dense mosaic. Structure and motion only — the look is the skin's.
 */

const R = "calc(var(--site-radius, 10px) * 0.6)";
const card: CSSProperties = { background: tv.surface, borderRadius: R, border: `1px solid ${mixv(tv.border, "transparent", 70)}` };

/** Stripes with a scalloped edge, in the accent and the surface colours. */
function Awning({ stripe = 28, className = "" }: { stripe?: number; className?: string }) {
  const s = stripe;
  const r = s / 2;
  return (
    <div aria-hidden className={className}>
      <div style={{ height: s * 0.6, backgroundImage: `repeating-linear-gradient(90deg, ${tv.accent} 0 ${s}px, ${tv.surface} ${s}px ${s * 2}px)` }} />
      <div
        style={{
          height: r,
          backgroundImage: `radial-gradient(circle at ${r}px 0, ${tv.accent} ${r - 0.5}px, transparent ${r}px), radial-gradient(circle at ${s + r}px 0, ${tv.surface} ${r - 0.5}px, transparent ${r}px)`,
          backgroundSize: `${s * 2}px ${r}px`,
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}

/** A frame of small tiles in the accent tint (a checker of two mixes). */
const tileFrame: CSSProperties = {
  backgroundColor: mixv(tv.accent, tv.surface, 18),
  backgroundImage: `conic-gradient(${mixv(tv.accent, tv.surface, 55)} 25%, transparent 0 50%, ${mixv(tv.accent, tv.surface, 55)} 0 75%, transparent 0)`,
  backgroundSize: "16px 16px",
};

function Heading({ id, title, intro, align = "center" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 id={id} style={displayStyle(fluid.h2)}>{title}</h2>
      <span aria-hidden className={`mt-4 flex gap-1 ${center ? "justify-center" : ""}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="size-2 rotate-45" style={{ background: i % 2 ? tv.border : tv.accent }} />
        ))}
      </span>
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
      <header className="sticky top-0 z-40" style={{ background: tv.bg }}>
        <Container size="xl" className="flex items-center justify-between gap-4 py-3">
          <a href="#" className="min-w-0 truncate rounded focus-visible:outline-2" style={{ ...displayStyle("clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem)"), ...focusRing }}>
            {c.businessName}
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-5 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded py-1 text-sm hover:opacity-70 focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>{n.label}</a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <MenuCta ctx={ctx} radius={R} className="!min-h-10 !px-4">{terms.catalogLabel}</MenuCta>
            {nav.length ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="bazaar-nav"
                aria-label={open ? "Close the section list" : "Open the section list"}
                onClick={() => setOpen((o) => !o)}
                className="grid size-10 place-items-center rounded focus-visible:outline-2 lg:hidden"
                style={{ color: tv.text, ...focusRing }}
              >
                <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
                </svg>
              </button>
            ) : null}
          </div>
        </Container>
        {open ? (
          <nav id="bazaar-nav" aria-label="Sections" className="lg:hidden" style={{ background: tv.surface }}>
            <Container className="grid grid-cols-2 gap-1 py-3">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="rounded py-2.5 focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>{n.label}</a>
              ))}
            </Container>
          </nav>
        ) : null}
        <Awning className="pointer-events-none absolute inset-x-0 top-full" stripe={24} />
      </header>
      <main className="pt-6">{children}</main>
    </>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

const COLS = 8;
const ROWS = 6;

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, site } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  const today = todayHoursLine(c.hours, site.todayName);
  return (
    <section aria-labelledby="bazaar-title" className="py-12 sm:py-16">
      <Container size="xl" className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          {t.badge ? <p className="inline-block px-3 py-1 text-sm font-semibold" style={{ background: tv.accent, color: tv.accentText, borderRadius: R }}>{t.badge}</p> : null}
          <h1 id="bazaar-title" className="mt-5" style={displayStyle(fluid.hero)}>{c.businessName}</h1>
          {tagline ? <p className="mt-5 max-w-lg leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{tagline}</p> : null}
          {today ? (
            <p className="mt-5 inline-flex items-center gap-2 text-sm" style={{ color: tv.text }}>
              <SiteIcon name="clock" size={16} />
              {today}
            </p>
          ) : null}
          <ActionRow ctx={ctx} radius={R} menuLabel={terms.ctaLabel} className="mt-8" />
        </div>
        <div className="p-3 sm:p-4" style={{ ...tileFrame, borderRadius: R }}>
          <div className="relative aspect-[5/4] overflow-hidden" style={{ borderRadius: `calc(${R} * 0.6)` }}>
            <Image src={src} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 50vw, 92vw" className="object-cover" />
            {/* The photo is revealed tile by tile, from the centre out (once). */}
            <div aria-hidden className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
              {Array.from({ length: COLS * ROWS }, (_, i) => {
                const x = i % COLS;
                const y = Math.floor(i / COLS);
                const d = Math.abs(x - (COLS - 1) / 2) + Math.abs(y - (ROWS - 1) / 2);
                return <span key={i} className="sk-tile-out" style={{ background: (x + y) % 2 ? mixv(tv.accent, tv.surface, 55) : mixv(tv.accent, tv.surface, 25), ["--i" as string]: Math.round(d * 3) } as CSSProperties} />;
              })}
            </div>
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
  const id = `bz-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="p-3" style={{ ...tileFrame, borderRadius: R }}>
          <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: `calc(${R} * 0.6)` }}>
            <Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
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

/** Each dish is a stall: its own little awning over the photo. */
function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.signatureDishes.length === 0) return null;
  const id = `bz-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="group sk-lift overflow-hidden" style={card}>
              <Awning stripe={18} />
              <div className="relative mx-3 mt-1 aspect-[4/3] overflow-hidden" style={{ borderRadius: R }}>
                <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="sk-zoom object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 style={displayStyle(fluid.h3)}>{d.name}</h3>
                  {d.price ? <span className="shrink-0 font-semibold tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
                </div>
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
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `bz-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {c.popularItems.map((d, i) => (
            <li key={`${d.name}-${i}`} className="overflow-hidden" style={card}>
              <div className="relative aspect-square">
                <Image src={d.image || img.dish} alt="" fill sizes="(min-width: 768px) 22vw, 46vw" className="object-cover" />
                {d.price ? <span className="absolute bottom-2 right-2 px-2 py-0.5 text-sm font-semibold tabular-nums" style={{ background: tv.accent, color: tv.accentText, borderRadius: R }}>{d.price}</span> : null}
              </div>
              <p className="p-3 text-sm font-medium" style={{ color: tv.text }}>{d.name}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <MenuCta ctx={ctx} variant="outline" radius={R}>{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Gallery ─────────────────────────── */

/** A dense mosaic: tiles of different sizes packed tight. */
const MOSAIC = ["col-span-2 row-span-2", "", "", "row-span-2", "col-span-2", "", "", "col-span-2 row-span-2", "", "row-span-2", "", ""];

function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 12).map((g) => g.image_url as string);
  const id = `bz-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title="Around the market" />
        <ul className="mt-12 grid grid-flow-dense auto-rows-[7rem] grid-cols-3 gap-1.5 sm:auto-rows-[9rem] md:grid-cols-6">
          {photos.map((src, i) => (
            <li key={src + i} className={`group relative overflow-hidden ${photos.length > 2 ? MOSAIC[i % MOSAIC.length] : "col-span-3"}`} style={{ borderRadius: 4 }}>
              <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="(min-width: 768px) 33vw, 66vw" className="sk-zoom object-cover" />
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

/** Hours on a board hung from two strings, like a stall's sign. */
function StallBoard({ ctx }: { ctx: LandingSectionProps["ctx"] }) {
  const { c, site } = ctx;
  return (
    <div className="relative pt-10">
      <svg aria-hidden className="absolute inset-x-0 top-0 h-10 w-full" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ color: tv.muted }}>
        <path d="M20 40 L50 2 L80 40" fill="none" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full" style={{ background: tv.text }} />
      <div className="p-6 sm:p-8" style={{ background: tv.footer, color: tv.footerMuted, borderRadius: R, border: `6px solid ${mixv(tv.accent, tv.text, 55)}` }}>
        <p className="text-center" style={displayStyle(fluid.h3, { color: tv.footerText })}>Opening hours</p>
        <ul className="mt-5 space-y-2">
          {c.hours.map((h) => {
            const today = h.day.toLowerCase() === site.todayName.toLowerCase();
            return (
              <li key={h.day} className="flex items-baseline gap-3" style={{ color: today ? tv.footerText : undefined, fontWeight: today ? 700 : 400 }}>
                <span>{h.day}</span>
                <span aria-hidden className="min-w-4 flex-1 translate-y-[-3px] border-b border-dashed" style={{ borderColor: mixv(tv.footerText, "transparent", 35) }} />
                <span className="whitespace-nowrap tabular-nums">{h.hours}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Visit({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `bz-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title="Find our stall" />
        <div className={`mt-12 grid grid-cols-1 items-start gap-10 ${c.hours.length && hasContact ? "lg:grid-cols-2" : "mx-auto max-w-xl"}`}>
          {c.hours.length ? <StallBoard ctx={ctx} /> : null}
          {hasContact ? (
            <div className="p-6 sm:p-8 lg:mt-10" style={card}>
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
  return <FooterV2 ctx={ctx} top={<Awning stripe={24} />} />;
}

const std = standardSections({
  prefix: "bz",
  Heading,
  card,
  radius: R,
  eventsVariant: "cards",
  titles: { team: "The stallholders", events: "Market days", reviews: "Overheard at the counter", amenities: "Good to know" },
});

export const layout: LayoutDefinition = {
  key: "bazaar",
  label: "Bazaar",
  description: "A market hall: a striped awning, a tiled frame that reveals the photo tile by tile, dishes as stalls and a dense photo mosaic.",
  menuStructure: "market-stalls",
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
