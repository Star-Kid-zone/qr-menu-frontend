import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FULL_SITE } from "../fixtures";
import { amenityViews, buildSiteContent, curatedList, eventView } from "./content";
import { googleFontsHrefs, lookFromSettings } from "./look";
import { Counter, LineReveal, MOTION_CSS } from "./motion";
import { footerInk } from "../tokens";
import { getSkin } from "../skins";
import { contrastRatio } from "@/utils/contrast";
import { CANDLE_ANIMATION, EMBER_ANIMATION, SPARKLE_ANIMATION, VINE_ANIMATION } from "./lottie/animations";
import { openStatusAt } from "./openStatus";
import { LOTTIE_IDS } from "./lottie/SiteLottie";
import { todayHoursLine } from "./blocks";
import type { Menu } from "@/types";

describe("site content", () => {
  it("keeps known amenities once each, with labels and notes", () => {
    const v = amenityViews([{ id: "wifi" }, { id: "wifi" }, { id: "helipad" }, { id: "parking", note: " Basement " }, null]);
    expect(v).toEqual([
      { id: "wifi", label: "Free Wi-Fi", icon: "wifi" },
      { id: "parking", label: "Parking", icon: "parking", note: "Basement" },
    ]);
  });

  it("formats events in the restaurant's time zone", () => {
    const e = eventView({ id: "1", title: "Jazz", description: null, startsAt: "2026-12-04T13:30:00.000Z", endsAt: "2026-12-04T16:30:00.000Z", imageUrl: null, linkUrl: "javascript:alert(1)" }, "Asia/Kolkata")!;
    expect(e.dateLabel).toBe("Friday 4 December");
    expect(e.timeLabel).toBe("7:00 pm – 10:00 pm");
    expect(e.linkUrl).toBeNull();
    const allDay = eventView({ id: "2", title: "Fair", description: null, startsAt: "2026-12-05T00:00:00+05:30", endsAt: null, imageUrl: null, linkUrl: null }, "Asia/Kolkata")!;
    expect(allDay.timeLabel).toBe("");
  });

  it("builds the model from the payload, events in date order", () => {
    const m = buildSiteContent(
      { ...FULL_SITE, events: [{ ...FULL_SITE.events![0], id: "b", startsAt: "2099-02-01T10:00:00Z" }, { ...FULL_SITE.events![0], id: "a" }] },
      new Date("2026-11-16T10:00:00Z"),
    );
    expect(m.events.map((e) => e.id)).toEqual(["a", "b"]);
    expect(m.todayName).toBe("Monday");
    expect(m.amenities).toHaveLength(2);
    expect(m.awards[0].title).toBe("Fixture award title");
  });

  it("curated list keeps the owner's order, skips missing items and caps at 12", () => {
    const items = FULL_SITE.menuItems as Menu[];
    const list = curatedList({ itemIds: ["3", "99", "1"], title: "  Picks  " }, items, "₹", "Fallback");
    expect(list.title).toBe("Picks");
    expect(list.items.map((d) => d.name)).toEqual(["Fixture Dal Makhani", "Fixture Butter Chicken"]);
    expect(curatedList(undefined, items, "₹", "Fallback")).toEqual({ title: "Fallback", items: [] });
    expect(curatedList({ itemIds: Array.from({ length: 20 }, () => "1") }, items, "₹", "x").items).toHaveLength(12);
  });

  it("today's hours line", () => {
    const hours = [{ day: "Monday", hours: "12:00 — 23:00", startTime: "12:00", endTime: "23:00" }, { day: "Tuesday", hours: "Closed" }];
    expect(todayHoursLine(hours, "Monday")).toBe("Open today 12:00 – 23:00");
    expect(todayHoursLine(hours, "tuesday")).toBe("Closed today");
    expect(todayHoursLine(hours, "Sunday")).toBeNull();
  });
});

describe("look", () => {
  it("menu page prefers menu colours, then the landing ones", () => {
    const look = lookFromSettings({ skin_id: "royal-velvet", primary_color: "#112233", menu_primary_color: "#445566", accent_color: "#FAFAFA" }, "x", "menu");
    expect(look.palette.accent).toBe("#445566");
    expect(look.palette.bg).toBe("#FAFAFA");
    expect(lookFromSettings({ skin_id: "royal-velvet", primary_color: "#112233" }, "x").palette.accent).toBe("#112233");
  });

  it("loads display and reading faces as separate font requests", () => {
    const urls = googleFontsHrefs({ fonts: { display: '"Bebas Neue",sans-serif', body: '"Inter",sans-serif' } });
    expect(urls).toEqual([
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    ]);
  });

  it("footer text is readable on every flagship skin's footer", () => {
    for (const id of ["royal-velvet", "ivory-atelier", "fresh-grid", "broadsheet", "farmhouse", "glasshouse", "block-party", "diner-print", "after-hours", "orbit", "soft-clay", "arcade"]) {
      const p = getSkin(id)!.palette;
      const ink = footerInk(p)["--site-footer-text"];
      expect(contrastRatio(ink, p.footer), id).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("motion kit", () => {
  it("renders headline words as real text, ready to animate", () => {
    const out = renderToStaticMarkup(<LineReveal text="Casa Nonna Kitchen" id="t" />);
    expect(out).toContain('id="t"');
    expect(out.match(/class="sk-rise"/g)).toHaveLength(3);
    expect(out.replace(/<[^>]+>/g, "")).toBe("Casa Nonna Kitchen");
  });

  it("counters render the final value on the server", () => {
    expect(renderToStaticMarkup(<Counter value="120k" />)).toContain(">120k<");
  });

  it("switches every animation off for reduced motion and the owner's motion setting", () => {
    expect(MOTION_CSS).toContain("prefers-reduced-motion: reduce");
    expect(MOTION_CSS).toContain('[data-motion="off"]');
    // Only transform / opacity / clip-path are animated.
    const keyframes = MOTION_CSS.match(/@keyframes[^{]+\{([^@]*?)\}\}/g) ?? [];
    expect(keyframes.length).toBeGreaterThan(5);
    for (const k of keyframes) expect(k).not.toMatch(/\b(width|height|top|left|margin|padding)\s*:/);
  });
});

describe("lottie kit", () => {
  it.each([["sparkle", SPARKLE_ANIMATION], ["candle", CANDLE_ANIMATION]] as const)("%s draws in the accent slot", (_n, a) => {
    expect(a.slots.accent).toBeTruthy();
    expect(a.layers.length).toBeGreaterThan(0);
    expect(JSON.stringify(a)).toContain('"sid":"accent"');
    expect(a.op).toBeGreaterThan(a.ip);
  });

  it("registers every animation", () => {
    expect([...LOTTIE_IDS].sort()).toEqual([
      "baubles", "beer", "boat", "cake", "candle", "cheers", "colour-burst", "confetti", "crescent", "dandiya",
      "diya", "egg", "embers", "fireworks", "flag", "hearts", "kite", "lantern", "leaves", "marigold",
      "pumpkin", "rakhi", "shamrock", "snowfall", "sparkle", "steam", "sun", "vines",
    ]);
  });

  it.each([["vines", VINE_ANIMATION], ["embers", EMBER_ANIMATION]] as const)("%s draws in the accent slot", (_n, a) => {
    expect(JSON.stringify(a)).toContain('"sid":"accent"');
    expect(a.layers.length).toBeGreaterThan(3);
  });
});

describe("open status", () => {
  const hours = [
    { day: "Monday", hours: "12:00 — 23:00", startTime: "12:00", endTime: "23:00" },
    { day: "Friday", hours: "18:00 — 02:00", startTime: "18:00", endTime: "02:00" },
    { day: "Tuesday", hours: "Closed" },
  ];
  // 2026-11-16 is a Monday. Times are UTC; the zone is UTC so the clock reads the same.
  const at = (iso: string) => openStatusAt(hours, "UTC", new Date(iso));

  it("counts down to closing while open", () => {
    expect(at("2026-11-16T20:46:00Z")).toEqual({ open: true, label: "Closes in 2 h 14 min", minutes: 134 });
  });
  it("says when it opens before opening", () => {
    expect(at("2026-11-16T09:30:00Z")).toEqual({ open: false, label: "Opens at 12:00", minutes: 150 });
  });
  it("closed after hours, and on closed days", () => {
    expect(at("2026-11-16T23:30:00Z")?.label).toBe("Closed for today");
    expect(at("2026-11-17T12:00:00Z")?.label).toBe("Closed today");
  });
  it("handles closing after midnight", () => {
    expect(at("2026-11-20T23:00:00Z")).toEqual({ open: true, label: "Closes in 3 h", minutes: 180 });
  });
  it("uses the restaurant's time zone", () => {
    // 07:30 UTC = 13:00 in Kolkata, Monday: open.
    expect(openStatusAt(hours, "Asia/Kolkata", new Date("2026-11-16T07:30:00Z"))?.open).toBe(true);
  });
  it("is null with no hours, or no row for today", () => {
    expect(openStatusAt([], "UTC", new Date())).toBeNull();
    expect(at("2026-11-22T12:00:00Z")).toBeNull();
  });
});
