"use client";

import React, { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormField, Select, ToggleCard } from "@/components/ui";
import { MENU_LAYOUT_OPTIONS, MENU_STRUCTURE_OPTIONS, WORKSPACE_TOGGLE_OPTIONS } from "@/constants/workspace.constants";
import { getTemplatePalette } from "@/constants/templatePalettes";
import type { WorkspaceSettingsFormValues, WorkspaceToggleKey } from "@/types/workspace.types";
import { MENU_PARTS, getMenuPart, isPartCustomised, type MenuPartId } from "../menuParts";
import { MENU_COLOUR_THEMES, ROLE_FIELD, themeToValues, type ColourRole } from "../menuThemes";
import { MenuCategoriesPanel } from "./MenuCategoriesPanel";
import { SiteStatusPanel } from "./SiteStatusPanel";
import { ColourPartPreview } from "./ColourPartPreview";

/** The guest-facing buttons (the announcement is managed on the Content tab). */
const GUEST_TOGGLES = WORKSPACE_TOGGLE_OPTIONS.filter((t) => t.id !== "announcement_enabled");
import { StudioShell } from "../studio/StudioShell";
import { useRememberedPanel } from "../studio/useRememberedPanel";
import type { StudioPartFocus } from "../studio/resolvePart";
import { FontControl, ShapeControl, StructureTiles, SwatchControl, ThemeStrip, type Glyphs } from "../studio/primitives";

export interface MenuDesignStudioProps {
  formId: string;
  disabled: boolean;
  isDirty: boolean;
  watchedValues: WorkspaceSettingsFormValues;
  errors: FieldErrors<WorkspaceSettingsFormValues>;
  register: UseFormRegister<WorkspaceSettingsFormValues>;
  setValue: UseFormSetValue<WorkspaceSettingsFormValues>;
  focusedPart?: StudioPartFocus | null;
  /** Category names in item order, for the Categories panel. */
  menuCategories?: readonly string[];
}

type RailId = MenuPartId | "layout" | "categories" | "status" | "show";

const SET_OPTS = { shouldDirty: true, shouldTouch: true, shouldValidate: true } as const;

const GLYPHS: Glyphs = {
  "": [[4, 4, 32, 4], [4, 11, 32, 13]],
  list: [[4, 3, 14, 3], [4, 9, 32, 4], [4, 15, 32, 4], [4, 21, 32, 4]],
  grid: [[4, 4, 15, 9], [21, 4, 15, 9], [4, 15, 15, 9], [21, 15, 15, 9]],
  sidebar: [[3, 3, 9, 22], [15, 3, 22, 6], [15, 11, 22, 6], [15, 19, 22, 6]],
  tabs: [[4, 3, 8, 4], [14, 3, 8, 4], [24, 3, 8, 4], [4, 11, 32, 5], [4, 18, 32, 5]],
  accordion: [[4, 3, 32, 5], [4, 10, 32, 5], [4, 17, 32, 5], [4, 24, 32, 2]],
  magazine: [[3, 3, 34, 11], [3, 16, 16, 8], [21, 16, 16, 8]],
  compact: [[4, 3, 32, 2], [4, 8, 32, 2], [4, 13, 32, 2], [4, 18, 32, 2], [4, 23, 32, 2]],
  masonry: [[4, 3, 10, 12], [15, 3, 10, 7], [26, 3, 10, 14], [4, 17, 10, 8], [15, 12, 10, 13], [26, 19, 10, 6]],
  story: [[3, 3, 34, 8], [3, 13, 34, 4], [3, 19, 34, 6]],
  bento: [[3, 3, 20, 12], [25, 3, 12, 6], [25, 11, 12, 4], [3, 17, 12, 8], [17, 17, 20, 8]],
  "bill-of-fare": [[6, 2, 28, 24], [14, 5, 12, 2], [9, 10, 22, 2], [9, 14, 22, 2], [9, 18, 22, 2]],
  spotlight: [[3, 3, 9, 22], [15, 3, 22, 7], [15, 12, 22, 6], [15, 20, 22, 5]],
  "magazine-spread": [[3, 3, 20, 14], [26, 3, 11, 4], [26, 9, 11, 4], [26, 15, 11, 4], [3, 19, 20, 6]],
  "drinks-list": [[3, 3, 34, 3], [3, 8, 22, 3], [27, 8, 10, 3], [3, 13, 22, 3], [27, 13, 10, 3], [3, 18, 22, 3], [27, 18, 10, 3]],
  "shop-shelf": [[3, 3, 10, 10], [15, 3, 10, 10], [27, 3, 10, 10], [3, 15, 10, 10], [15, 15, 10, 10], [27, 15, 10, 10]],
  "garden-cards": [[3, 4, 16, 9], [21, 4, 16, 9], [3, 15, 16, 9], [21, 15, 16, 9]],
  "catch-board": [[3, 3, 34, 22], [6, 7, 28, 2], [6, 12, 28, 2], [6, 17, 28, 2]],
  "grill-board": [[3, 3, 34, 3], [3, 9, 10, 16], [15, 9, 10, 16], [27, 9, 10, 16]],
  "bento-box": [[3, 3, 17, 22], [22, 3, 15, 10], [22, 15, 7, 10], [30, 15, 7, 10]],
  "market-stalls": [[3, 3, 34, 4], [3, 9, 10, 8], [15, 9, 10, 8], [27, 9, 10, 8], [3, 19, 34, 6]],
  "deco-card": [[6, 3, 28, 4], [6, 10, 12, 15], [22, 10, 12, 15]],
  jukebox: [[3, 3, 34, 9], [5, 5, 9, 5], [16, 5, 9, 5], [27, 5, 9, 5], [3, 14, 34, 11]],
};

export function MenuDesignStudio({
  formId,
  disabled,
  isDirty,
  watchedValues,
  errors,
  register,
  setValue,
  focusedPart,
  menuCategories = [],
}: MenuDesignStudioProps) {
  const [active, setActive] = useRememberedPanel<RailId>("menu", "layout");

  // A tap in the preview picks a part. Adjusted during render, not in an effect,
  // so the inspector never flashes the previous part.
  const [seenNonce, setSeenNonce] = useState(focusedPart?.nonce ?? 0);
  if (focusedPart && focusedPart.nonce !== seenNonce) {
    setSeenNonce(focusedPart.nonce);
    if (MENU_PARTS.some((p) => p.id === focusedPart.part)) setActive(focusedPart.part as MenuPartId);
  }

  const values = watchedValues as unknown as Record<string, unknown>;
  const palette = getTemplatePalette(watchedValues.menu_theme ?? "");
  const part = getMenuPart(active === "layout" || active === "categories" || active === "status" || active === "show" ? "page" : active);

  const set = (name: keyof WorkspaceSettingsFormValues, v: string) => setValue(name, v as never, SET_OPTS);

  const applyTheme = (id: string) => {
    const theme = MENU_COLOUR_THEMES.find((t) => t.id === id);
    if (!theme) return;
    for (const [field, colour] of Object.entries(themeToValues(theme, ROLE_FIELD))) {
      set(field as keyof WorkspaceSettingsFormValues, colour);
    }
  };

  const colourCount = part.controls.filter((x) => x.kind === "color").length;

  return (
    <StudioShell
      formId={formId}
      ariaLabel="Menu page design"
      strip={
        MENU_PARTS.some((p) => p.id === active) ? (
          <ThemeStrip values={values} fields={ROLE_FIELD} disabled={disabled} dirty={isDirty} onPick={applyTheme} />
        ) : null
      }
      groups={[
        { id: "setup", label: "Set up" },
        { id: "content", label: "Content" },
        { id: "tune", label: "Fine-tune", collapsible: true },
      ]}
      items={[
        { id: "layout", group: "setup", label: "Menu design", hint: "How dishes are laid out. \"Match my layout\" uses the design made for your website layout." },
        {
          id: "categories",
          group: "content",
          label: "Sections",
          hint: "Order and hide categories, show some only on certain dates, pick their icons, and turn search and filters on or off.",
          customised: Boolean(watchedValues.site_document?.menu?.sections.length),
        },
        { id: "status", group: "content", label: "Open / closed", hint: "Tell guests you're closed for a day or a holiday. Shared with your website.", customised: Boolean(watchedValues.site_document?.status) },
        { id: "show", group: "content", label: "Buttons guests see", hint: "Menu, pay and review buttons. Shared with your website." },
        ...MENU_PARTS.map((p) => ({ id: p.id as string, group: "tune", label: p.label, hint: p.summary, customised: isPartCustomised(p, values, palette) })),
      ]}
      active={active}
      onActive={(id) => setActive(id as RailId)}
    >
      {active === "layout" ? (
        <>
          <StructureTiles
            label="Menu design"
            field="menu_structure"
            options={MENU_STRUCTURE_OPTIONS}
            glyphs={GLYPHS}
            value={watchedValues.menu_structure ?? ""}
            register={register}
            disabled={disabled}
          />
          {watchedValues.skin_id ? (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              Colours and fonts come from your website style. Change it under Website → Landing page → Style.
            </p>
          ) : (
            <FormField label="Colours and fonts" htmlFor={`${formId}-menu-layout`} error={errors.menu_theme?.message}>
              <Select
                id={`${formId}-menu-layout`}
                invalid={Boolean(errors.menu_theme)}
                disabled={disabled}
                className="h-9 max-w-sm text-sm"
                {...register("menu_theme")}
              >
                {MENU_LAYOUT_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        </>
      ) : active === "status" ? (
        <SiteStatusPanel
          formId={formId}
          value={watchedValues.site_document ?? null}
          disabled={disabled}
          onChange={(doc) => setValue("site_document", doc, SET_OPTS)}
        />
      ) : active === "show" ? (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            {GUEST_TOGGLES.map((t) => (
              <ToggleCard
                key={t.id}
                checked={Boolean(watchedValues[t.id])}
                onChange={(checked) => setValue(t.id as WorkspaceToggleKey, checked as never, SET_OPTS)}
                label={t.label}
                description={t.description}
                disabled={disabled}
                className="p-3 shadow-2xs"
              />
            ))}
          </div>
        </>
      ) : active === "categories" ? (
        <MenuCategoriesPanel
          value={watchedValues.site_document ?? null}
          categories={menuCategories}
          businessType={watchedValues.business_type ?? ""}
          disabled={disabled}
          onChange={(doc) => setValue("site_document", doc, SET_OPTS)}
        />
      ) : (
        <>
          {/* Same live mini-preview + readability checks as the landing editor, for the menu's own colours. */}
          <ColourPartPreview part={part.id} values={values} page="menu" />
          <div className="grid gap-3 sm:grid-cols-2">
            {part.controls.map((c) => {
              const templateValue = palette?.[c.paletteKey] as string | undefined;
              if (c.kind === "color") {
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
              }
              return (
                <div key={c.name} className="space-y-2 sm:col-span-2">
                  <p className="text-body-medium text-foreground">{c.label}</p>
                  {c.kind === "font" ? (
                    <FontControl value={String(values[c.name] ?? "")} disabled={disabled} onChange={(v) => set(c.name, v)} />
                  ) : (
                    <ShapeControl
                      value={String(values[c.name] ?? "")}
                      disabled={disabled}
                      onChange={(v) => set(c.name, v)}
                      cardBg={String(values.menu_section_bg_color ?? "#ffffff")}
                      border={String(values.menu_border_color ?? "#cccccc")}
                      pageBg={String(values.menu_accent_color ?? "#f4f4f4")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </StudioShell>
  );
}
