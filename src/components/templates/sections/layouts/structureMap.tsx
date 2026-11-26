"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { LandingTemplateProps } from "@/types/public/templates/rawPublicSiteData.types";
import type { LayoutDefinition } from "./types";
import { LayoutPage } from "./LayoutPage";

type LayoutModule = { layout: LayoutDefinition };

/**
 * One code-split chunk per layout: a guest downloads only the layout their site uses, not all
 * twenty. next/dynamic (SSR on by default) still server-renders the chosen layout; each import is
 * written inline in its dynamic() call so Next can register and preload the chunk. Keys are the saved `landing_structure` values (layouts.test.tsx checks
 * this list matches the registry).
 */
function toPage({ layout }: LayoutModule): ComponentType<LandingTemplateProps> {
  const Page = (p: LandingTemplateProps) => <LayoutPage layout={layout} {...p} />;
  Page.displayName = `Layout(${layout.label})`;
  return Page;
}

/**
 * `landing_structure` key → page component, for TenantLandingPage and the admin preview.
 * ("" = the default page, which isn't in this map.)
 */
export const STRUCTURE_MAP: Record<string, ComponentType<LandingTemplateProps>> = {
  "grand-hall": dynamic(() => import("./grand-hall").then(toPage)),
  "noir-salon": dynamic(() => import("./noir-salon").then(toPage)),
  "atelier-editorial": dynamic(() => import("./atelier-editorial").then(toPage)),
  conservatory: dynamic(() => import("./conservatory").then(toPage)),
  pier: dynamic(() => import("./pier").then(toPage)),
  ember: dynamic(() => import("./ember").then(toPage)),
  tatami: dynamic(() => import("./tatami").then(toPage)),
  bazaar: dynamic(() => import("./bazaar").then(toPage)),
  "supper-club": dynamic(() => import("./supper-club").then(toPage)),
  "midnight-diner": dynamic(() => import("./midnight-diner").then(toPage)),
  split: dynamic(() => import("./royal-luxe").then(toPage)),
  minimal: dynamic(() => import("./odyssey-classic").then(toPage)),
  magazine: dynamic(() => import("./trattoria").then(toPage)),
  cards: dynamic(() => import("./legend").then(toPage)),
  dashboard: dynamic(() => import("./bento").then(toPage)),
  tabs: dynamic(() => import("./street-pop").then(toPage)),
  story: dynamic(() => import("./chefs-journal").then(toPage)),
  "sidebar-right": dynamic(() => import("./cafe-notebook").then(toPage)),
  compact: dynamic(() => import("./link-card").then(toPage)),
  "horizontal-split": dynamic(() => import("./zen-grid").then(toPage)),
};
