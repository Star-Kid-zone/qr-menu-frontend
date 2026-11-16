"use client";

import type { LandingTemplateProps } from "@/types/components/templates/rawPublicSiteData.types";
import { getRichContent } from "./defaults";
import { getThemeImages } from "./themeImages";
import { LandingSections } from "@/components/templates/sections/landing/LandingSections";
import { LANDING_SECTIONS } from "@/components/templates/sections/landing/registry";
import { resolvePageSections } from "@/components/templates/sections/document";
import type { LandingSectionContext } from "@/components/templates/sections/types";
import { buildSiteContent } from "@/components/site-system/kit/content";
import { lookFromSettings, siteToday } from "@/components/site-system/kit/look";
import { SiteFonts } from "@/components/site-system/kit/SiteFonts";
import { MotionStyles } from "@/components/site-system/kit/motion";
import { SiteLookProvider } from "@/components/site-system/SiteLookContext";
import { OccasionOverlay } from "@/components/site-system/occasions/OccasionOverlay";
import { siteLookCssVars } from "@/components/site-system/tokens";
import { textureBackground } from "@/components/site-system/ornaments";

export interface ThemeConfig {
  slug: string;
  // Colours
  bg: string; // page background
  surface: string; // card/section background
  border: string; // border colour
  textPrimary: string; // main heading colour
  textSecondary: string; // body text colour
  accent: string; // highlight / accent colour
  accentText: string; // text on accent background
  heroOverlay: string; // hero gradient overlay
  // Typography
  fontFamily: string;
  headingClass?: string;
  // Decoration
  marqueeText?: string;
  badge?: string; // small label above hero title
  heroTagline?: string;
  footerBg?: string;
  divider?: string; // decorative divider between sections
  cardStyle?: string; // extra classes for dish cards
  sectionBg?: string; // alternating section backgrounds
}

interface Props extends LandingTemplateProps {
  theme: ThemeConfig;
}

/**
 * The default landing page for every style theme. The page itself is a list of
 * sections (components/templates/sections/landing) rendered in the order the
 * owner saved in `settings.site_document`, or the default order when they
 * haven't customised it.
 */
/**
 * The theme + content context every landing section receives: the style
 * template's defaults with all owner-saved colours/fonts/wording merged over
 * them. Shared by the default page and every layout.
 */
export function buildLandingContext(themeConfig: ThemeConfig, p: LandingTemplateProps): LandingSectionContext {
  const c = getRichContent(p.data, themeConfig.slug);

  // One source of colour for every page: the resolved site look (skin, then the
  // owner's saved colours — see site-system/kit/look.ts). Layouts that read `t`
  // and layouts that read the CSS tokens therefore always agree.
  const look = lookFromSettings(p.data.settings, "", "landing");
  const { palette, fonts, skin } = look;
  const onStyle = typeof p.data.settings?.skin_id === "string" && p.data.settings.skin_id.trim() !== "";

  // The business type's wording ("Drinks", "See the drinks") when the owner chose a type;
  // otherwise the industry wording, as before. Every layout reads c.terms, so all of them follow.
  const chosenType = typeof p.data.settings?.business_type === "string" && p.data.settings.business_type.trim() !== "";
  if (chosenType) {
    const b = look.business.terms;
    c.terms = {
      ...c.terms,
      catalogLabel: b.catalogLabel,
      itemSingular: b.itemSingular,
      itemPlural: b.itemPlural,
      featuredSectionLabel: b.featuredSectionLabel,
      popularSectionLabel: b.popularSectionLabel,
      ctaLabel: b.ctaLabel,
    };
  }
  const t: ThemeConfig = {
    ...themeConfig,
    bg:            palette.bg,
    surface:       palette.surface,
    border:        palette.border,
    textPrimary:   palette.text,
    textSecondary: palette.textMuted,
    accent:        palette.accent,
    accentText:    palette.accentText,
    footerBg:      palette.footer,
    sectionBg:     palette.band,
    fontFamily:    fonts.body,
    cardStyle:     c.theme.cardStyle      || (themeConfig.cardStyle  ?? 'rounded-2xl'),
    heroOverlay:   c.theme.heroOverlay    || skin.heroOverlay,
    // The skin decides (converted skins carry their template's heading style); the owner's choice wins.
    headingClass:  c.theme.headingClass   || skin.headingClass,
    // A site on a style shows only the owner's own wording; the old templates' built-in
    // slogans ("Helvetica. Switzerland. Precision.") apply only to sites still on a template.
    badge:         c.theme.badge          || (onStyle ? '' : themeConfig.badge),
    marqueeText:   c.theme.marqueeText    || (onStyle ? '' : themeConfig.marqueeText),
    heroTagline:   c.theme.heroTagline    || (onStyle ? '' : themeConfig.heroTagline),
  };

  return {
    c,
    t,
    img: getThemeImages(t.slug),
    p,
    sectionBg: t.sectionBg ?? t.surface,
    footerBg: t.footerBg ?? t.bg,
    cardStyle: t.cardStyle ?? "",
    site: buildSiteContent(p.data),
  };
}

export default function BaseTemplate({ theme: themeConfig, ...p }: Props) {
  const ctx = buildLandingContext(themeConfig, p);
  const { t } = ctx;

  const sections = resolvePageSections(p.data.settings?.site_document, "landing", LANDING_SECTIONS);
  const look = lookFromSettings(p.data.settings, "", "landing");

  return (
    <SiteLookProvider look={look}>
      <SiteFonts look={look} />
      <MotionStyles />
      <div
        style={{
          ...siteLookCssVars(look),
          ...textureBackground(look.skin.background.texture, look.palette),
          fontFamily: t.fontFamily,
          backgroundColor: t.bg,
          color: t.textSecondary,
        }}
        // clip, not hidden: hidden would make this the scroll container and break sticky bars.
        className="min-h-dvh overflow-x-clip"
        data-motion={look.motion}
      >
        <OccasionOverlay look={look} live={!p.isPreview} />
        <LandingSections ctx={ctx} sections={sections} today={siteToday(p.data.settings as Record<string, unknown> | undefined)} />
      </div>
    </SiteLookProvider>
  );
}
