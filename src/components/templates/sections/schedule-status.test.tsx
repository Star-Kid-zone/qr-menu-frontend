import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { activeSiteStatus, isScheduledOn, parseSiteDocument, todayIn, visibleSections } from "./document";
import { SiteStatusBanner } from "./SiteStatusBanner";
import { scheduleSummary } from "@/features/workspace/components/SectionsPanel";

describe("todayIn", () => {
  const instant = new Date("2026-11-09T20:00:00Z");

  it("uses the restaurant's zone, not the server's", () => {
    expect(todayIn("UTC", instant)).toBe("2026-11-09");
    expect(todayIn("Asia/Kolkata", instant)).toBe("2026-11-10"); // 01:30 next day
    expect(todayIn("America/Los_Angeles", instant)).toBe("2026-11-09");
  });

  it("falls back to UTC for a missing or unknown zone", () => {
    expect(todayIn(undefined, instant)).toBe("2026-11-09");
    expect(todayIn("Not/AZone", instant)).toBe("2026-11-09");
  });
});

describe("section schedules", () => {
  const s = (from?: string, to?: string) => ({ schedule: { ...(from ? { from } : {}), ...(to ? { to } : {}) } });

  it("includes both end dates", () => {
    expect(isScheduledOn(s("2026-12-01", "2026-12-31"), "2026-12-01")).toBe(true);
    expect(isScheduledOn(s("2026-12-01", "2026-12-31"), "2026-12-31")).toBe(true);
    expect(isScheduledOn(s("2026-12-01", "2026-12-31"), "2026-11-30")).toBe(false);
    expect(isScheduledOn(s("2026-12-01", "2026-12-31"), "2027-01-01")).toBe(false);
  });

  it("supports open-ended windows and no schedule", () => {
    expect(isScheduledOn(s(undefined, "2026-12-31"), "2020-01-01")).toBe(true);
    expect(isScheduledOn(s("2026-12-01"), "2030-01-01")).toBe(true);
    expect(isScheduledOn({}, "2030-01-01")).toBe(true);
  });

  it("visibleSections drops sections outside their window only when a date is given", () => {
    const list = [{ id: "a", type: "offers", schedule: { to: "2026-01-01" } }, { id: "b", type: "faq" }];
    const known = new Set(["offers", "faq"]);
    expect(visibleSections(list, known, "2026-06-01").map((x) => x.id)).toEqual(["b"]);
    expect(visibleSections(list, known).map((x) => x.id)).toEqual(["a", "b"]);
  });

  it("parses schedules defensively", () => {
    const doc = parseSiteDocument({
      version: 1,
      landing: { sections: [{ id: "a", type: "offers", schedule: { from: "bad", to: "2026-12-31" } }, { id: "b", type: "faq", schedule: { from: 5 } }] },
    });
    expect(doc?.landing?.sections[0].schedule).toEqual({ to: "2026-12-31" });
    expect(doc?.landing?.sections[1].schedule).toBeUndefined();
  });

  it("summarises a window for the editor", () => {
    expect(scheduleSummary(undefined, "2026-11-09")).toBeNull();
    expect(scheduleSummary({ from: "2026-12-01", to: "2026-12-31" }, "2026-11-09")).toBe("Shows 1 Dec – 31 Dec");
    expect(scheduleSummary({ from: "2026-12-01" }, "2026-11-09")).toBe("Starts 1 Dec");
    expect(scheduleSummary({ to: "2026-12-31" }, "2026-11-09")).toBe("Until 31 Dec");
    expect(scheduleSummary({ to: "2026-11-01" }, "2026-11-09")).toBe("Ended 1 Nov");
  });
});

describe("site status", () => {
  const doc = (status: unknown) => ({ version: 1, status });

  it("is inactive when open, missing, or the reopen date has arrived", () => {
    expect(activeSiteStatus(null, "2026-11-09")).toBeNull();
    expect(activeSiteStatus(doc({ mode: "open" }), "2026-11-09")).toBeNull();
    expect(activeSiteStatus(doc({ mode: "holiday", until: "2026-11-09" }), "2026-11-09")).toBeNull();
    expect(activeSiteStatus(doc({ mode: "holiday", until: "2026-11-10" }), "2026-11-09")?.mode).toBe("holiday");
    expect(activeSiteStatus(doc({ mode: "gone-fishing" }), "2026-11-09")).toBeNull();
  });

  it("banner shows the default line, a custom message and the reopen date", () => {
    const html = (status: unknown) => renderToStaticMarkup(<SiteStatusBanner settings={{ site_document: doc(status), timezone: "UTC" }} />);
    expect(html({ mode: "renovation", until: "2099-03-05" })).toContain("We&#x27;re closed for renovation.");
    expect(html({ mode: "renovation", until: "2099-03-05" })).toContain("We reopen on 5 March 2099.");
    expect(html({ mode: "closed-today", message: "Private event tonight" })).toContain("Private event tonight");
    expect(html({ mode: "open" })).toBe("");
    expect(html({ mode: "holiday", until: "2000-01-01" })).toBe("");
  });
});
