"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { IntroSection } from "../../landing/intro";
import { useCuratedList } from "../../landing/siteContent";
import type { LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import {
  ActionRow,
  AmenityGrid,
  AwardList,
  BTN,
  buttonStyle,
  ContactList,
  EventList,
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
import { Counter, MarqueeTrack } from "@/components/site-system/kit/motion";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, tv } from "@/components/site-system/kit/tokens";

/**
 * Atelier Editorial — the restaurant as a magazine. A contents rail follows
 * you down the page on laptops; the opening is a cover with the name set as
 * large as the page allows (it wipes in once); dishes run as a feature
 * spread and an index; offers are classifieds; photos are laid out as a
 * spread. Structure and motion only — the look is the skin's.
 */

const RAIL = "lg:pl-60";

/** Page width inside the rail offset. */
function Page({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-10 ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Section opener: a heavy rule, the title, and an optional standfirst beside it. */
function Opener({ id, title, standfirst, children }: { id: string; title: string; standfirst?: string; children?: ReactNode }) {
  return (
    <div className="border-t-2 pt-6" style={{ borderColor: tv.text }}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-end">
        <h2 id={id} style={displayStyle(fluid.h2, { letterSpacing: "-0.015em" })}>
          {title}
        </h2>
        {standfirst || children ? (
          <div className="lg:pb-2">
            {standfirst ? <p className="leading-relaxed" style={{ color: tv.muted }}>{standfirst}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */

function useCurrentSection(ids: string[]) {
  const [current, setCurrent] = useState<string | null>(null);
  const key = ids.join("|");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = key.split("|").map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key]);
  return current;
}

function Frame({ ctx, nav, children }: LayoutFrameProps) {
  const { c, site } = ctx;
  const terms = useTerms(ctx);
  const [open, setOpen] = useState(false);
  const current = useCurrentSection(nav.map((n) => n.id));
  const today = todayHoursLine(c.hours, site.todayName);

  const links = (onPick?: () => void) =>
    nav.map((n) => {
      const on = current === n.id;
      return (
        <li key={n.id}>
          <a
            href={`#${n.id}`}
            onClick={onPick}
            aria-current={on ? "location" : undefined}
            className="group flex items-center gap-3 rounded py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: on ? tv.text : tv.muted, ...focusRing }}
          >
            <span aria-hidden className="h-px transition-all duration-300" style={{ width: on ? 28 : 12, background: on ? tv.accent : "currentColor" }} />
            {n.label}
          </a>
        </li>
      );
    });

  return (
    <>
      {/* Laptop: the contents rail. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between border-r px-7 py-8 lg:flex" style={{ background: tv.bg, borderColor: mixv(tv.border, "transparent", 80) }}>
        <div>
          <a href="#" className="block rounded focus-visible:outline-2 focus-visible:outline-offset-4" style={{ ...displayStyle("1.6rem", { lineHeight: 1.1 }), ...focusRing }}>
            {c.businessName}
          </a>
          <nav aria-label="Contents" className="mt-10">
            <p className="mb-3 text-xs" style={{ color: tv.muted }}>In this issue</p>
            <ul>{links()}</ul>
          </nav>
        </div>
        <div className="space-y-4 text-sm" style={{ color: tv.muted }}>
          {today ? <p className="flex items-center gap-2"><SiteIcon name="clock" size={15} />{today}</p> : null}
          <MenuCta ctx={ctx} radius="0" className="w-full">{terms.catalogLabel}</MenuCta>
        </div>
      </aside>

      {/* Phone and tablet: a slim masthead with a contents drop-down. */}
      <header className="sticky top-0 z-40 border-b lg:hidden" style={{ background: mixv(tv.bg, "transparent", 94), borderColor: mixv(tv.border, "transparent", 70), backdropFilter: "blur(10px)" }}>
        <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-10">
          <a href="#" className="min-w-0 truncate rounded focus-visible:outline-2" style={{ ...displayStyle("1.25rem"), ...focusRing }}>
            {c.businessName}
          </a>
          <div className="flex shrink-0 items-center gap-1">
            {c.cta.menuBtn ? (
              <ctx.p.LinkComponent to={ctx.p.menuHref} onClick={() => ctx.p.track("click", "menu_button", {})} className="grid size-11 place-items-center rounded focus-visible:outline-2" style={{ color: tv.accent, ...focusRing }}>
                <SiteIcon name="menu" size={22} title={terms.catalogLabel} />
              </ctx.p.LinkComponent>
            ) : null}
            {nav.length ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="atelier-contents"
                onClick={() => setOpen((o) => !o)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded px-2 text-sm focus-visible:outline-2"
                style={{ color: tv.text, ...focusRing }}
              >
                Contents
                <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className="transition-transform" style={{ transform: open ? "rotate(180deg)" : undefined }}>
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        {open ? (
          <nav id="atelier-contents" aria-label="Contents" className="border-t px-5 pb-4 pt-2 sm:px-10" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
            <ul className="grid grid-cols-2 gap-x-6">{links(() => setOpen(false))}</ul>
          </nav>
        ) : null}
      </header>

      <main className={RAIL}>{children}</main>
    </>
  );
}

/* ─────────────────────────── Opening ─────────────────────────── */

function Announcement({ ctx: { c } }: LandingSectionProps) {
  if (!c.announcement) return null;
  return (
    <div className="border-b py-3 text-sm" style={{ background: tv.bg, borderColor: mixv(tv.border, "transparent", 60), color: tv.text }}>
      <Page className="flex items-center gap-3">
        <span className="shrink-0 px-2 py-0.5 text-xs font-semibold" style={{ background: tv.accent, color: tv.accentText }}>News</span>
        <span className="min-w-0">{c.announcement}</span>
      </Page>
    </div>
  );
}

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  const lines = c.stats.slice(0, 3);
  return (
    <section aria-labelledby="atelier-title" className="pb-14 pt-8 sm:pb-20 sm:pt-12" style={{ background: tv.bg }}>
      <Page>
        <div className="flex items-center justify-between gap-4 border-b pb-3 text-sm" style={{ borderColor: tv.text, color: tv.muted }}>
          <span>{t.badge || c.address || " "}</span>
          {todayHoursLine(c.hours, ctx.site.todayName) ? <span className="hidden sm:inline">{todayHoursLine(c.hours, ctx.site.todayName)}</span> : null}
        </div>
        <h1
          id="atelier-title"
          className="sk-wipe mt-4 break-words"
          style={displayStyle(fluid.giant, { lineHeight: 0.9, letterSpacing: "-0.035em", ["--sk-delay" as string]: "150ms" } as CSSProperties)}
        >
          {c.businessName}
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="sk-fade relative aspect-[16/11] overflow-hidden lg:col-span-8" style={{ ["--sk-delay" as string]: "500ms", borderRadius: tv.radius } as CSSProperties}>
            <Image src={src} alt={c.terms.heroAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="sk-fade flex flex-col justify-between gap-8 lg:col-span-4" style={{ ["--sk-delay" as string]: "700ms" } as CSSProperties}>
            {tagline ? <p style={displayStyle("clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem)", { lineHeight: 1.2 })}>{tagline}</p> : <span />}
            {lines.length ? (
              <ul className="divide-y border-y" style={{ borderColor: mixv(tv.border, "transparent", 60) }}>
                {lines.map((s) => (
                  <li key={s.label} className="flex items-baseline justify-between gap-4 py-3" style={{ borderColor: mixv(tv.border, "transparent", 60) }}>
                    <span className="text-sm" style={{ color: tv.muted }}>{s.label}</span>
                    <span style={displayStyle("1.6rem", { color: tv.accent })}>{s.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <ActionRow ctx={ctx} radius="0" menuLabel={terms.ctaLabel} />
          </div>
        </div>
      </Page>
    </section>
  );
}

function Marquee({ ctx: { c, t } }: LandingSectionProps) {
  const text = t.marqueeText || c.slogan;
  if (!text) return null;
  const items = text.split(/\s*[·•|]\s*/).filter(Boolean);
  return (
    <div className="border-y py-3" style={{ background: tv.bg, borderColor: tv.text, color: tv.text }}>
      <MarqueeTrack seconds={Math.max(30, items.length * 10)}>
        {[...items, ...items].map((it, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined} className="flex items-center gap-6 px-6 text-lg italic" style={{ fontFamily: tv.display }}>
            {it}
            <span aria-hidden className="not-italic" style={{ color: tv.accent }}>/</span>
          </span>
        ))}
      </MarqueeTrack>
    </div>
  );
}

/* ─────────────────────────── About ─────────────────────────── */

function Stats({ ctx: { c }, section }: LandingSectionProps) {
  if (c.stats.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell pad="sm" labelledBy={id}>
      <Page>
        <h2 id={id} className="sr-only">By the numbers</h2>
        <dl className="grid grid grid-cols-1-cols-2 border-t lg:grid-cols-4" style={{ borderColor: mixv(tv.border, "transparent", 40) }}>
          {c.stats.map((s, i) => (
            <div key={s.label} className={`py-6 pr-4 ${i % 2 ? "pl-4" : ""} lg:pl-4 lg:first:pl-0`} style={{ borderLeft: i > 0 ? `1px solid ${mixv(tv.border, "transparent", 40)}` : undefined }}>
              <dd style={displayStyle("clamp(2.5rem, 2rem + 2.6vw, 4.5rem)", { lineHeight: 1 })}>
                <Counter value={s.value} />
              </dd>
              <dt className="mt-2 text-sm" style={{ color: tv.muted }}>{s.label}</dt>
            </div>
          ))}
        </dl>
      </Page>
    </SectionShell>
  );
}

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title={c.story.headline || "Our story"} />
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {c.story.body ? (
            <p
              className="leading-loose lg:col-span-7 lg:columns-2 lg:gap-10 first-letter:float-left first-letter:mr-2 first-letter:text-[4.5rem] first-letter:leading-[0.8] first-letter:[color:var(--site-accent)] first-letter:[font-family:var(--site-font-display,var(--site-font))]"
              style={{ color: tv.muted, fontSize: "1.0625rem" }}
            >
              {c.story.body}
            </p>
          ) : null}
          <figure className={c.story.body ? "lg:col-span-5" : "lg:col-span-12"}>
            <Photo src={c.gallery[1]?.image_url || img.scene} alt="" className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 30vw, 90vw" />
            <figcaption className="mt-3 text-sm" style={{ color: tv.muted }}>{c.businessName}</figcaption>
          </figure>
        </div>
      </Page>
    </SectionShell>
  );
}

/* ─────────────────────────── Food ─────────────────────────── */

/** A feature spread: the lead dish large, the rest as a running column beside it. */
function Signature({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  const terms = useTerms(ctx);
  const dishes = c.signatureDishes.slice(0, 6);
  if (dishes.length === 0) return null;
  const [lead, ...rest] = dishes;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Page>
        <Opener id={id} title={terms.featuredSectionLabel} standfirst={c.terms.featuredSectionSubhead} />
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <article className="group lg:col-span-7">
            <div className="overflow-hidden" style={{ borderRadius: tv.radius }}>
              <Photo src={lead.image || img.dish} alt={lead.name} frame="rect" className="sk-zoom aspect-[4/3] w-full" sizes="(min-width: 1024px) 45vw, 92vw" />
            </div>
            <h3 className="mt-5" style={displayStyle("clamp(1.75rem, 1.4rem + 1.4vw, 2.6rem)")}>{lead.name}</h3>
            {lead.description ? <p className="mt-3 max-w-prose leading-relaxed" style={{ color: tv.muted }}>{lead.description}</p> : null}
            {lead.price ? <p className="mt-3 tabular-nums" style={{ color: tv.accent }}>{lead.price}</p> : null}
          </article>
          {rest.length ? (
            <ul className="divide-y lg:col-span-5" style={{ borderColor: mixv(tv.border, "transparent", 60) }}>
              {rest.map((d, i) => (
                <li key={`${d.name}-${i}`} className="group flex gap-4 py-4 first:pt-0">
                  <div className="relative size-20 shrink-0 overflow-hidden" style={{ borderRadius: tv.radius }}>
                    <Image src={d.image || img.dish} alt="" fill sizes="80px" className="sk-zoom object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-3">
                      <span style={{ color: tv.text, fontFamily: tv.display, fontSize: "1.2rem" }}>{d.name}</span>
                      {d.price ? <span className="shrink-0 text-sm tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
                    </p>
                    {d.description ? <p className="mt-1 line-clamp-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Page>
    </SectionShell>
  );
}

/** An index: name, section and price in ruled rows (a table on laptops, stacked on phones). */
function IndexTable({ items, caption }: { items: Array<{ name: string; description?: string; price?: string; category?: string; options?: Array<{ label: string; price: string }> }>; caption: string }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{caption}</caption>
      <thead className="hidden sm:table-header-group">
        <tr className="text-xs" style={{ color: tv.muted }}>
          <th scope="col" className="pb-2 font-normal">Item</th>
          <th scope="col" className="pb-2 font-normal">Section</th>
          <th scope="col" className="pb-2 text-right font-normal">Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((d, i) => (
          <tr key={`${d.name}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-4 border-t py-4 sm:table-row" style={{ borderColor: mixv(tv.border, "transparent", 50) }}>
            <th scope="row" className="font-normal sm:py-4 sm:pr-6">
              <span className="block" style={{ color: tv.text, fontFamily: tv.display, fontSize: "1.2rem" }}>{d.name}</span>
              {d.description ? <span className="mt-1 block text-sm" style={{ color: tv.muted }}>{d.description}</span> : null}
            </th>
            <td className="hidden text-sm sm:table-cell sm:py-4 sm:pr-6" style={{ color: tv.muted }}>{d.category}</td>
            <td className="row-span-2 text-right tabular-nums sm:py-4" style={{ color: tv.accent }}>
              {d.options && d.options.length ? d.options.map((o) => <span key={o.label} className="block text-sm">{o.label} {o.price}</span>) : d.price}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Popular({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title={terms.popularSectionLabel} standfirst={c.terms.popularSectionSubhead}>
          <MenuCta ctx={ctx} variant="quiet" className="mt-3 !px-0">{`The full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </Opener>
        <div className="mt-8">
          <IndexTable items={c.popularItems} caption={terms.popularSectionLabel} />
        </div>
      </Page>
    </SectionShell>
  );
}

function Curated({ ctx, section }: LandingSectionProps) {
  const list = useCuratedList(ctx, section.props);
  if (list.items.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Page>
        <Opener id={id} title={list.title} />
        <div className="mt-8">
          <IndexTable items={list.items} caption={list.title} />
        </div>
      </Page>
    </SectionShell>
  );
}

/** Offers as classifieds: boxed notices in a ruled grid. */
function Offers({ ctx: { c }, section }: LandingSectionProps) {
  if (c.offers.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title="Notices" standfirst="Current offers." />
        <ul className="mt-10 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: mixv(tv.border, "transparent", 50), border: `1px solid ${mixv(tv.border, "transparent", 50)}` }}>
          {c.offers.map((o, i) => {
            const value = offerValue(o);
            return (
              <li key={i} className="flex flex-col gap-3 p-6" style={{ background: tv.bg }}>
                {value ? <span className="self-start px-2 py-0.5 text-sm font-semibold" style={{ background: tv.accent, color: tv.accentText }}>{value}</span> : null}
                {o.title ? <h3 style={displayStyle(fluid.h3)}>{o.title}</h3> : null}
                {o.description ? <p className="text-sm leading-relaxed" style={{ color: tv.muted }}>{o.description}</p> : null}
              </li>
            );
          })}
        </ul>
      </Page>
    </SectionShell>
  );
}

/* ─────────────────────────── Trust ─────────────────────────── */

/** Photos laid out as a spread: one large, the rest in varying sizes. */
const SPREAD = [
  "col-span-6 row-span-2 lg:col-span-4",
  "col-span-3 lg:col-span-2",
  "col-span-3 lg:col-span-2",
  "col-span-6 lg:col-span-3",
  "col-span-3 lg:col-span-3",
  "col-span-3 lg:col-span-2",
  "col-span-6 lg:col-span-4",
];

function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 7).map((g) => g.image_url as string);
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Page>
        <Opener id={id} title="Photographs" />
        <ul className="mt-10 grid auto-rows-[9rem] grid-cols-6 gap-3 sm:auto-rows-[12rem] sm:gap-4">
          {photos.map((src, i) => (
            <li key={src + i} className={`group relative overflow-hidden ${photos.length === 1 ? "col-span-6 row-span-2" : SPREAD[i]}`} style={{ borderRadius: tv.radius }}>
              <Image src={src} alt={`${c.businessName}, photo ${i + 1}`} fill sizes="(min-width: 1024px) 40vw, 50vw" className="sk-zoom object-cover" />
            </li>
          ))}
        </ul>
      </Page>
    </SectionShell>
  );
}

/** Reviews as letters: quotes set in columns. */
function Reviews({ ctx, section }: LandingSectionProps) {
  const { c, p } = ctx;
  if (c.googleReviews.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title="Letters from guests">
          {c.cta.reviewBtn && c.cta.reviewLink ? (
            <button type="button" onClick={p.onReview} className={`${BTN} !px-0`} style={buttonStyle("quiet")}>
              Write a review on Google
            </button>
          ) : null}
        </Opener>
        <div className="mt-10 gap-10 sm:columns-2 lg:columns-3">
          {c.googleReviews.slice(0, 6).map((r) => (
            <figure key={r.id} className="mb-10 break-inside-avoid">
              <span style={{ color: tv.accent }}><Stars rating={r.rating} /></span>
              {r.text ? <blockquote className="mt-3" style={displayStyle("1.3rem", { lineHeight: 1.4 })}>“{r.text}”</blockquote> : null}
              <figcaption className="mt-3 text-sm" style={{ color: tv.muted }}>
                {r.authorName}
                {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </Page>
    </SectionShell>
  );
}

function Awards({ ctx, section }: LandingSectionProps) {
  if (ctx.site.awards.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" pad="sm" labelledBy={id}>
      <Page>
        <Opener id={id} title="As seen in" />
        <AwardList awards={ctx.site.awards} variant="list" className="mt-6 sm:columns-2 sm:gap-10" />
      </Page>
    </SectionShell>
  );
}

function Team({ ctx, section }: LandingSectionProps) {
  if (ctx.site.team.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title="Contributors" standfirst="The people who make the place." />
        <TeamGrid team={ctx.site.team} className="mt-12 text-left [&_li]:text-left [&_p]:mx-0" frame="rect" />
      </Page>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

function Visit({ ctx, section }: LandingSectionProps) {
  const { c, site } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title="Visiting" />
        <div className={`mt-10 grid gap-12 ${hasContact && c.hours.length ? "lg:grid-cols-2" : ""}`}>
          {c.hours.length ? (
            <div>
              <h3 className="mb-3 text-sm" style={{ color: tv.muted }}>Opening hours</h3>
              <HoursList hours={c.hours} todayName={site.todayName} />
            </div>
          ) : null}
          {hasContact ? (
            <div>
              <h3 className="mb-5 text-sm" style={{ color: tv.muted }}>Address and contact</h3>
              <ContactList ctx={ctx} />
              <SocialLinks ctx={ctx} className="mt-8" />
              <ActionRow ctx={ctx} menu={false} secondary="outline" radius="0" className="mt-8" />
            </div>
          ) : null}
        </div>
      </Page>
    </SectionShell>
  );
}

function Amenities({ ctx, section }: LandingSectionProps) {
  if (ctx.site.amenities.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" pad="sm" labelledBy={id}>
      <Page>
        <Opener id={id} title="Practical notes" />
        <AmenityGrid amenities={ctx.site.amenities} className="mt-8" />
      </Page>
    </SectionShell>
  );
}

function Events({ ctx, section }: LandingSectionProps) {
  if (ctx.site.events.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Page>
        <Opener id={id} title="Diary" standfirst="Dates for your calendar." />
        <EventList events={ctx.site.events} className="mt-6" />
      </Page>
    </SectionShell>
  );
}

/** Questions as an interview: every answer on show, nothing to open. */
function Faq({ ctx: { c }, section }: LandingSectionProps) {
  if (c.faqs.length === 0) return null;
  const id = `${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Page>
        <Opener id={id} title="Questions, answered" />
        <dl className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {c.faqs.map((f, i) => (
            <div key={`${f.q}-${i}`}>
              <dt style={displayStyle(fluid.h3, { lineHeight: 1.25 })}>{f.q}</dt>
              <dd className="mt-3 leading-relaxed" style={{ color: tv.muted }}>{f.a}</dd>
            </div>
          ))}
        </dl>
      </Page>
    </SectionShell>
  );
}

function Divider({ section }: LandingSectionProps) {
  return (
    <div aria-hidden className="py-8" style={{ background: tv.bg }}>
      <Page>
        <span className="block border-t" style={{ borderColor: tv.text }} />
        <MotifBand variant={section.variant} idPrefix={`ae-${section.id}`} className="my-2" opacity={0.6} />
        <span className="block border-t" style={{ borderColor: tv.text }} />
      </Page>
    </div>
  );
}

function Footer({ ctx }: LandingSectionProps) {
  return <FooterV2 ctx={ctx} />;
}

export const layout: LayoutDefinition = {
  key: "atelier-editorial",
  label: "Atelier Editorial",
  description: "A magazine: a contents rail, a cover with the name set huge, a feature spread, an index of dishes and photos laid out as a spread.",
  menuStructure: "magazine-spread",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "marquee", "story", "signature-dishes", "popular-items", "curated-list", "stats", "gallery",
    "team", "events", "offers", "reviews", "awards", "visit", "amenities", "faq", "divider", "footer",
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
