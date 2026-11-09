"use client";

import React, { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormField, Select, ToggleCard } from "@/components/ui";
import { cn } from "@/utils/cn";
import {
  HEADING_CLASS_OPTIONS,
  HERO_OVERLAY_OPTIONS,
  HERO_TAGLINE_OPTIONS,
  LANDING_LAYOUT_OPTIONS,
  LANDING_STRUCTURE_OPTIONS,
  THEME_BADGE_OPTIONS,
  THEME_MARQUEE_OPTIONS,
  WORKSPACE_TOGGLE_OPTIONS,
} from "@/constants/workspace.constants";
import { getTemplatePalette } from "@/constants/templatePalettes";
import type { Currency } from "@/types";
import type { WorkspaceSettingsFormValues, WorkspaceToggleKey } from "@/types/workspace.types";
import { LANDING_PARTS, getLandingPart, isLandingPartCustomised, type LandingControl, type LandingPartId } from "../landingParts";
import { LANDING_ROLE_FIELD, MENU_COLOUR_THEMES, themeToValues, type ColourRole } from "../menuThemes";
import { StudioShell } from "../studio/StudioShell";
import type { StudioPartFocus } from "../studio/resolvePart";
import {
  FontControl,
  ShapeControl,
  StructureTiles,
  SwatchControl,
  TextWithSuggestions,
  ThemeStrip,
  type Glyphs,
} from "../studio/primitives";

export interface LandingDesignStudioProps {
  formId: string;
  disabled: boolean;
  isDirty: boolean;
  currencies?: Currency[];
  watchedValues: WorkspaceSettingsFormValues;
  errors: FieldErrors<WorkspaceSettingsFormValues>;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  setValue: UseFormSetValue<WorkspaceSettingsFormValues>;
  focusedPart?: StudioPartFocus | null;
}

type RailId = LandingPartId | "layout";

const SET_OPTS = { shouldDirty: true, shouldTouch: true, shouldValidate: true } as const;

const GLYPHS: Glyphs = {
  "": [[4, 4, 32, 4], [4, 11, 32, 13]],
  split: [[3, 3, 11, 22], [17, 3, 20, 8], [17, 13, 20, 5], [17, 20, 20, 5]],
  minimal: [[3, 3, 34, 13], [3, 19, 10, 6], [15, 19, 10, 6], [27, 19, 10, 6]],
  magazine: [[3, 3, 22, 12], [27, 3, 10, 22], [3, 17, 22, 8]],
  cards: [[4, 3, 32, 6], [4, 11, 32, 6], [4, 19, 32, 6]],
  dashboard: [[3, 3, 20, 10], [25, 3, 12, 10], [3, 15, 12, 10], [17, 15, 20, 10]],
  tabs: [[4, 3, 8, 4], [14, 3, 8, 4], [24, 3, 8, 4], [4, 11, 32, 14]],
  story: [[3, 3, 15, 10], [20, 5, 17, 3], [20, 10, 17, 3], [22, 15, 15, 10], [3, 17, 17, 3], [3, 22, 17, 3]],
  "sidebar-right": [[3, 3, 22, 7], [3, 12, 22, 6], [3, 20, 22, 5], [28, 3, 9, 22]],
  compact: [[12, 3, 16, 5], [12, 10, 16, 4], [12, 16, 16, 4], [12, 22, 16, 3]],
  "horizontal-split": [[3, 3, 34, 8], [3, 13, 16, 12], [21, 13, 16, 12]],
};

const TOGGLES = WORKSPACE_TOGGLE_OPTIONS.filter((t) => t.id !== "announcement_enabled");

const TEXT_OPTIONS = {
  hero_tagline: HERO_TAGLINE_OPTIONS,
  theme_badge: THEME_BADGE_OPTIONS,
  theme_marquee: THEME_MARQUEE_OPTIONS,
} as const;

/** The tint over the hero photo, drawn over a stand-in photo so the effect is easy to compare. */
function OverlayControl({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  const photo = "linear-gradient(135deg,#d9c8a6,#7c8b9e 60%,#3f4a5a)";
  return (
    <div role="radiogroup" aria-label="Photo tint" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {HERO_OVERLAY_OPTIONS.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={o.label}
            title={o.label}
            disabled={disabled}
            onClick={() => onChange(o.value)}
            className={cn(
              "overflow-hidden rounded-xl border p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed",
              selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
            )}
          >
            <span
              aria-hidden="true"
              className="block h-10 w-full rounded-lg"
              style={{ background: o.value === "none" ? photo : `${o.value}, ${photo}` }}
            />
            <span className="sr-only">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LandingDesignStudio({
  formId,
  disabled,
  isDirty,
  currencies = [],
  watchedValues,
  errors,
  register,
  setValue,
  focusedPart,
}: LandingDesignStudioProps) {
  const [active, setActive] = useState<RailId>("layout");

  // A tap in the preview picks a part. Adjusted during render, not in an effect,
  // so the panel never flashes the previous part.
  const [seenNonce, setSeenNonce] = useState(focusedPart?.nonce ?? 0);
  if (focusedPart && focusedPart.nonce !== seenNonce) {
    setSeenNonce(focusedPart.nonce);
    if (LANDING_PARTS.some((p) => p.id === focusedPart.part)) setActive(focusedPart.part as LandingPartId);
  }

  const values = watchedValues as unknown as Record<string, unknown>;
  const palette = getTemplatePalette(watchedValues.landing_theme ?? "");
  const part = getLandingPart(active === "layout" ? "page" : active);

  const set = (name: keyof WorkspaceSettingsFormValues, v: unknown) => setValue(name, v as never, SET_OPTS);

  const applyTheme = (id: string) => {
    const theme = MENU_COLOUR_THEMES.find((t) => t.id === id);
    if (!theme) return;
    for (const [field, colour] of Object.entries(themeToValues(theme, LANDING_ROLE_FIELD))) {
      set(field as keyof WorkspaceSettingsFormValues, colour);
    }
  };

  const colourCount = part.controls.filter((x) => x.kind === "color").length;

  const renderControl = (c: LandingControl) => {
    const templateValue = palette?.[c.paletteKey] as string | undefined;
    switch (c.kind) {
      case "color":
        return (
          <SwatchControl
            key={c.name}
            id={`${formId}-${c.name}`}
            role={c.paletteKey as ColourRole}
            label={c.label}
            hint={c.hint}
            value={String(values[c.name] ?? "")}
            templateValue={templateValue}
            disabled={disabled}
            onChange={(v) => set(c.name, v)}
            wide={colourCount === 1}
          />
        );
      case "text":
        return (
          <TextWithSuggestions
            key={c.name}
            id={`${formId}-${c.name}`}
            label={c.label}
            hint={c.hint}
            placeholder={c.placeholder}
            value={String(values[c.name] ?? "")}
            options={TEXT_OPTIONS[c.name]}
            disabled={disabled}
            onChange={(v) => set(c.name, v)}
            wide={c.name === "hero_tagline"}
          />
        );
      case "font":
        return (
          <div key={c.name} className="space-y-2 sm:col-span-2">
            <p className="text-body-medium text-foreground">{c.label}</p>
            <FontControl value={String(values[c.name] ?? "")} disabled={disabled} onChange={(v) => set(c.name, v)} />
          </div>
        );
      case "shape":
        return (
          <div key={c.name} className="space-y-2 sm:col-span-2">
            <p className="text-body-medium text-foreground">{c.label}</p>
            <ShapeControl
              value={String(values[c.name] ?? "")}
              disabled={disabled}
              onChange={(v) => set(c.name, v)}
              cardBg={String(values.secondary_color ?? "#ffffff")}
              border={String(values.border_color ?? "#cccccc")}
              pageBg={String(values.accent_color ?? "#f4f4f4")}
            />
          </div>
        );
      case "heading":
        return (
          <div key={c.name} className="sm:col-span-2">
            <FormField label={c.label} htmlFor={`${formId}-heading-class`}>
              <Select id={`${formId}-heading-class`} disabled={disabled} className="h-9 text-sm" {...register("heading_class")}>
                {HEADING_CLASS_OPTIONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        );
      case "overlay":
        return (
          <div key={c.name} className="sm:col-span-2">
            <OverlayControl value={String(values[c.name] ?? "")} disabled={disabled} onChange={(v) => set(c.name, v)} />
          </div>
        );
    }
  };

  return (
    <StudioShell
      formId={formId}
      ariaLabel="Landing page design"
      strip={<ThemeStrip values={values} fields={LANDING_ROLE_FIELD} disabled={disabled} dirty={isDirty} onPick={applyTheme} />}
      items={[
        { id: "layout", label: "Layout" },
        ...LANDING_PARTS.map((p) => ({
          id: p.id as string,
          label: p.label,
          customised: isLandingPartCustomised(p, values, palette),
        })),
      ]}
      active={active}
      onActive={(id) => setActive(id as RailId)}
    >
      {active === "layout" ? (
        <>
          <StructureTiles
            label="Page structure"
            field="landing_structure"
            options={LANDING_STRUCTURE_OPTIONS}
            glyphs={GLYPHS}
            value={watchedValues.landing_structure ?? ""}
            register={register}
            disabled={disabled}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Style template" htmlFor={`${formId}-landing-layout`} error={errors.landing_theme?.message}>
              <Select
                id={`${formId}-landing-layout`}
                invalid={Boolean(errors.landing_theme)}
                disabled={disabled}
                className="h-9 text-sm"
                {...register("landing_theme")}
              >
                {LANDING_LAYOUT_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Loading screen" htmlFor={`${formId}-loading-layout`} error={errors.loading_screen_theme?.message}>
              <Select
                id={`${formId}-loading-layout`}
                invalid={Boolean(errors.loading_screen_theme)}
                disabled={disabled}
                className="h-9 text-sm"
                {...register("loading_screen_theme")}
              >
                <option value="minimal">Minimalist - Clean spinner</option>
                <option value="branded">Branded - Logo &amp; Primary color</option>
                <option value="skeleton">Skeleton - Content placeholders</option>
              </Select>
            </FormField>
          </div>
        </>
      ) : active === "show" ? (
        <>
          <p className="text-caption text-muted-foreground">{part.summary}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {TOGGLES.map((t) => (
              <ToggleCard
                key={t.id}
                checked={Boolean(watchedValues[t.id])}
                onChange={(checked) => set(t.id as WorkspaceToggleKey, checked)}
                label={t.label}
                description={t.description}
                disabled={disabled}
                className="p-3 shadow-2xs"
              />
            ))}
          </div>
          {currencies.length > 0 ? (
            <FormField label="Currency for prices" htmlFor={`${formId}-currency`}>
              <Select
                id={`${formId}-currency`}
                disabled={disabled}
                className="h-9 text-sm"
                {...register("currency_id", {
                  setValueAs: (v) => {
                    if (v === "" || v == null) return null;
                    const n = Number(v);
                    return Number.isNaN(n) ? null : n;
                  },
                })}
              >
                <option value="">Select currency</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </Select>
            </FormField>
          ) : null}
        </>
      ) : (
        <>
          <p className="text-caption text-muted-foreground">{part.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">{part.controls.map(renderControl)}</div>
        </>
      )}
    </StudioShell>
  );
}
