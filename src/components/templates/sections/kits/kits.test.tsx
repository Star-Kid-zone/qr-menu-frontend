import { getBusinessType, KIT_BUSINESS_TYPE } from "@/components/site-system/business-types";
import { getSkin } from "@/components/site-system/skins";
import { LAYOUT_MAP } from "../layouts/registry";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { workspaceSettingsSchema } from "@/schemas/workspace.schema";
import { getDefaultWorkspaceSettings } from "@/utils/workspace.utils";
import BaseTemplate from "@/components/templates/landing/_shared/BaseTemplate";
import { LANDING_THEME_DATA } from "@/components/templates/landing/_shared/themeData";
import type { LandingTemplateProps } from "@/types/public/templates/rawPublicSiteData.types";
import { KitPicker } from "@/features/workspace/components/KitPicker";
import { LANDING_SECTION_MAP } from "../landing/registry";
import { ART_MOTIF_MAP } from "../art/motifs";
import { kitFormValues, kitRecipe, RESTAURANT_KITS } from "./kits";

describe.each(RESTAURANT_KITS.map((k) => [k.label, k] as const))("kit: %s", (_label, kit) => {
  it("is a recipe: a known business type with a real layout and style", () => {
    const recipe = kitRecipe(kit);
    expect(getBusinessType(recipe.businessType)?.id).toBe(KIT_BUSINESS_TYPE[kit.id]);
    expect(LAYOUT_MAP.has(recipe.layout)).toBe(true);
    expect(getSkin(recipe.skinId)?.id).toBe(recipe.skinId);
  });

  it("applying it sets the type, layout and style, leaves the menu matching the layout, and sets no old template", () => {
    const v = kitFormValues(kit, { hero_tagline: "", theme_badge: "", theme_marquee: "" });
    const recipe = kitRecipe(kit);
    expect(v).toMatchObject({ business_type: recipe.businessType, landing_structure: recipe.layout, skin_id: recipe.skinId, menu_structure: "", landing_theme: "" });
    expect(v.primary_color).toBe(getSkin(recipe.skinId)!.palette.accent);
    expect(v.hero_tagline).toBe(kit.copy.tagline);
  });
  it("has a valid section list: known types, unique ids, real motifs, and a hero + footer", () => {
    const ids = kit.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of kit.sections) {
      expect(LANDING_SECTION_MAP.has(s.type)).toBe(true);
      expect(s.id).toMatch(/^[a-z0-9][a-z0-9_-]{0,39}$/);
      if (s.type === "divider") expect(ART_MOTIF_MAP.has(s.variant!)).toBe(true);
      else if (s.variant) expect(LANDING_SECTION_MAP.get(s.type)!.variants?.some((v) => v.value === s.variant)).toBe(true);
    }
    const shown = kit.sections.filter((s) => !s.hidden).map((s) => s.type);
    expect(shown).toContain("hero");
    expect(shown).toContain("footer");
  });

  it("never hides a content section (owners' content shows in every look) and includes every one", () => {
    expect(kit.sections.filter((x) => x.hidden)).toEqual([]);
    const types = new Set(kit.sections.map((x) => x.type));
    for (const t of ["announcement", "hero", "marquee", "stats", "story", "signature-dishes", "popular-items", "offers", "gallery", "reviews", "visit", "faq", "footer"]) {
      expect(types.has(t)).toBe(true);
    }
  });

  it("produces form values the settings form accepts", () => {
    const merged = { ...getDefaultWorkspaceSettings(), ...kitFormValues(kit, { hero_tagline: "", theme_badge: "", theme_marquee: "" }) };
    expect(workspaceSettingsSchema.safeParse(merged).success).toBe(true);
  });
});

describe("kitFormValues", () => {
  it("fills starter wording only where the owner left it empty", () => {
    const kit = RESTAURANT_KITS[0];
    const out = kitFormValues(kit, { hero_tagline: "Our own words", theme_badge: "", theme_marquee: "  " });
    expect(out.hero_tagline).toBeUndefined();
    expect(out.theme_badge).toBe(kit.copy.badge);
    expect(out.theme_marquee).toBe(kit.copy.marquee);
  });

  it("uses the business type's first recommended layout (a designed layout, not the default page)", () => {
    expect(kitFormValues(RESTAURANT_KITS[0], { hero_tagline: "", theme_badge: "", theme_marquee: "" }).landing_structure).toBe(kitRecipe(RESTAURANT_KITS[0]).layout);
  });
});

describe("dividers on the guest page", () => {
  const Link: LandingTemplateProps["LinkComponent"] = ({ to, children }) => <a href={to}>{children}</a>;
  const html = (siteDocument: unknown) =>
    renderToStaticMarkup(
      <BaseTemplate
        theme={LANDING_THEME_DATA["swiss-international"]}
        data={{ user_id: '1', settings: { site_document: siteDocument }, business: null, payment: null, review: null, gallery: [], offers: [], menuItems: [] }}
        routeSlug="vimal"
        menuHref="/menu"
        onPay={() => {}}
        onReview={() => {}}
        track={() => {}}
        LinkComponent={Link}
      />,
    );

  it("are hidden for sites that never chose them, and drawn (decoratively) when a kit adds them", () => {
    expect(html(null)).not.toContain('data-section-type="divider"');
    const kit = RESTAURANT_KITS.find((k) => k.id === "arabian-mandi")!;
    const out = html({ version: 1, landing: { sections: kit.sections }, kit: kit.id });
    expect((out.match(/data-section-type="divider"/g) ?? []).length).toBe(2);
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain("url(#divider-divider)");
    expect(out).toContain("url(#divider-divider-2)");
  });
});

describe("KitPicker", () => {
  it("applies a kit only after confirmation and marks the active kit", async () => {
    const onApply = vi.fn();
    const { rerender } = render(<KitPicker disabled={false} onApply={onApply} />);
    fireEvent.click(screen.getByRole("button", { name: /^Japanese:/ }));
    expect(onApply).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("button", { name: "Use this look" }));
    await waitFor(() => expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ id: "japanese" })));

    rerender(<KitPicker activeKitId="japanese" disabled={false} onApply={onApply} />);
    expect(screen.getByRole("button", { name: /^Japanese:/ })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("kit order and wording", () => {
  it.each(RESTAURANT_KITS.map((k) => [k.id, k] as const))("%s ends with the footer", (_id, kit) => {
    expect(kit.sections.at(-1)?.type).toBe("footer");
  });

  it("switching kits replaces the previous kit's wording but keeps the owner's own", () => {
    const [a, b] = RESTAURANT_KITS;
    const fromKit = kitFormValues(b, { hero_tagline: a.copy.tagline, theme_badge: a.copy.badge, theme_marquee: "" });
    expect(fromKit.hero_tagline).toBe(b.copy.tagline);
    expect(fromKit.theme_badge).toBe(b.copy.badge);
    const own = kitFormValues(b, { hero_tagline: "Our own words", theme_badge: "", theme_marquee: "" });
    expect(own.hero_tagline).toBeUndefined();
  });
});