"use client";

import type { ComponentType } from "react";
import type { LandingTemplateProps } from "@/types/public/templates/rawPublicSiteData.types";
import { LayoutPage } from "./LayoutPage";
import { LAYOUTS } from "./registry";

/**
 * `landing_structure` key → page component, for TenantLandingPage and the
 * admin preview. Each designed layout renders through LayoutPage. ("" = the
 * default page, which isn't in this map.)
 */
export const STRUCTURE_MAP: Record<string, ComponentType<LandingTemplateProps>> = Object.fromEntries(
  LAYOUTS.map((layout) => {
    const Page = (p: LandingTemplateProps) => <LayoutPage layout={layout} {...p} />;
    Page.displayName = `Layout(${layout.label})`;
    return [layout.key, Page];
  }),
);
