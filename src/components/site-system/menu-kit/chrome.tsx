"use client";

import type { CSSProperties } from "react";
import type { PublicMenuTemplateProps } from "@/components/templates/core/types";
import { APP_NAME } from "@/config/app.constants";
import { SiteIcon } from "../icons/SiteIcon";
import { siteLookCssVars } from "../tokens";
import type { SiteLook } from "../types";
import { tv } from "../kit/tokens";

/**
 * The bottom of every menu page (all 22 structures and the default menu):
 * the age notice for alcohol businesses and the menu footer. Kept apart from
 * MenuKit so the original structures can use it without importing the kit.
 */

/** For bars, pubs and wine shops: the legal drinking age, stated plainly. */
export function AgeNotice({ look }: { look: SiteLook | undefined }) {
  const age = look?.business.alcohol?.ageNotice;
  if (!age) return null;
  return (
    <p className="mx-auto mt-10 flex max-w-6xl items-center gap-2 px-5 text-sm sm:px-8" style={{ color: tv.muted }}>
      <SiteIcon name="question" size={16} />
      Alcoholic drinks are served only to guests aged {age} and over. Please drink responsibly.
    </p>
  );
}

/** Footer for the menu page: name, address, call, directions, back to the site, credit. */
export function MenuFooter({ p }: { p: PublicMenuTemplateProps }) {
  return (
    <footer className="mt-16" style={{ background: tv.footer, color: tv.footerMuted }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="space-y-2 text-sm">
          <p style={{ color: tv.footerText, fontFamily: tv.display, fontSize: "1.4rem" }}>{p.businessName}</p>
          {p.address ? <p>{p.address}</p> : null}
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {p.phone ? <a href={`tel:${p.phone}`} className="hover:underline" style={{ color: tv.footerText }}>{p.phone}</a> : null}
            {p.locationUrl ? <a href={p.locationUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: tv.footerAccent }}>Get directions</a> : null}
            <p.LinkComponent to={p.landingHref} className="hover:underline" style={{ color: tv.footerAccent }}>Visit our website</p.LinkComponent>
          </div>
        </div>
        <div className="text-xs">
          <p>© {new Date().getFullYear()} {p.businessName}</p>
          <p className="mt-1">Digital menu by {APP_NAME}</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Age notice + footer with their own token scope, for menus whose page root
 * doesn't set the site tokens (the original structures and the default menu).
 */
export function MenuChrome({ p }: { p: PublicMenuTemplateProps }) {
  const style = (p.look ? siteLookCssVars(p.look) : {}) as CSSProperties;
  return (
    <div style={style} data-menu-chrome>
      <AgeNotice look={p.look} />
      <MenuFooter p={p} />
    </div>
  );
}
