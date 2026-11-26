import { ROLE_FIELD } from "./menuThemes";
import { resolvePartByColour } from "./studio/resolvePart";
import { MENU_PARTS as CONST_MENU_PARTS } from "@/constants/workspace.constants";
import type { MenuColorKey, WorkspacePalette } from "@/types/admin/workspace/workspace.types";

/** The parts of the guest menu page an owner can tap in the preview and restyle. */
export type MenuPartId = "page" | "header" | "card" | "text" | "accent";

type MenuControl =
  | { kind: "color"; name: MenuColorKey; label: string; hint: string; paletteKey: keyof WorkspacePalette }
  | { kind: "font"; name: "menu_font_family"; label: string; hint: string; paletteKey: "fontFamily" }
  | { kind: "shape"; name: "menu_card_style"; label: string; hint: string; paletteKey: "cardStyle" };

export interface MenuPartConfig {
  id: MenuPartId;
  label: string;
  summary: string;
  controls: readonly MenuControl[];
}

export const MENU_PARTS: readonly MenuPartConfig[] = CONST_MENU_PARTS;

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
