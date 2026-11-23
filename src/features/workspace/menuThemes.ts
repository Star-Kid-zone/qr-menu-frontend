import type { MenuColorKey } from "@/types/admin/workspace/workspace.types";
import {
  type ColourRole,
  type ColourSet,
  type MenuColourTheme,
  ROLE_FIELD,
  LANDING_ROLE_FIELD,
  MENU_COLOUR_THEMES,
} from "@/constants/workspace.constants";

export {
  type ColourRole,
  type ColourSet,
  type MenuColourTheme,
  ROLE_FIELD,
  LANDING_ROLE_FIELD,
  MENU_COLOUR_THEMES,
};

export type RoleFieldMap = Record<ColourRole, string>;

const ROLES = Object.keys(ROLE_FIELD) as ColourRole[];

const same = (a: unknown, b: unknown): boolean =>
  typeof a === "string" && typeof b === "string" && a.trim().toLowerCase() === b.trim().toLowerCase();

/** The form values a theme sets: all nine colours for a page, and nothing else. */
export function themeToValues(theme: MenuColourTheme, fields: RoleFieldMap = ROLE_FIELD): Record<string, string> {
  return Object.fromEntries(ROLES.map((r) => [fields[r], theme.colors[r]]));
}

/** The theme whose nine colours all match the current values, if any. */
export function findActiveTheme(
  values: Record<string, unknown>,
  fields: RoleFieldMap = ROLE_FIELD
): MenuColourTheme | undefined {
  return MENU_COLOUR_THEMES.find((t) => ROLES.every((r) => same(values[fields[r]], t.colors[r])));
}

export interface SwatchOption {
  value: string;
  label: string;
}

/** Swatches offered for one colour role: that role's colour from every theme, duplicates removed. */
export function swatchOptions(role: ColourRole): SwatchOption[] {
  const seen = new Set<string>();
  const out: SwatchOption[] = [];
  for (const t of MENU_COLOUR_THEMES) {
    const key = t.colors[role].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ value: t.colors[role], label: t.name });
  }
  return out;
}
