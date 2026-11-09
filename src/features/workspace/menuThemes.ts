import type { MenuColorKey } from "@/types/workspace.types";

/** Roles a menu colour can play. Same keys as the template palettes use. */
export type ColourRole =
  | "primary"
  | "secondary"
  | "accent"
  | "textPrimary"
  | "textSecondary"
  | "accentText"
  | "borderColor"
  | "footerBg"
  | "sectionBg";

export type ColourSet = Record<ColourRole, string>;

export interface MenuColourTheme {
  id: string;
  name: string;
  colors: ColourSet;
}

/** The form field each colour role is stored in. */
export const ROLE_FIELD: Record<ColourRole, MenuColorKey> = {
  primary: "menu_primary_color",
  secondary: "menu_secondary_color",
  accent: "menu_accent_color",
  textPrimary: "menu_text_primary_color",
  textSecondary: "menu_text_secondary_color",
  accentText: "menu_accent_text_color",
  borderColor: "menu_border_color",
  footerBg: "menu_footer_bg_color",
  sectionBg: "menu_section_bg_color",
};

/** Same roles, as stored for the landing page. */
export const LANDING_ROLE_FIELD: Record<ColourRole, string> = {
  primary: "primary_color",
  secondary: "secondary_color",
  accent: "accent_color",
  textPrimary: "text_primary_color",
  textSecondary: "text_secondary_color",
  accentText: "accent_text_color",
  borderColor: "border_color",
  footerBg: "footer_bg_color",
  sectionBg: "section_bg_color",
};

export type RoleFieldMap = Record<ColourRole, string>;

const ROLES = Object.keys(ROLE_FIELD) as ColourRole[];

// Each set is balanced as a whole: readable text on the page and cards, a highlight colour that
// stands out on cards, and button text that reads on the highlight colour.
export const MENU_COLOUR_THEMES: MenuColourTheme[] = [
  { id: "warm-cream", name: "Warm Cream", colors: { accent: "#fdf6e9", secondary: "#ffffff", sectionBg: "#f6ead2", primary: "#c2410c", textPrimary: "#2b1d0e", textSecondary: "#6b5844", accentText: "#ffffff", borderColor: "#e8d9bd", footerBg: "#2b1d0e" } },
  { id: "fresh-green", name: "Fresh Green", colors: { accent: "#f3f8f1", secondary: "#ffffff", sectionBg: "#e4efe0", primary: "#2f7d4f", textPrimary: "#14301f", textSecondary: "#4c6b57", accentText: "#ffffff", borderColor: "#cfe0d3", footerBg: "#14301f" } },
  { id: "ocean-blue", name: "Ocean Blue", colors: { accent: "#f1f6fb", secondary: "#ffffff", sectionBg: "#e1ecf7", primary: "#1d5fb4", textPrimary: "#0f2540", textSecondary: "#4a6280", accentText: "#ffffff", borderColor: "#cbdcee", footerBg: "#0f2540" } },
  { id: "sunset", name: "Sunset", colors: { accent: "#fff7f0", secondary: "#ffffff", sectionBg: "#ffe8d6", primary: "#e8590c", textPrimary: "#3b1d0a", textSecondary: "#7c5538", accentText: "#ffffff", borderColor: "#f6d5bb", footerBg: "#3b1d0a" } },
  { id: "berry", name: "Berry", colors: { accent: "#fbf3f7", secondary: "#ffffff", sectionBg: "#f5e1ea", primary: "#a3194f", textPrimary: "#34101f", textSecondary: "#7a4a5c", accentText: "#ffffff", borderColor: "#ecd0db", footerBg: "#34101f" } },
  { id: "lavender", name: "Lavender", colors: { accent: "#f6f4fc", secondary: "#ffffff", sectionBg: "#e9e4f8", primary: "#6d4ac7", textPrimary: "#201438", textSecondary: "#62577e", accentText: "#ffffff", borderColor: "#d9d1f0", footerBg: "#201438" } },
  { id: "clean-slate", name: "Clean Slate", colors: { accent: "#f6f7f9", secondary: "#ffffff", sectionBg: "#eceef2", primary: "#111827", textPrimary: "#111827", textSecondary: "#5b6472", accentText: "#ffffff", borderColor: "#dde0e6", footerBg: "#111827" } },
  { id: "midnight", name: "Midnight", colors: { accent: "#0f172a", secondary: "#1e293b", sectionBg: "#182236", primary: "#38bdf8", textPrimary: "#f1f5f9", textSecondary: "#a3b1c6", accentText: "#0b1220", borderColor: "#2b3a52", footerBg: "#020617" } },
  { id: "charcoal-gold", name: "Charcoal & Gold", colors: { accent: "#16130e", secondary: "#231e16", sectionBg: "#2d261b", primary: "#d4a853", textPrimary: "#f5ecd9", textSecondary: "#bfb299", accentText: "#16130e", borderColor: "#43392a", footerBg: "#0c0a07" } },
  { id: "forest-night", name: "Forest Night", colors: { accent: "#0f1a14", secondary: "#17261d", sectionBg: "#1e3226", primary: "#5fbf8a", textPrimary: "#e8f5ec", textSecondary: "#a2c2ae", accentText: "#0a140e", borderColor: "#2e4a39", footerBg: "#08110b" } },
];

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
