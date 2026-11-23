import type { ComponentType } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MenuCategoriesPanel } from "@/features/workspace/components/MenuCategoriesPanel";
import type { PublicMenuPayload } from "@/types/public/publicSite.types";
import type { SiteDocument } from "../types";
import { isMenuPartShown } from "./parts";

vi.mock("@/hooks/useAnalytics.hook", () => ({ useAnalytics: () => ({ track: () => {} }) }));

const layouts = import.meta.glob<{ default: ComponentType<{ payload: PublicMenuPayload; routeSlug: string | null }> }>(
  "../../menu/_shared/structures/MenuStructure*.tsx",
  { eager: true },
);

function payload(siteDocument: unknown): PublicMenuPayload {
  return {
    mapped: {
      userId: 1,
      publicSlug: "vimal",
      settings: { site_document: siteDocument },
      business: { business_name: "Vimal Kitchen" },
      offers: [],
      gallery: [],
    },
    menuItems: [
      { id: 1, item: "Biryani", price: "12", category: "Mains", type: "Non-Veg", popular: true, availability: true, dietaryTags: ["spicy"] },
      { id: 2, item: "Dosa", price: "6", category: "Breakfast", type: "Veg", popular: false, availability: true, dietaryTags: [] },
    ],
    routeSlug: "vimal",
  } as unknown as PublicMenuPayload;
}

const hide = (...types: string[]) => ({ version: 1, menu: { sections: types.map((t) => ({ id: t, type: t, hidden: true })) } });

describe("menu search / filter switches", () => {
  it("reads the switches from the document (shown unless hidden)", () => {
    expect(isMenuPartShown(null, "search")).toBe(true);
    expect(isMenuPartShown(hide("search"), "search")).toBe(false);
    expect(isMenuPartShown(hide("search"), "filters")).toBe(true);
  });

  const names = Object.keys(layouts).map((k) => k.match(/MenuStructure(\w+)\.tsx$/)![1]);
  // The Popular *filter button*: its label is "Popular", after either a star icon (<svg>) or the older "⭐".
  const popularChip = /<button[^>]*>(?:\s*<span[^>]*>)?\s*(?:<svg[\s\S]*?<\/svg>|⭐)\s*(?:<\/span>)?\s*Popular\s*(?:<\/span>)?\s*<\/button>/;

  it("the checks below are not vacuous: layouts do render a search box and a Popular filter by default", () => {
    const rendered = names.map((name) =>
      renderToStaticMarkup(
        (() => {
          const Layout = layouts[`../../menu/_shared/structures/MenuStructure${name}.tsx`].default;
          return <Layout payload={payload(null)} routeSlug="vimal" />;
        })(),
      ),
    );
    expect(rendered.filter((h) => h.includes('type="search"')).length).toBeGreaterThanOrEqual(8);
    // Since the 2026-11-09 menu redesign, Grid and Masonry show the Popular chip for this data.
    expect(rendered.filter((h) => popularChip.test(h)).length).toBeGreaterThanOrEqual(2);
  });

  it.each(names)("%s layout: hiding search removes the search box; hiding filters removes the Popular chip", (name) => {
    const Layout = layouts[`../../menu/_shared/structures/MenuStructure${name}.tsx`].default;
    const html = (doc: unknown) => renderToStaticMarkup(<Layout payload={payload(doc)} routeSlug="vimal" />);

    const before = html(null);
    const noSearch = html(hide("search"));
    const noFilters = html(hide("filters"));

    if (before.includes('type="search"')) expect(noSearch).not.toContain('type="search"');
    // The Popular *filter button* goes; a Popular badge on a dish card stays.
    if (popularChip.test(before)) expect(noFilters).not.toMatch(popularChip);
    // Items themselves are never hidden by these switches.
    expect(noFilters).toContain("Biryani");
    expect(noSearch).toContain("Biryani");
  });
});

describe("MenuCategoriesPanel switches", () => {
  it("turning a part off stores it as hidden, turning it on removes the entry", () => {
    const onChange = vi.fn();
    const { rerender } = render(<MenuCategoriesPanel value={null} categories={["Mains"]} disabled={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch", { name: /Search box/ }));
    const off = onChange.mock.calls[0][0] as SiteDocument;
    expect(off.menu?.sections).toEqual([{ id: "search", type: "search", hidden: true }]);

    rerender(<MenuCategoriesPanel value={off} categories={["Mains"]} disabled={false} onChange={onChange} />);
    expect(screen.getByRole("switch", { name: /Search box/ })).toHaveAttribute("aria-checked", "false");
    fireEvent.click(screen.getByRole("switch", { name: /Search box/ }));
    expect(onChange.mock.calls[1][0]).toBeNull();
  });

  it("category edits keep the part switches", () => {
    const onChange = vi.fn();
    render(<MenuCategoriesPanel value={hide("filters") as SiteDocument} categories={["Mains", "Breakfast"]} disabled={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Hide Mains" }));
    const doc = onChange.mock.calls[0][0] as SiteDocument;
    expect(doc.menu?.sections.find((s) => s.type === "filters")?.hidden).toBe(true);
    expect(doc.menu?.sections.find((s) => s.props?.name === "Mains")?.hidden).toBe(true);
  });
});
