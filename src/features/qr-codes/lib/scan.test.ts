import { describe, expect, it } from "vitest";
import { DEFAULT_QR_DESIGN } from "@/constants/qrCodes.constants";
import { buildScanReport, scanDistanceCm } from "./scan";

const base = DEFAULT_QR_DESIGN;

describe("buildScanReport", () => {
  it("passes the default design", () => {
    expect(buildScanReport(base, 50)).toEqual({ tone: "good", issues: [] });
  });

  it("fails dots that are too close to the background", () => {
    expect(buildScanReport({ ...base, dataColor: "#eeeeee" }, 50).tone).toBe("bad");
  });

  it("warns on light dots on a dark background", () => {
    const r = buildScanReport({ ...base, dataColor: "#ffffff", finderColor: "#ffffff", backgroundFill: "#000000" }, 50);
    expect(r.tone).toBe("warn");
    expect(r.issues.some((i) => i.message.includes("Light dots"))).toBe(true);
  });

  it("warns on decorative dots, a missing border and tiny prints", () => {
    expect(buildScanReport({ ...base, dataPattern: "star" }, 50).tone).toBe("warn");
    expect(buildScanReport({ ...base, margin: 0, frame: { ...base.frame, layout: "none" } }, 50).tone).toBe("warn");
    expect(buildScanReport({ ...base, margin: 0 }, 50).tone).toBe("good"); // frames bring their own border
    expect(buildScanReport(base, 15).tone).toBe("warn");
  });
});

describe("scanDistanceCm", () => {
  it("is about ten times the code width", () => {
    expect(scanDistanceCm(52.5)).toBe(53);
  });
});
