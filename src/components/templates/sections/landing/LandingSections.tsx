"use client";

import type { LandingSectionContext, SectionInstance } from "../types";
import { visibleSections } from "../document";
import { LANDING_SECTION_MAP } from "./registry";
import { useOptionalSiteLook } from "@/components/site-system/SiteLookContext";
import { OccasionHeroDecoration } from "@/components/site-system/occasions/OccasionHeroDecoration";

/**
 * Renders a landing page's sections in order, skipping hidden and unknown ones.
 * Each section is tagged with data attributes (no layout box: display:contents)
 * so the design studio can map a click in the preview back to its section.
 */
export function LandingSections({
  ctx,
  sections,
  today,
}: {
  ctx: LandingSectionContext;
  sections: readonly SectionInstance[];
  /** Restaurant-local "YYYY-MM-DD"; sections scheduled outside it are left out. */
  today?: string;
}) {
  const look = useOptionalSiteLook();
  return (
    <>
      {visibleSections(sections, LANDING_SECTION_MAP, today).map((section) => {
        const Section = LANDING_SECTION_MAP.get(section.type)!.component;
        return (
          // The hero gets a real box while an occasion is on, so its decoration can frame it.
          <div
            key={section.id}
            data-section-id={section.id}
            data-section-type={section.type}
            className={section.type === "hero" && look?.occasion ? "relative" : undefined}
            style={section.type === "hero" && look?.occasion ? undefined : { display: "contents" }}
          >
            <Section ctx={ctx} section={section} />
            {section.type === "hero" && look ? <OccasionHeroDecoration look={look} /> : null}
          </div>
        );
      })}
    </>
  );
}
