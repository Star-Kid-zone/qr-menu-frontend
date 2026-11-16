"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IntroSection } from "../../landing/intro";
import { useCuratedList } from "../../landing/siteContent";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import {
  ActionRow,
  AmenityGrid,
  AwardList,
  BTN,
  buttonStyle,
  Container,
  ContactList,
  EventList,
  FaqList,
  HoursList,
  MenuCta,
  MotifBand,
  offerValue,
  SectionShell,
  SocialLinks,
  Stars,
  TeamGrid,
  todayHoursLine,
} from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter, MarqueeTrack, Parallax } from "@/components/site-system/kit/motion";
import { SiteLottie } from "@/components/site-system/kit/lottie/SiteLottie";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, lightPool, mixv, ON_PHOTO, ON_PHOTO_MUTED, photoScrim, tv } from "@/components/site-system/kit/tokens";

/**
 * Noir Salon — a lounge after dark, staged like a theatre. A bare bar over a
 * full-height stage; one spotlight sweeps across the name. Dishes are lit one
 * at a time, offers are tickets, the gallery is a film reel and the hours run
 * along a ticker. Structure and motion only — the look is the skin's.
 */

function Heading({ id, title, intro, align = "left" }: { id: string; title: string; intro?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 id={id} style={displayStyle(fluid.h2, { letterSpacing: "-0.01em" })}>
        {title}
      </h2>
      <span aria-hidden className={`mt-5 block h-px w-16 ${align === "center" ? "mx-auto" : ""}`} style={{ background: tv.accent }} />
      {intro ? <p className="mt-5 leading-relaxed" style={{ fontSize: fluid.lead, color: tv.muted }}>{intro}</p> : null}
    </div>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  // The see-through bar only makes sense over the stage; if the owner put another section first, stay solid.
  const [overStage, setOverStage] = useState(true);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const first = main.current?.querySelector<HTMLElement>(":scope > [data-section-type]:not([data-section-type='intro'])");
    setOverStage(first?.dataset.sectionType === "hero");
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const button = toggle.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  // Over the stage the bar is see-through with light text; once scrolled it takes the page colours.
  const filled = solid || !overStage;
  const ink = filled || open ? tv.text : ON_PHOTO;
  return (
    <>
      <header
        className="fixed inset-x-0 z-50 transition-[background-color,box-shadow] duration-300"
        style={{
          // Below an occasion banner while it's on screen (--occ-offset, set by OccasionOverlay).
          top: "var(--occ-offset, 0px)",
          background: filled && !open ? mixv(tv.bg, "transparent", 92) : "transparent",
          backdropFilter: filled && !open ? "blur(10px)" : undefined,
          boxShadow: filled && !open ? `0 1px 0 ${mixv(tv.border, "transparent", 80)}` : undefined,
        }}
      >
        <Container size="xl" className="flex items-center justify-between gap-4 py-3.5">
          <a href="#" className="min-w-0 truncate rounded text-xl focus-visible:outline-2 focus-visible:outline-offset-4" style={{ color: ink, fontFamily: tv.display, ...focusRing }}>
            {c.businessName}
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:block">
              <MenuCta ctx={ctx} variant={filled || open ? "solid" : "on-photo"} radius="999px">
                {terms.catalogLabel}
              </MenuCta>
            </span>
            {c.cta.menuBtn ? (
              <ctx.p.LinkComponent
                to={ctx.p.menuHref}
                onClick={() => ctx.p.track("click", "menu_button", {})}
                className="grid size-11 place-items-center rounded-full focus-visible:outline-2 sm:hidden"
                style={{ color: ink, ...focusRing }}
              >
                <SiteIcon name="menu" size={22} title={terms.catalogLabel} />
              </ctx.p.LinkComponent>
            ) : null}
            {nav.length ? (
              <button
                ref={toggle}
                type="button"
                aria-expanded={open}
                aria-controls="noir-index"
                onClick={() => setOpen((o) => !o)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: ink, ...focusRing }}
              >
                <span aria-hidden className="flex w-5 flex-col gap-1.5">
                  <span className="h-px w-full transition-transform duration-300" style={{ background: "currentColor", transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }} />
                  <span className="h-px w-full transition-transform duration-300" style={{ background: "currentColor", transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }} />
                </span>
                {open ? "Close" : "Index"}
              </button>
            ) : null}
          </div>
        </Container>
      </header>

      {open ? (
        <div id="noir-index" role="dialog" aria-modal="true" aria-label="Sections" className="fixed inset-0 z-40 flex flex-col overflow-y-auto" style={{ background: tv.bg }}>
          <Container size="xl" className="flex flex-1 flex-col justify-center gap-10 pb-12 pt-24 lg:flex-row lg:items-end lg:justify-between">
            <nav aria-label="Sections">
              <ul className="space-y-1">
                {nav.map((n, i) => (
                  <li key={n.id} className="sk-mask block">
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${n.id}`}
                      onClick={() => setOpen(false)}
                      className="sk-rise rounded focus-visible:outline-2 focus-visible:outline-offset-4 hover:opacity-60"
                      style={{ ...displayStyle("clamp(2.25rem, 1.6rem + 3.4vw, 4.75rem)", { lineHeight: 1.12 }), ["--i" as string]: i, ["--sk-d" as string]: "650ms", ...focusRing } as CSSProperties}
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="max-w-xs space-y-6 text-sm" style={{ color: tv.muted }}>
              <ContactList ctx={ctx} iconSize={16} />
              <MenuCta ctx={ctx} radius="999px">{terms.ctaLabel}</MenuCta>
            </div>
          </Container>
        </div>
      ) : null}
      <main ref={main} style={{ paddingTop: overStage ? undefined : "4.25rem" }}>
        {children}
      </main>
    </>
  );
}

/* ─────────────────────────── Opening ─────────────────────────── */

function Announcement({ ctx: { c } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <div className="px-4 py-3 text-center text-sm" style={{ background: tv.accent, color: tv.accentText }}>
      {c.announcement}
    </div>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p, site } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  const today = todayHoursLine(c.hours, site.todayName);
  return (
    <section aria-labelledby="noir-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden" style={{ color: ON_PHOTO }}>
      <Image src={src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: photoScrim("center", 0.86) }} />
      {/* The spotlight: one soft pool of light that crosses the stage once. */}
      <div aria-hidden className="sk-sweep -z-10" style={{ background: lightPool(), ["--sk-delay" as string]: "200ms" } as CSSProperties} />
      <Container size="xl" className="flex flex-1 flex-col items-center justify-center pb-16 pt-28 text-center">
        {t.badge ? (
          <p className="sk-fade text-sm" style={{ color: ON_PHOTO_MUTED, ["--sk-delay" as string]: "500ms" } as CSSProperties}>
            {t.badge}
          </p>
        ) : null}
        <h1 id="noir-title" className="sk-fade mt-4 max-w-[14ch]" style={displayStyle(fluid.giant, { color: ON_PHOTO, lineHeight: 0.92, letterSpacing: "-0.02em", ["--sk-delay" as string]: "350ms", ["--sk-d" as string]: "1600ms" } as CSSProperties)}>
          {c.businessName}
        </h1>
        {tagline ? (
          <p className="sk-fade mx-auto mt-7 max-w-xl leading-relaxed" style={{ fontSize: fluid.lead, color: ON_PHOTO_MUTED, ["--sk-delay" as string]: "1400ms" } as CSSProperties}>
            {tagline}
          </p>
        ) : null}
        <div className="sk-fade mt-10" style={{ ["--sk-delay" as string]: "1600ms" } as CSSProperties}>
          <ActionRow ctx={ctx} primary="on-photo" secondary="on-photo-outline" radius="999px" menuLabel={terms.ctaLabel} className="justify-center" />
        </div>
      </Container>
      {today ? (
        <div className="flex items-center justify-center gap-2 pb-8 text-sm" style={{ color: ON_PHOTO_MUTED }}>
          <span className="size-8">
            <SiteLottie name="candle" live={!p.isPreview} className="h-full w-full" />
          </span>
          {today}
        </div>
      ) : null}
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan;
  if (!text) return null;
  const items = text.split(/\s*[·•|]\s*/).filter(Boolean);
  return (
    <div className="py-6" style={{ background: tv.bg, borderBottom: `1px solid ${mixv(tv.border, "transparent", 70)}` }}>
      <MarqueeTrack seconds={Math.max(36, items.length * 12)}>
        {[...items, ...items].map((it, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length || undefined}
            className="px-8"
            style={{ fontFamily: tv.display, fontSize: "clamp(2.25rem, 1.5rem + 3vw, 4.5rem)", lineHeight: 1.1, color: i % 2 ? "transparent" : tv.text, WebkitTextStroke: i % 2 ? `1px ${tv.accent}` : undefined }}
          >
            {it}
          </span>
        ))}
      </MarqueeTrack>
    </div>
  );
}

/* ─────────────────────────── About ─────────────────────────── */

function Stats({ ctx: { c }, section }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  return (
    <SectionShell tone="band" pad="sm" labelledBy={`${section.id}-t`}>
      <h2 id={`${section.id}-t`} className="sr-only">In numbers</h2>
      <Container size="xl">
        <dl className="grid grid grid-cols-1-cols-2 gap-y-8 lg:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="border-l pl-5" style={{ borderColor: mixv(tv.accent, "transparent", 60) }}>
              <dd style={displayStyle("clamp(2.5rem, 2rem + 2.4vw, 4.25rem)", { lineHeight: 1 })}>
                <Counter value={s.value} />
              </dd>
              <dt className="mt-3 text-sm" style={{ color: tv.muted }}>{s.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </SectionShell>
  );
}

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `${section.id}-t`;
  const body = c.story.body.trim();
  const cut = body.search(/[.!?](\s|$)/);
  const lead = cut > 0 && cut < 220 ? body.slice(0, cut + 1) : "";
  const rest = lead ? body.slice(lead.length).trim() : body;
  return (
    <SectionShell labelledBy={id} pad="lg">
      <Container size="xl" className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id={id} className="text-sm" style={{ color: tv.accent }}>{c.story.headline || "Our story"}</h2>
          {lead ? <p className="mt-6" style={displayStyle("clamp(1.75rem, 1.3rem + 2vw, 3rem)", { lineHeight: 1.2 })}>{lead}</p> : null}
          {rest ? <p className="mt-6 max-w-prose leading-loose" style={{ fontSize: fluid.lead, color: tv.muted }}>{rest}</p> : null}
        </div>
        <Parallax amount={70} className="aspect-[4/5] w-full max-w-md justify-self-center lg:justify-self-end" style={{ borderRadius: tv.radius }}>
          <div className="relative h-full w-full">
            <Image src={c.gallery[1]?.image_url || img.scene} alt="" fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
          </div>
        </Parallax>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Food ─────────────────────────── */

/** One dish in the light at a time: point at (or tab to) a name and its photo comes up. */
function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  const [active, setActive] = useState(0);
  const dishes = c.signatureDishes.slice(0, 6);
  if (dishes.length === 0) return null;
  const id = `${section.id}-t`;
  const lit = dishes[Math.min(active, dishes.length - 1)];
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative hidden aspect-[4/5] overflow-hidden lg:block" style={{ borderRadius: tv.radius }}>
            <Image key={lit.name} src={lit.image || img.dish} alt={lit.name} fill sizes="45vw" className="sk-fade object-cover" style={{ ["--sk-d" as string]: "500ms" } as CSSProperties} />
          </div>
          <ul>
            {dishes.map((d, i) => {
              const on = i === active;
              return (
                <li key={`${d.name}-${i}`} style={{ borderBottom: `1px solid ${mixv(tv.border, "transparent", 70)}` }}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group flex w-full items-start gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={focusRing}
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden lg:hidden" style={{ borderRadius: tv.radius }}>
                      <Image src={d.image || img.dish} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="transition-opacity" style={displayStyle(fluid.h3, { opacity: on ? 1 : 0.62 })}>{d.name}</span>
                        {d.price ? <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
                      </span>
                      {d.description ? <span className="mt-2 block text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </SectionShell>
  );
}

function ItemList({ items }: { items: Array<{ name: string; description?: string; price?: string; category?: string; options?: Array<{ label: string; price: string }> }> }) {
  return (
    <ul className="grid grid-cols-1 gap-x-16 md:grid-cols-2">
      {items.map((d, i) => (
        <li key={`${d.name}-${i}`} className="flex items-baseline gap-4 py-5" style={{ borderBottom: `1px solid ${mixv(tv.border, "transparent", 70)}` }}>
          <div className="min-w-0 flex-1">
            <p style={{ color: tv.text, fontFamily: tv.display, fontSize: "1.25rem" }}>{d.name}</p>
            {d.description ? <p className="mt-1 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
          </div>
          <p className="shrink-0 text-right tabular-nums" style={{ color: tv.accent }}>
            {d.options && d.options.length ? d.options.map((o) => <span key={o.label} className="block text-sm">{o.label} {o.price}</span>) : d.price}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Popular({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
          <MenuCta ctx={ctx} variant="outline" radius="999px">{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
        <div className="mt-12">
          <ItemList items={c.popularItems} />
        </div>
      </Container>
    </SectionShell>
  );
}

function Curated({ ctx, section }: LandingSectionProps) {
  const list = useCuratedList(ctx, section.props);
  if (list.items.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title={list.title} />
        <div className="mt-12">
          <ItemList items={list.items} />
        </div>
      </Container>
    </SectionShell>
  );
}

/** Offers as tickets: a stub with the value, notches cut where the perforation runs. */
function Offers({ ctx: { c }, section }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  const id = `${section.id}-t`;
  // A mask, not a colour: opaque = keep. Two half-masks each cut one notch where the perforation meets the edge.
  const cut = "radial-gradient(circle 10px at 7.5rem 0, transparent 98%, black) top/100% 51% no-repeat, radial-gradient(circle 10px at 7.5rem 100%, transparent 98%, black) bottom/100% 51% no-repeat";
  const notch: CSSProperties = { WebkitMaskImage: cut, maskImage: cut };
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title="Tonight's offers" />
        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
          {c.offers.map((o, i) => {
            const value = offerValue(o);
            return (
              <li key={i} className="flex w-[min(30rem,86vw)] shrink-0 snap-start" style={{ ...notch, background: tv.surface, border: `1px solid ${mixv(tv.border, "transparent", 60)}`, borderRadius: tv.radius }}>
                <div className="grid w-[7.5rem] shrink-0 place-items-center border-r border-dashed p-4 text-center" style={{ borderColor: mixv(tv.accent, "transparent", 50), color: tv.accent, fontFamily: tv.display, fontSize: "1.5rem", lineHeight: 1.1 }}>
                  {value || <SiteIcon name="tag" size={28} />}
                </div>
                <div className="min-w-0 p-6">
                  {o.title ? <h3 style={displayStyle(fluid.h3)}>{o.title}</h3> : null}
                  {o.description ? <p className="mt-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{o.description}</p> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Trust ─────────────────────────── */

/** A film reel: frames side by side between sprocket rows; scroll, swipe or use the arrows. */
function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  const reel = useRef<HTMLUListElement>(null);
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 10).map((g) => g.image_url as string);
  const id = `${section.id}-t`;
  const sprockets: CSSProperties = {
    height: 18,
    backgroundImage: `repeating-linear-gradient(90deg, transparent 0 14px, ${mixv(tv.footerText, "transparent", 55)} 14px 26px)`,
    backgroundSize: "26px 8px",
    backgroundPosition: "0 center",
    backgroundRepeat: "repeat-x",
  };
  const scroll = (dir: 1 | -1) => reel.current?.scrollBy({ left: dir * reel.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <SectionShell tone="footer" labelledBy={id}>
      <Container size="xl" className="flex items-end justify-between gap-6">
        <h2 id={id} style={displayStyle(fluid.h2, { color: tv.footerText })}>From the room</h2>
        {photos.length > 2 ? (
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scroll(d)}
                aria-label={d < 0 ? "Earlier photos" : "More photos"}
                className="grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ border: `1px solid ${mixv(tv.footerText, "transparent", 40)}`, color: tv.footerText, outlineColor: tv.footerAccent }}
              >
                <SiteIcon name="arrow-right" size={18} style={{ transform: d < 0 ? "rotate(180deg)" : undefined }} />
              </button>
            ))}
          </div>
        ) : null}
      </Container>
      <div className="mt-10">
        <div aria-hidden style={sprockets} />
        <ul ref={reel} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:px-8">
          {photos.map((src, i) => (
            <li key={src + i} className="relative aspect-[4/3] w-[78vw] shrink-0 snap-center overflow-hidden sm:w-[46vw] lg:w-[34vw]" style={{ borderRadius: 4 }}>
              <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="(min-width: 1024px) 34vw, 78vw" className="object-cover" />
            </li>
          ))}
        </ul>
        <div aria-hidden style={sprockets} />
      </div>
    </SectionShell>
  );
}

/** One review at a time, large; arrows to move through them. */
function Reviews({ ctx, section }: LandingSectionProps) {
  const { c, p } = ctx;
  const [i, setI] = useState(0);
  const reviews = c.googleReviews.slice(0, 8);
  if (reviews.length === 0) return null;
  const id = `${section.id}-t`;
  const r = reviews[i % reviews.length];
  const go = (d: number) => setI((n) => (n + d + reviews.length) % reviews.length);
  return (
    <SectionShell labelledBy={id} pad="lg">
      <Container size="md" className="text-center">
        <h2 id={id} className="text-sm" style={{ color: tv.accent }}>What guests say</h2>
        <figure key={r.id} className="sk-fade mt-8" style={{ ["--sk-d" as string]: "500ms" } as CSSProperties} aria-live="polite">
          {r.text ? <blockquote style={displayStyle("clamp(1.6rem, 1.2rem + 1.8vw, 2.75rem)", { lineHeight: 1.25 })}>“{r.text}”</blockquote> : null}
          <figcaption className="mt-8 flex flex-col items-center gap-2 text-sm" style={{ color: tv.muted }}>
            <span style={{ color: tv.accent }}><Stars rating={r.rating} /></span>
            <span>
              {r.authorName}
              {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
            </span>
          </figcaption>
        </figure>
        {reviews.length > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-4 text-sm" style={{ color: tv.muted }}>
            <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid size-11 place-items-center rounded-full focus-visible:outline-2" style={{ border: `1px solid ${mixv(tv.border, "transparent", 40)}`, color: tv.text, ...focusRing }}>
              <SiteIcon name="arrow-right" size={18} style={{ transform: "rotate(180deg)" }} />
            </button>
            <span className="tabular-nums">{(i % reviews.length) + 1} of {reviews.length}</span>
            <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid size-11 place-items-center rounded-full focus-visible:outline-2" style={{ border: `1px solid ${mixv(tv.border, "transparent", 40)}`, color: tv.text, ...focusRing }}>
              <SiteIcon name="arrow-right" size={18} />
            </button>
          </div>
        ) : null}
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <button type="button" onClick={p.onReview} className={`${BTN} mt-10`} style={buttonStyle("quiet")}>
            Write a review on Google
          </button>
        ) : null}
      </Container>
    </SectionShell>
  );
}

function Awards({ ctx, section }: LandingSectionProps) {
  if (ctx.site.awards.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" pad="sm" labelledBy={id}>
      <Container size="xl" className="grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr]">
        <Heading id={id} title="Press and awards" />
        <AwardList awards={ctx.site.awards} variant="list" />
      </Container>
    </SectionShell>
  );
}

function Team({ ctx, section }: LandingSectionProps) {
  if (ctx.site.team.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title="Behind the bar and the pass" />
        <TeamGrid team={ctx.site.team} className="mt-12" />
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

/** Hours as a running ticker; the full table stays one tap away for anyone who'd rather read it still. */
function HoursTicker({ ctx }: { ctx: LandingSectionContext }) {
  const { c, site } = ctx;
  if (c.hours.length === 0) return null;
  return (
    <div style={{ background: tv.accent, color: tv.accentText }}>
      <MarqueeTrack seconds={Math.max(28, c.hours.length * 6)} className="py-3">
        {c.hours.map((h, i) => (
          <span key={i} className="flex items-center gap-6 whitespace-nowrap px-6 text-sm" style={{ fontWeight: h.day.toLowerCase() === site.todayName.toLowerCase() ? 700 : 400 }}>
            {h.day} {h.hours}
            <span aria-hidden>✦</span>
          </span>
        ))}
      </MarqueeTrack>
    </div>
  );
}

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `${section.id}-t`;
  return (
    <section aria-labelledby={id}>
      <HoursTicker ctx={ctx} />
      <SectionShell as="div" pad="md">
        <Container size="xl" className={`grid gap-12 ${hasContact && c.hours.length ? "lg:grid-cols-[1.2fr_1fr]" : ""}`}>
          {hasContact ? (
            <div>
              <Heading id={id} title="Find us" />
              <ContactList ctx={ctx} className="mt-10 text-lg" iconSize={20} />
              <SocialLinks ctx={ctx} className="mt-8" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius="999px" className="mt-8" />
            </div>
          ) : (
            <Heading id={id} title="Hours" />
          )}
          {c.hours.length ? (
            <details className="group self-start p-6 sm:p-8" open style={{ background: tv.surface, border: `1px solid ${mixv(tv.border, "transparent", 60)}`, borderRadius: tv.radius }}>
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg focus-visible:outline-2 [&::-webkit-details-marker]:hidden" style={{ color: tv.text, fontFamily: tv.display, ...focusRing }}>
                Opening hours
                <SiteIcon name="clock" size={20} />
              </summary>
              <HoursList hours={c.hours} todayName={site.todayName} className="mt-5" />
            </details>
          ) : null}
        </Container>
      </SectionShell>
    </section>
  );
}

function Amenities({ ctx, section }: LandingSectionProps) {
  if (ctx.site.amenities.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" pad="sm" labelledBy={id}>
      <Container size="xl" className="grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr]">
        <Heading id={id} title="The house" />
        <AmenityGrid amenities={ctx.site.amenities} />
      </Container>
    </SectionShell>
  );
}

function Events({ ctx, section }: LandingSectionProps) {
  if (ctx.site.events.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title="On stage soon" />
        <EventList events={ctx.site.events} variant="cards" className="mt-12" />
      </Container>
    </SectionShell>
  );
}

function Faq({ ctx: { c }, section }: LandingSectionProps) {
  if (c.faqs.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="xl" className="grid grid-cols-1 gap-10 lg:grid-cols-[18rem_1fr]">
        <Heading id={id} title="Before you come" />
        <FaqList faqs={c.faqs} />
      </Container>
    </SectionShell>
  );
}

function Divider({ section }: LandingSectionProps) {
  return (
    <div aria-hidden className="py-8" style={{ background: tv.bg }}>
      <Container size="xl">
        <MotifBand variant={section.variant} idPrefix={`ns-${section.id}`} opacity={0.45} />
      </Container>
    </div>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} />;
}

export const layout: LayoutDefinition = {
  key: "noir-salon",
  label: "Noir Salon",
  description: "After dark: a full-height stage with a sweeping spotlight, dishes lit one at a time, a film-reel gallery and an hours ticker.",
  menuStructure: "spotlight",
  Frame,
  nativeOrder: [
    "intro", "hero", "announcement", "marquee", "story", "signature-dishes", "stats", "popular-items", "curated-list", "offers",
    "events", "gallery", "reviews", "team", "awards", "visit", "amenities", "faq", "divider", "footer",
  ],
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
    awards: Awards,
    team: Team,
    amenities: Amenities,
    events: Events,
    "curated-list": Curated,
  },
};
