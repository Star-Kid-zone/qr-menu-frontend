import type { ComponentType } from "react";
import type { LandingTemplateProps } from "@/types/public/templates/rawPublicSiteData.types";
import type { ThemeConfig } from "@/components/templates/landing/_shared/BaseTemplate";
import type { RichContent } from "@/components/templates/landing/_shared/defaults";
import type { getThemeImages } from "@/components/templates/landing/_shared/themeImages";
import type { OccasionEntry } from "@/components/site-system/types";
import type { SiteContentModel } from "@/components/site-system/kit/content";

/**
 * Website CMS document — which sections a guest page shows, in which order,
 * and which are hidden. Stored as `workspaces.site_document` (jsonb).
 * Mirrors `siteDocumentSchema` in
 * qr-backend/qr-menu-backend/src/validation/schemas/siteDocument.schema.ts.
 */
export interface SectionInstance {
  /** Stable per page; lets the editor track a section across reorders. */
  id: string;
  /** Key into the section registry. Unknown types are skipped when rendering. */
  type: string;
  hidden?: boolean;
  variant?: string;
  props?: Record<string, unknown>;
  /** Only show between these dates (inclusive, "YYYY-MM-DD", restaurant time zone). Either end may be open. */
  schedule?: SectionSchedule;
}

export interface SectionSchedule {
  from?: string;
  to?: string;
}

interface SitePage {
  sections: SectionInstance[];
}

export type SiteStatusMode = "open" | "closed-today" | "temporarily-closed" | "holiday" | "renovation";

/** Whole-site status, shown as a banner on the landing and menu pages. */
export interface SiteStatus {
  mode: SiteStatusMode;
  /** Owner's own wording; replaces the default line for the mode. */
  message?: string;
  /** "YYYY-MM-DD" the restaurant reopens; the banner stops showing on this date. */
  until?: string;
}

export interface SiteDocument {
  version: 1;
  landing?: SitePage;
  menu?: SitePage;
  status?: SiteStatus;
  /** Restaurant-type kit the site was started from. */
  kit?: string;
  /** The festival / occasion the owner switched on (site system §2.8): on while present. Never added automatically. */
  occasion?: OccasionEntry;
}

export type SitePageKind = "landing" | "menu";

/** Everything a landing section needs: content, merged theme, stock images and the template callbacks. */
export interface LandingSectionContext {
  c: RichContent;
  t: ThemeConfig;
  img: ReturnType<typeof getThemeImages>;
  p: LandingTemplateProps;
  /** Alternating band background (falls back to the card surface). */
  sectionBg: string;
  footerBg: string;
  cardStyle: string;
  /** Awards, team, events, amenities and today's weekday (site system). */
  site: SiteContentModel;
  /** In-page links to the visible sections (set by LayoutPage; used by footers). */
  nav?: ReadonlyArray<{ id: string; label: string }>;
}

export interface LandingSectionProps {
  ctx: LandingSectionContext;
  section: SectionInstance;
}

type SectionGroup = "opening" | "about" | "food" | "engage" | "trust" | "visit" | "global";

interface SectionDefinition<P> {
  type: string;
  label: string;
  description: string;
  group: SectionGroup;
  component: ComponentType<P>;
  /**
   * Shown when a site first gets this section. Sections added to the platform
   * later should be `false`, so already-customised sites don't change on deploy.
   */
  defaultVisible: boolean;
  /** Alternative designs; the first is the default (used when the section has no `variant`). */
  variants?: readonly SectionVariant[];
}

export interface SectionVariant {
  value: string;
  label: string;
}

export type LandingSectionDefinition = SectionDefinition<LandingSectionProps>;
