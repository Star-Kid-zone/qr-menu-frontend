import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LANDING_SECTIONS } from "@/components/templates/sections/landing/registry";
import type { SiteDocument } from "@/components/templates/sections/types";
import { SectionsPanel } from "./SectionsPanel";

const labels = () => within(screen.getByRole("list", { name: "Page sections" })).getAllByRole("listitem").map((li) => li.querySelector("p")?.textContent);

function setup(value: SiteDocument | null = null, structureKey = "", disabled = false) {
  const onChange = vi.fn();
  render(<SectionsPanel value={value} structureKey={structureKey} disabled={disabled} onChange={onChange} />);
  return onChange;
}

describe("SectionsPanel", () => {
  it("lists every section in default order for an uncustomised site", () => {
    setup();
    expect(labels()).toEqual(LANDING_SECTIONS.map((d) => d.label));
    expect(screen.getByRole("button", { name: "Reset order" })).toBeDisabled();
  });

  it("lists every section for a designed layout too (all layouts render all sections)", () => {
    setup(null, "dashboard");
    expect(labels()).toEqual(LANDING_SECTIONS.map((d) => d.label));
  });

  it("hides a section and writes a version-1 document", () => {
    const onChange = setup();
    fireEvent.click(screen.getByRole("button", { name: "Hide Questions" }));
    const doc = onChange.mock.calls[0][0] as SiteDocument;
    expect(doc.version).toBe(1);
    expect(doc.landing?.sections.find((s) => s.type === "faq")?.hidden).toBe(true);
    expect(doc.landing?.sections).toHaveLength(LANDING_SECTIONS.length);
  });

  it("moves a section up", () => {
    const onChange = setup();
    fireEvent.click(screen.getByRole("button", { name: "Move Hero up" }));
    const doc = onChange.mock.calls[0][0] as SiteDocument;
    const before = LANDING_SECTIONS.map((d) => d.type);
    const after = doc.landing!.sections.map((s) => s.type);
    const i = before.indexOf("hero");
    // Hero swaps places with the section that was directly above it.
    expect(after[i - 1]).toBe("hero");
    expect(after[i]).toBe(before[i - 1]);
  });

  it("shows a hidden section again", () => {
    const value: SiteDocument = { version: 1, landing: { sections: [{ id: "faq", type: "faq", hidden: true }] } };
    const onChange = setup(value);
    fireEvent.click(screen.getByRole("button", { name: "Show Questions" }));
    const doc = onChange.mock.calls[0][0] as SiteDocument;
    expect(doc.landing?.sections.find((s) => s.type === "faq")?.hidden).toBeUndefined();
  });

  it("resets to null, or keeps the menu page when it is customised", () => {
    const landingOnly: SiteDocument = { version: 1, landing: { sections: [{ id: "hero", type: "hero" }] } };
    expect((() => { const fn = setup(landingOnly); fireEvent.click(screen.getByRole("button", { name: "Reset order" })); return fn.mock.calls[0][0]; })()).toBeNull();
  });

  it("keeps a customised menu page on reset", () => {
    const both: SiteDocument = { version: 1, landing: { sections: [] }, menu: { sections: [{ id: "x", type: "footer" }] } };
    const onChange = setup(both);
    fireEvent.click(screen.getByRole("button", { name: "Reset order" }));
    expect(onChange.mock.calls[0][0]).toEqual({ version: 1, menu: both.menu });
  });

  it("warns when every section is hidden", () => {
    const value: SiteDocument = {
      version: 1,
      landing: { sections: LANDING_SECTIONS.map((d) => ({ id: d.type, type: d.type, hidden: true })) },
    };
    setup(value);
    expect(screen.getByRole("status")).toHaveTextContent("empty page");
  });

  it("disables every control when read-only", () => {
    setup(null, "", true);
    expect(screen.getByRole("button", { name: "Hide Hero" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move Hero down" })).toBeDisabled();
  });

  it("does not render any date fields or schedule buttons", () => {
    setup();
    expect(screen.queryByRole("button", { name: /Schedule/i })).toBeNull();
    expect(screen.queryByLabelText(/show from/i)).toBeNull();
    expect(screen.queryByLabelText(/until/i)).toBeNull();
  });

  it("renders position badges and visual thumbnails for all sections", () => {
    setup();
    const items = within(screen.getByRole("list", { name: "Page sections" })).getAllByRole("listitem");
    expect(items).toHaveLength(LANDING_SECTIONS.length);
    // Position numbers start from 1
    expect(items[0]).toHaveTextContent("1");
    expect(items[1]).toHaveTextContent("2");
    // Has thumbnail SVG in each row
    expect(items[0].querySelector("svg")).not.toBeNull();
  });
});
