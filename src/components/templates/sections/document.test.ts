import { describe, expect, it } from "vitest";
import { defaultSections, parseSiteDocument, resolvePageSections, visibleSections } from "./document";

const CATALOGUE = [
  { type: "hero", defaultVisible: true },
  { type: "story", defaultVisible: true },
  { type: "faq", defaultVisible: true },
  { type: "events", defaultVisible: false }, // a section shipped after sites were customised
  { type: "footer", defaultVisible: true },
];

const doc = (sections: unknown[]) => ({ version: 1, landing: { sections } });
const types = (list: { type: string }[]) => list.map((s) => s.type);

describe("resolvePageSections", () => {
  it("uses the catalogue order when the site was never customised", () => {
    for (const raw of [null, undefined, "garbage", { version: 2 }, { version: 1 }]) {
      expect(resolvePageSections(raw, "landing", CATALOGUE)).toEqual(defaultSections(CATALOGUE));
    }
    expect(defaultSections(CATALOGUE).find((s) => s.type === "events")?.hidden).toBe(true);
  });

  it("keeps the saved order and hidden flags", () => {
    const out = resolvePageSections(
      doc([
        { id: "footer", type: "footer" },
        { id: "faq", type: "faq", hidden: true },
        { id: "hero", type: "hero" },
        { id: "story", type: "story" },
        { id: "events", type: "events" },
      ]),
      "landing",
      CATALOGUE,
    );
    expect(types(out)).toEqual(["footer", "faq", "hero", "story", "events"]);
    expect(out[1].hidden).toBe(true);
  });

  it("slots a section missing from the saved layout in after its default predecessor", () => {
    const out = resolvePageSections(
      doc([
        { id: "footer", type: "footer" },
        { id: "hero", type: "hero" },
        { id: "faq", type: "faq" },
      ]),
      "landing",
      CATALOGUE,
    );
    // story follows hero; events (hidden by default) follows faq
    expect(types(out)).toEqual(["footer", "hero", "story", "faq", "events"]);
    expect(out.find((s) => s.type === "story")?.hidden).toBeUndefined();
    expect(out.find((s) => s.type === "events")?.hidden).toBe(true);
  });

  it("puts a missing first section at the top", () => {
    expect(types(resolvePageSections(doc([{ id: "faq", type: "faq" }]), "landing", CATALOGUE))[0]).toBe("hero");
  });

  it("keeps unknown types (for the editor) but drops malformed entries and duplicate ids", () => {
    const out = resolvePageSections(
      doc([
        { id: "hero", type: "hero" },
        { id: "hero", type: "story" },
        { id: "w", type: "future-widget" },
        { id: "BAD ID", type: "faq" },
        "nope",
      ]),
      "landing",
      CATALOGUE,
    );
    expect(out.filter((s) => s.id === "hero")).toHaveLength(1);
    expect(types(out)).toContain("future-widget");
    expect(out.some((s) => s.id === "BAD ID")).toBe(false);
  });

  it("does not reuse an id taken by another section", () => {
    const out = resolvePageSections(doc([{ id: "story", type: "hero" }]), "landing", CATALOGUE);
    expect(out.find((s) => s.type === "story")?.id).toBe("story-2");
  });

  it("reads each page independently", () => {
    const raw = { version: 1, menu: { sections: [{ id: "x", type: "footer" }] } };
    expect(resolvePageSections(raw, "landing", CATALOGUE)).toEqual(defaultSections(CATALOGUE));
    expect(types(resolvePageSections(raw, "menu", CATALOGUE))[0]).toBe("hero");
  });
});

describe("visibleSections", () => {
  it("drops hidden and unknown sections", () => {
    const known = new Set(["hero", "faq"]);
    const out = visibleSections(
      [{ id: "a", type: "hero" }, { id: "b", type: "faq", hidden: true }, { id: "c", type: "ghost" }],
      known,
    );
    expect(out.map((s) => s.id)).toEqual(["a"]);
  });
});

describe("parseSiteDocument", () => {
  it("ignores props that are not objects", () => {
    const parsed = parseSiteDocument(doc([{ id: "h", type: "hero", props: "x", variant: 3 }]));
    expect(parsed?.landing?.sections[0]).toEqual({ id: "h", type: "hero" });
  });
});
