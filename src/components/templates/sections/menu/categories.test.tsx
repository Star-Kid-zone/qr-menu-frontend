import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Menu } from "@/types";
import { applyMenuCategoryLayout } from "@/components/templates/core/useTemplateData";
import { MenuCategoriesPanel } from "@/features/workspace/components/MenuCategoriesPanel";
import type { SiteDocument } from "../types";
import { lookFromSettings } from "@/components/site-system/kit/look";
import { iconForCategory } from "@/components/site-system/business-types";
import {
  categoryIconOverrides,
  categoriesInItemOrder,
  categorySectionId,
  menuSectionsFromCategories,
  resolveMenuCategories,
  visibleMenuCategories,
} from "./categories";

const item = (id: number, category: string | null) => ({ id, item: `Item ${id}`, category }) as unknown as Menu;
const ITEMS = [item(1, "Starters"), item(2, "Mains"), item(3, "Starters"), item(4, null), item(5, "Desserts"), item(6, "Mains")];
const cat = (name: string, extra: Record<string, unknown> = {}) => ({ id: categorySectionId(name), type: "category", props: { name }, ...extra });
const doc = (sections: unknown[], extra: Record<string, unknown> = {}) => ({ version: 1, menu: { sections }, ...extra });
const names = (items: Menu[]) => items.map((i) => i.id);

describe("menu categories", () => {
  it("lists categories in item order, de-duplicated case-insensitively", () => {
    expect(categoriesInItemOrder([...ITEMS, item(7, " mains ")])).toEqual(["Starters", "Mains", "Desserts"]);
  });

  it("makes ids that fit the backend rules, including for non-Latin names", () => {
    expect(categorySectionId("Hot Drinks & Shakes")).toBe("cat-hot-drinks-shakes");
    expect(categorySectionId("المشويات")).toMatch(/^cat-[a-z0-9]+$/);
    expect(categorySectionId("Mains", new Set(["cat-mains"]))).toBe("cat-mains-2");
    expect(categorySectionId("x".repeat(80)).length).toBeLessThanOrEqual(40);
  });

  it("puts saved categories first, then new ones in item order; drops categories no longer on the menu", () => {
    const list = resolveMenuCategories(doc([cat("Desserts"), cat("Old Specials"), cat("starters", { hidden: true })]), ["Starters", "Mains", "Desserts"]);
    expect(list.map((c) => c.name)).toEqual(["Desserts", "Starters", "Mains"]);
    expect(list[1].hidden).toBe(true);
  });

  it("applies hidden flags and date windows for guests", () => {
    const d = doc([cat("Mains", { schedule: { from: "2026-12-01" } }), cat("Starters", { hidden: true }), cat("Desserts")]);
    expect(visibleMenuCategories(d, ["Starters", "Mains", "Desserts"], "2026-11-09")).toEqual(["Desserts"]);
    expect(visibleMenuCategories(d, ["Starters", "Mains", "Desserts"], "2026-12-05")).toEqual(["Mains", "Desserts"]);
  });

  it("round-trips and keeps non-category menu sections", () => {
    const list = resolveMenuCategories(null, ["Starters", "Mains"]);
    const other = { id: "search", type: "search", hidden: true };
    const sections = menuSectionsFromCategories(list, [cat("Mains") as never, other]);
    expect(sections.map((s) => s.type)).toEqual(["category", "category", "search"]);
    expect(resolveMenuCategories({ version: 1, menu: { sections } }, ["Starters", "Mains"]).map((c) => c.name)).toEqual(["Starters", "Mains"]);
  });
});

describe("applyMenuCategoryLayout (guest menu data)", () => {
  it("leaves the menu untouched when the owner hasn't placed categories", () => {
    expect(applyMenuCategoryLayout(ITEMS, {})).toBe(ITEMS);
    expect(applyMenuCategoryLayout(ITEMS, { site_document: { version: 1, status: { mode: "holiday" } } })).toBe(ITEMS);
  });

  it("orders categories, keeps item order inside a category, and keeps uncategorised items last", () => {
    const out = applyMenuCategoryLayout(ITEMS, { site_document: doc([cat("Desserts"), cat("Mains"), cat("Starters")]) });
    expect(names(out)).toEqual([5, 2, 6, 1, 3, 4]);
  });

  it("removes items in hidden or out-of-window categories (so search can't find them either)", () => {
    const out = applyMenuCategoryLayout(ITEMS, {
      timezone: "UTC",
      site_document: doc([cat("Mains", { hidden: true }), cat("Desserts", { schedule: { to: "2000-01-01" } })]),
    });
    expect(names(out)).toEqual([1, 3, 4]);
  });
});

describe("MenuCategoriesPanel", () => {
  const labels = () => within(screen.getByRole("list", { name: "Menu categories" })).getAllByRole("listitem").map((li) => li.querySelector("p")?.textContent);

  it("shows a hint when the menu has no categories", () => {
    render(<MenuCategoriesPanel value={null} categories={[]} disabled={false} onChange={vi.fn()} />);
    expect(screen.getByText(/no categories yet/i)).toBeInTheDocument();
  });

  it("lists categories and writes order + hidden into the menu page, keeping the rest of the document", () => {
    const onChange = vi.fn();
    const value: SiteDocument = { version: 1, status: { mode: "holiday" } };
    render(<MenuCategoriesPanel value={value} categories={["Starters", "Mains", "Desserts"]} disabled={false} onChange={onChange} />);
    expect(labels()).toEqual(["Starters", "Mains", "Desserts"]);

    fireEvent.click(screen.getByRole("button", { name: "Move Desserts up" }));
    const moved = onChange.mock.calls[0][0] as SiteDocument;
    expect(moved.status).toEqual({ mode: "holiday" });
    expect(moved.menu?.sections.map((s) => s.props?.name)).toEqual(["Starters", "Desserts", "Mains"]);

    fireEvent.click(screen.getByRole("button", { name: "Hide Mains" }));
    const hidden = onChange.mock.calls[1][0] as SiteDocument;
    expect(hidden.menu?.sections.find((s) => s.props?.name === "Mains")?.hidden).toBe(true);
  });

  it("reset removes only the category layout", () => {
    const onChange = vi.fn();
    const value = doc([cat("Mains")], { status: { mode: "holiday" } }) as SiteDocument;
    render(<MenuCategoriesPanel value={value} categories={["Mains"]} disabled={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Reset order" }));
    expect(onChange).toHaveBeenCalledWith({ version: 1, status: { mode: "holiday" } });
  });
});

describe("category icon override", () => {
  const doc = { version: 1, menu: { sections: [{ id: "cat-pizzas", type: "category", props: { name: "Pizzas", icon: "fish" } }] } };

  it("keeps the owner's icon through load and save", () => {
    const list = resolveMenuCategories(doc, ["Pizzas", "Desserts"]);
    expect(list[0].icon).toBe("fish");
    expect(list[1].icon).toBeUndefined();
    const saved = menuSectionsFromCategories(list);
    expect(saved[0].props).toEqual({ name: "Pizzas", icon: "fish" });
    expect(saved[1].props).toEqual({ name: "Desserts" });
  });

  it("the owner's icon wins over matching the name; others still match", () => {
    expect(categoryIconOverrides(doc)).toEqual({ pizzas: "fish" });
    const look = lookFromSettings({ business_type: "pizzeria", site_document: doc }, "");
    expect(iconForCategory("Pizzas", look)).toBe("fish");
    expect(iconForCategory("pizzas ", look)).toBe("fish");
    expect(iconForCategory("Desserts", look)).not.toBe("fish");
  });
});