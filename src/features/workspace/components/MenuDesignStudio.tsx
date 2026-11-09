"use client";

import React, { useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormField, Select } from "@/components/ui";
import { MENU_LAYOUT_OPTIONS, MENU_STRUCTURE_OPTIONS } from "@/constants/workspace.constants";
import { getTemplatePalette } from "@/constants/templatePalettes";
import type { WorkspaceSettingsFormValues } from "@/types/workspace.types";
import { MENU_PARTS, getMenuPart, isPartCustomised, type MenuPartId } from "../menuParts";
import { MENU_COLOUR_THEMES, ROLE_FIELD, themeToValues, type ColourRole } from "../menuThemes";
import { StudioShell } from "../studio/StudioShell";
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
}

type RailId = MenuPartId | "layout";

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
}: MenuDesignStudioProps) {
  const [active, setActive] = useState<RailId>("layout");

  // A tap in the preview picks a part. Adjusted during render, not in an effect,
  // so the inspector never flashes the previous part.
  const [seenNonce, setSeenNonce] = useState(focusedPart?.nonce ?? 0);
  if (focusedPart && focusedPart.nonce !== seenNonce) {
    setSeenNonce(focusedPart.nonce);
    if (MENU_PARTS.some((p) => p.id === focusedPart.part)) setActive(focusedPart.part as MenuPartId);
  }

  const values = watchedValues as unknown as Record<string, unknown>;
  const palette = getTemplatePalette(watchedValues.menu_theme ?? "");
  const part = getMenuPart(active === "layout" ? "page" : active);

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
      strip={<ThemeStrip values={values} fields={ROLE_FIELD} disabled={disabled} dirty={isDirty} onPick={applyTheme} />}
      items={[
        { id: "layout", label: "Layout" },
        ...MENU_PARTS.map((p) => ({ id: p.id as string, label: p.label, customised: isPartCustomised(p, values, palette) })),
      ]}
      active={active}
      onActive={(id) => setActive(id as RailId)}
    >
      {active === "layout" ? (
        <>
          <StructureTiles
            label="Menu structure"
            field="menu_structure"
            options={MENU_STRUCTURE_OPTIONS}
            glyphs={GLYPHS}
            value={watchedValues.menu_structure ?? ""}
            register={register}
            disabled={disabled}
          />
          <FormField label="Style template" htmlFor={`${formId}-menu-layout`} error={errors.menu_theme?.message}>
            <Select
              id={`${formId}-menu-layout`}
              invalid={Boolean(errors.menu_theme)}
              disabled={disabled}
              className="h-9 text-sm"
              {...register("menu_theme")}
            >
              {MENU_LAYOUT_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
          </FormField>
        </>
      ) : (
        <>
          <p className="text-caption text-muted-foreground">{part.summary}</p>
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
