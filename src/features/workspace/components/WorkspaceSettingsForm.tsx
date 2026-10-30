"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PiSlidersHorizontalBold,
  PiCaretDownBold,
  PiCaretUpBold,
} from "react-icons/pi";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";
import { getTemplatePalette } from "@/constants/templatePalettes";
import { workspaceSettingsSchema } from "@/schemas/workspace.schema";
import type {
  WorkspacePalette,
  WorkspaceSettingsFormValues,
} from "@/types/workspace.types";
import type { WorkspaceSettingsFormProps } from "@/types/components/admin/workspace/WorkspaceSettingsForm.types";
import {
  LandingLayoutSection,
  LandingPaletteSection,
  LandingTypographySection,
  LandingBrandingSection,
  LandingVisibilitySection,
  MenuLayoutSection,
  MenuPaletteSection,
  MenuTypographySection,
} from "./sections";

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
  onStartEditing,
  initialActiveSubSection,
}: WorkspaceSettingsFormProps & { section?: "landing" | "menu" }) {
  const disabled = loading || readOnly;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
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
  const watchedValues = (rawWatched && Object.keys(rawWatched).length > 0
    ? { ...initialValues, ...rawWatched }
    : initialValues) as WorkspaceSettingsFormValues;

  useEffect(() => {
    if (isOpen) onValuesChange?.(watchedValues as WorkspaceSettingsFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, isOpen]);

  // Master toggle: Additional Information is hidden until "Expand all" or an edit button is clicked
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState<boolean>(() =>
    Boolean(initialActiveSubSection)
  );

  const landingSectionKeys = ["palette", "typography", "branding", "visibility"];
  const menuSectionKeys = ["menu-palette", "menu-typography"];
  const currentKeys = section === "menu" ? menuSectionKeys : landingSectionKeys;

  // Individual card expansion state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    if (initialActiveSubSection) {
      return { [initialActiveSubSection]: true };
    }
    return {
      palette: true,
      typography: true,
      branding: true,
      visibility: true,
      "menu-palette": true,
      "menu-typography": true,
    };
  });

  useEffect(() => {
    if (initialActiveSubSection) {
      setIsAdditionalInfoOpen(true);
      setExpandedSections((prev) => ({ ...prev, [initialActiveSubSection]: true }));
    }
  }, [initialActiveSubSection]);

  const handleExpandAll = () => {
    setIsAdditionalInfoOpen(true);
    const updated: Record<string, boolean> = { ...expandedSections };
    currentKeys.forEach((k) => {
      updated[k] = true;
    });
    setExpandedSections(updated);
  };

  const handleCollapseAll = () => {
    setIsAdditionalInfoOpen(false);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditSection = (id: string) => {
    setIsAdditionalInfoOpen(true);
    setExpandedSections((prev) => ({ ...prev, [id]: true }));
    if (readOnly) {
      onStartEditing?.(id);
    }
  };

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
        void handleSubmit(onSubmit)(e);
      }}
      className={cn("py-0", compact ? "space-y-4" : "space-y-6")}
    >
      {/* ── LANDING PAGE DESIGN ───────────────────────────────────────────── */}
      {(!section || section === "landing") && (
        <div className="space-y-4">
          <LandingLayoutSection
            formId={formId}
            disabled={disabled}
            readOnly={readOnly}
            errors={errors}
            register={register}
            onStartEditing={onStartEditing}
          />

          {/* ── ADDITIONAL INFORMATION (Completely hidden until Expand all) ──── */}
          <div className="space-y-3 pt-1">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex items-center justify-between gap-3 transition-colors hover:border-primary/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                  <PiSlidersHorizontalBold className="size-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground">
                    Additional Information
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    Brand colors, typography, marketing copy, and section visibility
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={isAdditionalInfoOpen ? handleCollapseAll : handleExpandAll}
                startIcon={
                  isAdditionalInfoOpen ? (
                    <PiCaretUpBold className="size-3.5" />
                  ) : (
                    <PiCaretDownBold className="size-3.5" />
                  )
                }
                className="shrink-0"
              >
                {isAdditionalInfoOpen ? "Collapse all" : "Expand all"}
              </Button>
            </div>

            {isAdditionalInfoOpen && (
              <div className="space-y-3 pt-1 transition-all">
                <LandingPaletteSection
                  formId={formId}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  isExpanded={Boolean(expandedSections["palette"])}
                  onToggle={() => toggleSection("palette")}
                  onEdit={() => handleEditSection("palette")}
                  showPalettePresets={showPalettePresets}
                  landingTheme={landingTheme}
                  watchedValues={watchedValues}
                  errors={errors}
                  setValue={setValue}
                  applyTemplatePalette={applyTemplatePalette}
                />

                <LandingTypographySection
                  formId={formId}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  isExpanded={Boolean(expandedSections["typography"])}
                  onToggle={() => toggleSection("typography")}
                  onEdit={() => handleEditSection("typography")}
                  watchedValues={watchedValues}
                  register={register}
                  setValue={setValue}
                />

                <LandingBrandingSection
                  formId={formId}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  isExpanded={Boolean(expandedSections["branding"])}
                  onToggle={() => toggleSection("branding")}
                  onEdit={() => handleEditSection("branding")}
                  currencies={currencies}
                  watchedValues={watchedValues}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                />

                <LandingVisibilitySection
                  formId={formId}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  isExpanded={Boolean(expandedSections["visibility"])}
                  onToggle={() => toggleSection("visibility")}
                  onEdit={() => handleEditSection("visibility")}
                  watchedValues={watchedValues}
                  setValue={setValue}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MENU PAGE DESIGN ──────────────────────────────────────────────── */}
      {section === "menu" && (
        <div className="space-y-4">
          <MenuLayoutSection
            formId={formId}
            disabled={disabled}
            readOnly={readOnly}
            errors={errors}
            register={register}
            onStartEditing={onStartEditing}
          />

          {/* ── ADDITIONAL INFORMATION (Completely hidden until Expand all) ──── */}
          <div className="space-y-3 pt-1">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex items-center justify-between gap-3 transition-colors hover:border-primary/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                  <PiSlidersHorizontalBold className="size-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground">
                    Additional Information
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    Menu brand colors, typography, and card styling
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={isAdditionalInfoOpen ? handleCollapseAll : handleExpandAll}
                startIcon={
                  isAdditionalInfoOpen ? (
                    <PiCaretUpBold className="size-3.5" />
                  ) : (
                    <PiCaretDownBold className="size-3.5" />
                  )
                }
                className="shrink-0"
              >
                {isAdditionalInfoOpen ? "Collapse all" : "Expand all"}
              </Button>
            </div>

            {isAdditionalInfoOpen && (
              <div className="space-y-3 pt-1 transition-all">
                <MenuPaletteSection
                  formId={formId}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  isExpanded={Boolean(expandedSections["menu-palette"])}
                  onToggle={() => toggleSection("menu-palette")}
                  onEdit={() => handleEditSection("menu-palette")}
                  menuTheme={menuTheme}
                  watchedValues={watchedValues}
                  errors={errors}
                  setValue={setValue}
                  applyMenuTemplatePalette={applyMenuTemplatePalette}
                />

                <MenuTypographySection
                  formId={formId}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  isExpanded={Boolean(expandedSections["menu-typography"])}
                  onToggle={() => toggleSection("menu-typography")}
                  onEdit={() => handleEditSection("menu-typography")}
                  watchedValues={watchedValues}
                  setValue={setValue}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Managed on the Banners tab; keep registered so workspace saves still send current values */}
      <div className="hidden" aria-hidden="true">
        <input type="checkbox" {...register("announcement_enabled")} />
        <textarea {...register("announcement_text")} />
      </div>
    </form>
  );
}
