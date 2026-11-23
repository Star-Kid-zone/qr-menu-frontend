"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/utils/cn";
import { toast } from "@/components/ui";
import { getTemplatePalette } from "@/constants/templatePalettes";
import { workspaceSettingsSchema } from "@/schemas/workspace.schema";
import type {
  WorkspacePalette,
  WorkspaceSettingsFormValues,
} from "@/types/admin/workspace/workspace.types";
import type { WorkspaceSettingsFormProps } from "@/types/admin/workspace/WorkspaceSettingsForm.types";
import { LandingDesignStudio } from "./LandingDesignStudio";
import { MenuDesignStudio } from "./MenuDesignStudio";

export function WorkspaceSettingsForm({
  formId,
  isOpen,
  initialValues,
  onSubmit,
  error: _error,
  loading = false,
  currencies = [],
  showPalettePresets = true,
  readOnly = false,
  compact = false,
  section,
  onValuesChange,
  focusedPart,
  menuCategories = [],
  onAssetsChanged,
}: WorkspaceSettingsFormProps & { section?: "landing" | "menu" }) {
  const disabled = loading || readOnly;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<WorkspaceSettingsFormValues>({
    resolver: zodResolver(workspaceSettingsSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(initialValues);
    }
  }, [initialValues, isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      reset(initialValues);
    }
  }, [isOpen, initialValues, reset]);

  const rawWatched = useWatch({ control });
  // Memoised: a fresh object every render re-fires the onValuesChange effect below,
  // which updates the parent, which re-renders this form — an endless loop.
  const watchedValues = useMemo(
    () =>
      (rawWatched && Object.keys(rawWatched).length > 0
        ? { ...initialValues, ...rawWatched }
        : initialValues) as WorkspaceSettingsFormValues,
    [rawWatched, initialValues]
  );

  useEffect(() => {
    if (isOpen) onValuesChange?.(watchedValues as WorkspaceSettingsFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, isOpen]);

  const applyTemplatePalette = (palette: WorkspacePalette) => {
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    setValue("theme_colour", palette.alias, opts);
    setValue("primary_color", palette.primary, opts);
    setValue("secondary_color", palette.secondary, opts);
    setValue("accent_color", palette.accent, opts);
    if (palette.textPrimary) setValue("text_primary_color", palette.textPrimary, opts);
    if (palette.textSecondary) setValue("text_secondary_color", palette.textSecondary, opts);
    if (palette.accentText) setValue("accent_text_color", palette.accentText, opts);
    if (palette.borderColor) setValue("border_color", palette.borderColor, opts);
    if (palette.footerBg) setValue("footer_bg_color", palette.footerBg, opts);
    if (palette.sectionBg) setValue("section_bg_color", palette.sectionBg, opts);
    if (palette.fontFamily) setValue("font_family", palette.fontFamily, opts);
    if (palette.cardStyle) setValue("card_style", palette.cardStyle, opts);
    if (palette.heroOverlay) setValue("hero_overlay", palette.heroOverlay, opts);
    if (palette.badge != null) setValue("theme_badge", palette.badge, opts);
    if (palette.marqueeText != null) setValue("theme_marquee", palette.marqueeText, opts);
    if (palette.headingClass != null) setValue("heading_class", palette.headingClass, opts);
    if (palette.heroTagline != null) setValue("hero_tagline", palette.heroTagline, opts);
  };

  const applyMenuTemplatePalette = (palette: WorkspacePalette) => {
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    if (palette.primary) setValue("menu_primary_color", palette.primary, opts);
    if (palette.secondary) setValue("menu_secondary_color", palette.secondary, opts);
    if (palette.accent) setValue("menu_accent_color", palette.accent, opts);
    if (palette.textPrimary) setValue("menu_text_primary_color", palette.textPrimary, opts);
    if (palette.textSecondary) setValue("menu_text_secondary_color", palette.textSecondary, opts);
    if (palette.accentText) setValue("menu_accent_text_color", palette.accentText, opts);
    if (palette.borderColor) setValue("menu_border_color", palette.borderColor, opts);
    if (palette.footerBg) setValue("menu_footer_bg_color", palette.footerBg, opts);
    if (palette.sectionBg) setValue("menu_section_bg_color", palette.sectionBg, opts);
    if (palette.fontFamily) setValue("menu_font_family", palette.fontFamily, opts);
    if (palette.cardStyle) setValue("menu_card_style", palette.cardStyle, opts);
  };

  const landingTheme = watchedValues.landing_theme as string | undefined;
  const menuTheme = watchedValues.menu_theme as string | undefined;
  const prevLandingThemeRef = useRef<string | undefined>(undefined);
  const prevMenuThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    prevLandingThemeRef.current = undefined;
    prevMenuThemeRef.current = undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (prevLandingThemeRef.current === undefined) {
      prevLandingThemeRef.current = landingTheme;
      return;
    }
    if (prevLandingThemeRef.current === landingTheme) return;
    prevLandingThemeRef.current = landingTheme;
    const palette = getTemplatePalette(landingTheme ?? "");
    if (!palette) return;
    applyTemplatePalette(palette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingTheme, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (prevMenuThemeRef.current === undefined) {
      prevMenuThemeRef.current = menuTheme;
      return;
    }
    if (prevMenuThemeRef.current === menuTheme) return;
    prevMenuThemeRef.current = menuTheme;
    const palette = getTemplatePalette(menuTheme ?? "");
    if (!palette) return;
    applyMenuTemplatePalette(palette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuTheme, isOpen]);

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        if (readOnly) {
          e.preventDefault();
          return;
        }
        void handleSubmit(
          onSubmit,
          (invalidErrors) => {
            console.error("Workspace settings validation failed:", invalidErrors);
            const firstError = Object.values(invalidErrors)[0];
            if (firstError?.message) {
              toast.error(String(firstError.message));
            } else {
              toast.error("Please check the form for errors.");
            }
          }
        )(e);
      }}
      className={cn("py-0", compact ? "space-y-4" : "space-y-6")}
    >
      {/* ── LANDING PAGE DESIGN ───────────────────────────────────────────── */}
      {(!section || section === "landing") && (
        <LandingDesignStudio
          formId={formId}
          disabled={disabled}
          isDirty={isDirty}
          currencies={currencies}
          watchedValues={watchedValues}
          errors={errors}
          register={register}
          setValue={setValue}
          focusedPart={focusedPart}
          // A kit sets the style template *and* its own colours/fonts: record the template as
          // already applied so the palette sync below doesn't overwrite the kit's look.
          onAssetsChanged={onAssetsChanged}
          onThemeAppliedWithLook={(theme) => {
            prevLandingThemeRef.current = theme;
          }}
        />
      )}

      {/* ── MENU PAGE DESIGN ──────────────────────────────────────────────── */}
      {section === "menu" && (
        <MenuDesignStudio
          formId={formId}
          disabled={disabled}
          isDirty={isDirty}
          watchedValues={watchedValues}
          errors={errors}
          register={register}
          setValue={setValue}
          focusedPart={focusedPart}
          menuCategories={menuCategories}
        />
      )}

      {/* Managed on the Banners tab; keep registered so workspace saves still send current values */}
      <div className="hidden" aria-hidden="true">
        <input type="checkbox" {...register("announcement_enabled")} />
        <textarea {...register("announcement_text")} />
      </div>
    </form>
  );
}
