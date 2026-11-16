"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import type { HoursRow } from "@/components/templates/landing/_shared/defaults";
import { ActionRow, Container, ContactList, HoursList, MenuCta, SectionShell, SocialLinks } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Supper Club — art deco, perfectly symmetrical. A centred bar with stepped
 * rules, the photo in a stepped deco frame, two fans that unfold either side
 * of the name (once), dishes in mirrored columns, photos in framed pairs and
 * a deco clock set to tonight's closing time. Structure and motion only.
 */

const STEPPED = "polygon(0 14px, 8px 14px, 8px 6px, 14px 6px, 14px 0, calc(100% - 14px) 0, calc(100% - 14px) 6px, calc(100% - 8px) 6px, calc(100% - 8px) 14px, 100% 14px, 100% calc(100% - 14px), calc(100% - 8px) calc(100% - 14px), calc(100% - 8px) calc(100% - 6px), calc(100% - 14px) calc(100% - 6px), calc(100% - 14px) 100%, 14px 100%, 14px calc(100% - 6px), 8px calc(100% - 6px), 8px calc(100% - 14px), 0 calc(100% - 14px))";
const card: CSSProperties = { background: tv.surface, border: `1px solid ${mixv(tv.accent, "transparent", 45)}` };

/** A fan of seven blades; on load the blades open out from upright. */
function Fan({ width = 120, className = "", mirror = false }: { width?: number; className?: string; mirror?: boolean }) {
  const n = 7;
  const step = 180 / n;
  const pt = (deg: number) => [60 + 52 * Math.cos((deg * Math.PI) / 180), 60 + 52 * Math.sin((deg * Math.PI) / 180)].map((v) => v.toFixed(2));
  return (
    <svg aria-hidden viewBox="0 0 120 62" width={width} height={(width / 120) * 62} className={className} style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
      {Array.from({ length: n }, (_, k) => {
        const a1 = 180 + k * step;
        const a2 = a1 + step;
        const [x1, y1] = pt(a1);
        const [x2, y2] = pt(a2);
        const mid = a1 + step / 2;
        return (
          <g key={k} className="sk-fan" style={{ ["--i" as string]: k, ["--fold" as string]: `${270 - mid}deg` } as CSSProperties}>
            <path d={`M60 60 L${x1} ${y1} A52 52 0 0 1 ${x2} ${y2} Z`} fill={k % 2 ? mixv(tv.accent, "transparent", 40) : tv.accent} stroke={tv.bg} strokeWidth="0.8" />
          </g>
        );
      })}
      <path d="M8 60 H112" stroke={tv.accent} strokeWidth="1.2" />
    </svg>
  );
}

/** Stepped deco rule: three lines that narrow towards the centre. */
function DecoRule({ className = "", color = tv.accent }: { className?: string; color?: string }) {
  return (
    <span aria-hidden className={`flex flex-col items-center gap-1 ${className}`}>
      <span className="h-px w-24" style={{ background: color }} />
      <span className="h-px w-14" style={{ background: color }} />
      <span className="h-px w-6" style={{ background: color }} />
    </span>
  );
}

function Heading({ id, title, intro }: HeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 id={id} style={displayStyle(fluid.h2, { letterSpacing: "0.02em" })}>{title}</h2>
      <DecoRule className="mt-4" />
      {intro ? <p className="mt-4 leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{intro}</p> : null}
    </div>
  );
}

/** A stepped-corner frame with an inner hairline. */
function DecoFrame({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`p-2.5 ${className}`} style={{ background: tv.accent, clipPath: STEPPED, ...style }}>
      <div className="h-full p-1.5" style={{ background: tv.bg, clipPath: STEPPED }}>
        <div className="relative h-full overflow-hidden" style={{ clipPath: STEPPED }}>{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  const [open, setOpen] = useState(false);
  const half = Math.ceil(nav.length / 2);
  const link = "rounded py-1 text-sm hover:opacity-70 focus-visible:outline-2";
  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: tv.bg, borderBottom: `3px double ${mixv(tv.accent, "transparent", 70)}` }}>
        <Container size="xl" className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
          <nav aria-label="Sections" className="hidden justify-end gap-6 lg:flex">
            {nav.slice(0, half).map((n) => <a key={n.id} href={`#${n.id}`} className={link} style={{ color: tv.text, ...focusRing }}>{n.label}</a>)}
          </nav>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="supper-nav"
            aria-label={open ? "Close the section list" : "Open the section list"}
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center justify-self-start rounded focus-visible:outline-2 lg:hidden"
            style={{ color: tv.text, ...focusRing }}
          >
            <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
              {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 6h16M6 11h10M9 16h4" />}
            </svg>
          </button>
          <a href="#" className="flex flex-col items-center rounded px-2 focus-visible:outline-2" style={focusRing}>
            <span className="max-w-[14rem] truncate text-center" style={displayStyle("clamp(1.15rem, 1rem + 0.6vw, 1.5rem)", { letterSpacing: "0.06em" })}>{c.businessName}</span>
            <DecoRule className="mt-1 scale-75" />
          </a>
          <div className="flex items-center justify-end gap-6">
            <nav aria-label="More sections" className="hidden gap-6 lg:flex">
              {nav.slice(half).map((n) => <a key={n.id} href={`#${n.id}`} className={link} style={{ color: tv.text, ...focusRing }}>{n.label}</a>)}
            </nav>
            <MenuCta ctx={ctx} variant="outline" radius="0" className="!min-h-10 !px-3 sm:!px-4">{terms.catalogLabel}</MenuCta>
          </div>
        </Container>
        {open ? (
          <nav id="supper-nav" aria-label="Sections" className="lg:hidden" style={{ borderTop: `1px solid ${mixv(tv.accent, "transparent", 40)}` }}>
            <Container className="flex flex-col items-center py-3">
              {nav.map((n) => <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="w-full py-2.5 text-center text-lg focus-visible:outline-2" style={{ color: tv.text, fontFamily: tv.display, ...focusRing }}>{n.label}</a>)}
            </Container>
          </nav>
        ) : null}
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
    <section aria-labelledby="supper-title" className="py-14 text-center sm:py-20">
      <Container size="md">
        {t.badge ? <p className="text-sm" style={{ color: tv.accent, letterSpacing: "0.08em" }}>{t.badge}</p> : null}
        <div className="mt-4 flex items-end justify-center gap-3 sm:gap-6">
          <Fan width={92} className="hidden shrink-0 sm:block" />
          <h1 id="supper-title" className="sk-fade" style={displayStyle(fluid.hero, { letterSpacing: "0.03em", ["--sk-delay" as string]: "500ms" } as CSSProperties)}>{c.businessName}</h1>
          <Fan width={92} mirror className="hidden shrink-0 sm:block" />
        </div>
        <Fan width={110} className="mx-auto mt-4 sm:hidden" />
        {tagline ? <p className="mx-auto mt-6 max-w-xl leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{tagline}</p> : null}
        <ActionRow ctx={ctx} radius="0" menuLabel={terms.ctaLabel} className="mt-8 justify-center" />
        <DecoFrame className="mx-auto mt-12 aspect-[16/9] w-full">
          <Image src={src} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 64rem, 92vw" className="object-cover" />
        </DecoFrame>
      </Container>
    </section>
  );
}

/* ─────────────────────────── About + food ─────────────────────────── */

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `sc-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="md" className="text-center">
        <Heading id={id} title={c.story.headline || "Our story"} />
        {c.story.body ? <p className="mx-auto mt-8 max-w-2xl leading-loose" style={{ fontSize: fluid.lead, color: tv.muted }}>{c.story.body}</p> : null}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-5">
          <DecoFrame className="aspect-[3/4]"><Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 768px) 20rem, 45vw" className="object-cover" /></DecoFrame>
          <DecoFrame className="aspect-[3/4]"><Image src={c.gallery[2]?.image_url || img.dish} alt="" fill sizes="(min-width: 768px) 20rem, 45vw" className="object-cover" /></DecoFrame>
        </div>
      </Container>
    </SectionShell>
  );
}

/** Two mirrored columns, divided by a central rule — the left column right-aligned. */
function MirroredList({ items }: { items: Array<{ name: string; description?: string; price?: string; options?: Array<{ label: string; price: string }> }> }) {
  const half = Math.ceil(items.length / 2);
  const cols = [items.slice(0, half), items.slice(half)];
  return (
    <div className="grid grid-cols-1 gap-x-16 md:grid-cols-[1fr_1px_1fr]">
      {cols.map((col, ci) => (
        <ul key={ci} className={`${ci === 0 ? "md:text-right" : "md:col-start-3"} space-y-7`}>
          {col.map((d, i) => (
            <li key={`${d.name}-${i}`}>
              <p style={displayStyle("1.3rem")}>{d.name}</p>
              {d.description ? <p className="mt-1 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
              <p className="mt-1 tabular-nums" style={{ color: tv.accent }}>{d.options && d.options.length ? d.options.map((o) => `${o.label} ${o.price}`).join("  /  ") : d.price}</p>
            </li>
          ))}
        </ul>
      ))}
      <span aria-hidden className="hidden md:col-start-2 md:row-start-1 md:block" style={{ background: mixv(tv.accent, "transparent", 50) }} />
    </div>
  );
}

function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.signatureDishes.length === 0) return null;
  const id = `sc-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="group text-center">
              <DecoFrame className="mx-auto aspect-square w-full max-w-xs">
                <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw" className="sk-zoom object-cover" />
              </DecoFrame>
              <h3 className="mt-5" style={displayStyle(fluid.h3)}>{d.name}</h3>
              {d.description ? <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
              {d.price ? <p className="mt-2 tabular-nums" style={{ color: tv.accent }}>{d.price}</p> : null}
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
  const id = `sc-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="md">
        <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
        <div className="mt-12"><MirroredList items={c.popularItems} /></div>
        <div className="mt-12 text-center">
          <MenuCta ctx={ctx} variant="outline" radius="0">{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Gallery ─────────────────────────── */

/** Photos in framed pairs, the two frames of each pair mirroring each other. */
function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  const pairs: string[][] = [];
  for (let i = 0; i < photos.length; i += 2) pairs.push(photos.slice(i, i + 2));
  const id = `sc-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="md">
        <Heading id={id} title="An evening here" />
        <div className="mt-12 space-y-8">
          {pairs.map((pair, pi) => (
            <div key={pi} className={`grid items-center gap-5 ${pair.length === 2 ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-1"}`}>
              <DecoFrame className={pair.length === 2 ? "aspect-[4/5]" : "mx-auto aspect-[16/9] w-full max-w-2xl"}>
                <Image src={pair[0]} alt={`${c.businessName}, photo ${pi * 2 + 1}`} fill sizes="(min-width: 768px) 28rem, 45vw" className="object-cover" />
              </DecoFrame>
              {pair.length === 2 ? (
                <>
                  <DecoRule className="rotate-90" />
                  <DecoFrame className="aspect-[4/5]">
                    <Image src={pair[1]} alt={`${c.businessName}, photo ${pi * 2 + 2}`} fill sizes="(min-width: 768px) 28rem, 45vw" className="object-cover" />
                  </DecoFrame>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

const toMin = (s?: string) => {
  const m = s?.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** A sunburst clock, its hands set to tonight's closing time. */
function DecoClock({ hours, todayName }: { hours: HoursRow[]; todayName: string }) {
  const today = hours.find((h) => h.day.toLowerCase() === todayName.toLowerCase());
  const close = toMin(today?.endTime);
  const hourDeg = close === null ? 0 : ((close / 60) % 12) * 30;
  const minDeg = close === null ? 0 : (close % 60) * 6;
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-full max-w-[14rem]" role="img" aria-label={close === null ? "Closed today" : `Doors close at ${today!.endTime} tonight`}>
        <circle cx="100" cy="100" r="92" fill={tv.surface} stroke={tv.accent} strokeWidth="3" />
        <circle cx="100" cy="100" r="84" fill="none" stroke={mixv(tv.accent, "transparent", 50)} strokeWidth="1" />
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1="100" y1="100" x2="100" y2="30" stroke={mixv(tv.accent, "transparent", 16)} strokeWidth="1" transform={`rotate(${i * 15} 100 100)`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={i % 3 ? 98.5 : 97} y="16" width={i % 3 ? 3 : 6} height={i % 3 ? 8 : 14} fill={tv.accent} transform={`rotate(${i * 30} 100 100)`} />
        ))}
        {close !== null ? (
          <>
            <line x1="100" y1="100" x2="100" y2="56" stroke={tv.text} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourDeg + minDeg / 12} 100 100)`} />
            <line x1="100" y1="100" x2="100" y2="34" stroke={tv.text} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${minDeg} 100 100)`} />
          </>
        ) : null}
        <circle cx="100" cy="100" r="5" fill={tv.accent} />
      </svg>
      <figcaption className="mt-4 text-center" style={displayStyle("1.25rem")}>
        {close === null ? "Closed today" : `Doors close at ${today!.endTime} tonight`}
      </figcaption>
    </figure>
  );
}

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `sc-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title="Reservations and hours" />
        <div className={`mt-14 grid grid-cols-1 items-start gap-10 ${c.hours.length && hasContact ? "lg:grid-cols-3" : "mx-auto max-w-xl"}`}>
          {c.hours.length ? (
            <>
              <DecoClock hours={c.hours} todayName={site.todayName} />
              <div className="p-6" style={card}><HoursList hours={c.hours} todayName={site.todayName} variant="leaders" /></div>
            </>
          ) : null}
          {hasContact ? (
            <div className="p-6" style={card}>
              <ContactList ctx={ctx} />
              <SocialLinks ctx={ctx} className="mt-6" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius="0" className="mt-6" />
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} align="center" top={<div className="flex justify-center pt-10"><DecoRule color={tv.footerAccent} /></div>} />;
}

const std = standardSections({
  prefix: "sc",
  Heading,
  card,
  radius: "0",
  teamFrame: "notched",
  titles: { team: "Your hosts", events: "Evenings to come", reviews: "Guests' notes", amenities: "For your evening", awards: "Honours" },
});

export const layout: LayoutDefinition = {
  key: "supper-club",
  label: "Supper Club",
  description: "Art deco and symmetrical: stepped frames, fans that unfold beside the name, mirrored columns and a clock set to closing time.",
  menuStructure: "deco-card",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "marquee", "story", "signature-dishes", "popular-items", "curated-list", "events", "offers",
    "stats", "gallery", "team", "reviews", "awards", "visit", "amenities", "faq", "divider", "footer",
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
