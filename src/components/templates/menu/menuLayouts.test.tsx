import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { mapPublicUserDetailsFromApi } from "@/components/templates/core/mapPublicUserDetails";
import { menuSample } from "@/app/menu-lab/[key]/sample";
import type { PublicMenuPayload } from "@/types/public-site";
import type { Menu } from "@/types";
import GenericMenuTemplate from "./_shared/GenericMenuTemplate";

vi.mock("@/hooks/useAnalytics.hook", () => ({ useAnalytics: () => ({ track: () => {} }) }));

/**
 * The contract every menu layout must meet (the sample menu is the menu-lab's):
 * the guest can always identify the restaurant, get back to it, search, move
 * between categories, read every dish's name and price, open a dish from the
 * keyboard, and pay.
 */

const structures = import.meta.glob<{ default: ComponentType<{ payload: PublicMenuPayload; routeSlug: string | null; themeSlug?: string }> }>(
  "./_shared/structures/MenuStructure*.tsx",
  { eager: true },
);

const LAYOUTS: Array<[string, ComponentType<{ payload: PublicMenuPayload; routeSlug: string | null; themeSlug?: string }>]> = [
  ["Default", GenericMenuTemplate],
  ...Object.entries(structures).map(([path, mod]) => [path.match(/MenuStructure(\w+)\.tsx$/)![1], mod.default] as [string, typeof mod.default]),
];

function payload(dark = false): PublicMenuPayload {
  const data = menuSample("", dark, "swiss");
  const mapped = mapPublicUserDetailsFromApi(data);
  if (!mapped.ok) throw new Error(mapped.error);
  return { mapped: mapped.value, menuItems: data.menuItems as Menu[], routeSlug: "lab" };
}

const html = (Layout: (typeof LAYOUTS)[number][1]) => renderToStaticMarkup(<Layout payload={payload()} routeSlug="lab" themeSlug="swiss" />);

const FIRST_CATEGORY_DISHES = ["Burrata &amp; heirloom tomato", "Crispy calamari", "Garlic bread"];

describe.each(LAYOUTS.map(([name], i) => [name, i] as const))("menu layout: %s", (_name, i) => {
  const Layout = LAYOUTS[i][1];
  const out = html(Layout);

  it("names the restaurant and links back to it", () => {
    expect(out).toContain("Casa Nonna");
    expect(out).toMatch(/href="[^"]*"[^>]*>[^<]*(Back|back|Venue|venue|Home|home)/);
  });

  it("has a search box", () => {
    expect(out).toContain('type="search"');
  });

  it("lets guests move between categories", () => {
    for (const cat of ["Starters", "Pizza", "Pasta"]) expect(out).toContain(cat);
  });

  it("shows dish names and prices (at least the first category)", () => {
    for (const dish of FIRST_CATEGORY_DISHES) expect(out).toContain(dish);
    expect(out).toMatch(/₹\s*580|580/);
  });

  it("makes dishes reachable from the keyboard", () => {
    // Either native buttons/links or role="button" with tabindex.
    const focusableDish = new RegExp(`(<button[^>]*>|role="button"[^>]*tabindex="0"|tabindex="0"[^>]*role="button")[\\s\\S]{0,4000}Crispy calamari`);
    expect(out).toMatch(focusableDish);
  });

  it("offers the Pay bill button", () => {
    expect(out.toLowerCase()).toContain("pay bill");
  });
});
