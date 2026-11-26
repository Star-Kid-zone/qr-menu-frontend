import type { ComponentType, ReactNode } from "react";
import type { LandingSectionContext, LandingSectionProps } from "../types";

/**
 * Every landing section type. A layout MUST implement all of them (enforced by
 * the `Record<LandingSectionType, …>` type and by layouts.test.tsx), so no
 * layout ever drops part of a restaurant's content.
 */
export const LANDING_SECTION_TYPES = [
  "intro",
  "announcement",
  "hero",
  "marquee",
  "stats",
  "story",
  "signature-dishes",
  "popular-items",
  "offers",
  "gallery",
  "reviews",
  "visit",
  "faq",
  "divider",
  "footer",
  // Site system (PLAN §2.3): owner-managed content, off until the owner adds it.
  "awards",
  "team",
  "amenities",
  "events",
  "curated-list",
] as const;

type LandingSectionType = (typeof LANDING_SECTION_TYPES)[number];

/** An in-page link for the layout's navigation bar (only sections that are actually shown). */
export interface LayoutNavItem {
  /** DOM id of the section's anchor (`#${id}`). */
  id: string;
  label: string;
}

export interface LayoutFrameProps {
  ctx: LandingSectionContext;
  /** Links to the visible sections worth navigating to (story, menu, gallery, reviews, visit, faq). */
  nav: LayoutNavItem[];
  /** The page's sections, already in the owner's order with hidden/out-of-date ones removed. */
  children: ReactNode;
}

export interface LayoutDefinition {
  /** Stable key stored in `landing_structure` (kept from the old layouts so saved sites carry over). */
  key: string;
  label: string;
  /** One line shown in the editor. */
  description: string;
  /**
   * The page shell: background, navigation bar (logo/name, links from `nav`, a primary action),
   * fonts, and anything that wraps every section. Sections render as its children.
   */
  Frame: ComponentType<LayoutFrameProps>;
  /** One component per section type. Each renders null when it has no content to show. */
  sections: Record<LandingSectionType, ComponentType<LandingSectionProps>>;
  /** Default order for a site that hasn't arranged its sections (defaults to the registry order). */
  nativeOrder?: readonly LandingSectionType[];
  /** The menu structure designed to pair with this layout ("Match my layout"). */
  menuStructure?: string;
}
