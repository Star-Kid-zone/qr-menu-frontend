"use client";

import type { ComponentType, CSSProperties } from "react";
import type { LandingSectionProps } from "@/components/templates/sections/types";
import { IntroSection } from "@/components/templates/sections/landing/intro";
import { useCuratedList } from "@/components/templates/sections/landing/siteContent";
import {
  AmenityGrid,
  AwardList,
  BTN,
  buttonStyle,
  Container,
  EventList,
  FaqList,
  MenuCta,
  MotifBand,
  offerValue,
  Photo,
  SectionShell,
  Stars,
  TeamGrid,
  type Tone,
} from "./blocks";
import { Counter, MarqueeTrack } from "./motion";
import { useTerms } from "./terms";
import { displayStyle, fluid, mixv, tv } from "./tokens";

/**
 * The quieter sections, built from one layout's own heading, card shape and
 * tones. A layout spends its design on the frame, hero, story, dishes,
 * gallery, visit and footer; these follow its look without repeating code
 * in every layout. Any of them can still be overridden.
 */

export interface HeadingProps {
  id: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}

export interface StandardOptions {
  /** Prefix for ids (unique per layout). */
  prefix: string;
  Heading: ComponentType<HeadingProps>;
  /** Tone for alternating sections. */
  band?: Tone;
  /** Card look (offers, reviews, curated list). */
  card: CSSProperties;
  /** Button corner radius. */
  radius: string;
  align?: "left" | "center";
  teamFrame?: string;
  eventsVariant?: "programme" | "cards";
  awardsVariant?: "laurels" | "list";
  titles?: Partial<Record<"awards" | "team" | "amenities" | "events" | "faq" | "offers" | "reviews" | "stats", string>>;
}

export function standardSections(o: StandardOptions) {
  const { Heading, card, radius } = o;
  const band = o.band ?? "band";
  const align = o.align ?? "center";
  const t = (k: keyof NonNullable<StandardOptions["titles"]>, d: string) => o.titles?.[k] ?? d;
  const hid = (s: LandingSectionProps["section"]) => `${o.prefix}-${s.id}-t`;

  function Announcement({ ctx: { c } }: LandingSectionProps) {
    if (!c.announcement) return null;
    return (
      <div className="px-4 py-3 text-center text-sm" style={{ background: tv.accent, color: tv.accentText }}>
        {c.announcement}
      </div>
    );
  }

  function Marquee({ ctx: { c, t: theme } }: LandingSectionProps) {
    const text = theme.marqueeText || c.slogan;
    if (!text) return null;
    const items = text.split(/\s*[·•|]\s*/).filter(Boolean);
    return (
      <div className="py-4" style={{ background: tv.surface, color: tv.text, borderBlock: `1px solid ${mixv(tv.border, "transparent", 70)}` }}>
        <MarqueeTrack seconds={Math.max(30, items.length * 10)}>
          {[...items, ...items].map((it, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-lg" style={{ fontFamily: tv.display }}>
              {it}
              <span aria-hidden style={{ color: tv.accent }}>✿</span>
            </span>
          ))}
        </MarqueeTrack>
      </div>
    );
  }

  function Stats({ ctx: { c }, section }: LandingSectionProps) {
    if (c.stats.length === 0) return null;
    return (
      <SectionShell tone={band} pad="sm" labelledBy={hid(section)}>
        <h2 id={hid(section)} className="sr-only">{t("stats", "In numbers")}</h2>
        <Container>
          <dl className="grid grid grid-cols-1-cols-2 gap-6 lg:grid-cols-4">
            {c.stats.map((s) => (
              <div key={s.label} className="p-5 text-center" style={card}>
                <dd style={displayStyle("clamp(2.2rem, 1.8rem + 2vw, 3.4rem)", { color: tv.accent })}>
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

  function Offers({ ctx: { c }, section }: LandingSectionProps) {
    if (c.offers.length === 0) return null;
    return (
      <SectionShell labelledBy={hid(section)}>
        <Container>
          <Heading id={hid(section)} title={t("offers", "Offers")} align={align} />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.offers.map((offer, i) => {
              const value = offerValue(offer);
              return (
                <li key={i} className="flex flex-col overflow-hidden" style={card}>
                  {offer.image_url ? <Photo src={offer.image_url} alt="" frame="rect" className="aspect-[16/9] w-full" sizes="(min-width: 1024px) 30vw, 90vw" /> : null}
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    {value ? <span className="self-start px-2.5 py-0.5 text-sm font-semibold" style={{ background: tv.accent, color: tv.accentText, borderRadius: radius }}>{value}</span> : null}
                    {offer.title ? <h3 style={displayStyle(fluid.h3)}>{offer.title}</h3> : null}
                    {offer.description ? <p className="text-sm leading-relaxed" style={{ color: tv.muted }}>{offer.description}</p> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </SectionShell>
    );
  }

  function Reviews({ ctx, section }: LandingSectionProps) {
    const { c, p } = ctx;
    if (c.googleReviews.length === 0) return null;
    return (
      <SectionShell tone={band} labelledBy={hid(section)}>
        <Container>
          <Heading id={hid(section)} title={t("reviews", "Kind words")} align={align} />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {c.googleReviews.slice(0, 6).map((r) => (
              <li key={r.id} className="flex flex-col p-6" style={card}>
                <span style={{ color: tv.accent }}><Stars rating={r.rating} /></span>
                {r.text ? <blockquote className="mt-4 flex-1 leading-relaxed" style={{ color: tv.text }}>“{r.text}”</blockquote> : null}
                <p className="mt-4 text-sm" style={{ color: tv.muted }}>
                  {r.authorName}
                  {r.relativePublishDescription ? `, ${r.relativePublishDescription}` : ""}
                </p>
              </li>
            ))}
          </ul>
          {c.cta.reviewBtn && c.cta.reviewLink ? (
            <div className={`mt-10 ${align === "center" ? "text-center" : ""}`}>
              <button type="button" onClick={p.onReview} className={BTN} style={buttonStyle("outline", radius)}>Write a review on Google</button>
            </div>
          ) : null}
        </Container>
      </SectionShell>
    );
  }

  function Faq({ ctx: { c }, section }: LandingSectionProps) {
    if (c.faqs.length === 0) return null;
    return (
      <SectionShell labelledBy={hid(section)}>
        <Container size="sm">
          <Heading id={hid(section)} title={t("faq", "Questions")} align={align} />
          <FaqList faqs={c.faqs} className="mt-10" />
        </Container>
      </SectionShell>
    );
  }

  function Awards({ ctx, section }: LandingSectionProps) {
    if (ctx.site.awards.length === 0) return null;
    return (
      <SectionShell tone={band} pad="sm" labelledBy={hid(section)}>
        <Container>
          <Heading id={hid(section)} title={t("awards", "Awards and press")} align={align} />
          <AwardList awards={ctx.site.awards} variant={o.awardsVariant ?? "laurels"} className="mt-10" />
        </Container>
      </SectionShell>
    );
  }

  function Team({ ctx, section }: LandingSectionProps) {
    if (ctx.site.team.length === 0) return null;
    return (
      <SectionShell labelledBy={hid(section)}>
        <Container>
          <Heading id={hid(section)} title={t("team", "The team")} align={align} />
          <TeamGrid team={ctx.site.team} frame={o.teamFrame} className="mt-12" />
        </Container>
      </SectionShell>
    );
  }

  function Amenities({ ctx, section }: LandingSectionProps) {
    if (ctx.site.amenities.length === 0) return null;
    return (
      <SectionShell tone={band} pad="sm" labelledBy={hid(section)}>
        <Container>
          <Heading id={hid(section)} title={t("amenities", "Good to know")} align={align} />
          <AmenityGrid amenities={ctx.site.amenities} className="mt-10" />
        </Container>
      </SectionShell>
    );
  }

  function Events({ ctx, section }: LandingSectionProps) {
    if (ctx.site.events.length === 0) return null;
    return (
      <SectionShell labelledBy={hid(section)}>
        <Container size={o.eventsVariant === "cards" ? "lg" : "md"}>
          <Heading id={hid(section)} title={t("events", "What's on")} align={align} />
          <EventList events={ctx.site.events} variant={o.eventsVariant ?? "programme"} className="mt-10" />
        </Container>
      </SectionShell>
    );
  }

  function Curated({ ctx, section }: LandingSectionProps) {
    const list = useCuratedList(ctx, section.props);
    const terms = useTerms(ctx);
    if (list.items.length === 0) return null;
    return (
      <SectionShell tone={band} labelledBy={hid(section)}>
        <Container>
          <Heading id={hid(section)} title={list.title} align={align} />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.items.map((d) => (
              <li key={d.id} className="flex gap-4 p-4" style={card}>
                {d.image ? <Photo src={d.image} alt="" frame="rounded" className="size-20 shrink-0" sizes="80px" /> : null}
                <div className="min-w-0 flex-1">
                  <p style={{ color: tv.text, fontFamily: tv.display, fontSize: "1.15rem" }}>{d.name}</p>
                  {d.description ? <p className="mt-1 line-clamp-2 text-sm" style={{ color: tv.muted }}>{d.description}</p> : null}
                  <p className="mt-2 text-sm tabular-nums" style={{ color: tv.accent }}>
                    {d.options.length ? d.options.map((x) => `${x.label} ${x.price}`).join(" · ") : d.price}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className={`mt-10 ${align === "center" ? "text-center" : ""}`}>
            <MenuCta ctx={ctx} variant="outline" radius={radius}>{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
          </div>
        </Container>
      </SectionShell>
    );
  }

  function Divider({ section }: LandingSectionProps) {
    return (
      <div aria-hidden className="py-8" style={{ background: tv.bg }}>
        <Container>
          <MotifBand variant={section.variant} idPrefix={`${o.prefix}-${section.id}`} opacity={0.6} />
        </Container>
      </div>
    );
  }

  return {
    intro: IntroSection,
    announcement: Announcement,
    marquee: Marquee,
    stats: Stats,
    offers: Offers,
    reviews: Reviews,
    faq: Faq,
    awards: Awards,
    team: Team,
    amenities: Amenities,
    events: Events,
    "curated-list": Curated,
    divider: Divider,
  };
}
