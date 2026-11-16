"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { ActionRow, Container, ContactList, MenuCta, SectionShell, SocialLinks } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Tatami — quiet, ordered, paper and wood. Sections listed down a vertical
 * rail on laptops; the photo behind paper screens, one of which slides open
 * when the page arrives; photos set in a lattice frame; hours in upright
 * columns. Structure and motion only — the look is the skin's.
 */

const VERTICAL: CSSProperties = { writingMode: "vertical-rl" };

/** Shoji lattice drawn in the border colour over a surface. */
const lattice = (cell = 56, paper = 94): CSSProperties => ({
  backgroundColor: mixv(tv.surface, "transparent", paper),
  backgroundImage: `linear-gradient(${mixv(tv.border, "transparent", 90)} 1px, transparent 1px), linear-gradient(90deg, ${mixv(tv.border, "transparent", 90)} 1px, transparent 1px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

const card: CSSProperties = { background: tv.surface, border: `1px solid ${mixv(tv.border, "transparent", 70)}` };

/** A heading sealed with a small square stamp carrying its first letter. */
function Heading({ id, title, intro, align = "left" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={`flex items-start gap-4 ${center ? "mx-auto max-w-2xl flex-col items-center text-center" : "max-w-2xl"}`}>
      <span aria-hidden className="grid size-9 shrink-0 place-items-center text-sm font-semibold" style={{ border: `1.5px solid ${tv.accent}`, color: tv.accent, fontFamily: tv.display }}>
        {title.trim().charAt(0)}
      </span>
      <div>
        <h2 id={id} style={displayStyle(fluid.h2, { lineHeight: 1.1 })}>{title}</h2>
        {intro ? <p className="mt-3 leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{intro}</p> : null}
      </div>
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
      {/* Laptop: the vertical rail on the right edge. */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-16 flex-col items-center justify-between border-l py-6 lg:flex" style={{ background: tv.bg, borderColor: mixv(tv.border, "transparent", 70) }}>
        <a href="#" className="rounded py-2 focus-visible:outline-2" style={{ ...VERTICAL, ...displayStyle("1.05rem"), ...focusRing }}>
          {c.businessName}
        </a>
        <nav aria-label="Sections">
          <ul className="flex flex-col items-center gap-5">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="rounded py-1 text-sm hover:opacity-60 focus-visible:outline-2" style={{ ...VERTICAL, color: tv.text, ...focusRing }}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {c.cta.menuBtn ? (
          <ctx.p.LinkComponent to={ctx.p.menuHref} onClick={() => ctx.p.track("click", "menu_button", {})} className="grid size-11 place-items-center rounded-full focus-visible:outline-2" style={{ background: tv.accent, color: tv.accentText, ...focusRing }}>
            <SiteIcon name="menu" size={20} title={terms.catalogLabel} />
          </ctx.p.LinkComponent>
        ) : <span />}
      </aside>

      {/* Phone / tablet: a plain bar. */}
      <header className="sticky top-0 z-40 border-b lg:hidden" style={{ background: mixv(tv.bg, "transparent", 94), borderColor: mixv(tv.border, "transparent", 70), backdropFilter: "blur(8px)" }}>
        <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <a href="#" className="min-w-0 truncate rounded focus-visible:outline-2" style={{ ...displayStyle("1.2rem"), ...focusRing }}>{c.businessName}</a>
          <div className="flex shrink-0 items-center gap-1">
            <MenuCta ctx={ctx} radius="0" className="!min-h-10 !px-4">{terms.catalogLabel}</MenuCta>
            {nav.length ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="tatami-nav"
                aria-label={open ? "Close the section list" : "Open the section list"}
                onClick={() => setOpen((o) => !o)}
                className="grid size-10 place-items-center rounded focus-visible:outline-2"
                style={{ color: tv.text, ...focusRing }}
              >
                <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 3h14v14H3zM10 3v14M3 10h14" />}
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        {open ? (
          <nav id="tatami-nav" aria-label="Sections" className="border-t px-5 py-3 sm:px-8" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
            <ul className="grid grid-cols-2 gap-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded py-2.5 focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main className="lg:pr-16">{children}</main>
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
    <section aria-labelledby="tatami-title" className="relative isolate overflow-hidden lg:min-h-[100svh]">
      <Image src={src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-10 object-cover" />
      <div className="grid grid-cols-1 min-h-[88svh] lg:min-h-[100svh] lg:grid-cols-2">
        {/* The fixed screen, carrying the name. */}
        <div className="relative flex items-end p-6 pt-24 sm:p-12 lg:items-center" style={{ ...lattice(64, 62), backdropFilter: "blur(3px)" }}>
          <div className="w-full p-7 sm:p-10" style={{ background: tv.surface, border: `1px solid ${mixv(tv.border, "transparent", 60)}` }}>
            {t.badge ? <p className="text-sm" style={{ color: tv.accent }}>{t.badge}</p> : null}
            <h1 id="tatami-title" className="sk-fade mt-3" style={displayStyle(fluid.hero, { lineHeight: 1.02, ["--sk-delay" as string]: "900ms" } as CSSProperties)}>
              {c.businessName}
            </h1>
            {tagline ? <p className="sk-fade mt-5 max-w-md leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted, ["--sk-delay" as string]: "1100ms" } as CSSProperties}>{tagline}</p> : null}
            <ActionRow ctx={ctx} radius="0" menuLabel={terms.ctaLabel} className="sk-fade mt-8" />
          </div>
        </div>
        {/* The screen that slides open once, showing the room behind it. */}
        <div aria-hidden className="relative hidden overflow-hidden lg:block">
          <div className="sk-slide-r absolute inset-0" style={{ ...lattice(64, 100), borderLeft: `2px solid ${mixv(tv.border, "transparent", 90)}` }} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── About + food ─────────────────────────── */

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `tt-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr_0.9fr] lg:items-start">
        <h2 id={id} className="lg:max-h-[28rem]" style={{ ...displayStyle(fluid.h2, { lineHeight: 1.15 }) }}>
          <span className="lg:[writing-mode:vertical-rl]">{c.story.headline || "Our story"}</span>
        </h2>
        {c.story.body ? <p className="max-w-prose leading-loose lg:pt-2" style={{ fontSize: fluid.lead, color: tv.muted }}>{c.story.body}</p> : <span />}
        <div className="relative aspect-[3/4] w-full max-w-sm justify-self-center p-2" style={card}>
          <div className="relative h-full w-full">
            <Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 1024px) 26vw, 80vw" className="object-cover" />
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

/** Dishes in a lattice: photos separated by fine lines, like panes in a screen. */
function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.signatureDishes.length === 0) return null;
  const id = `tt-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: mixv(tv.border, "transparent", 90), border: `1px solid ${mixv(tv.border, "transparent", 90)}` }}>
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="group p-4" style={{ background: tv.surface }}>
              <div className="relative aspect-square overflow-hidden">
                <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw" className="sk-zoom object-cover" />
              </div>
              <div className="flex items-baseline justify-between gap-3 pt-4">
                <h3 style={displayStyle("1.25rem")}>{d.name}</h3>
                {d.price ? <span className="shrink-0 text-sm tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
              </div>
              {d.description ? <p className="mt-1 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
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
  const id = `tt-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
        <ul className="mt-10 grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {c.popularItems.map((d, i) => (
            <li key={`${d.name}-${i}`} className="flex items-center gap-4 border-b py-4" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
              <span className="relative size-14 shrink-0 overflow-hidden">
                <Image src={d.image || img.dish} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium" style={{ color: tv.text }}>{d.name}</span>
                {d.description ? <span className="block truncate text-sm" style={{ color: tv.muted }}>{d.description}</span> : null}
              </span>
              {d.price ? <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <MenuCta ctx={ctx} variant="outline" radius="0">{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Gallery ─────────────────────────── */

/** Photos framed like a screen: a heavy outer frame, fine lattice between the panes. */
function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 9).map((g) => g.image_url as string);
  const id = `tt-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title="Within these walls" />
        <ul className="mt-12 grid grid grid-cols-1-cols-2 gap-1.5 p-1.5 sm:grid-cols-3" style={{ background: tv.text, border: `6px solid ${tv.text}` }}>
          {photos.map((src, i) => (
            <li key={src + i} className="group relative aspect-square overflow-hidden">
              <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="(min-width: 640px) 30vw, 46vw" className="sk-zoom object-cover" />
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

/** The week in upright columns (laptop); a plain list on phones. */
function HoursColumns({ ctx }: { ctx: LandingSectionProps["ctx"] }) {
  const { c, site } = ctx;
  return (
    <>
      <ol className="hidden h-64 grid-cols-7 gap-px md:grid" style={{ background: mixv(tv.border, "transparent", 80), border: `1px solid ${mixv(tv.border, "transparent", 80)}` }} aria-label="Opening hours">
        {c.hours.map((h) => {
          const today = h.day.toLowerCase() === site.todayName.toLowerCase();
          return (
            <li key={h.day} className="flex items-start justify-center gap-2 py-5" style={{ background: today ? mixv(tv.accent, tv.surface, 12) : tv.surface, color: today ? tv.text : tv.muted }}>
              <span style={{ ...VERTICAL, fontFamily: tv.display, fontSize: "1.15rem", color: today ? tv.accent : tv.text }}>{h.day}</span>
              <span className="text-sm tabular-nums" style={VERTICAL}>{h.hours}</span>
            </li>
          );
        })}
      </ol>
      <ul className="space-y-2 md:hidden">
        {c.hours.map((h) => (
          <li key={h.day} className="flex justify-between gap-4 border-b pb-2" style={{ borderColor: mixv(tv.border, "transparent", 70), color: h.day.toLowerCase() === site.todayName.toLowerCase() ? tv.text : tv.muted }}>
            <span>{h.day}</span>
            <span className="tabular-nums">{h.hours}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Visit({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `tt-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="Visit" />
        <div className={`mt-12 grid gap-10 ${c.hours.length && hasContact ? "lg:grid-cols-[1.4fr_1fr]" : "max-w-3xl"}`}>
          {c.hours.length ? <HoursColumns ctx={ctx} /> : null}
          {hasContact ? (
            <div>
              <ContactList ctx={ctx} />
              <SocialLinks ctx={ctx} className="mt-8" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius="0" className="mt-8" />
            </div>
          ) : null}
        </div>
      </Container>
    </SectionShell>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} />;
}

const std = standardSections({
  prefix: "tt",
  Heading,
  card,
  radius: "0",
  align: "left",
  awardsVariant: "list",
  titles: { team: "Hands in the kitchen", events: "Gatherings", reviews: "Guests' words", amenities: "Good to know", faq: "Questions" },
});

export const layout: LayoutDefinition = {
  key: "tatami",
  label: "Tatami",
  description: "Quiet and ordered: a vertical section rail, paper screens that slide open over the photo, a lattice gallery and hours in upright columns.",
  menuStructure: "bento-box",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "story", "signature-dishes", "popular-items", "curated-list", "marquee", "stats", "offers",
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
