"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import { IntroSection } from "../../landing/intro";
import { useCuratedList } from "../../landing/siteContent";
import type { LandingSectionContext, LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { OrnamentCorner } from "@/components/site-system/ornaments";
import { useSiteLook } from "@/components/site-system/SiteLookContext";
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
  Photo,
  SectionShell,
  SocialLinks,
  Stars,
  TeamGrid,
  todayHoursLine,
} from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { Counter, Curtain, LineReveal, MarqueeTrack, Reveal } from "@/components/site-system/kit/motion";
import { SiteLottie } from "@/components/site-system/kit/lottie/SiteLottie";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Grand Hall — a palace dining room. Centred crest with the sections split
 * either side of it; the name set beside an arched window; everything framed,
 * ruled and symmetrical. Its one moment: a velvet curtain parts and the name
 * sets word by word. Hours sit on a printed card; the gallery is a row of arches.
 *
 * Structure and motion only — every colour, face and icon comes from the skin.
 */

/** A true semicircle on top of a 3:4–4:5 photo. */
const ARCH = "50% 50% 0 0 / 38% 38% 0 0";

/** The hall's ornament: a lozenge on a rule, with scrolls curling away from it. */
function Flourish({ width = 200, className = "", color = tv.accent }: { width?: number; className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 20" width={width} height={(width / 200) * 20} className={className} fill="none" stroke="currentColor" strokeLinecap="round" style={{ color }}>
      <path d="M4 10h66c6 0 8-6 13-6s5 6 1 6M196 10h-66c-6 0-8 6-13 6s-5-6-1-6" strokeWidth="1" />
      <path d="M100 2l7 8-7 8-7-8z" strokeWidth="1.2" />
      <path d="M100 6.5l3 3.5-3 3.5-3-3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => /\p{L}/u.test(w));
  return (words.length > 1 ? `${words[0][0]}${words[1][0]}` : (words[0] ?? "·").slice(0, 2)).toUpperCase();
}

/** The crest: the owner's logo, or their initials, inside a double ring. */
function Crest({ ctx, size = 64 }: { ctx: LandingSectionContext; size?: number }) {
  const { c } = ctx;
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, border: `1px solid ${tv.accent}`, outline: `1px solid ${mixv(tv.accent, "transparent", 45)}`, outlineOffset: 3, color: tv.accent }}
    >
      {c.logoUrl ? (
        <span className="relative overflow-hidden rounded-full" style={{ width: size - 10, height: size - 10 }}>
          <Image src={c.logoUrl} alt="" fill sizes={`${size}px`} className="object-cover" />
        </span>
      ) : (
        <span style={{ fontFamily: tv.display, fontSize: size * 0.36, lineHeight: 1 }}>{initials(c.businessName)}</span>
      )}
    </span>
  );
}

function Heading({ id, title, intro, align = "center", tone = "text" }: { id: string; title: string; intro?: string; align?: "center" | "left"; tone?: "text" | "footer" }) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <h2 id={id} style={displayStyle(fluid.h2, tone === "footer" ? { color: tv.footerText } : {})}>
        {title}
      </h2>
      <Flourish className={`mt-4 ${center ? "mx-auto" : ""}`} />
      {intro ? (
        <p className="mt-5 leading-relaxed" style={{ fontSize: fluid.lead, color: tone === "footer" ? tv.footerMuted : tv.muted }}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** A framed card: hairline border, an inner rule, and the skin's corner ornament in each corner. */
function FramedCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const { ornaments } = useSiteLook();
  return (
    <div className={`relative p-7 sm:p-10 ${className}`} style={{ background: tv.surface, border: `1px solid ${mixv(tv.accent, "transparent", 55)}`, ...style }}>
      <span aria-hidden className="pointer-events-none absolute inset-2" style={{ border: `1px solid ${mixv(tv.accent, "transparent", 25)}` }} />
      <OrnamentCorner corner={ornaments.corner} size={26} className="absolute left-1 top-1" />
      <OrnamentCorner corner={ornaments.corner} size={26} className="absolute right-1 top-1 rotate-90" />
      <OrnamentCorner corner={ornaments.corner} size={26} className="absolute bottom-1 right-1 rotate-180" />
      <OrnamentCorner corner={ornaments.corner} size={26} className="absolute bottom-1 left-1 -rotate-90" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  const [open, setOpen] = useState(false);
  const half = Math.ceil(nav.length / 2);
  const left = nav.slice(0, half);
  const right = nav.slice(half);
  const today = todayHoursLine(c.hours, ctx.site.todayName);
  const link = "rounded px-1 py-1 text-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <>
      {today || c.phone ? (
        <div className="text-xs" style={{ background: tv.footer, color: tv.footerMuted }}>
          <Container size="xl" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-2 sm:justify-between">
            {today ? (
              <span className="inline-flex items-center gap-2">
                <SiteIcon name="clock" size={14} />
                {today}
              </span>
            ) : <span />}
            {c.phone ? (
              <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2 hover:underline" style={{ color: tv.footerText }}>
                <SiteIcon name="phone" size={14} />
                {c.phone}
              </a>
            ) : null}
          </Container>
        </div>
      ) : null}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: mixv(tv.bg, "transparent", 90), borderBottom: `1px solid ${mixv(tv.accent, "transparent", 35)}` }}>
        <Container size="xl" className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3">
          <nav aria-label="Sections" className="hidden items-center justify-end gap-6 lg:flex">
            {left.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={link} style={{ color: tv.text, ...focusRing }}>
                {n.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="grid size-11 place-items-center justify-self-start rounded-full focus-visible:outline-2 lg:hidden"
            aria-expanded={open}
            aria-controls="grand-hall-nav"
            aria-label={open ? "Close the section list" : "Open the section list"}
            onClick={() => setOpen((o) => !o)}
            style={{ color: tv.text, ...focusRing }}
          >
            <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 7h16M6 11h10M3 15h16" />}
            </svg>
          </button>
          <a href="#" className="flex flex-col items-center gap-1.5 rounded focus-visible:outline-2 focus-visible:outline-offset-4" style={focusRing} aria-label={`${c.businessName}, back to top`}>
            <Crest ctx={ctx} size={52} />
            <span className="hidden max-w-[16rem] truncate text-sm sm:block" style={{ color: tv.text, fontFamily: tv.display }}>
              {c.businessName}
            </span>
          </a>
          <div className="flex items-center justify-end gap-6">
            <nav aria-label="More sections" className="hidden items-center gap-6 lg:flex">
              {right.map((n) => (
                <a key={n.id} href={`#${n.id}`} className={link} style={{ color: tv.text, ...focusRing }}>
                  {n.label}
                </a>
              ))}
            </nav>
            <span className="hidden sm:block">
              <MenuCta ctx={ctx} variant="outline" radius="0">
                {terms.catalogLabel}
              </MenuCta>
            </span>
            {c.cta.menuBtn ? (
              <ctx.p.LinkComponent
                to={ctx.p.menuHref}
                onClick={() => ctx.p.track("click", "menu_button", {})}
                className="grid size-11 place-items-center rounded-full focus-visible:outline-2 sm:hidden"
                style={{ color: tv.accent, ...focusRing }}
              >
                <SiteIcon name="menu" size={22} title={terms.catalogLabel} />
              </ctx.p.LinkComponent>
            ) : null}
          </div>
        </Container>
        {open ? (
          <nav id="grand-hall-nav" aria-label="Sections" className="lg:hidden" style={{ borderTop: `1px solid ${mixv(tv.accent, "transparent", 30)}` }}>
            <Container className="flex flex-col items-center py-4 text-center">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="w-full py-3 text-lg focus-visible:outline-2" style={{ color: tv.text, fontFamily: tv.display, ...focusRing }}>
                  {n.label}
                </a>
              ))}
              <MenuCta ctx={ctx} radius="0" className="mt-3 w-full sm:hidden">
                {terms.ctaLabel}
              </MenuCta>
            </Container>
          </nav>
        ) : null}
      </header>
      <main>{children}</main>
    </>
  );
}

/* ─────────────────────────── Opening ─────────────────────────── */

function Announcement({ ctx: { c } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <div className="px-4 py-3 text-center text-sm" style={{ background: tv.accent, color: tv.accentText }}>
      <span className="inline-flex items-center gap-3">
        <span aria-hidden>◆</span>
        {c.announcement}
        <span aria-hidden>◆</span>
      </span>
    </div>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, p } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  const velvet = `repeating-linear-gradient(90deg, ${mixv(tv.accent, tv.text, 72)} 0 22px, ${mixv(tv.accent, tv.text, 56)} 22px 46px, ${mixv(tv.accent, tv.text, 66)} 46px 64px)`;
  return (
    <section aria-labelledby="hall-title" className="relative isolate overflow-hidden" style={{ background: tv.bg }}>
      <Curtain color={velvet} />
      <Container size="xl" className="grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="text-center lg:text-left">
          {t.badge ? (
            <p className="sk-fade inline-flex items-center gap-3 text-sm" style={{ color: tv.accent, ["--sk-delay" as string]: "900ms" } as CSSProperties}>
              <span aria-hidden className="h-px w-8" style={{ background: "currentColor" }} />
              {t.badge}
              <span aria-hidden className="h-px w-8 lg:hidden" style={{ background: "currentColor" }} />
            </p>
          ) : null}
          <LineReveal id="hall-title" text={c.businessName} delayMs={950} className="mt-5" style={displayStyle(fluid.hero, { lineHeight: 1.02 })} />
          <Flourish width={240} className="sk-fade mx-auto mt-6 lg:mx-0" />
          {tagline ? (
            <p className="sk-fade mx-auto mt-6 max-w-lg leading-relaxed lg:mx-0" style={{ fontSize: fluid.lead, color: tv.muted, ["--sk-delay" as string]: "1300ms" } as CSSProperties}>
              {tagline}
            </p>
          ) : null}
          <div className="sk-fade mt-9 flex justify-center lg:justify-start" style={{ ["--sk-delay" as string]: "1450ms" } as CSSProperties}>
            <ActionRow ctx={ctx} radius="0" menuLabel={terms.ctaLabel} className="justify-center lg:justify-start" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-md lg:max-w-none">
          <div className="relative p-3" style={{ borderRadius: ARCH, border: `1px solid ${mixv(tv.accent, "transparent", 55)}` }}>
            <Photo src={src} alt={c.terms.heroAlt} frame="none" priority className="aspect-[4/5] w-full" style={{ borderRadius: ARCH, overflow: "hidden" }} sizes="(min-width: 1024px) 40vw, 90vw" />
            <span aria-hidden className="pointer-events-none absolute inset-6" style={{ borderRadius: ARCH, border: `1px solid ${mixv(tv.bg, "transparent", 55)}` }} />
          </div>
          <div aria-hidden className="absolute -right-4 -top-6 size-24 sm:size-28">
            <SiteLottie name="sparkle" live={!p.isPreview} className="h-full w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan;
  if (!text) return null;
  const items = text.split(/\s*[·•|]\s*/).filter(Boolean);
  return (
    <div style={{ background: tv.surface, borderBlock: `1px solid ${mixv(tv.accent, "transparent", 40)}`, color: tv.text }} className="py-4">
      <MarqueeTrack seconds={Math.max(30, items.length * 9)}>
        {[...items, ...items].map((it, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined} className="flex items-center gap-8 px-8 text-lg" style={{ fontFamily: tv.display }}>
            {it}
            <span aria-hidden style={{ color: tv.accent }}>✦</span>
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
      <Container size="md">
        <dl className="grid grid-cols-2 sm:flex sm:justify-center">
          {c.stats.map((s, i) => (
            <div key={s.label} className="px-6 py-6 text-center sm:flex-1" style={{ borderLeft: i > 0 ? `1px solid ${mixv(tv.accent, "transparent", 40)}` : undefined }}>
              <dd style={displayStyle("clamp(2.25rem, 1.8rem + 2vw, 3.5rem)", { color: tv.accent })}>
                <Counter value={s.value} />
              </dd>
              <dt className="mt-2 text-sm" style={{ color: tv.muted }}>{s.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </SectionShell>
  );
}

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (!c.story) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="mx-auto w-full max-w-sm">
          <div className="p-3" style={{ borderRadius: ARCH, border: `1px solid ${mixv(tv.accent, "transparent", 50)}` }}>
            <Photo src={c.gallery[1]?.image_url || img.scene} alt="" frame="none" className="aspect-[3/4] w-full" style={{ borderRadius: ARCH, overflow: "hidden" }} />
          </div>
        </Reveal>
        <div>
          <Heading id={id} title={c.story.headline || "Our story"} align="left" />
          {c.story.body ? (
            <p
              className="mt-8 max-w-prose leading-loose first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:[color:var(--site-accent)] first-letter:[font-family:var(--site-font-display,var(--site-font))]"
              style={{ fontSize: fluid.lead, color: tv.muted }}
            >
              {c.story.body}
            </p>
          ) : null}
          <div className="mt-10">
            <MenuCta ctx={ctx} variant="outline" radius="0">{terms.ctaLabel}</MenuCta>
          </div>
        </div>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Food ─────────────────────────── */

function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  if (c.signatureDishes.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
        <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {c.signatureDishes.slice(0, 6).map((d, i) => (
            <li key={`${d.name}-${i}`} className="group text-center">
              <div className="mx-auto max-w-[17rem] p-2" style={{ borderRadius: ARCH, border: `1px solid ${mixv(tv.accent, "transparent", 45)}` }}>
                <div className="overflow-hidden" style={{ borderRadius: ARCH }}>
                  <Photo src={d.image || img.dish} alt={d.name} frame="none" className="sk-zoom aspect-[4/5] w-full" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw" />
                </div>
              </div>
              <h3 className="mt-6" style={displayStyle(fluid.h3)}>{d.name}</h3>
              {d.description ? <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
              {d.price ? <p className="mt-3 text-lg tabular-nums" style={{ color: tv.accent, fontFamily: tv.display }}>{d.price}</p> : null}
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/** A bill of fare: name, dotted leader, price; the description beneath. */
function BillRows({ items }: { items: Array<{ name: string; description?: string; price?: string; options?: Array<{ label: string; price: string }> }> }) {
  return (
    <ul className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
      {items.map((d, i) => (
        <li key={`${d.name}-${i}`} className="py-5" style={{ borderBottom: `1px solid ${mixv(tv.border, "transparent", 60)}` }}>
          <p className="flex items-baseline gap-3">
            <span className="min-w-0" style={{ color: tv.text, fontFamily: tv.display, fontSize: "1.2rem" }}>{d.name}</span>
            <span aria-hidden className="min-w-6 flex-1 translate-y-[-4px] border-b border-dotted" style={{ borderColor: mixv(tv.accent, "transparent", 50) }} />
            <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>
              {d.options && d.options.length ? d.options.map((o) => `${o.label} ${o.price}`).join(" · ") : d.price}
            </span>
          </p>
          {d.description ? <p className="mt-1.5 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
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
      <Container size="md">
        <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
        <div className="mt-12">
          <BillRows items={c.popularItems} />
        </div>
        <div className="mt-12 text-center">
          <MenuCta ctx={ctx} radius="0">{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
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
      <Container size="md">
        <FramedCard>
          <Heading id={id} title={list.title} />
          <div className="mt-10">
            <BillRows items={list.items} />
          </div>
        </FramedCard>
      </Container>
    </SectionShell>
  );
}

function Offers({ ctx: { c }, section }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="Offers" intro="Current offers at the house." />
        <ul className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {c.offers.map((o, i) => {
            const value = offerValue(o);
            return (
              <li key={i}>
                <FramedCard className="h-full text-center">
                  {value ? <p style={displayStyle("clamp(1.8rem, 1.5rem + 1.2vw, 2.5rem)", { color: tv.accent })}>{value}</p> : null}
                  {o.title ? <h3 className="mt-3" style={displayStyle(fluid.h3)}>{o.title}</h3> : null}
                  {o.description ? <p className="mt-3 text-sm leading-relaxed" style={{ color: tv.muted }}>{o.description}</p> : null}
                </FramedCard>
              </li>
            );
          })}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Trust ─────────────────────────── */

function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 8).map((g) => g.image_url as string);
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="xl">
        <Heading id={id} title="Inside the hall" />
        <ul className="mt-14 grid grid grid-cols-1-cols-2 items-end gap-4 sm:gap-6 md:grid-cols-4">
          {photos.map((src, i) => (
            <li key={src + i} className={i % 2 ? "md:translate-y-10" : ""}>
              <div className="group overflow-hidden p-1.5" style={{ borderRadius: ARCH, border: `1px solid ${mixv(tv.accent, "transparent", 45)}` }}>
                <div className="overflow-hidden" style={{ borderRadius: ARCH }}>
                  <Photo src={src} alt={`${c.businessName}, photo ${i + 1}`} frame="none" className={`sk-zoom w-full ${i % 3 === 0 ? "aspect-[3/5]" : "aspect-[3/4]"}`} sizes="(min-width: 768px) 24vw, 48vw" />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="h-10" aria-hidden />
      </Container>
    </SectionShell>
  );
}

function Reviews({ ctx, section }: LandingSectionProps) {
  const { c, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  const [first, ...rest] = c.googleReviews.slice(0, 4);
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="md" className="text-center">
        <h2 id={id} className="sr-only">Guest reviews</h2>
        <Flourish className="mx-auto" />
        <figure className="mx-auto mt-10 max-w-3xl">
          <span style={{ color: tv.accent }}><Stars rating={first.rating} size={18} /></span>
          {first.text ? (
            <blockquote className="mt-6" style={displayStyle("clamp(1.5rem, 1.15rem + 1.6vw, 2.4rem)", { lineHeight: 1.3 })}>
              “{first.text}”
            </blockquote>
          ) : null}
          <figcaption className="mt-6 text-sm" style={{ color: tv.muted }}>
            {first.authorName}
            {first.relativePublishDescription ? `, ${first.relativePublishDescription}` : ""}
          </figcaption>
        </figure>
        {rest.length ? (
          <ul className="mt-14 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
            {rest.map((r) => (
              <li key={r.id} className="p-6" style={{ background: tv.surface, border: `1px solid ${mixv(tv.accent, "transparent", 30)}` }}>
                <span style={{ color: tv.accent }}><Stars rating={r.rating} /></span>
                {r.text ? <p className="mt-3 text-sm leading-relaxed" style={{ color: tv.text }}>{r.text}</p> : null}
                <p className="mt-4 text-xs" style={{ color: tv.muted }}>{r.authorName}</p>
              </li>
            ))}
          </ul>
        ) : null}
        {c.cta.reviewBtn && c.cta.reviewLink ? (
          <button type="button" onClick={p.onReview} className={`${BTN} mt-12`} style={buttonStyle("outline", "0")}>
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
      <Container>
        <Heading id={id} title="Honours and press" />
        <AwardList awards={ctx.site.awards} className="mt-12" />
      </Container>
    </SectionShell>
  );
}

function Team({ ctx, section }: LandingSectionProps) {
  if (ctx.site.team.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="The household" intro="The people who cook, pour and welcome you." />
        <TeamGrid team={ctx.site.team} frame="arch" className="mt-14" />
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasHours = c.hours.length > 0;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!hasHours && !hasContact) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="Visit the hall" />
        <div className={`mt-14 grid items-start gap-12 ${hasHours && hasContact ? "lg:grid-cols-2" : "mx-auto max-w-xl"}`}>
          {hasHours ? (
            <FramedCard>
              <p className="text-center" style={displayStyle(fluid.h3)}>Hours</p>
              <Flourish width={120} className="mx-auto mt-3" />
              <HoursList hours={c.hours} todayName={site.todayName} variant="leaders" className="mt-6" />
            </FramedCard>
          ) : null}
          {hasContact ? (
            <div className="lg:pt-6">
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

function Amenities({ ctx, section }: LandingSectionProps) {
  if (ctx.site.amenities.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" pad="sm" labelledBy={id}>
      <Container>
        <Heading id={id} title="For your comfort" />
        <AmenityGrid amenities={ctx.site.amenities} className="mx-auto mt-12 max-w-4xl" />
      </Container>
    </SectionShell>
  );
}

function Events({ ctx, section }: LandingSectionProps) {
  if (ctx.site.events.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container size="md">
        <Heading id={id} title="Evenings at the hall" />
        <FramedCard className="mt-12">
          <EventList events={ctx.site.events} />
        </FramedCard>
      </Container>
    </SectionShell>
  );
}

function Faq({ ctx: { c }, section }: LandingSectionProps) {
  if (c.faqs.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container size="sm">
        <Heading id={id} title="Questions" />
        <FaqList faqs={c.faqs} className="mt-10" />
      </Container>
    </SectionShell>
  );
}

function Divider({ section }: LandingSectionProps) {
  return (
    <div aria-hidden className="py-10" style={{ background: tv.bg }}>
      <Container className="flex items-center gap-6">
        <MotifBand variant={section.variant} idPrefix={`gh-${section.id}`} className="flex-1" />
        <Flourish width={160} className="shrink-0" />
        <MotifBand variant={section.variant} idPrefix={`gh-${section.id}-b`} className="flex-1" />
      </Container>
    </div>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return (
    <FooterV2
      ctx={ctx}
      align="center"
      crest={<Crest ctx={ctx} size={76} />}
      top={<div className="flex justify-center pt-10"><Flourish width={180} color={tv.footerAccent} /></div>}
    />
  );
}

export const layout: LayoutDefinition = {
  key: "grand-hall",
  label: "Grand Hall",
  description: "A palace dining room: centred crest, arched windows, framed cards and a velvet curtain that opens the page.",
  menuStructure: "bill-of-fare",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "marquee", "stats", "story", "team", "signature-dishes", "popular-items", "curated-list",
    "offers", "events", "gallery", "reviews", "awards", "visit", "amenities", "faq", "divider", "footer",
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
