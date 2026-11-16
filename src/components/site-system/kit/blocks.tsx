"use client";

import Image from "next/image";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import type { LandingSectionContext } from "@/components/templates/sections/types";
import type { HoursRow } from "@/components/templates/landing/_shared/defaults";
import { ART_MOTIF_MAP, ART_MOTIFS } from "@/components/templates/sections/art/motifs";
import { useOptionalSiteLook } from "../SiteLookContext";
import { SiteIcon } from "../icons/SiteIcon";
import { frameStyle } from "../ornaments";
import type { PublicAward, PublicTeamMember } from "../types";
import type { AmenityView, EventView } from "./content";
import { fluid, focusRing, mixv, space, tv } from "./tokens";

/**
 * Shared, token-only building blocks for the site-system layouts. A layout
 * composes these with its own structure and motion; nothing here picks a
 * colour, font or icon style of its own.
 */

/* ───────────────────────── structure ───────────────────────── */

const WIDTH = { sm: "max-w-3xl", md: "max-w-5xl", lg: "max-w-6xl", xl: "max-w-7xl" } as const;

export function Container({ children, size = "lg", className = "", style }: { children: ReactNode; size?: keyof typeof WIDTH; className?: string; style?: CSSProperties }) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${WIDTH[size]} ${className}`} style={style}>
      {children}
    </div>
  );
}

export type Tone = "base" | "band" | "surface" | "accent" | "footer" | "inverse";

/** Background + text colours for a tone. "inverse" swaps page and text colours. */
export function toneStyle(tone: Tone): CSSProperties {
  switch (tone) {
    case "band":
      return { background: tv.band, color: tv.muted };
    case "surface":
      return { background: tv.surface, color: tv.muted };
    case "accent":
      return { background: tv.accent, color: tv.accentText };
    case "footer":
      return { background: tv.footer, color: tv.footerMuted };
    case "inverse":
      return { background: tv.text, color: tv.bg };
    default:
      return { background: tv.bg, color: tv.muted };
  }
}

/** A page section: tone, vertical rhythm, and an accessible name from its heading. */
export function SectionShell({
  children,
  tone = "base",
  pad = "md",
  className = "",
  style,
  labelledBy,
  as: Tag = "section",
}: {
  children: ReactNode;
  tone?: Tone;
  pad?: keyof typeof space | "none";
  className?: string;
  style?: CSSProperties;
  labelledBy?: string;
  as?: ElementType;
}) {
  const padding = pad === "none" ? undefined : space[pad];
  return (
    <Tag aria-labelledby={labelledBy} className={`relative ${className}`} style={{ ...toneStyle(tone), paddingBlock: padding, ...style }}>
      {children}
    </Tag>
  );
}

/* ───────────────────────── media ───────────────────────── */

/**
 * A photo in a shape. `frame` overrides the skin's frame (a layout may fix a
 * shape that is part of its structure, e.g. Grand Hall's arch).
 */
export function Photo({
  src,
  alt,
  frame,
  className = "",
  style,
  sizes = "(min-width: 1024px) 45vw, 100vw",
  priority = false,
  imgClassName = "",
}: {
  src: string;
  alt: string;
  frame?: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
}) {
  const look = useOptionalSiteLook();
  const shape = frame ?? look?.ornaments.frame ?? "rect";
  const fs = frameStyle(shape, { accent: tv.accent, border: tv.border });
  return (
    <div className={`relative ${className}`} style={{ ...fs, ...style }}>
      {/* Next 16: `priority` is deprecated; an above-the-fold hero loads eagerly at high fetch priority. */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} aria-hidden viewBox="0 0 20 20" width={size} height={size} fill={i <= r ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.8l-5.1 2.6 1-5.6-4.1-4 5.7-.8z" />
        </svg>
      ))}
    </span>
  );
}

/* ───────────────────────── actions ───────────────────────── */

export type ButtonVariant = "solid" | "outline" | "quiet" | "on-photo" | "on-photo-outline";

export const BTN =
  "inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm font-semibold transition-[opacity,transform,background-color] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.98]";

export function buttonStyle(variant: ButtonVariant, radius: string = tv.radius): CSSProperties {
  const base: CSSProperties = { borderRadius: radius, ...focusRing };
  switch (variant) {
    case "outline":
      return { ...base, border: `1px solid ${tv.accent}`, color: tv.accent };
    case "quiet":
      return { ...base, color: tv.text, textDecoration: "underline", textUnderlineOffset: 6, paddingInline: 4 };
    case "on-photo":
      return { ...base, background: "rgb(255 255 255)", color: "rgb(0 0 0)" };
    case "on-photo-outline":
      return { ...base, border: "1px solid rgb(255 255 255 / .7)", color: "rgb(255 255 255)", outlineColor: "rgb(255 255 255)" };
    default:
      return { ...base, background: tv.accent, color: tv.accentText };
  }
}

/** The menu link (only when the owner has the menu button on). */
export function MenuCta({ ctx, variant = "solid", radius, children, className = "" }: { ctx: LandingSectionContext; variant?: ButtonVariant; radius?: string; children?: ReactNode; className?: string }) {
  const { c, p } = ctx;
  if (!c.cta.menuBtn) return null;
  return (
    <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", "menu_button", {})} style={buttonStyle(variant, radius)} className={`${BTN} ${className}`}>
      {children ?? c.terms.ctaLabel}
    </p.LinkComponent>
  );
}

/** Menu, pay and review actions — each only when the owner turned it on and set it up (no ordering). */
export function ActionRow({
  ctx,
  primary = "solid",
  secondary = "outline",
  radius,
  menuLabel,
  menu = true,
  className = "",
}: {
  ctx: LandingSectionContext;
  primary?: ButtonVariant;
  secondary?: ButtonVariant;
  radius?: string;
  /** Text of the menu button (defaults to the industry wording). */
  menuLabel?: string;
  /** Include the menu button (off where the section already has one nearby). */
  menu?: boolean;
  className?: string;
}) {
  const { c, p } = ctx;
  const pay = c.cta.payBtn && c.cta.paymentLink;
  const review = c.cta.reviewBtn && c.cta.reviewLink;
  if (!(menu && c.cta.menuBtn) && !pay && !review) return null;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {menu ? <MenuCta ctx={ctx} variant={primary} radius={radius}>{menuLabel}</MenuCta> : null}
      {pay ? (
        <button type="button" onClick={p.onPay} className={BTN} style={buttonStyle(secondary, radius)}>
          Pay bill
        </button>
      ) : null}
      {review ? (
        <button type="button" onClick={p.onReview} className={BTN} style={buttonStyle(secondary === "solid" ? "outline" : secondary, radius)}>
          Leave a review
        </button>
      ) : null}
    </div>
  );
}

/* ───────────────────────── visit ───────────────────────── */

/** Opening hours. Today's row is marked (restaurant time zone). */
export function HoursList({
  hours,
  todayName,
  variant = "table",
  className = "",
}: {
  hours: HoursRow[];
  todayName: string;
  variant?: "table" | "leaders" | "compact";
  className?: string;
}) {
  if (hours.length === 0) return null;
  return (
    <table className={`w-full border-collapse text-left ${className}`}>
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {hours.map((h) => {
          const today = h.day.toLowerCase() === todayName.toLowerCase();
          const closed = h.hours === "Closed";
          return (
            <tr
              key={h.day}
              style={{
                borderBottom: variant === "table" ? `1px solid ${mixv(tv.border, "transparent", 80)}` : undefined,
                color: today ? tv.text : tv.muted,
                fontWeight: today ? 600 : undefined,
              }}
            >
              <th scope="row" className={`${variant === "compact" ? "py-1" : "py-2.5"} pr-4 font-[inherit]`}>
                <span className="flex items-baseline gap-2">
                  {h.day}
                  {today ? <span className="text-xs font-normal" style={{ color: tv.accent }}>Today</span> : null}
                  {variant === "leaders" ? <span aria-hidden className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted" style={{ borderColor: mixv(tv.muted, "transparent", 60) }} /> : null}
                </span>
              </th>
              <td className={`${variant === "compact" ? "py-1" : "py-2.5"} whitespace-nowrap text-right tabular-nums${closed ? " italic" : ""}`}>
                {h.startTime && h.endTime ? (
                  <>
                    <time dateTime={h.startTime}>{h.startTime}</time> – <time dateTime={h.endTime}>{h.endTime}</time>
                  </>
                ) : (
                  h.hours
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Today's hours as one line ("Open today 12:00 – 23:00"), or null. */
export function todayHoursLine(hours: HoursRow[], todayName: string): string | null {
  const row = hours.find((h) => h.day.toLowerCase() === todayName.toLowerCase());
  if (!row) return null;
  if (!row.startTime || !row.endTime) return "Closed today";
  return `Open today ${row.startTime} – ${row.endTime}`;
}

const waHref = (n: string) => `https://wa.me/${n.replace(/[^\d]/g, "")}`;

/** Address (with directions), phone, email, WhatsApp, website — whatever the owner filled in. */
export function ContactList({ ctx, className = "", iconSize = 18 }: { ctx: LandingSectionContext; className?: string; iconSize?: number }) {
  const { c } = ctx;
  const rows: Array<{ icon: string; label: string; body: ReactNode }> = [];
  if (c.address) {
    rows.push({
      icon: "pin",
      label: "Address",
      body: (
        <>
          <span className="block">{c.address}</span>
          {c.locationUrl ? (
            <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm underline underline-offset-4 focus-visible:outline-2" style={{ color: tv.accent, ...focusRing }}>
              Get directions
            </a>
          ) : null}
        </>
      ),
    });
  }
  if (c.phone) rows.push({ icon: "phone", label: "Phone", body: <a href={`tel:${c.phone}`} className="hover:underline focus-visible:outline-2" style={focusRing}>{c.phone}</a> });
  if (c.email) rows.push({ icon: "mail", label: "Email", body: <a href={`mailto:${c.email}`} className="break-all hover:underline focus-visible:outline-2" style={focusRing}>{c.email}</a> });
  if (c.whatsapp) {
    rows.push({ icon: "chat", label: "WhatsApp", body: <a href={waHref(c.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:underline focus-visible:outline-2" style={focusRing}>{c.whatsapp}</a> });
  }
  if (c.websiteHref) {
    rows.push({ icon: "globe", label: "Website", body: <a href={c.websiteHref} target="_blank" rel="noopener noreferrer" className="break-all hover:underline focus-visible:outline-2" style={focusRing}>{c.websiteUrlRaw.replace(/^https?:\/\//, "")}</a> });
  }
  if (rows.length === 0) return null;
  return (
    <dl className={`space-y-4 ${className}`}>
      {rows.map((r) => (
        <div key={r.label} className="flex gap-3">
          <dt className="pt-0.5" style={{ color: tv.accent }}>
            <SiteIcon name={r.icon} size={iconSize} title={r.label} />
          </dt>
          <dd className="min-w-0" style={{ color: tv.text }}>{r.body}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SocialLinks({ ctx, className = "", variant = "pill" }: { ctx: LandingSectionContext; className?: string; variant?: "pill" | "plain" }) {
  const { social } = ctx.c;
  if (social.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {social.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-10 items-center gap-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${variant === "pill" ? "px-3.5" : "pr-3"}`}
            style={{
              ...focusRing,
              color: "inherit",
              ...(variant === "pill" ? { border: `1px solid ${mixv(tv.border, "transparent", 90)}`, borderRadius: 999 } : {}),
            }}
          >
            <span aria-hidden>{getSocialPlatformIcon(s.platform ?? s.name)}</span>
            {getSocialPlatformLabel(s.platform, s.name)}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ───────────────────────── owner content ───────────────────────── */

export function AmenityGrid({ amenities, variant = "grid", className = "" }: { amenities: AmenityView[]; variant?: "grid" | "row"; className?: string }) {
  if (amenities.length === 0) return null;
  return (
    <ul className={`${variant === "grid" ? "grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4" : "flex flex-wrap gap-x-6 gap-y-3"} ${className}`}>
      {amenities.map((a) => (
        <li key={a.id} className="flex items-start gap-3">
          <span className="shrink-0" style={{ color: tv.accent }}>
            <SiteIcon name={a.icon} size={variant === "grid" ? 28 : 20} />
          </span>
          <span className="min-w-0">
            <span className="block font-medium" style={{ color: tv.text }}>{a.label}</span>
            {a.note ? <span className="block text-sm" style={{ color: tv.muted }}>{a.note}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AwardInner({ a }: { a: PublicAward }) {
  return (
    <>
      <span className="block font-medium" style={{ color: tv.text }}>{a.title}</span>
      {a.publisher || a.year ? (
        <span className="block text-sm" style={{ color: tv.muted }}>
          {[a.publisher, a.year].filter(Boolean).join(", ")}
        </span>
      ) : null}
    </>
  );
}

/** Awards and press. `laurels` sets each title between two laurel sprigs. */
export function AwardList({ awards, variant = "laurels", className = "" }: { awards: PublicAward[]; variant?: "laurels" | "list"; className?: string }) {
  if (awards.length === 0) return null;
  return (
    <ul className={`${variant === "laurels" ? "flex flex-wrap justify-center gap-x-10 gap-y-8" : "divide-y"} ${className}`} style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
      {awards.map((a) => {
        const body = (
          <span className={`flex items-center gap-3 ${variant === "laurels" ? "text-center" : "py-3"}`}>
            {variant === "laurels" ? <Laurel /> : a.logoUrl ? (
              <span className="relative h-10 w-10 shrink-0 overflow-hidden" style={{ borderRadius: 6 }}>
                <Image src={a.logoUrl} alt="" fill sizes="40px" className="object-contain" />
              </span>
            ) : (
              <span style={{ color: tv.accent }}><SiteIcon name="medal" size={24} /></span>
            )}
            <span className="min-w-0"><AwardInner a={a} /></span>
            {variant === "laurels" ? <Laurel flip /> : null}
          </span>
        );
        return (
          <li key={a.id} className={variant === "laurels" ? "max-w-[18rem]" : ""}>
            {a.url ? (
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="block rounded focus-visible:outline-2 focus-visible:outline-offset-4 hover:opacity-80" style={focusRing}>
                {body}
              </a>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 48" width="18" height="36" className="shrink-0" style={{ color: tv.accent, transform: flip ? "scaleX(-1)" : undefined }}>
      <g fill="currentColor">
        <path d="M18 46C8 40 4 30 6 18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        {[10, 18, 26, 34].map((y, i) => (
          <ellipse key={y} cx={i % 2 ? 9 : 4.5} cy={y} rx="2.4" ry="5" transform={`rotate(${i % 2 ? 35 : -25} ${i % 2 ? 9 : 4.5} ${y})`} />
        ))}
      </g>
    </svg>
  );
}

export function TeamGrid({ team, frame, className = "" }: { team: PublicTeamMember[]; frame?: string; className?: string }) {
  if (team.length === 0) return null;
  return (
    <ul className={`grid gap-10 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {team.map((m) => (
        <li key={m.id} className="text-center">
          {m.photoUrl ? (
            <Photo src={m.photoUrl} alt={m.name} frame={frame} className="mx-auto aspect-[4/5] w-full max-w-[16rem]" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw" />
          ) : (
            <span className="mx-auto grid aspect-[4/5] w-full max-w-[16rem] place-items-center" style={{ ...frameStyle(frame ?? "rect", { accent: tv.accent, border: tv.border }), background: mixv(tv.accent, tv.surface, 10), color: tv.accent }}>
              <SiteIcon name="toque" size={56} />
            </span>
          )}
          <p className="mt-5 text-lg font-medium" style={{ color: tv.text, fontFamily: tv.display }}>{m.name}</p>
          {m.role ? <p className="text-sm" style={{ color: tv.accent }}>{m.role}</p> : null}
          {m.bio ? <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed" style={{ color: tv.muted }}>{m.bio}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** Upcoming events: a programme (date block + details) or cards with photos. */
export function EventList({ events, variant = "programme", className = "" }: { events: EventView[]; variant?: "programme" | "cards"; className?: string }) {
  if (events.length === 0) return null;
  if (variant === "cards") {
    return (
      <ul className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {events.map((e) => (
          <li key={e.id} className="flex flex-col overflow-hidden" style={{ background: tv.surface, border: `1px solid ${mixv(tv.border, "transparent", 80)}`, borderRadius: tv.radius }}>
            {e.imageUrl ? <Photo src={e.imageUrl} alt="" frame="rect" className="aspect-[16/9] w-full" sizes="(min-width: 1024px) 30vw, 90vw" /> : null}
            <div className="flex flex-1 flex-col p-5">
              <p className="text-sm" style={{ color: tv.accent }}>
                <time dateTime={e.startsAt}>{e.dateLabel}</time>
                {e.timeLabel ? `, ${e.timeLabel}` : ""}
              </p>
              <p className="mt-2 text-xl" style={{ color: tv.text, fontFamily: tv.display }}>{e.title}</p>
              {e.description ? <p className="mt-2 text-sm leading-relaxed" style={{ color: tv.muted }}>{e.description}</p> : null}
              {e.linkUrl ? (
                <a href={e.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-auto pt-4 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2" style={{ color: tv.accent, ...focusRing }}>
                  Event details
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol className={`divide-y ${className}`} style={{ borderColor: mixv(tv.border, "transparent", 70) }}>
      {events.map((e) => (
        <li key={e.id} className="grid grid grid-cols-1-cols-[4.5rem_1fr] gap-5 py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
          <time dateTime={e.startsAt} className="text-center leading-none" style={{ color: tv.accent }}>
            <span className="block text-sm">{e.weekday}</span>
            <span className="block py-1 text-4xl" style={{ fontFamily: tv.display }}>{e.day}</span>
            <span className="block text-sm">{e.month}</span>
          </time>
          <div className="min-w-0">
            <p className="text-xl" style={{ color: tv.text, fontFamily: tv.display }}>{e.title}</p>
            {e.timeLabel ? <p className="mt-1 text-sm" style={{ color: tv.muted }}>{e.timeLabel}</p> : null}
            {e.description ? <p className="mt-2 max-w-prose text-sm leading-relaxed" style={{ color: tv.muted }}>{e.description}</p> : null}
          </div>
          {e.linkUrl ? (
            <a href={e.linkUrl} target="_blank" rel="noopener noreferrer" className="col-start-2 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 sm:col-start-3" style={{ color: tv.accent, ...focusRing }}>
              Event details
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── text blocks ───────────────────────── */

export function FaqList({ faqs, className = "" }: { faqs: Array<{ q: string; a: string }>; className?: string }) {
  if (faqs.length === 0) return null;
  return (
    <div className={className}>
      {faqs.map((f, i) => (
        <details key={`${f.q}-${i}`} className="group py-5" style={{ borderBottom: `1px solid ${mixv(tv.border, "transparent", 80)}` }} open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden" style={{ color: tv.text, ...focusRing }}>
            {f.q}
            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: tv.accent }}>
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </summary>
          <p className="mt-3 max-w-prose leading-relaxed" style={{ color: tv.muted }}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function offerValue(o: { badge_text?: string | null; offer_value?: string | null; offer_type?: string | null }): string {
  if (o.badge_text) return o.badge_text;
  if (!o.offer_value) return "";
  return `${o.offer_value}${o.offer_type === "percentage" && !/%/.test(o.offer_value) ? "%" : ""} off`;
}

/** A decorative band in the skin's divider motif (or the section's chosen one). */
export function MotifBand({ variant, idPrefix, className = "", width = "100%", opacity = 0.8 }: { variant?: string; idPrefix: string; className?: string; width?: number | string; opacity?: number }) {
  const look = useOptionalSiteLook();
  const motif = ART_MOTIF_MAP.get(variant ?? "") ?? ART_MOTIF_MAP.get(look?.ornaments.divider ?? "") ?? ART_MOTIFS[0];
  const id = `${idPrefix}-motif`;
  // A fixed width is rounded down to whole tiles, so a short ornament never ends in half a motif.
  const w = typeof width === "number" ? Math.max(motif.w, Math.floor(width / motif.w) * motif.w) : width;
  return (
    <svg aria-hidden width={w} height={motif.h} className={className} style={{ color: tv.accent, opacity, display: "block" }}>
      <defs>
        <pattern id={id} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse">
          {motif.tile}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Standard heading for the shared default sections (title + optional intro). */
export function PlainHeading({ id, title, intro, align = "center" }: { id: string; title: string; intro?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 id={id} style={{ fontFamily: tv.display, fontSize: fluid.h2, color: tv.text, lineHeight: 1.1, textWrap: "balance" } as CSSProperties}>
        {title}
      </h2>
      {intro ? <p className="mt-4 leading-relaxed" style={{ color: tv.muted, fontSize: fluid.lead }}>{intro}</p> : null}
    </div>
  );
}
