"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PiPaletteBold,
  PiSparkleBold,
  PiSquaresFourBold,
  PiEyeBold,
  PiSlidersHorizontalBold,
  PiPencilSimpleBold,
  PiCaretDownBold,
  PiCaretUpBold,
  PiTextAaBold,
} from "react-icons/pi";
import type { Currency } from "@/types";
import {
  LANDING_LAYOUT_OPTIONS,
  LANDING_STRUCTURE_OPTIONS,
  MENU_LAYOUT_OPTIONS,
  MENU_STRUCTURE_OPTIONS,
  WORKSPACE_COLOR_FIELDS,
  WORKSPACE_EXTENDED_COLOR_FIELDS,
  MENU_COLOR_FIELDS,
  MENU_EXTENDED_COLOR_FIELDS,
  WORKSPACE_TOGGLE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  CARD_STYLE_OPTIONS,
  HEADING_CLASS_OPTIONS,
  HERO_OVERLAY_OPTIONS,
  THEME_BADGE_OPTIONS,
  THEME_MARQUEE_OPTIONS,
  HERO_TAGLINE_OPTIONS,
} from "@/constants/workspace.constants";
import { DropdownWithCustomInput } from "./DropdownWithCustomInput";
import { getTemplatePalette } from "@/constants/templatePalettes";
import { workspaceSettingsSchema } from "@/schemas/workspace.schema";
import type {
  WorkspacePalette,
  WorkspaceSettingsFormValues,
  WorkspaceToggleKey,
} from "@/types/workspace.types";
import {
  Button,
  FormField,
  Input,
  Select,
  ToggleCard,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import { WorkspaceSettingsFormProps } from "@/types/components/admin/workspace/WorkspaceSettingsForm.types";

export function WorkspaceSettingsForm({
  formId,
  isOpen,
  initialValues,
  onSubmit,
  error,
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

  const watchedValues = useWatch({ control }) ?? initialValues;

  useEffect(() => {
    if (isOpen) onValuesChange?.(watchedValues as WorkspaceSettingsFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, isOpen]);

  // Master toggle: Additional Information is completely hidden by default until "Expand all" is clicked
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
          {/* Main Layout Section */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <PiSquaresFourBold className="size-5" />
                </div>
                <div>
                  <h3 className="text-h3 text-foreground">Landing Page Layout</h3>
                  <p className="text-caption text-muted-foreground">
                    Core template, page structure, and loading style
                  </p>
                </div>
              </div>
              {readOnly && onStartEditing && (
                <button
                  type="button"
                  onClick={() => onStartEditing("layout")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  <PiPencilSimpleBold className="size-3.5 text-primary" />
                  <span>Edit layout</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                label="Landing layout"
                htmlFor={`${formId}-landing-layout`}
                error={errors.landing_theme?.message}
              >
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

              <FormField
                label="Page structure"
                htmlFor={`${formId}-landing-structure`}
                error={errors.landing_structure?.message}
              >
                <Select
                  id={`${formId}-landing-structure`}
                  invalid={Boolean(errors.landing_structure)}
                  disabled={disabled}
                  className="h-9 text-sm"
                  {...register("landing_structure")}
                >
                  {LANDING_STRUCTURE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Loading screen"
                htmlFor={`${formId}-loading-layout`}
                error={errors.loading_screen_theme?.message}
              >
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
          </section>

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

            {/* Content only rendered when Additional Information is expanded */}
            {isAdditionalInfoOpen && (
              <div className="space-y-3 pt-1 transition-all">
                {/* 1. Brand & Extended Palette */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("palette")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                        <PiPaletteBold className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Brand &amp; Extended Palette</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Primary, secondary, accent, borders &amp; background shades
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {readOnly && onStartEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection("palette");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                        >
                          <PiPencilSimpleBold className="size-3.5 text-primary" />
                          <span>Edit colors</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={expandedSections["palette"] ? "Collapse palette" : "Expand palette"}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expandedSections["palette"] ? (
                          <PiCaretUpBold className="size-4" />
                        ) : (
                          <PiCaretDownBold className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSections["palette"] && (
                    <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Core Brand Colors
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {WORKSPACE_COLOR_FIELDS.map((color) => (
                            <div
                              key={color.name}
                              className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
                            >
                              <FormField
                                label={color.label}
                                htmlFor={`${formId}-${color.name}`}
                                error={errors[color.name]?.message}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`${formId}-${color.name}`}
                                    type="color"
                                    aria-label={`${color.label} picker`}
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                                    disabled={disabled}
                                    value={watchedValues[color.name]}
                                    onChange={(e) =>
                                      setValue(color.name, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                  <Input
                                    aria-label={`${color.label} hex`}
                                    invalid={Boolean(errors[color.name])}
                                    className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2"
                                    disabled={disabled}
                                    value={watchedValues[color.name]}
                                    onChange={(e) =>
                                      setValue(color.name, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                </div>
                              </FormField>
                            </div>
                          ))}
                        </div>
                      </div>

                      {showPalettePresets ? (() => {
                        const tp = getTemplatePalette(landingTheme ?? "");
                        return tp ? (
                          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-2xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-5 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                                <div className="flex-1" style={{ backgroundColor: tp.primary }} />
                                <div className="flex-1" style={{ backgroundColor: tp.secondary }} />
                                <div className="flex-1" style={{ backgroundColor: tp.accent }} />
                              </div>
                              <span className="text-caption font-semibold text-muted-foreground truncate">
                                {tp.name} template default palette
                              </span>
                            </div>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => applyTemplatePalette(tp)}
                              className="shrink-0 rounded-lg border border-border bg-background px-3 py-1 text-caption font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50 transition-colors"
                            >
                              Reset to defaults
                            </button>
                          </div>
                        ) : null;
                      })() : null}

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Extended Colors (Text, Borders &amp; Backgrounds)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {WORKSPACE_EXTENDED_COLOR_FIELDS.map((color) => (
                            <div
                              key={color.name}
                              className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
                            >
                              <FormField
                                label={color.label}
                                htmlFor={`${formId}-${color.name}`}
                                error={errors[color.name as keyof typeof errors]?.message}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`${formId}-${color.name}`}
                                    type="color"
                                    aria-label={`${color.label} picker`}
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                                    disabled={disabled}
                                    value={watchedValues[color.name as keyof typeof watchedValues] as string}
                                    onChange={(e) =>
                                      setValue(color.name as any, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                  <Input
                                    aria-label={`${color.label} hex`}
                                    invalid={Boolean(errors[color.name as keyof typeof errors])}
                                    className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2"
                                    disabled={disabled}
                                    value={watchedValues[color.name as keyof typeof watchedValues] as string}
                                    onChange={(e) =>
                                      setValue(color.name as any, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                </div>
                              </FormField>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => toggleSection("palette")}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Done editing colors
                          </button>
                          <Button size="sm" type="submit" form={formId} loading={loading}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Typography & Styling */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("typography")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                        <PiSparkleBold className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Typography &amp; Styling</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Font family, card corner shapes, headings &amp; hero overlay
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {readOnly && onStartEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection("typography");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                        >
                          <PiPencilSimpleBold className="size-3.5 text-primary" />
                          <span>Edit typography</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={expandedSections["typography"] ? "Collapse typography" : "Expand typography"}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expandedSections["typography"] ? (
                          <PiCaretUpBold className="size-4" />
                        ) : (
                          <PiCaretDownBold className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSections["typography"] && (
                    <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Font family" htmlFor={`${formId}-font-family`}>
                          <DropdownWithCustomInput
                            id={`${formId}-font-family`}
                            options={FONT_FAMILY_OPTIONS}
                            disabled={disabled}
                            placeholder='"Inter","Plus Jakarta Sans",system-ui,sans-serif'
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm"
                            value={watchedValues.font_family ?? ""}
                            onChange={(v) =>
                              setValue("font_family", v, { shouldDirty: true, shouldValidate: true })
                            }
                          />
                        </FormField>

                        <FormField label="Card corners" htmlFor={`${formId}-card-style`}>
                          <DropdownWithCustomInput
                            id={`${formId}-card-style`}
                            options={CARD_STYLE_OPTIONS}
                            disabled={disabled}
                            placeholder="rounded-2xl"
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm"
                            value={watchedValues.card_style ?? ""}
                            onChange={(v) =>
                              setValue("card_style", v, { shouldDirty: true, shouldValidate: true })
                            }
                          />
                        </FormField>

                        <FormField label="Heading style" htmlFor={`${formId}-heading-class`}>
                          <Select
                            id={`${formId}-heading-class`}
                            disabled={disabled}
                            className="h-9 text-sm"
                            {...register("heading_class")}
                          >
                            {HEADING_CLASS_OPTIONS.map((h) => (
                              <option key={h.value} value={h.value}>
                                {h.label}
                              </option>
                            ))}
                          </Select>
                        </FormField>

                        <FormField label="Hero overlay" htmlFor={`${formId}-hero-overlay`}>
                          <DropdownWithCustomInput
                            id={`${formId}-hero-overlay`}
                            options={HERO_OVERLAY_OPTIONS}
                            disabled={disabled}
                            placeholder="linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))"
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm font-mono text-[10px]"
                            value={watchedValues.hero_overlay ?? ""}
                            onChange={(v) =>
                              setValue("hero_overlay", v, { shouldDirty: true, shouldValidate: true })
                            }
                          />
                        </FormField>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => toggleSection("typography")}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Done editing typography
                          </button>
                          <Button size="sm" type="submit" form={formId} loading={loading}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Text & Content Customisation */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("branding")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                        <PiTextAaBold className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Text &amp; Content Customisation</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Theme alias, currency, promotional badges, marquee strips &amp; hero tagline
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {readOnly && onStartEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection("branding");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                        >
                          <PiPencilSimpleBold className="size-3.5 text-primary" />
                          <span>Edit text</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={expandedSections["branding"] ? "Collapse text options" : "Expand text options"}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expandedSections["branding"] ? (
                          <PiCaretUpBold className="size-4" />
                        ) : (
                          <PiCaretDownBold className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSections["branding"] && (
                    <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Theme alias"
                          htmlFor={`${formId}-theme-colour`}
                          error={errors.theme_colour?.message}
                        >
                          <Input
                            id={`${formId}-theme-colour`}
                            invalid={Boolean(errors.theme_colour)}
                            disabled={disabled}
                            placeholder="e.g. Modern Bistro"
                            className="h-9 text-sm"
                            {...register("theme_colour")}
                          />
                        </FormField>

                        {currencies.length > 0 && (
                          <FormField label="Website currency" htmlFor={`${formId}-currency`}>
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
                              <option value="">Select Currency</option>
                              {currencies.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.code} ({c.symbol})
                                </option>
                              ))}
                            </Select>
                          </FormField>
                        )}

                        <FormField label="Badge text" htmlFor={`${formId}-theme-badge`}>
                          <DropdownWithCustomInput
                            id={`${formId}-theme-badge`}
                            options={THEME_BADGE_OPTIONS}
                            disabled={disabled}
                            placeholder="e.g. Curated · Modern · Delicious"
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm"
                            value={watchedValues.theme_badge ?? ""}
                            onChange={(v) =>
                              setValue("theme_badge", v, { shouldDirty: true, shouldValidate: true })
                            }
                          />
                        </FormField>

                        <FormField label="Marquee strip text" htmlFor={`${formId}-theme-marquee`}>
                          <DropdownWithCustomInput
                            id={`${formId}-theme-marquee`}
                            options={THEME_MARQUEE_OPTIONS}
                            disabled={disabled}
                            placeholder="e.g. Bento Style · Modern Dining"
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm"
                            value={watchedValues.theme_marquee ?? ""}
                            onChange={(v) =>
                              setValue("theme_marquee", v, { shouldDirty: true, shouldValidate: true })
                            }
                          />
                        </FormField>

                        <div className="md:col-span-2">
                          <FormField label="Hero tagline" htmlFor={`${formId}-hero-tagline`}>
                            <DropdownWithCustomInput
                              id={`${formId}-hero-tagline`}
                              options={HERO_TAGLINE_OPTIONS}
                              disabled={disabled}
                              placeholder="e.g. Fresh flavours, made with care"
                              selectClassName="h-9 text-sm"
                              inputClassName="h-9 text-sm"
                              value={watchedValues.hero_tagline ?? ""}
                              onChange={(v) =>
                                setValue("hero_tagline", v, { shouldDirty: true, shouldValidate: true })
                              }
                            />
                          </FormField>
                        </div>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => toggleSection("branding")}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Done editing text
                          </button>
                          <Button size="sm" type="submit" form={formId} loading={loading}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Section Visibility */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("visibility")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                        <PiEyeBold className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Section Visibility</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Turn on or off landing page action buttons and promotional sections
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {readOnly && onStartEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection("visibility");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                        >
                          <PiPencilSimpleBold className="size-3.5 text-primary" />
                          <span>Edit visibility</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={expandedSections["visibility"] ? "Collapse visibility" : "Expand visibility"}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expandedSections["visibility"] ? (
                          <PiCaretUpBold className="size-4" />
                        ) : (
                          <PiCaretDownBold className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSections["visibility"] && (
                    <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {WORKSPACE_TOGGLE_OPTIONS.filter((t) => t.id !== "announcement_enabled").map(
                          (toggle) => (
                            <ToggleCard
                              key={toggle.id}
                              checked={Boolean(watchedValues[toggle.id])}
                              onChange={(checked) =>
                                setValue(toggle.id as WorkspaceToggleKey, checked, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                })
                              }
                              label={toggle.label}
                              disabled={disabled}
                              className="p-3 shadow-2xs"
                            />
                          )
                        )}
                      </div>

                      {!readOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => toggleSection("visibility")}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Done editing visibility
                          </button>
                          <Button size="sm" type="submit" form={formId} loading={loading}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MENU PAGE DESIGN ──────────────────────────────────────────────── */}
      {section === "menu" && (
        <div className="space-y-4">
          {/* Main Layout Section */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <PiSquaresFourBold className="size-5" />
                </div>
                <div>
                  <h3 className="text-h3 text-foreground">Menu Page Layout</h3>
                  <p className="text-caption text-muted-foreground">
                    Menu layout style and category navigation structure
                  </p>
                </div>
              </div>
              {readOnly && onStartEditing && (
                <button
                  type="button"
                  onClick={() => onStartEditing("layout")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  <PiPencilSimpleBold className="size-3.5 text-primary" />
                  <span>Edit layout</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Menu layout"
                htmlFor={`${formId}-menu-layout`}
                error={errors.menu_theme?.message}
              >
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

              <FormField
                label="Menu structure"
                htmlFor={`${formId}-menu-structure`}
                error={errors.menu_structure?.message}
              >
                <Select
                  id={`${formId}-menu-structure`}
                  invalid={Boolean(errors.menu_structure)}
                  disabled={disabled}
                  className="h-9 text-sm"
                  {...register("menu_structure")}
                >
                  {MENU_STRUCTURE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </section>

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

            {/* Content only rendered when Additional Information is expanded */}
            {isAdditionalInfoOpen && (
              <div className="space-y-3 pt-1 transition-all">
                {/* 1. Menu Brand & Extended Palette */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("menu-palette")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                        <PiPaletteBold className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Menu Brand &amp; Extended Palette</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Menu highlights, item surfaces, text &amp; card borders
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {readOnly && onStartEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection("menu-palette");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                        >
                          <PiPencilSimpleBold className="size-3.5 text-primary" />
                          <span>Edit colors</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={
                          expandedSections["menu-palette"]
                            ? "Collapse menu palette"
                            : "Expand menu palette"
                        }
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expandedSections["menu-palette"] ? (
                          <PiCaretUpBold className="size-4" />
                        ) : (
                          <PiCaretDownBold className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSections["menu-palette"] && (
                    <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Core Menu Colors
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {MENU_COLOR_FIELDS.map((color) => (
                            <div
                              key={color.name}
                              className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
                            >
                              <FormField
                                label={color.label}
                                htmlFor={`${formId}-${color.name}`}
                                error={errors[color.name as keyof typeof errors]?.message}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`${formId}-${color.name}`}
                                    type="color"
                                    aria-label={`${color.label} picker`}
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                                    disabled={disabled}
                                    value={
                                      (watchedValues[color.name as keyof typeof watchedValues] as string) ||
                                      "#000000"
                                    }
                                    onChange={(e) =>
                                      setValue(color.name as any, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                  <Input
                                    aria-label={`${color.label} hex`}
                                    invalid={Boolean(errors[color.name as keyof typeof errors])}
                                    className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2"
                                    disabled={disabled}
                                    value={
                                      (watchedValues[color.name as keyof typeof watchedValues] as string) ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setValue(color.name as any, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                </div>
                              </FormField>
                            </div>
                          ))}
                        </div>
                      </div>

                      {(() => {
                        const mp = getTemplatePalette(menuTheme ?? "");
                        return mp ? (
                          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-2xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-5 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                                <div className="flex-1" style={{ backgroundColor: mp.primary }} />
                                <div className="flex-1" style={{ backgroundColor: mp.secondary }} />
                                <div className="flex-1" style={{ backgroundColor: mp.accent }} />
                              </div>
                              <span className="text-caption font-semibold text-muted-foreground truncate">
                                {mp.name} template default palette
                              </span>
                            </div>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => applyMenuTemplatePalette(mp)}
                              className="shrink-0 rounded-lg border border-border bg-background px-3 py-1 text-caption font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50 transition-colors"
                            >
                              Reset to defaults
                            </button>
                          </div>
                        ) : null;
                      })()}

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Extended Menu Colors (Text, Borders &amp; Backgrounds)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {MENU_EXTENDED_COLOR_FIELDS.map((color) => (
                            <div
                              key={color.name}
                              className="space-y-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs"
                            >
                              <FormField
                                label={color.label}
                                htmlFor={`${formId}-${color.name}`}
                                error={errors[color.name as keyof typeof errors]?.message}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    id={`${formId}-${color.name}`}
                                    type="color"
                                    aria-label={`${color.label} picker`}
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1"
                                    disabled={disabled}
                                    value={
                                      (watchedValues[color.name as keyof typeof watchedValues] as string) ||
                                      "#000000"
                                    }
                                    onChange={(e) =>
                                      setValue(color.name as any, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                  <Input
                                    aria-label={`${color.label} hex`}
                                    invalid={Boolean(errors[color.name as keyof typeof errors])}
                                    className="min-w-0 flex-1 font-mono text-[10px] font-bold uppercase h-8 px-2"
                                    disabled={disabled}
                                    value={
                                      (watchedValues[color.name as keyof typeof watchedValues] as string) ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setValue(color.name as any, e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }
                                  />
                                </div>
                              </FormField>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => toggleSection("menu-palette")}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Done editing colors
                          </button>
                          <Button size="sm" type="submit" form={formId} loading={loading}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Menu Typography & Styling */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleSection("menu-typography")}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                        <PiSparkleBold className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">Menu Typography &amp; Styling</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Font family &amp; item card corners for dishes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {readOnly && onStartEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection("menu-typography");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                        >
                          <PiPencilSimpleBold className="size-3.5 text-primary" />
                          <span>Edit typography</span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={
                          expandedSections["menu-typography"]
                            ? "Collapse menu typography"
                            : "Expand menu typography"
                        }
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expandedSections["menu-typography"] ? (
                          <PiCaretUpBold className="size-4" />
                        ) : (
                          <PiCaretDownBold className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedSections["menu-typography"] && (
                    <div className="p-4 border-t border-border/60 bg-muted/10 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Font family" htmlFor={`${formId}-menu-font-family`}>
                          <DropdownWithCustomInput
                            id={`${formId}-menu-font-family`}
                            options={FONT_FAMILY_OPTIONS}
                            disabled={disabled}
                            placeholder='"Inter","Plus Jakarta Sans",system-ui,sans-serif'
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm"
                            value={watchedValues.menu_font_family ?? ""}
                            onChange={(v) =>
                              setValue("menu_font_family", v, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          />
                        </FormField>

                        <FormField label="Card corners" htmlFor={`${formId}-menu-card-style`}>
                          <DropdownWithCustomInput
                            id={`${formId}-menu-card-style`}
                            options={CARD_STYLE_OPTIONS}
                            disabled={disabled}
                            placeholder="rounded-2xl"
                            selectClassName="h-9 text-sm"
                            inputClassName="h-9 text-sm"
                            value={watchedValues.menu_card_style ?? ""}
                            onChange={(v) =>
                              setValue("menu_card_style", v, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          />
                        </FormField>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <button
                            type="button"
                            onClick={() => toggleSection("menu-typography")}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Done editing typography
                          </button>
                          <Button size="sm" type="submit" form={formId} loading={loading}>
                            Save changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
