"use client";

import React, { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormField, Select, ToggleCard } from "@/components/ui";
import { cn } from "@/utils/cn";
import {
  HEADING_CLASS_OPTIONS,
  HERO_OVERLAY_OPTIONS,
  HERO_TAGLINE_OPTIONS,
  THEME_BADGE_OPTIONS,
  THEME_MARQUEE_OPTIONS,
  WORKSPACE_TOGGLE_OPTIONS,
} from "@/constants/workspace.constants";
import { getTemplatePalette } from "@/constants/templatePalettes";
import type { Currency } from "@/types";
import type { WorkspaceSettingsFormValues, WorkspaceToggleKey } from "@/types/admin/workspace/workspace.types";
import { LANDING_PARTS, getLandingPart, isLandingPartCustomised, type LandingControl, type LandingPartId } from "../landingParts";
import { LANDING_ROLE_FIELD, MENU_COLOUR_THEMES, themeToValues, type ColourRole } from "../menuThemes";
import { StudioShell } from "../studio/StudioShell";
import { useRememberedPanel } from "../studio/useRememberedPanel";
import { SectionsPanel } from "./SectionsPanel";
import { KitPicker } from "./KitPicker";
import { ColourPartPreview } from "./ColourPartPreview";
import { HeroImagePanel } from "./HeroImagePanel";

/** Parts whose colours get the live mini-preview and readability checks. */
const COLOUR_PREVIEW_PARTS: readonly LandingPartId[] = ["page", "cards", "text", "accent"];
import { kitFormValues, type RestaurantKit } from "@/components/templates/sections/kits/kits";
import { SiteStatusPanel } from "./SiteStatusPanel";
import type { StudioPartFocus } from "../studio/resolvePart";
import { BusinessTypePicker, LayoutGallery, StyleGallery, skinFormValues } from "../studio/SitePickers";
import { OccasionsPanel } from "../studio/OccasionsPanel";
import { SiteContentPanel } from "../studio/SiteContentPanel";
import { getBusinessType, resolveBusinessType } from "@/components/site-system/business-types";
import type { Palette, SkinDefinition } from "@/components/site-system/types";
import {
  FontControl,
  ShapeControl,
  SwatchControl,
  TextWithSuggestions,
  ThemeStrip,
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
  /** Called before a kit changes the style template along with its own colours, so the form skips its template-palette sync. */
  onThemeAppliedWithLook?: (landingTheme: string) => void;
  /** Reload after the hero photo changes (saved straight away). */
  onAssetsChanged?: () => void | Promise<void>;
}

type RailId = LandingPartId | "quick" | "type" | "layout" | "style" | "loading" | "sections" | "status" | "occasions" | "content";

const SET_OPTS = { shouldDirty: true, shouldTouch: true, shouldValidate: true } as const;


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
  onThemeAppliedWithLook,
  onAssetsChanged,
}: LandingDesignStudioProps) {
  // A new site starts at its business type; one that has one starts at the layout.
  const [active, setActive] = useRememberedPanel<RailId>("landing", watchedValues.business_type ? "layout" : "type");

  // A tap in the preview picks a part. Adjusted during render, not in an effect,
  // so the panel never flashes the previous part.
  const [seenNonce, setSeenNonce] = useState(focusedPart?.nonce ?? 0);
  if (focusedPart && focusedPart.nonce !== seenNonce) {
    setSeenNonce(focusedPart.nonce);
    if (LANDING_PARTS.some((p) => p.id === focusedPart.part)) setActive(focusedPart.part as LandingPartId);
  }

  const values = watchedValues as unknown as Record<string, unknown>;
  const palette = getTemplatePalette(watchedValues.landing_theme ?? "");
  const part = getLandingPart(LANDING_PARTS.some((p) => p.id === active) ? (active as LandingPartId) : "page");
  const business = getBusinessType(watchedValues.business_type) ?? resolveBusinessType({ site_document: watchedValues.site_document });
  /** The current colours as a palette, for the layout thumbnails. */
  const currentPalette: Palette = {
    bg: String(values.accent_color || "#ffffff"),
    surface: String(values.secondary_color || "#f4f4f4"),
    accent: String(values.primary_color || "#333333"),
    accentText: String(values.accent_text_color || "#ffffff"),
    text: String(values.text_primary_color || "#111111"),
    textMuted: String(values.text_secondary_color || "#555555"),
    border: String(values.border_color || "#dddddd"),
    band: String(values.section_bg_color || "#eeeeee"),
    footer: String(values.footer_bg_color || "#222222"),
  };
  const pickSkin = (skin: SkinDefinition) => {
    for (const [field, v] of Object.entries(skinFormValues(skin))) set(field as keyof WorkspaceSettingsFormValues, v);
  };

  const set = (name: keyof WorkspaceSettingsFormValues, v: unknown) => setValue(name, v as never, SET_OPTS);

  const applyTheme = (id: string) => {
    const theme = MENU_COLOUR_THEMES.find((t) => t.id === id);
    if (!theme) return;
    for (const [field, colour] of Object.entries(themeToValues(theme, LANDING_ROLE_FIELD))) {
      set(field as keyof WorkspaceSettingsFormValues, colour);
    }
  };

  /** Apply a restaurant-type kit to the form (live preview; saved with the normal Save). */
  const applyKit = (kit: RestaurantKit) => {
    // A recipe sets no old template; tell the form so its template colour sync stays out of the way.
    onThemeAppliedWithLook?.("");
    for (const [field, v] of Object.entries(kitFormValues(kit, watchedValues))) {
      set(field as keyof WorkspaceSettingsFormValues, v);
    }
    const doc = watchedValues.site_document;
    set("site_document", { ...(doc ?? {}), version: 1, landing: { sections: kit.sections }, kit: kit.id });
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
      strip={
        COLOUR_PREVIEW_PARTS.includes(active as LandingPartId) ? (
          <ThemeStrip values={values} fields={LANDING_ROLE_FIELD} disabled={disabled} dirty={isDirty} onPick={applyTheme} />
        ) : null
      }
      groups={[
        { id: "setup", label: "Set up" },
        { id: "content", label: "Content" },
        { id: "tune", label: "Fine-tune", collapsible: true },
      ]}
      items={[
        { id: "quick", group: "setup", label: "Quick start", hint: "A ready-made look for your cuisine: business type, layout, style and section order in one click." },
        { id: "type", group: "setup", label: "Business type", hint: "Sets the words guests see (Menu or Drinks), the item details you can add, and icons.", customised: Boolean(watchedValues.business_type) },
        { id: "layout", group: "setup", label: "Layout", hint: "How the page is arranged and how it moves. Suggested layouts for your business type come first." },
        { id: "style", group: "setup", label: "Style", hint: "Colours, fonts, icons and ornaments. Picking one sets your colours; you can fine-tune them later.", customised: Boolean(watchedValues.skin_id) },
        { id: "sections", group: "content", label: "Sections", hint: "Choose which parts of the page show, and in what order.", customised: Boolean(watchedValues.site_document?.landing) },
        { id: "content", group: "content", label: "Awards, team, events", hint: "Extra content guests can see: press and awards, your team, upcoming events, amenities and picks." },
        { id: "occasions", group: "content", label: "Occasions", hint: "Switch on a festival: guests get its opening scene, a banner and decorations until you turn it off.", customised: Boolean(watchedValues.site_document?.occasion) },
        { id: "status", group: "content", label: "Open / closed", hint: "Tell guests you're closed for a day or a holiday.", customised: Boolean(watchedValues.site_document?.status) },
        ...LANDING_PARTS.map((p) => ({
          id: p.id as string,
          group: "tune",
          label: p.label,
          hint: p.summary,
          customised: isLandingPartCustomised(p, values, palette),
        })),
        { id: "loading", group: "tune", label: "Loading screen", hint: "What guests see for a moment while the page opens." },
      ]}
      active={active}
      onActive={(id) => setActive(id as RailId)}
    >
      {active === "quick" ? (
        <KitPicker activeKitId={watchedValues.site_document?.kit} disabled={disabled} onApply={applyKit} />
      ) : active === "type" ? (
        <BusinessTypePicker value={watchedValues.business_type ?? ""} disabled={disabled} onChange={(id) => set("business_type", id)} />
      ) : active === "layout" ? (
        <LayoutGallery
          value={watchedValues.landing_structure ?? ""}
          recommended={business.recommended.layouts}
          palette={currentPalette}
          disabled={disabled}
          onChange={(key) => set("landing_structure", key)}
        />
      ) : active === "style" ? (
        <StyleGallery value={watchedValues.skin_id ?? ""} recommended={business.recommended.skins} disabled={disabled} onChange={pickSkin} />
      ) : active === "loading" ? (
        <FormField label="Loading screen" htmlFor={`${formId}-loading-layout`} error={errors.loading_screen_theme?.message}>
          <Select
            id={`${formId}-loading-layout`}
            invalid={Boolean(errors.loading_screen_theme)}
            disabled={disabled}
            className="h-9 max-w-sm text-sm"
            {...register("loading_screen_theme")}
          >
            <option value="minimal">Simple spinner</option>
            <option value="branded">Your logo and colour</option>
            <option value="skeleton">Outline of the page</option>
          </Select>
        </FormField>
      ) : active === "sections" ? (
        <SectionsPanel
          value={watchedValues.site_document ?? null}
          structureKey={watchedValues.landing_structure ?? ""}
          disabled={disabled}
          onChange={(doc) => set("site_document", doc)}
        />
      ) : active === "occasions" ? (
        <OccasionsPanel
          value={watchedValues.site_document ?? null}
          disabled={disabled}
          onChange={(doc) => set("site_document", doc)}
        />
      ) : active === "content" ? (
        <SiteContentPanel value={watchedValues.site_document ?? null} disabled={disabled} onChange={(doc) => set("site_document", doc)} />
      ) : active === "status" ? (
        <SiteStatusPanel
          formId={formId}
          value={watchedValues.site_document ?? null}
          disabled={disabled}
          onChange={(doc) => set("site_document", doc)}
        />
      ) : active === "show" ? (
        <>
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
          {COLOUR_PREVIEW_PARTS.includes(part.id) ? <ColourPartPreview part={part.id} values={values} /> : null}
          {part.id === "hero" ? <HeroImagePanel disabled={disabled} onChanged={onAssetsChanged} /> : null}
          {part.id === "hero" ? <p className="text-body-medium text-foreground">Photo tint</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">{part.controls.map(renderControl)}</div>
        </>
      )}
    </StudioShell>
  );
}
