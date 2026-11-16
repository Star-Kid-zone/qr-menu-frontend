"use client";

import { Fragment, type CSSProperties } from "react";
import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { buildLandingContext } from "@/components/templates/landing/_shared/BaseTemplate";
import { LANDING_THEME_DATA } from "@/components/templates/landing/_shared/themeData";
import { SiteLookProvider } from "@/components/site-system/SiteLookContext";
import { siteLookCssVars } from "@/components/site-system/tokens";
import { textureBackground } from "@/components/site-system/ornaments";
import { lookFromSettings, siteToday } from "@/components/site-system/kit/look";
import { SiteFonts } from "@/components/site-system/kit/SiteFonts";
import { MotionStyles } from "@/components/site-system/kit/motion";
import { OccasionOverlay } from "@/components/site-system/occasions/OccasionOverlay";
import { OccasionHeroDecoration } from "@/components/site-system/occasions/OccasionHeroDecoration";
import { resolvePageSections, visibleSections } from "../document";
import { LANDING_SECTIONS, LANDING_SECTION_MAP } from "../landing/registry";
import { structureCatalogue } from "../landing/structureSections";
import type { LayoutDefinition, LayoutNavItem } from "./types";

/** Which sections get a link in a layout's navigation bar, and what it says. */
const NAV_LABELS: Partial<Record<string, string>> = {
  story: "About",
  "signature-dishes": "Specialties",
  "popular-items": "Menu",
  offers: "Offers",
  events: "Events",
  gallery: "Gallery",
  reviews: "Reviews",
  visit: "Visit",
  faq: "FAQ",
};

/**
 * Renders a landing page with one of the designed layouts. Every layout goes
 * through the same section engine as the default page (the owner's order,
 * hidden sections, date windows) and the same site look (skin + owner
 * colours as tokens, texture, display face, motion kit).
 */
export function LayoutPage({ layout, ...p }: LandingTemplateProps & { layout: LayoutDefinition }) {
  const themeSlug = p.themeSlug && LANDING_THEME_DATA[p.themeSlug] ? p.themeSlug : "swiss-international";
  const baseCtx = buildLandingContext(LANDING_THEME_DATA[themeSlug] ?? LANDING_THEME_DATA["swiss-international"], p);
  const settings = (p.data.settings ?? {}) as Record<string, unknown>;
  const look = lookFromSettings(settings, layout.key, "landing");

  const catalogue = layout.nativeOrder ? structureCatalogue(layout.nativeOrder) : LANDING_SECTIONS;
  const sections = visibleSections(
    resolvePageSections(settings.site_document, "landing", catalogue),
    LANDING_SECTION_MAP,
    siteToday(settings),
  );

  const nav: LayoutNavItem[] = sections
    .filter((s) => NAV_LABELS[s.type])
    .map((s) => ({ id: `section-${s.id}`, label: NAV_LABELS[s.type]! }));
  const ctx = { ...baseCtx, nav };

  const rootStyle: CSSProperties = {
    ...siteLookCssVars(look),
    backgroundColor: look.palette.bg,
    ...textureBackground(look.skin.background.texture, look.palette),
    fontFamily: "var(--site-font)",
    color: "var(--site-text-muted)",
  };

  const { Frame } = layout;
  return (
    <SiteLookProvider look={look}>
      <SiteFonts look={look} />
      <MotionStyles />
      {/* overflow-x: clip, not hidden — hidden would make this box the scroll container and silently break every sticky header inside it. */}
      <div style={rootStyle} className="min-h-dvh overflow-x-clip" data-layout={layout.key} data-motion={look.motion}>
        <OccasionOverlay look={look} live={!p.isPreview} />
        <Frame ctx={ctx} nav={nav}>
          {sections.map((section) => {
            const Section = layout.sections[section.type as keyof LayoutDefinition["sections"]];
            if (!Section) return <Fragment key={section.id} />;
            return (
              // A real box (not display:contents) so in-page nav links can scroll to it.
              <div
                key={section.id}
                id={`section-${section.id}`}
                data-section-id={section.id}
                data-section-type={section.type}
                className={section.type === "hero" && look.occasion ? "relative scroll-mt-20" : "scroll-mt-20"}
              >
                <Section ctx={ctx} section={section} />
                {section.type === "hero" ? <OccasionHeroDecoration look={look} /> : null}
              </div>
            );
          })}
        </Frame>
      </div>
    </SiteLookProvider>
  );
}
