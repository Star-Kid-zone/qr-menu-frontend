import { describe, it, expect } from "vitest";
import { isApiId } from "../ids";

describe("isApiId", () => {
  it("accepts the string ids the API returns, including values past 2^53", () => {
    expect(isApiId("42")).toBe(true);
    expect(isApiId("9007199254740993")).toBe(true);
  });

  it("rejects numbers, empty strings and anything that is not an id", () => {
    expect(isApiId(42)).toBe(false);
    expect(isApiId("")).toBe(false);
    expect(isApiId("12abc")).toBe(false);
    expect(isApiId("../1")).toBe(false);
    expect(isApiId(undefined)).toBe(false);
  });
});
