import { ROLE_FIELD } from "./menuThemes";
import { resolvePartByColour } from "./studio/resolvePart";
import type { MenuColorKey, WorkspacePalette } from "@/types/workspace.types";

/** The parts of the guest menu page an owner can tap in the preview and restyle. */
export type MenuPartId = "page" | "header" | "card" | "text" | "accent";

export type MenuControl =
  | { kind: "color"; name: MenuColorKey; label: string; hint: string; paletteKey: keyof WorkspacePalette }
  | { kind: "font"; name: "menu_font_family"; label: string; hint: string; paletteKey: "fontFamily" }
  | { kind: "shape"; name: "menu_card_style"; label: string; hint: string; paletteKey: "cardStyle" };

export interface MenuPartConfig {
  id: MenuPartId;
  label: string;
  summary: string;
  controls: MenuControl[];
}

export const MENU_PARTS: MenuPartConfig[] = [
  {
    id: "page",
    label: "Page",
    summary: "The background guests scroll over, and the footer.",
    controls: [
      { kind: "color", name: "menu_accent_color", label: "Page background", hint: "Behind everything", paletteKey: "accent" },
      { kind: "color", name: "menu_footer_bg_color", label: "Footer background", hint: "Bottom of the page", paletteKey: "footerBg" },
    ],
  },
  {
    id: "header",
    label: "Bars & headers",
    summary: "The top bar, category headers and the lines between things.",
    controls: [
      { kind: "color", name: "menu_secondary_color", label: "Bar background", hint: "Header and category bars", paletteKey: "secondary" },
      { kind: "color", name: "menu_border_color", label: "Lines", hint: "Borders and dividers", paletteKey: "borderColor" },
    ],
  },
  {
    id: "card",
    label: "Dish cards",
    summary: "The card each dish sits on.",
    controls: [
      { kind: "color", name: "menu_section_bg_color", label: "Card background", hint: "Behind each dish", paletteKey: "sectionBg" },
      { kind: "shape", name: "menu_card_style", label: "Card shape", hint: "Corners and shadow", paletteKey: "cardStyle" },
    ],
  },
  {
    id: "text",
    label: "Text",
    summary: "The typeface and the colours of dish names and descriptions.",
    controls: [
      { kind: "font", name: "menu_font_family", label: "Typeface", hint: "Used across the whole menu", paletteKey: "fontFamily" },
      { kind: "color", name: "menu_text_primary_color", label: "Dish names", hint: "Main text", paletteKey: "textPrimary" },
      { kind: "color", name: "menu_text_secondary_color", label: "Descriptions", hint: "Supporting text", paletteKey: "textSecondary" },
    ],
  },
  {
    id: "accent",
    label: "Prices & buttons",
    summary: "The colour that draws the eye: prices, highlights and the Pay bill button.",
    controls: [
      { kind: "color", name: "menu_primary_color", label: "Highlight colour", hint: "Prices, category titles, buttons", paletteKey: "primary" },
      { kind: "color", name: "menu_accent_text_color", label: "Text on buttons", hint: "Label inside the Pay bill button", paletteKey: "accentText" },
    ],
  },
];

export function getMenuPart(id: MenuPartId): MenuPartConfig {
  return MENU_PARTS.find((p) => p.id === id) ?? MENU_PARTS[0];
}

type Values = Record<string, unknown>;

const norm = (v: unknown): string => (typeof v === "string" ? v : "").trim().toLowerCase();

/** True when any control in the part differs from the template's own palette. */
export function isPartCustomised(part: MenuPartConfig, values: Values, palette: WorkspacePalette | null | undefined): boolean {
  if (!palette) return false;
  return part.controls.some((c) => {
    const base = palette[c.paletteKey];
    if (base == null) return false;
    return norm(values[c.name]) !== norm(base);
  });
}

const MENU_RESOLVE_SPEC = {
  fields: ROLE_FIELD,
  textPart: "text",
  accentPart: "accent",
  // Ties resolve card first, then bars, then the page behind them.
  backgrounds: [
    { role: "sectionBg", part: "card" },
    { role: "secondary", part: "header" },
    { role: "accent", part: "page" },
  ],
  fallback: "page",
  knownParts: MENU_PARTS.map((p) => p.id as string),
} as const;

/** Which part of the menu page the owner tapped in the preview. */
export function resolveMenuPart(target: Element, values: Values): MenuPartId {
  return resolvePartByColour(target, values, {
    ...MENU_RESOLVE_SPEC,
    backgrounds: [...MENU_RESOLVE_SPEC.backgrounds],
    knownParts: [...MENU_RESOLVE_SPEC.knownParts],
  }) as MenuPartId;
}
