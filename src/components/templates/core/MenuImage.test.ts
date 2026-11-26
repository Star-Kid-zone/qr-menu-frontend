import { describe, expect, it } from "vitest";
import { fixedThumbWidth } from "./MenuImage";

describe("fixedThumbWidth", () => {
  it("reads the largest fixed Tailwind size so thumbnails request small images", () => {
    expect(fixedThumbWidth("size-16 shrink-0 rounded-lg")).toBe(64);
    expect(fixedThumbWidth("size-24 shrink-0 self-start sm:size-28")).toBe(112);
    expect(fixedThumbWidth("h-24 w-24 shrink-0 sm:h-28 sm:w-28")).toBe(112);
    expect(fixedThumbWidth("size-[4.5rem] shrink-0")).toBe(72);
  });

  it("returns null for fluid images, which keep the card-width sizes", () => {
    expect(fixedThumbWidth("aspect-[4/3] w-full")).toBeNull();
    expect(fixedThumbWidth("absolute inset-0 h-full w-full object-cover")).toBeNull();
  });
});
