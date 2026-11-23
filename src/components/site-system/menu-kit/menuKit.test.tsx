import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import type { RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { Menu } from "@/types";
import { mapPublicUserDetailsFromApi } from "@/components/templates/core/mapPublicUserDetails";
import { resolveMenuStructure, MENU_STRUCTURE_KEYS } from "@/components/templates/menu/structureRegistry";
import BillOfFare from "@/components/templates/menu/_shared/structures/MenuStructureBillOfFare";
import Spotlight from "@/components/templates/menu/_shared/structures/MenuStructureSpotlight";
import MagazineSpread from "@/components/templates/menu/_shared/structures/MenuStructureMagazineSpread";
import DrinksList from "@/components/templates/menu/_shared/structures/MenuStructureDrinksList";
import ShopShelf from "@/components/templates/menu/_shared/structures/MenuStructureShopShelf";
import GardenCards from "@/components/templates/menu/_shared/structures/MenuStructureGardenCards";
import CatchBoard, { isMarketPrice } from "@/components/templates/menu/_shared/structures/MenuStructureCatchBoard";
import GrillBoard from "@/components/templates/menu/_shared/structures/MenuStructureGrillBoard";
import BentoBox, { wideFillers } from "@/components/templates/menu/_shared/structures/MenuStructureBentoBox";
import List from "@/components/templates/menu/_shared/structures/MenuStructureList";
import Grid from "@/components/templates/menu/_shared/structures/MenuStructureGrid";
import Sidebar from "@/components/templates/menu/_shared/structures/MenuStructureSidebar";
import Tabs from "@/components/templates/menu/_shared/structures/MenuStructureTabs";
import Accordion from "@/components/templates/menu/_shared/structures/MenuStructureAccordion";
import Magazine from "@/components/templates/menu/_shared/structures/MenuStructureMagazine";
import Compact from "@/components/templates/menu/_shared/structures/MenuStructureCompact";
import Masonry from "@/components/templates/menu/_shared/structures/MenuStructureMasonry";
import Story from "@/components/templates/menu/_shared/structures/MenuStructureStory";
import Bento from "@/components/templates/menu/_shared/structures/MenuStructureBento";
import { MenuCurrencyContext } from "@/components/templates/menu/_shared/structures/DietaryBadges";
import MarketStalls from "@/components/templates/menu/_shared/structures/MenuStructureMarketStalls";
import DecoCard from "@/components/templates/menu/_shared/structures/MenuStructureDecoCard";
import Jukebox, { selectionCode } from "@/components/templates/menu/_shared/structures/MenuStructureJukebox";
import { CAFE_SITE, CHEESE_DELI_SITE, FULL_SITE, PUB_SITE, SPARSE_SITE, WINE_SHOP_SITE } from "../fixtures";
import { attributeFilters, itemChips, itemDetailRows, matchesAttributes } from "./attributes";

type Structure = ComponentType<{ payload: PublicMenuPayload; routeSlug: string | null }>;

function payload(raw: RawPublicSiteData): PublicMenuPayload {
  const mapped = mapPublicUserDetailsFromApi({ ...raw, settings: { ...raw.settings, paybtn_status: 1 } });
  if (!mapped.ok) throw new Error("fixture did not map");
  return { mapped: mapped.value, menuItems: raw.menuItems as Menu[], routeSlug: "fixture" };
}

const html = (S: Structure, raw: RawPublicSiteData) => renderToStaticMarkup(<S payload={payload(raw)} routeSlug="fixture" />);

const STRUCTURES: Array<[string, Structure]> = [
  ["bill-of-fare", BillOfFare],
  ["spotlight", Spotlight],
  ["magazine-spread", MagazineSpread],
  ["drinks-list", DrinksList],
  ["shop-shelf", ShopShelf],
  ["garden-cards", GardenCards],
  ["catch-board", CatchBoard],
  ["grill-board", GrillBoard],
  ["bento-box", BentoBox],
  ["market-stalls", MarketStalls],
  ["deco-card", DecoCard],
  ["jukebox", Jukebox],
];

describe.each([
  ["list", List], ["grid", Grid], ["sidebar", Sidebar], ["tabs", Tabs], ["accordion", Accordion],
  ["magazine", Magazine], ["compact", Compact], ["masonry", Masonry], ["story", Story], ["bento", Bento],
] as Array<[string, Structure]>)("original menu structure: %s", (_key, S) => {
  const out = () => renderToStaticMarkup(
    <MenuCurrencyContext.Provider value="₹">
      <S payload={payload(PUB_SITE)} routeSlug="fixture" />
    </MenuCurrencyContext.Provider>,
  );

  it("shows every size with its price and the item's details", () => {
    const html = out().replace(/<!-- -->/g, "");
    expect(html).toContain("Half");
    expect(html).toMatch(/Pint<\/span>\s*₹380\.00/);
    expect(html).toContain("ABV 4.8%");
    expect(html).toContain("On tap");
  });

  it("ends with the age notice (for a pub) and the menu footer", () => {
    const html = out();
    expect(html).toMatch(/served only to guests aged (18|21) and over/);
    expect(html).toContain("Digital menu by");
    expect(html).toContain("Visit our website");
  });
});

describe("jukebox", () => {
  it("codes selections like a jukebox", () => {
    expect([0, 1, 5, 6, 13].map(selectionCode)).toEqual(["A1", "A2", "A6", "B1", "C2"]);
  });
});

describe("catch board and bento box rules", () => {
  it("writes 'Market price' for a catch with no fixed price", () => {
    const fish = { ...(PUB_SITE.menuItems[1] as Menu), price: "0" };
    expect(isMarketPrice(fish)).toBe(true);
    expect(isMarketPrice(PUB_SITE.menuItems[1] as Menu)).toBe(false);
    expect(isMarketPrice(PUB_SITE.menuItems[0] as Menu)).toBe(false); // has sizes
    const out = html(CatchBoard, { ...PUB_SITE, menuItems: [fish] as unknown as Menu[] });
    expect(out).toContain("Market price");
  });

  it("fills the bento's last row so the box stays rectangular", () => {
    expect([1, 2, 3, 4, 5, 8, 9].map(wideFillers)).toEqual([3, 2, 1, 0, 3, 0, 3]);
  });
});

describe.each(STRUCTURES)("menu structure: %s", (key, S) => {
  it("is registered", () => {
    expect(MENU_STRUCTURE_KEYS).toContain(key);
  });

  it("shows items, prices and every size", () => {
    const out = html(S, PUB_SITE);
    expect(out).toContain("Fixture House Lager");
    // Spotlight shows one category at a time; the next one is a button away.
    if (key === "spotlight" || key === "jukebox") expect(out).toMatch(/Pub grub/);
    else expect(out).toContain("Fixture Fish and Chips");
    expect(out).toContain("Half");
    expect(out).toContain("Pint");
    expect(out).toContain("380.00");
  });

  it("shows item details and the age notice for a pub", () => {
    const out = html(S, PUB_SITE);
    expect(out).toContain("Lager");
    expect(out).toContain("4.8%");
    expect(out).toMatch(/served only to guests aged (18|21) and over/);
  });

  it("does not show an age notice for a café", () => {
    expect(html(S, CAFE_SITE)).not.toContain("served only to guests aged");
  });

  it("has the menu footer with credit and a way back to the site", () => {
    const out = html(S, PUB_SITE);
    expect(out).toContain("Digital menu by");
    expect(out).toContain("Visit our website");
  });

  it("renders an empty menu without crashing", () => {
    expect(() => html(S, SPARSE_SITE)).not.toThrow();
    expect(html(S, SPARSE_SITE)).toContain("Fixture Sparse Cafe");
  });

  it("uses the skin's tokens", () => {
    expect(html(S, PUB_SITE)).toContain("--site-accent");
  });
});

describe("drinks list columns", () => {
  it("adds a column per size and per detail only when some drink has it", () => {
    const out = html(DrinksList, WINE_SHOP_SITE);
    expect(out).toContain(">Vintage<");
    expect(out).toContain("Piedmont");
    expect(out).not.toContain(">Half<");
  });
});

describe("shop shelf", () => {
  it("shows stock, origin and sizes for products", () => {
    const wine = html(ShopShelf, WINE_SHOP_SITE);
    expect(wine).toContain("In stock");
    expect(wine).toContain("Piedmont");
    const deli = html(ShopShelf, CHEESE_DELI_SITE);
    expect(deli).toContain("100g");
    expect(deli).toContain("250g");
  });
});

describe("Match my layout", () => {
  it("uses the saved structure first", () => {
    expect(resolveMenuStructure({ menu_structure: "list", landing_structure: "grand-hall" })).toBe("list");
  });
  it("pairs every wave-2 layout too", () => {
    expect(["conservatory", "pier", "ember", "tatami"].map((l) => resolveMenuStructure({ landing_structure: l }))).toEqual(["garden-cards", "catch-board", "grill-board", "bento-box"]);
  });
  it("pairs with a site-system layout when no structure is saved", () => {
    expect(resolveMenuStructure({ menu_structure: "", landing_structure: "grand-hall" })).toBe("bill-of-fare");
    expect(resolveMenuStructure({ landing_structure: "noir-salon" })).toBe("spotlight");
    expect(resolveMenuStructure({ landing_structure: "atelier-editorial" })).toBe("magazine-spread");
  });
  it("leaves existing sites on their default menu", () => {
    expect(resolveMenuStructure({ menu_structure: "", landing_structure: "split" })).toBeNull();
    expect(resolveMenuStructure({})).toBeNull();
    expect(resolveMenuStructure({ menu_structure: "no-such-thing", landing_structure: "grand-hall" })).toBeNull();
  });
});

describe("item details", () => {
  const lager = PUB_SITE.menuItems[0];
  const barolo = WINE_SHOP_SITE.menuItems[0];

  it("lists every filled-in detail for the item sheet", () => {
    const rows = itemDetailRows(barolo);
    expect(rows.map((r) => `${r.label}: ${r.value}`)).toEqual(
      expect.arrayContaining(["Colour: Red", "Grape: Nebbiolo", "Region: Piedmont", "Vintage: 2018", "ABV: 14%", "In stock: Yes"]),
    );
  });

  it("makes short chips", () => {
    expect(itemChips(lager)).toEqual(["Lager", "ABV 4.8%", "On tap"]);
    expect(itemChips(barolo, 3)).toEqual(["Red", "Nebbiolo", "Piedmont"]);
    expect(itemChips({ attributes: { product: { inStock: false } } })).toEqual(["Out of stock"]);
  });

  it("builds filters only from details with two or more values, fixed choices first, at most three", () => {
    const items: Array<Pick<Menu, "attributes">> = [
      { attributes: { wine: { colour: "red", grape: "A" } } },
      { attributes: { wine: { colour: "white", grape: "B" } } },
      { attributes: { beer: { serve: "tap" } } },
    ];
    const f = attributeFilters(items);
    expect(f.map((x) => x.key)).toEqual(["wine.colour", "wine.grape"]);
    expect(f[0].options.map((o) => o.label).sort()).toEqual(["Red", "White"]);
    const many = Array.from({ length: 9 }, (_, i) => ({ attributes: { wine: { country: `Country ${i}` } } }));
    expect(attributeFilters(many)).toEqual([]);
  });

  it("matches chosen details", () => {
    expect(matchesAttributes(barolo, { "wine.colour": "red" })).toBe(true);
    expect(matchesAttributes(barolo, { "wine.colour": "white" })).toBe(false);
    expect(matchesAttributes(lager, { "wine.colour": "red" })).toBe(false);
  });

  it("the full fixture's sizes reach the item sheet data", () => {
    expect(FULL_SITE.menuItems[3].priceOptions).toHaveLength(2);
  });
});
