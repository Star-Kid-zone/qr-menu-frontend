"use client";

import Image from "@/components/ui/Image";
import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ReactQRCode } from "@lglab/react-qr-code";
import { APP_NAME } from "@/config/app.constants";
import { getSocialPlatformIcon, getSocialPlatformLabel } from "@/components/templates/core/socialPlatforms";
import type { LandingSectionContext } from "@/components/templates/sections/types";
import { SiteIcon } from "../icons/SiteIcon";
import { todayHoursLine } from "./blocks";
import { fluid, mixv, tv } from "./tokens";

/**
 * Footer v2 (docs/site-system/PLAN.md §2.4) — the same content in every
 * layout, never empty: name (+ logo or crest), tagline, a QR code for the
 * menu, address with directions, phone, email, WhatsApp, today's hours,
 * quick links to the visible sections, social links, amenities, copyright,
 * credit and back to top. Fields the owner hasn't filled in are left out.
 *
 * Colours come from the footer tokens, which are picked for contrast with
 * the footer background (see footerInk).
 */

const subscribeNoop = () => () => {};

/** Absolute URL of the menu, known only in the browser (the page can live on several hosts). */
function useAbsoluteUrl(href: string): string | null {
  return useSyncExternalStore(
    subscribeNoop,
    () => (/^https?:\/\//i.test(href) ? href : `${window.location.origin}${href.startsWith("/") ? "" : "/"}${href}`),
    () => null,
  );
}

/** A scannable code for the menu. Always dark on white: codes must stay scannable on every skin. */
export function MenuQr({ href, size = 112, label = "Scan for the menu" }: { href: string; size?: number; label?: string }) {
  const url = useAbsoluteUrl(href);
  return (
    <figure className="flex w-fit flex-col items-center gap-2">
      <div className="grid place-items-center p-2" style={{ background: "rgb(255 255 255)", width: size + 16, height: size + 16, borderRadius: 10 }}>
        {url ? <ReactQRCode value={url} size={size} level="M" marginSize={0} /> : <span aria-hidden style={{ width: size, height: size }} />}
      </div>
      <figcaption className="text-xs" style={{ color: tv.footerMuted }}>
        {label}
      </figcaption>
    </figure>
  );
}

const linkCls = "rounded hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2";
const linkStyle: CSSProperties = { color: tv.footerText, outlineColor: tv.footerAccent };

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold" style={{ color: tv.footerText }}>
        {title}
      </h3>
      <div className="mt-3 space-y-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function FooterV2({
  ctx,
  align = "columns",
  crest,
  top,
  className = "",
}: {
  ctx: LandingSectionContext;
  /** "columns" (name and code across, details in columns) or "center" (one centred column). */
  align?: "columns" | "center";
  /** Replaces the logo next to the name (a layout's crest or monogram). */
  crest?: ReactNode;
  /** Decoration above the content (an ornament rule, a motif band). */
  top?: ReactNode;
  className?: string;
}) {
  const { c, p, site } = ctx;
  const nav = ctx.nav ?? [];
  const today = todayHoursLine(c.hours, site.todayName);
  const year = new Date().getFullYear();
  const center = align === "center";

  const identity = (
    <div className={`flex min-w-0 flex-col gap-4 ${center ? "items-center text-center" : ""}`}>
      {crest ?? (c.logoUrl ? (
        <span className="relative h-14 w-14 overflow-hidden" style={{ borderRadius: tv.radius }}>
          <Image src={c.logoUrl} alt="" fill sizes="56px" className="object-cover" />
        </span>
      ) : null)}
      <div>
        <p style={{ color: tv.footerText, fontFamily: tv.display, fontSize: fluid.h3, lineHeight: 1.15 }}>{c.businessName}</p>
        {c.slogan ? <p className="mt-2 max-w-sm text-sm leading-relaxed">{c.slogan}</p> : null}
        {today ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm" style={{ color: tv.footerText }}>
            <SiteIcon name="clock" size={16} />
            {today}
          </p>
        ) : null}
      </div>
    </div>
  );

  const visit = c.address ? (
    <Group title="Visit">
      <p>{c.address}</p>
      {c.locationUrl ? (
        <a href={c.locationUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 ${linkCls}`} style={{ ...linkStyle, color: tv.footerAccent }}>
          <SiteIcon name="directions" size={15} />
          Get directions
        </a>
      ) : null}
    </Group>
  ) : null;

  const contactRows = [
    c.phone ? <a key="tel" href={`tel:${c.phone}`} className={linkCls} style={linkStyle}>{c.phone}</a> : null,
    c.email ? <a key="mail" href={`mailto:${c.email}`} className={`break-all ${linkCls}`} style={linkStyle}>{c.email}</a> : null,
    c.whatsapp ? (
      <a key="wa" href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className={linkCls} style={linkStyle}>
        WhatsApp {c.whatsapp}
      </a>
    ) : null,
    c.websiteHref ? (
      <a key="web" href={c.websiteHref} target="_blank" rel="noopener noreferrer" className={`break-all ${linkCls}`} style={linkStyle}>
        {c.websiteUrlRaw.replace(/^https?:\/\//, "")}
      </a>
    ) : null,
  ].filter(Boolean);
  const contact = contactRows.length ? (
    <Group title="Contact">
      {contactRows.map((r, i) => (
        <p key={i}>{r}</p>
      ))}
    </Group>
  ) : null;

  const explore = (
    <Group title="Explore">
      <nav aria-label="Footer" className={`flex flex-col gap-2 ${center ? "items-center" : ""}`}>
        {c.cta.menuBtn ? (
          <p.LinkComponent to={p.menuHref} onClick={() => p.track("click", "footer_menu", {})} className={linkCls} style={{ ...linkStyle, color: tv.footerAccent }}>
            {c.terms.catalogLabel}
          </p.LinkComponent>
        ) : null}
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={linkCls} style={linkStyle}>
            {n.label}
          </a>
        ))}
      </nav>
    </Group>
  );

  const social = c.social.length ? (
    <ul className={`flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>
      {c.social.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={getSocialPlatformLabel(s.platform, s.name)}
            className="grid size-10 place-items-center rounded-full text-base focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ border: `1px solid ${mixv(tv.footerText, "transparent", 30)}`, color: tv.footerText, outlineColor: tv.footerAccent }}
          >
            <span aria-hidden>{getSocialPlatformIcon(s.platform ?? s.name)}</span>
          </a>
        </li>
      ))}
    </ul>
  ) : null;

  const amenities = site.amenities.length ? (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-xs ${center ? "justify-center" : ""}`} aria-label="Amenities">
      {site.amenities.map((a) => (
        <li key={a.id} className="inline-flex items-center gap-1.5">
          <SiteIcon name={a.icon} size={16} />
          {a.label}
        </li>
      ))}
    </ul>
  ) : null;

  const rule = { borderColor: mixv(tv.footerText, "transparent", 16) } as CSSProperties;

  return (
    <footer className={`relative ${className}`} style={{ background: tv.footer, color: tv.footerMuted }}>
      {top}
      <div className="mx-auto w-full max-w-6xl px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
        <div className={center ? "flex flex-col items-center gap-10" : "flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between"}>
          {identity}
          <MenuQr href={p.menuHref} />
        </div>

        <div className={`mt-12 grid gap-10 border-t pt-10 ${center ? "justify-items-center text-center sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`} style={rule}>
          {visit}
          {contact}
          {explore}
        </div>

        {social || amenities ? (
          <div className={`mt-10 flex flex-col gap-6 border-t pt-8 ${center ? "items-center" : "lg:flex-row lg:items-center lg:justify-between"}`} style={rule}>
            {social}
            {amenities}
          </div>
        ) : null}

        <div className={`mt-10 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between ${center ? "items-center text-center" : ""}`} style={rule}>
          <p>
            © {year} {c.businessName}. All rights reserved.
          </p>
          <p>Digital menu by {APP_NAME}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded px-1 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:self-auto ${center ? "self-center" : "self-start"}`}
            style={{ color: tv.footerText, outlineColor: tv.footerAccent }}
          >
            <SiteIcon name="arrow-right" size={14} style={{ transform: "rotate(-90deg)" }} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
