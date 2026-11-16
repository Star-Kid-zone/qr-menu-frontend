"use client";

import { useEffect, useMemo, useState } from "react";
import { PiMagnifyingGlass, PiPower, PiSparkle } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { Button, Input, toast } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { siteContentService } from "@/services/siteContent.service";
import type { SiteDocument } from "@/components/templates/sections/types";
import type { OccasionDefinition, OccasionRegion } from "@/components/site-system/types";
import { SiteIcon } from "@/components/site-system/icons/SiteIcon";
import { getOccasion, OCCASION_REGIONS, occasionsByRegion } from "@/components/site-system/occasions/definitions";
import { parseOccasion } from "@/components/site-system/occasions/activeOccasion";
import { setOccasion } from "./occasionsDoc";

const REGION_LABEL: Record<OccasionRegion, string> = { india: "India", gulf: "Gulf", western: "Western", general: "Any time" };


/** The festival's colour chip with its icon. */
function Badge({ def, size = "md" }: { def: OccasionDefinition; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-2xl", size === "lg" ? "size-14" : "size-10")}
      style={{ background: `linear-gradient(135deg, ${def.tints[0]}, ${def.tints[1] ?? def.tints[0]})`, color: def.ink }}
    >
      <SiteIcon name={def.badgeIcon} size={size === "lg" ? 28 : 20} iconStyle="line" />
    </span>
  );
}

/**
 * Occasions (PLAN §2.8): the owner switches one festival on, and it stays on
 * until they turn it off. Guests then get the festival's opening scene, a
 * banner and decorations. Picking happens in a modal; Save makes it live.
 */
export function OccasionsPanel({ value, disabled, onChange }: { value: SiteDocument | null; disabled: boolean; onChange: (doc: SiteDocument) => void }) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState<OccasionRegion>("india");
  const [query, setQuery] = useState("");
  const [wording, setWording] = useState<Record<string, { banner?: string; specialsCategory?: string }>>({});
  const groups = useMemo(() => occasionsByRegion(), []);

  const current = parseOccasion(value?.occasion);
  const def = current ? getOccasion(current.id) : null;

  useEffect(() => {
    siteContentService
      .getOccasionPacks()
      .then((res) => setWording(res.data && typeof res.data === "object" ? res.data : {}))
      .catch(() => setWording({})); // the shipped wording still works
  }, []);

  /** The platform's wording (superadmin edits win over the shipped text). */
  const bannerFor = (id: string) => wording[id]?.banner || getOccasion(id)?.bannerSuggestion || "";

  const choose = (id: string) => {
    const banner = wording[id]?.banner;
    onChange(setOccasion(value, { id, intensity: current?.intensity ?? "full", ...(banner ? { banner } : {}) }));
    setOpen(false);
    toast.success(`${getOccasion(id)?.label ?? "The occasion"} is on in the preview. Save to switch it on for guests.`);
  };

  const turnOff = () => {
    onChange(setOccasion(value, null));
    toast.success("Occasion turned off in the preview. Save to remove it for guests.");
  };

  const needle = query.trim().toLowerCase();
  const list = needle
    ? OCCASION_REGIONS.flatMap((r) => groups[r]).filter((o) => o.label.toLowerCase().includes(needle))
    : groups[region];

  return (
    <div className="space-y-5">
      {current && def ? (
        <section aria-label="Occasion that is on" className="overflow-hidden rounded-2xl border">
          <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5" style={{ background: `linear-gradient(120deg, ${def.tints[0]}1f, transparent 70%)` }}>
            <Badge def={def} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
                {def.label}
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">On</span>
              </p>
              <p className="text-sm text-muted-foreground">Guests see the opening scene, a banner and decorations until you turn it off.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={() => setOpen(true)}>
                Change
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={turnOff} startIcon={<PiPower className="size-4" />}>
                Turn off
              </Button>
            </div>
          </div>
          <div className="grid gap-4 border-t p-4 sm:grid-cols-2 sm:p-5">
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-foreground">Banner text</span>
              <Input
                value={current.banner ?? ""}
                maxLength={120}
                placeholder={bannerFor(def.id)}
                disabled={disabled}
                onChange={(e) => onChange(setOccasion(value, { ...current, banner: e.target.value || undefined }))}
              />
              <span className="block text-xs text-muted-foreground">Also shown on the opening scene. Leave empty to use the suggestion.</span>
            </label>
            <div className="space-y-1.5 text-sm">
              <span className="block font-medium text-foreground">How strong</span>
              <div role="radiogroup" aria-label="How strong" className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["subtle", "Subtle", "Banner and decorations"],
                    ["full", "Full", "Also festival colours"],
                  ] as const
                ).map(([level, label, hint]) => (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={current.intensity === level}
                    disabled={disabled}
                    onClick={() => onChange(setOccasion(value, { ...current, intensity: level }))}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      current.intensity === level ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="block font-medium text-foreground">{label}</span>
                    <span className="block text-xs text-muted-foreground">{hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section aria-label="No occasion" className="grid place-items-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary" aria-hidden>
            <PiSparkle className="size-7" />
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">No occasion is on</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Switch on a festival and guests are greeted with its own opening scene: snow and Santa at Christmas, fireworks at Diwali, lanterns at Eid.
            </p>
          </div>
          <Button type="button" disabled={disabled} onClick={() => setOpen(true)}>
            Choose an occasion
          </Button>
        </section>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Choose an occasion" maxWidth="max-w-3xl">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div role="tablist" aria-label="Regions" className="flex flex-wrap gap-1.5">
              {OCCASION_REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={!needle && region === r}
                  onClick={() => {
                    setQuery("");
                    setRegion(r);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium",
                    !needle && region === r ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {REGION_LABEL[r]}
                </button>
              ))}
            </div>
            <label className="relative ml-auto w-full sm:w-56">
              <span className="sr-only">Search occasions</span>
              <PiMagnifyingGlass aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="pl-9" />
            </label>
          </div>

          {list.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No occasion matches “{query}”.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((o) => {
                const on = current?.id === o.id;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => choose(o.id)}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
                        on ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
                      )}
                    >
                      <Badge def={o} />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">{o.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {on ? "On now" : REGION_LABEL[o.region]}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}
