"use client";

import React from "react";
import { PiCheckBold } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { kitRecipe, RESTAURANT_KITS, type RestaurantKit } from "@/components/templates/sections/kits/kits";
import { getSkin } from "@/components/site-system/skins";
import { ART_MOTIF_MAP } from "@/components/templates/sections/art/motifs";

export interface KitPickerProps {
  /** Kit the site was last started from (site_document.kit). */
  activeKitId?: string;
  disabled: boolean;
  onApply: (kit: RestaurantKit) => void;
}

/** A small preview of the kit: its style's page colour, a heading in the style's display face, a button, and the divider motif. */
function KitSwatch({ kit }: { kit: RestaurantKit }) {
  const skin = getSkin(kitRecipe(kit).skinId);
  if (!skin) return null;
  const p = skin.palette;
  const motifId = kit.sections.find((s) => s.type === "divider")?.variant;
  const motif = motifId ? ART_MOTIF_MAP.get(motifId) : undefined;
  const patternId = `kit-swatch-${kit.id}`;
  return (
    <span aria-hidden="true" className="block overflow-hidden rounded-lg border" style={{ background: p.bg, borderColor: p.border }}>
      <span className="block px-3 pt-3">
        <span className={cn("block truncate text-base leading-tight", skin.headingClass)} style={{ color: p.text, fontFamily: skin.fonts.display }}>
          {kit.label}
        </span>
        <span className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: p.accent, color: p.accentText }}>
          Menu
        </span>
      </span>
      <svg className="mt-2 block h-4 w-full" style={{ color: p.accent }}>
        {motif ? (
          <>
            <defs>
              <pattern id={patternId} width={motif.w} height={motif.h} patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                {motif.tile}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </>
        ) : null}
      </svg>
      <span className="flex h-2">
        {[p.band, p.surface, p.accent, p.text].map((c, i) => (
          <span key={i} className="flex-1" style={{ background: c }} />
        ))}
      </span>
    </span>
  );
}

/**
 * "Start from a restaurant type": one click applies a kit's look to the form
 * (preview updates live; nothing is saved until Save). Content is untouched.
 */
export function KitPicker({ activeKitId, disabled, onApply }: KitPickerProps) {
  const { confirm, confirmDialog } = useConfirmDialog();

  const pick = async (kit: RestaurantKit) => {
    const ok = await confirm({
      title: `Use the ${kit.label} look?`,
      description:
        "This sets your business type, layout and style (colours, fonts and shapes), and the order of your page sections. Your menu, photos, story and opening hours stay as they are. Check the preview, then Save — or Cancel to go back.",
      confirmLabel: "Use this look",
    });
    if (ok) onApply(kit);
  };

  return (
    <section aria-labelledby="kit-picker-heading" className="space-y-2">
      <div>
        <h3 id="kit-picker-heading" className="sr-only">
          Start from a restaurant type
        </h3>
        
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RESTAURANT_KITS.map((kit) => {
          const active = kit.id === activeKitId;
          return (
            <li key={kit.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => void pick(kit)}
                aria-pressed={active}
                aria-label={`${kit.label}: ${kit.description}`}
                className={cn(
                  "relative block w-full rounded-xl border p-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60",
                  active ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
                )}
              >
                <KitSwatch kit={kit} />
                <span className="mt-1.5 block px-1 text-caption text-muted-foreground line-clamp-2">{kit.description}</span>
                {active ? (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-primary p-0.5 text-primary-foreground">
                    <PiCheckBold className="size-3" />
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {confirmDialog}
    </section>
  );
}
