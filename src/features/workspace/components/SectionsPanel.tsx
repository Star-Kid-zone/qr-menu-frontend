"use client";

import React from "react";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import { Button } from "@/components/ui";
import { resolvePageSections } from "@/components/templates/sections/document";
import { LANDING_SECTION_MAP } from "@/components/templates/sections/landing/registry";
import { structureCatalogue } from "@/components/templates/sections/landing/structureSections";
import { LAYOUT_MAP } from "@/components/templates/sections/layouts/registry";
import { LANDING_SECTIONS } from "@/components/templates/sections/landing/registry";
import type { SectionInstance, SiteDocument } from "@/components/templates/sections/types";
import { moveItem, OrderableList, withSchedule } from "./OrderableList";

export { scheduleSummary } from "./OrderableList";

export interface SectionsPanelProps {
  value: SiteDocument | null;
  /** The selected landing_structure ("" = default page); sets the starting order. */
  structureKey: string;
  disabled: boolean;
  onChange: (doc: SiteDocument | null) => void;
}

/**
 * Landing page section list: reorder, show/hide, date windows, and reset to
 * the layout's default order. Edits the `site_document` form value, so the
 * live preview follows every change and the page's normal Save button stores it.
 */
export function SectionsPanel({ value, structureKey, disabled, onChange }: SectionsPanelProps) {
  // Every layout renders all sections in the saved order; a layout may define its own starting order.
  const nativeOrder = LAYOUT_MAP.get(structureKey.trim())?.nativeOrder;
  const catalogue = nativeOrder ? structureCatalogue(nativeOrder) : LANDING_SECTIONS;
  const sections = resolvePageSections(value, "landing", catalogue);
  const customised = Boolean(value?.landing);
  // The designed layouts draw their own hero and gallery; only these design choices apply there.
  const isLayout = Boolean(LAYOUT_MAP.get(structureKey.trim()));
  const LAYOUT_DESIGN_TYPES = new Set(["divider", "intro"]);

  const commit = (next: SectionInstance[]) => onChange({ ...(value ?? {}), version: 1, landing: { sections: next } });

  const reset = () => {
    if (!value) return;
    // Drop only the landing layout; keep the menu page and site status.
    // Nothing else customised → back to "never customised" (null).
    const rest: SiteDocument = { ...value };
    delete rest.landing;
    onChange(rest.menu || rest.status ? rest : null);
  };

  const visibleCount = sections.filter((s) => !s.hidden && LANDING_SECTION_MAP.has(s.type)).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-caption text-muted-foreground max-w-prose">
          Drag sections to change their order, or use the arrows. Hidden sections stay in the list so you can bring them back.
          {isLayout ? " This layout has its own hero and photo designs; switch to Default to choose between them." : ""}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || !customised}
          onClick={reset}
          startIcon={<PiArrowCounterClockwiseBold className="size-4" />}
        >
          Reset order
        </Button>
      </div>

      {visibleCount === 0 ? (
        <p role="status" className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-caption text-foreground">
          Every section is hidden, so guests will see an empty page.
        </p>
      ) : null}

      <OrderableList
        ariaLabel="Page sections"
        disabled={disabled}
        items={sections.map((s) => {
          const def = LANDING_SECTION_MAP.get(s.type);
          return {
            id: s.id,
            label: def?.label ?? "Unavailable section",
            description: def?.description,
            hidden: Boolean(s.hidden),
            schedule: s.schedule,
            // Only offer a design choice that changes the page (the preview would otherwise ignore it).
            variants: !isLayout || LAYOUT_DESIGN_TYPES.has(s.type) ? def?.variants : undefined,
            variant: s.variant,
          };
        })}
        onMove={(from, to) => commit(moveItem(sections, from, to))}
        onToggle={(index) =>
          commit(sections.map((s, i) => (i === index ? { ...s, hidden: s.hidden ? undefined : true } : s)))
        }
        onSchedule={(index, patch) => commit(sections.map((s, i) => (i === index ? withSchedule(s, patch) : s)))}
        onVariant={(index, variant) =>
          commit(
            sections.map((s, i) => {
              if (i !== index) return s;
              const next: SectionInstance = { ...s };
              if (variant) next.variant = variant;
              else delete next.variant;
              return next;
            })
          )
        }
      />
    </div>
  );
}
