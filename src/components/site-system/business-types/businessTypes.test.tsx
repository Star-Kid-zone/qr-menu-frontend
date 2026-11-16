import { LAYOUT_MAP } from "@/components/templates/sections/layouts/registry";
import { MENU_STRUCTURE_MAP } from "@/components/templates/menu/structureRegistry";
import { getSkin as getSkinForCheck } from "../skins";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BUSINESS_FAMILIES } from "../types";
import { BUSINESS_TYPES, KIT_BUSINESS_TYPE, getBusinessType, resolveBusinessType, businessTypesByFamily, categoryIcon, GENERIC_CATEGORY_ICONS } from ".";
import { RESTAURANT_KITS } from "@/components/templates/sections/kits/kits";
import { ATTRIBUTE_SETS } from "../attributes";
import { getSkin } from "../skins";
import { GLYPHS, GLYPH_GROUPS, getGlyph } from "../icons/glyphs";
import { SiteIcon } from "../icons/SiteIcon";
import { BUSINESS_FIXTURES, FULL_SITE } from "../fixtures";

describe("business type catalogue", () => {
  it("has 37 types with unique ids across 6 families", () => {
    expect(BUSINESS_TYPES).toHaveLength(37);
    expect(new Set(BUSINESS_TYPES.map((b) => b.id)).size).toBe(37);
    const counts = Object.fromEntries(Object.entries(businessTypesByFamily()).map(([f, list]) => [f, list.length]));
    expect(counts).toEqual({ restaurants: 17, "quick-casual": 4, "cafes-sweets": 6, "bars-lounges": 5, shops: 4, other: 1 });
    expect(Object.keys(counts)).toEqual([...BUSINESS_FAMILIES]);
  });

  it.each(BUSINESS_TYPES.map((b) => [b.id, b] as const))("%s is complete and points at things that exist", (_id, b) => {
    expect(b.attributeSets.length).toBeGreaterThan(0);
    for (const s of b.attributeSets) expect(ATTRIBUTE_SETS[s], s).toBeDefined();
    expect(getGlyph(b.defaultIcon), b.defaultIcon).not.toBeNull();
    for (const rule of b.categoryIcons) expect(getGlyph(rule.icon), rule.icon).not.toBeNull();
    for (const skin of b.recommended.skins) expect(getSkin(skin), skin).not.toBeNull();
    expect(b.recommended.layouts).toHaveLength(3);
    for (const preset of b.priceOptionPresets) expect(preset.length).toBeGreaterThanOrEqual(2);
    expect(b.terms.curatedListTitle.trim()).not.toBe("");
    // Copy is sentence case: no all-caps words longer than 3 letters (allows "IPA", "BBQ").
    for (const line of [b.copy.tagline, b.copy.badge, b.copy.marquee, ...Object.values(b.terms)]) {
      expect(line, line).not.toMatch(/\b[A-Z]{4,}\b/);
    }
  });

  it("drinks-led and alcohol types carry an age notice", () => {
    for (const id of ["pub", "cocktail-bar", "wine-bar", "brewery-taproom", "wine-shop"]) {
      expect(getBusinessType(id)?.alcohol?.ageNotice, id).toBeGreaterThanOrEqual(18);
    }
    expect(getBusinessType("cafe")?.alcohol).toBeUndefined();
  });

  it("every starter kit maps to a business type (kits are recipes now)", () => {
    for (const kit of RESTAURANT_KITS) {
      expect(getBusinessType(KIT_BUSINESS_TYPE[kit.id]), kit.id).not.toBeNull();
    }
  });

  it("resolves the saved type, then the kit's type, then generic", () => {
    expect(resolveBusinessType({ business_type: "pub" }).id).toBe("pub");
    expect(resolveBusinessType({ business_type: "", site_document: { version: 1, kit: "mexican-taqueria" } }).id).toBe("mexican");
    expect(resolveBusinessType({ business_type: "no-such-type" }).id).toBe("generic");
    expect(resolveBusinessType(null).id).toBe("generic");
  });
});

describe("category icons", () => {
  const generic = getBusinessType("generic")!;
  const wineBar = getBusinessType("wine-bar")!;
  const icon = (name: string, b = generic) => categoryIcon(name, b);

  it.each([
    ["Starters", "plate-fork"],
    ["Soups", "soup"],
    ["Biryani", "biryani"],
    ["Tandoori Breads", "naan"],
    ["Masala Dosa", "dosa"],
    ["Wood-fired Pizzas", "pizza"],
    ["Sushi Rolls", "sushi"],
    ["Nigiri & Sashimi", "nigiri"],
    ["Draught Beers", "draught-tap"],
    ["Craft Beer", "beer-bottle"],
    ["Signature Cocktails", "coupe"],
    ["Mocktails", "highball"],
    ["Single Malt Whisky", "tumbler"],
    ["Sparkling Wine", "flute"],
    ["Hot Coffee", "coffee"],
    ["Masala Chai", "chai"],
    ["Ice Cream", "ice-cream"],
    ["Cakes & Pastries", "cake-slice"],
    ["Hard Cheese", "cheese-wedge"],
    ["Gift Hampers", "hamper"],
    ["Mithai", "mithai-box"],
    ["Shisha Flavours", "shisha"],
    ["Mixed Grill", "grill"],
    ["Prawns", "crustaceans"],
  ])("%s → %s", (name, expected) => {
    expect(icon(name)).toBe(expected);
  });

  it("matches Hindi and Arabic category names", () => {
    expect(icon("बिरयानी")).toBe("biryani");
    expect(icon("मिठाई")).toBe("mithai-box");
    expect(icon("चाय")).toBe("chai");
    expect(icon("مشويات")).toBe("grill");
    expect(icon("شوربة")).toBe("soup");
    expect(icon("قهوة")).toBe("coffee");
    expect(icon("حلويات")).toBe("cupcake");
  });

  it("ignores Arabic diacritics and accents", () => {
    expect(icon("شَوْرَبَة")).toBe("soup");
    expect(icon("Crêpes")).toBe("pancakes");
  });

  it("colour words are not wine in general, but are for wine-led types", () => {
    expect(icon("Red Curry")).toBe("curry");
    expect(icon("Rose Milk")).not.toBe("wine-glass");
    expect(icon("Reds", wineBar)).toBe("wine-glass");
    expect(icon("Rosé", wineBar)).toBe("wine-glass");
  });

  it("matches whole words only", () => {
    expect(icon("Ginger Specials")).not.toBe("balloon"); // "gin"
    expect(icon("Tapas")).toBe("plate-fork"); // not "tap"
  });

  it("a bakery's breads are loaves; a restaurant's are flatbreads", () => {
    expect(icon("Breads", getBusinessType("bakery-patisserie")!)).toBe("bread");
    expect(icon("Breads", getBusinessType("north-indian")!)).toBe("naan");
  });

  it("falls back to the business type's default icon", () => {
    expect(icon("Zzz unusual", getBusinessType("pub")!)).toBe("pint");
    expect(icon("", getBusinessType("cafe")!)).toBe("coffee");
  });

  it("every generic rule points at a drawn icon", () => {
    for (const rule of GENERIC_CATEGORY_ICONS) expect(getGlyph(rule.icon), rule.icon).not.toBeNull();
  });
});

describe("catalogue icons", () => {
  it("adds 40 food, 22 drink, 12 shop and 21 festival icons (159 in total)", () => {
    expect(GLYPH_GROUPS.food).toHaveLength(40);
    expect(GLYPH_GROUPS.drinks).toHaveLength(22);
    expect(GLYPH_GROUPS.shop).toHaveLength(12);
    expect(GLYPH_GROUPS.festival).toHaveLength(21);
    expect(Object.keys(GLYPHS)).toHaveLength(159);
  });

  it("every catalogue icon renders in every style", () => {
    for (const name of [...GLYPH_GROUPS.food, ...GLYPH_GROUPS.drinks, ...GLYPH_GROUPS.shop, ...GLYPH_GROUPS.festival]) {
      for (const style of ["line", "filled", "duotone", "engraved", "hand-drawn", "pixel"] as const) {
        expect(renderToStaticMarkup(<SiteIcon name={name} iconStyle={style} />), `${name}/${style}`).toContain("data-icon");
      }
    }
  });
});

describe("fixtures", () => {
  it("business fixtures use only the attribute sets their type enables", () => {
    for (const [typeId, site] of Object.entries(BUSINESS_FIXTURES)) {
      const type = getBusinessType(typeId)!;
      expect(resolveBusinessType(site.settings).id).toBe(typeId);
      for (const item of site.menuItems) {
        for (const setId of Object.keys(item.attributes ?? {})) {
          expect(type.attributeSets, `${typeId}: ${setId}`).toContain(setId);
        }
      }
    }
  });

  it("the full fixture fills every owner-managed area", () => {
    expect(FULL_SITE.awards?.length).toBeGreaterThan(0);
    expect(FULL_SITE.team?.length).toBeGreaterThan(0);
    expect(FULL_SITE.events?.length).toBeGreaterThan(0);
    expect(FULL_SITE.gallery.length).toBeGreaterThanOrEqual(4);
    expect(FULL_SITE.offers.length).toBeGreaterThan(0);
    expect(FULL_SITE.faqs?.length).toBeGreaterThan(0);
    expect(FULL_SITE.googleReviews?.length).toBeGreaterThan(0);
    expect((FULL_SITE.settings.amenities as unknown[]).length).toBeGreaterThan(0);
  });
});

describe("recommendations point at things that exist", () => {
  it.each(BUSINESS_TYPES.map((b) => [b.id, b] as const))("%s", (_id, b) => {
    for (const key of b.recommended.layouts) expect(LAYOUT_MAP.has(key), `layout ${key}`).toBe(true);
    for (const id of b.recommended.skins) expect(getSkinForCheck(id)?.id, `skin ${id}`).toBe(id);
    expect(MENU_STRUCTURE_MAP[b.recommended.menuStructure], `menu ${b.recommended.menuStructure}`).toBeDefined();
  });
});