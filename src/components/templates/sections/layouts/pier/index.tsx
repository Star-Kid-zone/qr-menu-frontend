"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { LandingSectionProps } from "../../types";
import type { LayoutDefinition, LayoutFrameProps } from "../types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { iconForCategory } from "@/components/site-system/business-types";
import { useSiteLook } from "@/components/site-system/SiteLookContext";
import { ActionRow, Container, ContactList, MenuCta, SectionShell, SocialLinks, todayHoursLine } from "@/components/site-system/kit/blocks";
import { FooterV2 } from "@/components/site-system/kit/FooterV2";
import { standardSections, type HeadingProps } from "@/components/site-system/kit/standardSections";
import { useTerms } from "@/components/site-system/kit/terms";
import { displayStyle, fluid, focusRing, mixv, ON_PHOTO, ON_PHOTO_MUTED, photoScrim, tv } from "@/components/site-system/kit/tokens";

/**
 * Pier — a harbour-front kitchen. A floating header, the photo standing over
 * a moving water line, portholes for photographs, waves between sections and
 * the week's hours as a tide row (the longer the day, the higher the water).
 * Structure and motion only — the look is the skin's.
 */

const R = "var(--site-radius, 14px)";
const card: CSSProperties = { background: tv.surface, borderRadius: R, border: `1px solid ${mixv(tv.border, "transparent", 70)}` };

/** Two layers of waves drifting sideways at different speeds. `color` is what lies below the waves. */
function Waves({ color, className = "", height = 56 }: { color: string; className?: string; height?: number }) {
  const d = "M0 30 C 60 10, 120 10, 180 30 S 300 50, 360 30 S 480 10, 540 30 S 660 50, 720 30 V60 H0 Z";
  return (
    <div aria-hidden className={`pointer-events-none relative overflow-hidden ${className}`} style={{ height }}>
      <svg className="sk-wave absolute bottom-0 left-0 h-full w-[200%]" style={{ ["--sk-wave" as string]: "18s" } as CSSProperties} viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d={d} fill={color} opacity=".45" />
        <path d={d} fill={color} opacity=".45" transform="translate(720 0)" />
      </svg>
      <svg className="sk-wave absolute bottom-0 left-0 h-[80%] w-[200%]" style={{ ["--sk-wave" as string]: "11s" } as CSSProperties} viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d={d} fill={color} transform="translate(-90 6)" />
        <path d={d} fill={color} transform="translate(630 6)" />
      </svg>
    </div>
  );
}

function Heading({ id, title, intro, align = "left" }: HeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 id={id} style={displayStyle(fluid.h2)}>{title}</h2>
      <svg aria-hidden viewBox="0 0 120 10" width="96" height="8" className={`mt-4 ${center ? "mx-auto" : ""}`} style={{ color: tv.accent }}>
        <path d="M0 5 C 10 0, 20 0, 30 5 S 50 10, 60 5 S 80 0, 90 5 S 110 10, 120 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
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
      <header className="fixed inset-x-3 z-50 mx-auto max-w-6xl backdrop-blur-md sm:inset-x-6" style={{ top: "calc(var(--occ-offset, 0px) + 0.75rem)", ...card, background: mixv(tv.surface, "transparent", 88), boxShadow: `0 12px 30px -20px ${mixv(tv.text, "transparent", 50)}` }}>
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <a href="#" className="flex min-w-0 items-center gap-2 rounded focus-visible:outline-2" style={focusRing}>
            <span style={{ color: tv.accent }}><SiteIcon name="fish" size={22} /></span>
            <span className="truncate" style={displayStyle("1.2rem")}>{c.businessName}</span>
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-5 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded py-1 text-sm hover:opacity-70 focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <MenuCta ctx={ctx} radius={R} className="!min-h-10 !px-4">{terms.catalogLabel}</MenuCta>
            {nav.length ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="pier-nav"
                aria-label={open ? "Close the section list" : "Open the section list"}
                onClick={() => setOpen((o) => !o)}
                className="grid size-10 place-items-center rounded focus-visible:outline-2 lg:hidden"
                style={{ color: tv.text, ...focusRing }}
              >
                <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 8c3-2 5-2 8 0s5 2 8 0M3 14c3-2 5-2 8 0s5 2 8 0" />}
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        {open ? (
          <nav id="pier-nav" aria-label="Sections" className="border-t px-4 py-3 lg:hidden" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
            <ul className="grid grid-cols-2 gap-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded px-3 py-2.5 focus-visible:outline-2" style={{ color: tv.text, ...focusRing }}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <main className="pt-[4.75rem] sm:pt-20">{children}</main>
    </>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero({ ctx }: LandingSectionProps) {
  const { c, t, img, site } = ctx;
  const terms = useTerms(ctx);
  const src = c.bannerUrl || c.gallery[0]?.image_url || img.hero;
  const tagline = t.heroTagline || c.slogan;
  const today = todayHoursLine(c.hours, site.todayName);
  return (
    <section aria-labelledby="pier-title" className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden" style={{ color: ON_PHOTO }}>
      <Image src={src} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: photoScrim("bottom", 0.78) }} />
      <Container size="xl" className="pb-20 pt-24 sm:pb-28">
        {t.badge ? <p className="sk-slide-in text-sm" style={{ color: ON_PHOTO_MUTED }}>{t.badge}</p> : null}
        <h1 id="pier-title" className="sk-slide-in mt-3 max-w-4xl" style={displayStyle(fluid.hero, { color: ON_PHOTO, ["--sk-delay" as string]: "120ms" } as CSSProperties)}>
          {c.businessName}
        </h1>
        {tagline ? <p className="sk-slide-in mt-5 max-w-xl leading-relaxed" style={{ fontSize: fluid.lead, color: ON_PHOTO_MUTED, ["--sk-delay" as string]: "260ms" } as CSSProperties}>{tagline}</p> : null}
        <div className="sk-slide-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ ["--sk-delay" as string]: "380ms" } as CSSProperties}>
          <ActionRow ctx={ctx} primary="on-photo" secondary="on-photo-outline" radius={R} menuLabel={terms.ctaLabel} />
          {today ? (
            <span className="inline-flex items-center gap-2 text-sm" style={{ color: ON_PHOTO_MUTED }}>
              <SiteIcon name="clock" size={16} />
              {today}
            </span>
          ) : null}
        </div>
      </Container>
      <Waves color={tv.bg} className="absolute inset-x-0 bottom-0" height={64} />
    </section>
  );
}

/* ─────────────────────────── About + food ─────────────────────────── */

/** A round window: thick ring in the surface colour, a fine accent rule outside it. */
function Porthole({ src, alt, size, sizes }: { src: string; alt: string; size: string; sizes: string }) {
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size, border: `10px solid ${tv.surface}`, outline: `1.5px solid ${mixv(tv.accent, "transparent", 60)}`, outlineOffset: 4 }}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </span>
  );
}

function Story({ ctx, section }: LandingSectionProps) {
  const { c, img } = ctx;
  if (!c.story) return null;
  const id = `pr-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <Porthole src={c.gallery[1]?.image_url || img.scene} alt="" size="clamp(15rem, 12rem + 10vw, 22rem)" sizes="22rem" />
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
  const id = `pr-${section.id}-t`;
  return (
    <section aria-labelledby={id}>
      <Waves color={tv.band} height={40} />
      <SectionShell tone="band" as="div" style={{ paddingTop: "1.5rem" }}>
        <Container>
          <Heading id={id} title={terms.featuredSectionLabel} intro={c.terms.featuredSectionSubhead} />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.signatureDishes.slice(0, 6).map((d, i) => (
              <li key={`${d.name}-${i}`} className="group sk-lift overflow-hidden" style={card}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={d.image || img.dish} alt={d.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="sk-zoom object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 style={displayStyle(fluid.h3)}>{d.name}</h3>
                    {d.price ? <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
                  </div>
                  {d.description ? <p className="mt-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </SectionShell>
    </section>
  );
}

function Popular({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const look = useSiteLook();
  const terms = useTerms(ctx);
  if (c.popularItems.length === 0) return null;
  const id = `pr-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Heading id={id} title={terms.popularSectionLabel} intro={c.terms.popularSectionSubhead} />
          <MenuCta ctx={ctx} variant="outline" radius={R}>{`See the full ${terms.catalogLabel.toLowerCase()}`}</MenuCta>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {c.popularItems.map((d, i) => (
            <li key={`${d.name}-${i}`} className="flex items-start gap-4 border-b py-5" style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
              <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: mixv(tv.accent, "transparent", 12), color: tv.accent }}>
                <SiteIcon name={iconForCategory(d.category || d.name, look)} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-medium" style={{ color: tv.text }}>{d.name}</span>
                  {d.price ? <span className="shrink-0 tabular-nums" style={{ color: tv.accent }}>{d.price}</span> : null}
                </span>
                {d.description ? <span className="mt-1 block text-sm leading-relaxed" style={{ color: tv.muted }}>{d.description}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </SectionShell>
  );
}

/* ─────────────────────────── Gallery ─────────────────────────── */

/** A full-width row of portholes; swipe or scroll sideways. */
function Gallery({ ctx: { c }, section }: LandingSectionProps) {
  if (c.gallery.length === 0) return null;
  const photos = c.gallery.slice(0, 10).map((g) => g.image_url as string);
  const id = `pr-${section.id}-t`;
  return (
    <SectionShell tone="band" labelledBy={id}>
      <Container>
        <Heading id={id} title="Seen from the pier" />
      </Container>
      <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-5 pb-4 sm:gap-10 sm:px-8">
        {photos.map((src, i) => (
          <li key={src + i} className={`snap-center ${i % 2 ? "sk-bob" : ""}`} style={{ animationDelay: `${i * 0.6}s` }}>
            <Porthole src={src} alt={`${c.businessName}, photo ${i + 1}`} size={i % 3 === 0 ? "clamp(13rem, 10rem + 8vw, 18rem)" : "clamp(10rem, 8rem + 6vw, 14rem)"} sizes="18rem" />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

/* ─────────────────────────── Visit ─────────────────────────── */

const toMin = (s?: string) => {
  const m = s?.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** The week as a tide row: each day's water rises with the hours it's open. */
function TideRow({ ctx }: { ctx: LandingSectionProps["ctx"] }) {
  const { c, site } = ctx;
  return (
    <ol className="grid grid-cols-7 gap-1.5 sm:gap-3" aria-label="Opening hours">
      {c.hours.map((h) => {
        const s = toMin(h.startTime);
        let e = toMin(h.endTime);
        if (s !== null && e !== null && e <= s) e += 1440;
        const share = s !== null && e !== null ? Math.min(1, (e - s) / (16 * 60)) : 0;
        const today = h.day.toLowerCase() === site.todayName.toLowerCase();
        return (
          <li key={h.day} className="flex flex-col items-center gap-2 text-center">
            <span className="relative block h-36 w-full overflow-hidden" style={{ background: mixv(tv.border, "transparent", 60), borderRadius: 999, outline: today ? `2px solid ${tv.accent}` : undefined, outlineOffset: 3 }}>
              <span className="absolute inset-x-0 bottom-0" style={{ height: `${Math.max(share * 100, 0)}%`, background: today ? tv.accent : mixv(tv.accent, "transparent", 45) }} />
            </span>
            <span aria-hidden className="text-xs font-semibold sm:text-sm" style={{ color: today ? tv.text : tv.muted }}>{h.day.slice(0, 3)}</span>
            <span aria-hidden className="hidden text-[11px] leading-tight tabular-nums sm:block" style={{ color: tv.muted }}>
              {h.startTime && h.endTime ? (
                <>
                  {h.startTime}
                  <br />
                  {h.endTime}
                </>
              ) : (
                "Closed"
              )}
            </span>
            <span className="sr-only">{h.day}: {h.hours}{today ? " (today)" : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Visit({ ctx, section }: LandingSectionProps) {
  const { c } = ctx;
  const hasContact = Boolean(c.address || c.phone || c.email || c.whatsapp || c.websiteHref || c.social.length);
  if (!c.hours.length && !hasContact) return null;
  const id = `pr-${section.id}-t`;
  return (
    <SectionShell labelledBy={id}>
      <Container>
        <Heading id={id} title="Moor up with us" />
        <div className={`mt-12 grid gap-8 ${c.hours.length && hasContact ? "lg:grid-cols-[1.2fr_1fr]" : "max-w-2xl"}`}>
          {c.hours.length ? (
            <div className="p-6 sm:p-8" style={card}>
              <p className="mb-6 text-sm" style={{ color: tv.muted }}>Opening hours this week</p>
              <TideRow ctx={ctx} />
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

function Divider() {
  return <Waves color={tv.band} height={48} />;
}

function Footer({ ctx }: LandingSectionProps) {
  return (
    <div>
      <Waves color={tv.footer} height={56} />
      <FooterV2 ctx={ctx} />
    </div>
  );
}

const std = standardSections({
  prefix: "pr",
  Heading,
  card,
  radius: R,
  align: "left",
  eventsVariant: "cards",
  awardsVariant: "list",
  titles: { team: "On deck", events: "Coming up", reviews: "From our guests", amenities: "Good to know" },
});

export const layout: LayoutDefinition = {
  key: "pier",
  label: "Pier",
  description: "Harbour-front: a floating header, a hero over moving water, portholes for photos and the week's hours as a tide row.",
  menuStructure: "catch-board",
  Frame,
  nativeOrder: [
    "intro", "announcement", "hero", "marquee", "story", "signature-dishes", "popular-items", "curated-list", "stats", "offers",
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
    divider: Divider,
    footer: Footer,
  },
};
