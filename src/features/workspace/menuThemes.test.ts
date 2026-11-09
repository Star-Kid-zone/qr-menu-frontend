import { describe, expect, it } from "vitest";
import { MENU_COLOUR_THEMES, findActiveTheme, swatchOptions, themeToValues } from "./menuThemes";

describe("menu colour themes", () => {
  it("sets all nine menu colour fields", () => {
    const values = themeToValues(MENU_COLOUR_THEMES[0]);
    expect(Object.keys(values)).toHaveLength(9);
    expect(values.menu_primary_color).toBe(MENU_COLOUR_THEMES[0].colors.primary);
  });

  it("finds the active theme only when every colour matches", () => {
    const theme = MENU_COLOUR_THEMES[1];
    const values = themeToValues(theme);
    expect(findActiveTheme(values)?.id).toBe(theme.id);
    expect(findActiveTheme({ ...values, menu_primary_color: "#123456" })).toBeUndefined();
  });

  it("matches colours regardless of case", () => {
    const values = Object.fromEntries(
      Object.entries(themeToValues(MENU_COLOUR_THEMES[2])).map(([k, v]) => [k, v.toUpperCase()])
    );
    expect(findActiveTheme(values)?.id).toBe(MENU_COLOUR_THEMES[2].id);
  });

  it("offers de-duplicated swatches per role", () => {
    const options = swatchOptions("secondary");
    const values = options.map((o) => o.value.toLowerCase());
    expect(new Set(values).size).toBe(values.length);
    expect(options.length).toBeGreaterThan(1);
  });

  it("has unique theme ids", () => {
    const ids = MENU_COLOUR_THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
