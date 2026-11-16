import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LANDING_THEME_DATA } from "@/components/templates/landing/_shared/themeData";
import { ART_MOTIFS } from "@/components/templates/sections/art/motifs";
import { contrastRatio } from "@/utils/contrast";
import { SKIN_FAMILIES, AMENITY_IDS, type IconStyle } from "../types";
import { SKINS, LEGACY_FAMILY, FAMILY_DEFAULTS, getSkin, resolveSiteSkin, ownerPaletteFromSettings, FALLBACK_SKIN_ID } from ".";
import { FLAGSHIP_SKINS } from "./flagship";
import { GLYPHS, GLYPH_GROUPS, getGlyph } from "../icons/glyphs";
import { SiteIcon } from "../icons/SiteIcon";
import { FRAME_IDS, CORNER_IDS, TEXTURE_IDS, OrnamentCorner, frameStyle, textureBackground } from "../ornaments";

describe("skin catalogue", () => {
  it("has 79 skins with unique ids: 12 flagship (one per family) + 67 converted (46 retired for contrast)", () => {
    expect(SKINS).toHaveLength(79);
    expect(new Set(SKINS.map((s) => s.id)).size).toBe(79);
    expect(FLAGSHIP_SKINS).toHaveLength(12);
    expect(new Set(FLAGSHIP_SKINS.map((s) => s.family))).toEqual(new Set(SKIN_FAMILIES));
  });

  it("every existing style template has a family, and the table names no unknown template", () => {
    const slugs = Object.keys(LANDING_THEME_DATA);
    expect(slugs).toHaveLength(67);
    expect(slugs.filter((s) => !LEGACY_FAMILY[s])).toEqual([]);
    expect(Object.keys(LEGACY_FAMILY).filter((s) => !LANDING_THEME_DATA[s])).toEqual([]);
  });

  it("a converted skin reproduces its template's colours, fonts and overlay exactly", () => {
    for (const theme of Object.values(LANDING_THEME_DATA)) {
      const skin = getSkin(`legacy-${theme.slug}`)!;
      expect(skin.palette, theme.slug).toEqual({
        bg: theme.bg,
        surface: theme.surface,
        accent: theme.accent,
        accentText: theme.accentText,
        text: theme.textPrimary,
        textMuted: theme.textSecondary,
        border: theme.border,
        band: theme.sectionBg ?? theme.surface,
        footer: theme.footerBg ?? theme.bg,
      });
      expect(skin.fonts.body).toBe(theme.fontFamily);
      expect(skin.heroOverlay).toBe(theme.heroOverlay);
      expect(skin.headingClass).toBe(theme.headingClass ?? "");
      expect(skin.legacyThemeSlug).toBe(theme.slug);
    }
  });

  it("every family's ornaments and textures exist", () => {
    const motifs = new Set(ART_MOTIFS.map((m) => m.value));
    for (const [family, d] of Object.entries(FAMILY_DEFAULTS)) {
      expect(motifs.has(d.ornaments.divider), `${family} divider`).toBe(true);
      expect((FRAME_IDS as readonly string[]).includes(d.ornaments.frame), `${family} frame`).toBe(true);
      expect((CORNER_IDS as readonly string[]).includes(d.ornaments.corner), `${family} corner`).toBe(true);
      expect((TEXTURE_IDS as readonly string[]).includes(d.texture), `${family} texture`).toBe(true);
    }
  });
});

describe("skin adapter (existing sites keep their look)", () => {
  it("uses skin_id when set and known", () => {
    expect(resolveSiteSkin({ skin_id: "royal-velvet", landing_theme: "maximalism" }).id).toBe("royal-velvet");
  });
  it("falls back to the saved style template, then to the default", () => {
    expect(resolveSiteSkin({ skin_id: "", landing_theme: "serif-elegance" }).id).toBe("legacy-serif-elegance");
    expect(resolveSiteSkin({ skin_id: "no-such-skin", landing_theme: "serif-elegance" }).id).toBe("legacy-serif-elegance");
    expect(resolveSiteSkin({ landing_theme: "1" }).id).toBe(FALLBACK_SKIN_ID);
    expect(resolveSiteSkin(null).id).toBe(FALLBACK_SKIN_ID);
  });
  it("the menu page prefers menu_skin_id, then skin_id, then menu_theme", () => {
    expect(resolveSiteSkin({ menu_skin_id: "orbit", skin_id: "royal-velvet" }, "menu").id).toBe("orbit");
    expect(resolveSiteSkin({ skin_id: "royal-velvet", menu_theme: "maximalism" }, "menu").id).toBe("royal-velvet");
    expect(resolveSiteSkin({ menu_theme: "maximalism", landing_theme: "swiss-international" }, "menu").id).toBe("legacy-maximalism");
  });
  it("owner colours map onto palette roles the same way the live page merges them", () => {
    expect(ownerPaletteFromSettings({ primary_color: "#111111", secondary_color: "#222222", accent_color: "#333333", footer_bg_color: "" })).toEqual({
      accent: "#111111", surface: "#222222", bg: "#333333",
      accentText: undefined, text: undefined, textMuted: undefined, border: undefined, band: undefined, footer: undefined,
    });
    expect(ownerPaletteFromSettings({ menu_primary_color: "#abcdef", primary_color: "#111111" }, "menu").accent).toBe("#abcdef");
  });
});


function contrastProblems(p: (typeof SKINS)[number]["palette"]): string[] {
  const checks: Array<[string, string, string]> = [
    ["text on page", p.text, p.bg],
    ["supporting text on page", p.textMuted, p.bg],
    ["button text", p.accentText, p.accent],
    ["text on cards", p.text, p.surface],
  ];
  return checks
    .map(([name, fg, bg]) => [name, contrastRatio(fg, bg)] as const)
    .filter(([, ratio]) => ratio === null || ratio < 4.5)
    .map(([name, ratio]) => `${name} ${ratio === null ? "unreadable colour" : ratio.toFixed(2)}`);
}

describe("contrast (WCAG AA 4.5:1)", () => {
  it.each(FLAGSHIP_SKINS.map((s) => [s.id, s] as const))("flagship %s passes every check", (_id, skin) => {
    expect(contrastProblems(skin.palette)).toEqual([]);
  });

  // The templates that failed were retired (2026-11-15); every remaining one must pass.
  it("every converted template passes every check", () => {
    const failing = SKINS.filter((s) => s.id.startsWith("legacy-") && contrastProblems(s.palette).length).map((s) => s.id);
    expect(failing).toEqual([]);
  });
});

const STYLES: IconStyle[] = ["line", "fine-line", "filled", "duotone", "neon", "engraved", "hand-drawn", "pixel"];

describe("icons", () => {
  it("draws 24 site, 20 amenity and 20 dietary icons (catalogue icons: businessTypes.test)", () => {
    expect(GLYPH_GROUPS.ui).toHaveLength(24);
    expect(GLYPH_GROUPS.amenities).toHaveLength(20);
    expect(GLYPH_GROUPS.dietary).toHaveLength(20);
  });

  it("every amenity and every EU allergen has an icon", () => {
    for (const id of AMENITY_IDS) expect(getGlyph(id), id).not.toBeNull();
    for (const id of ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"]) {
      expect(getGlyph(id), id).not.toBeNull();
    }
  });

  it("no drawing contains a broken number", () => {
    for (const [name, g] of Object.entries(GLYPHS)) {
      for (const d of [g.o, g.f, g.d, g.s].filter(Boolean) as string[]) {
        expect(d, name).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });

  it.each(STYLES)("every icon renders in the %s style", (style) => {
    for (const name of Object.keys(GLYPHS)) {
      const html = renderToStaticMarkup(<SiteIcon name={name} iconStyle={style} />);
      expect(html, `${name}/${style}`).toContain(`data-icon-style="${style}"`);
    }
  });

  it("is decorative without a title and announced with one", () => {
    expect(renderToStaticMarkup(<SiteIcon name="wifi" />)).toContain('aria-hidden="true"');
    const titled = renderToStaticMarkup(<SiteIcon name="wifi" title="Free Wi-Fi" />);
    expect(titled).toContain('aria-label="Free Wi-Fi"');
    expect(titled).toContain("<title>Free Wi-Fi</title>");
  });

  it("an unknown name renders nothing instead of a broken icon", () => {
    expect(renderToStaticMarkup(<SiteIcon name="no-such-icon" />)).toBe("");
  });
});

describe("ornaments", () => {
  const palette = { accent: "#6E1F3F", border: "#D8C49A", text: "#24121F" };
  it("every frame and texture produces styles; every corner but none draws", () => {
    for (const f of FRAME_IDS) expect(Object.keys(frameStyle(f, palette)).length, f).toBeGreaterThan(0);
    for (const t of TEXTURE_IDS) {
      const css = textureBackground(t, palette);
      if (t === "none") expect(css).toEqual({});
      else expect(css.backgroundImage, t).toBeTruthy();
    }
    for (const c of CORNER_IDS) {
      const html = renderToStaticMarkup(<OrnamentCorner corner={c} />);
      if (c === "none") expect(html).toBe("");
      else expect(html, c).toContain("<path");
    }
  });
});
