"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PiMagnifyingGlass,
  PiPower,
  PiSparkle,
  PiCheckCircleFill,
  PiEyeBold,
  PiXBold,
  PiArrowsClockwiseBold,
} from "react-icons/pi";
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
function Badge({ def, size = "md" }: { def: OccasionDefinition; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl shadow-xs",
        size === "lg" ? "size-14 rounded-2xl" : size === "sm" ? "size-8 rounded-xl" : "size-10 rounded-xl"
      )}
      style={{ background: `linear-gradient(135deg, ${def.tints[0]}, ${def.tints[1] ?? def.tints[0]})`, color: def.ink }}
    >
      <SiteIcon name={def.badgeIcon} size={size === "lg" ? 28 : size === "sm" ? 16 : 20} iconStyle="line" />
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

  // Local state for banner text so typing spaces is never trimmed prematurely
  const rawBanner = (value?.occasion as { banner?: string } | undefined)?.banner;
  const [bannerText, setBannerText] = useState(rawBanner ?? "");

  useEffect(() => {
    setBannerText(rawBanner ?? "");
  }, [rawBanner, current?.id]);

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
    setBannerText(banner ?? "");
    onChange(setOccasion(value, { id, intensity: current?.intensity ?? "full", ...(banner ? { banner } : {}) }));
    setOpen(false);
    toast.success(`${getOccasion(id)?.label ?? "The occasion"} is on in the preview. Save to switch it on for guests.`);
  };

  const turnOff = () => {
    setBannerText("");
    onChange(setOccasion(value, null));
    toast.success("Occasion turned off in the preview. Save to remove it for guests.");
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setBannerText(nextVal);
    if (!current?.id) return;
    onChange(setOccasion(value, { ...current, id: current.id, banner: nextVal || undefined }));
  };

  const handleBannerBlur = () => {
    const trimmed = bannerText.trim();
    if (trimmed !== bannerText && current?.id) {
      setBannerText(trimmed);
      onChange(setOccasion(value, { ...current, id: current.id, banner: trimmed || undefined }));
    }
  };

  const applySuggestion = (suggestionText: string) => {
    setBannerText(suggestionText);
    if (!current?.id) return;
    onChange(setOccasion(value, { ...current, id: current.id, banner: suggestionText || undefined }));
  };

  const clearBannerText = () => {
    setBannerText("");
    if (!current?.id) return;
    onChange(setOccasion(value, { ...current, id: current.id, banner: undefined }));
  };

  const needle = query.trim().toLowerCase();
  const list = needle
    ? OCCASION_REGIONS.flatMap((r) => groups[r]).filter((o) => o.label.toLowerCase().includes(needle))
    : groups[region];

  const suggestion = def ? bannerFor(def.id) : "";

  return (
    <div className="space-y-5">
      {current && def ? (
        <section aria-label="Occasion that is on" className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          {/* Header Strip with festive gradient and status */}
          <div
            className="flex flex-wrap items-center gap-4 p-4 sm:p-5"
            style={{ background: `linear-gradient(120deg, ${def.tints[0]}24, transparent 75%)` }}
          >
            <Badge def={def} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-bold text-foreground">{def.label}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Active on website & menu
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Guests see the celebratory opening scene, top banner, and festive styling.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={() => setOpen(true)}
                leftIcon={<PiArrowsClockwiseBold className="size-3.5" />}
              >
                Change festival
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={turnOff}
                leftIcon={<PiPower className="size-4 text-destructive" />}
                className="hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              >
                Turn off
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t border-border p-4 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Banner Text Control with Space Support & Suggestion Pill */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <label htmlFor="occasion-banner-text" className="font-semibold text-foreground">
                    Banner text
                  </label>
                  <span
                    className={cn(
                      "text-caption tabular-figures",
                      bannerText.length > 100 ? "font-semibold text-warning" : "text-muted-foreground"
                    )}
                  >
                    {bannerText.length}/120
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="occasion-banner-text"
                    value={bannerText}
                    maxLength={120}
                    placeholder={suggestion}
                    disabled={disabled}
                    onChange={handleBannerChange}
                    onBlur={handleBannerBlur}
                    className="pr-8 text-sm"
                  />
                  {bannerText ? (
                    <button
                      type="button"
                      onClick={clearBannerText}
                      title="Clear banner text"
                      aria-label="Clear banner text"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <PiXBold className="size-3.5" />
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5 text-xs text-muted-foreground">
                  <span>Displayed on your opening scene and top header.</span>
                  {suggestion && bannerText !== suggestion ? (
                    <button
                      type="button"
                      onClick={() => applySuggestion(suggestion)}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <PiSparkle className="size-3" />
                      <span>Use suggestion</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* How Strong (Intensity Selector) */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="block font-semibold text-foreground">How strong</span>
                  <span className="text-caption text-muted-foreground">Festival intensity</span>
                </div>
                <div role="radiogroup" aria-label="How strong" className="grid grid-cols-2 gap-2.5">
                  {(
                    [
                      ["subtle", "Subtle", "Banner and decorations"],
                      ["full", "Full", "Festival colours & mood"],
                    ] as const
                  ).map(([level, label, hint]) => {
                    const isChecked = current.intensity === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        role="radio"
                        aria-checked={isChecked}
                        disabled={disabled}
                        onClick={() => onChange(setOccasion(value, { ...current, intensity: level }))}
                        className={cn(
                          "relative rounded-xl border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          isChecked
                            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                            : "border-border hover:border-primary/40 hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{label}</span>
                          {isChecked ? (
                            <PiCheckCircleFill className="size-4 text-primary" />
                          ) : (
                            <span className="size-4 rounded-full border border-muted-foreground/30" />
                          )}
                        </div>
                        <span className="mt-1 block text-xs text-muted-foreground leading-snug">{hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Interactive Banner Preview */}
            <div className="rounded-xl border border-border bg-muted/25 p-3.5 sm:p-4">
              <div className="mb-2 flex items-center justify-between text-caption font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <PiEyeBold className="size-3.5 text-primary" />
                  <span>Live Banner Preview</span>
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">Appears at top of menu & website</span>
              </div>
              <div
                className="relative flex items-center justify-between gap-3 overflow-hidden rounded-xl p-3 shadow-xs transition-all sm:p-3.5"
                style={{
                  background: `linear-gradient(135deg, ${def.tints[0]}, ${def.tints[1] ?? def.tints[0]})`,
                  color: def.ink,
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge def={def} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{def.label}</p>
                    <p className="truncate text-sm font-semibold sm:text-base">
                      {bannerText.trim() ? bannerText : suggestion}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 items-center gap-1.5 rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-xs sm:flex">
                  <PiSparkle className="size-3" />
                  <span>{current.intensity === "full" ? "Full Festival Mood" : "Subtle Banner"}</span>
                </div>
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
