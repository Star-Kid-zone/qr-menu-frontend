import { describe, it, expect } from "vitest";
import { maskEmail, slugBase, slugPreview } from "./authFormat";

describe("slugBase", () => {
  it("matches the backend's sign-up slug rules", () => {
    expect(slugBase("Spice Garden Bistro")).toBe("spice-garden-bistro");
    expect(slugBase("  Café & Grill!! ")).toBe("caf-grill");
    expect(slugBase("Annapoorna's Kitchen #2")).toBe("annapoorna-s-kitchen-2");
  });

  it("caps the name part at 50 characters without a trailing hyphen", () => {
    const base = slugBase(`${"a".repeat(49)} bcd`);
    expect(base.length).toBeLessThanOrEqual(50);
    expect(base.endsWith("-")).toBe(false);
  });
});

describe("slugPreview", () => {
  it("adds the placeholder for the random part and falls back when empty", () => {
    expect(slugPreview("Spice Garden")).toEqual({ base: "spice-garden", suffix: "xxxxxx" });
    expect(slugPreview("!!!").base).toBe("your-restaurant");
  });
});

describe("maskEmail", () => {
  it("keeps the first two characters and the domain", () => {
    expect(maskEmail("owner@cafe.com")).toBe("ow•••@cafe.com");
    expect(maskEmail("a@b.co")).toBe("a•@b.co");
    expect(maskEmail("not-an-email")).toBe("not-an-email");
  });
});
