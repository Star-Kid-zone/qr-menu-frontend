import { describe, expect, it } from "vitest";
import { parseHex, toHex6 } from "./contrast";

describe("colour helpers", () => {
  it("expands short hex and ignores alpha", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("#00000080")).toEqual([0, 0, 0]);
  });

  it("returns null for invalid input", () => {
    expect(parseHex("red")).toBeNull();
    expect(parseHex("")).toBeNull();
  });

  it("normalises computed colours", () => {
    expect(toHex6("rgb(255, 0, 16)")).toBe("#ff0010");
    expect(toHex6("rgba(0, 0, 0, 0)")).toBeNull();
    expect(toHex6("#ABC")).toBe("#aabbcc");
  });
});
