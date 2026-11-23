import { describe, expect, it } from "vitest";
import { BUSINESS_TYPES } from "@/components/site-system/business-types";
import { DEFAULT_QR_DESIGN, QR_FRAMES, QR_PRINT_SIZES } from "@/constants/qrCodes.constants";
import { frameRenderer } from "../frames";
import { contrastRatio, luminance } from "./color";
import {
  activeFrame,
  brandPalette,
  configFromDesign,
  designFromConfig,
  recommendedFrames,
  sameDesign,
  tableLabel,
  withPalette,
} from "./design";

const urls = { menu: "http://roma.localhost:3000/menu", website: "http://roma.localhost:3000/" };

describe("designFromConfig", () => {
  it("fills every field from defaults when nothing is saved", () => {
    const d = designFromConfig(null, urls);
    expect(d).toEqual({ ...DEFAULT_QR_DESIGN, frame: { ...DEFAULT_QR_DESIGN.frame } });
  });

  it("reads the destination from an older config that only stored the website URL", () => {
    expect(designFromConfig({ url: urls.website }, urls).destination).toBe("website");
    expect(designFromConfig({ url: "http://old-slug.localhost:3000/menu" }, urls).destination).toBe("menu");
  });

  it("falls back for unknown shapes, frame ids, layouts and colours", () => {
    const d = designFromConfig(
      {
        dataPattern: "zigzag",
        dataColor: "red",
        frame: { layout: "poster", cardId: "badge", stickerId: "nope", paper: "#12345", printSize: "a0" } as never,
      },
      urls,
    );
    expect(d.dataPattern).toBe("square");
    expect(d.dataColor).toBe(DEFAULT_QR_DESIGN.dataColor);
    expect(d.frame.layout).toBe("card");
    expect(d.frame.cardId).toBe("classic"); // a sticker id is not a card
    expect(d.frame.stickerId).toBe("badge");
    expect(d.frame.paper).toBe(DEFAULT_QR_DESIGN.frame.paper);
    expect(d.frame.printSize).toBe("a6");
  });

  it("trims over-long text to the limits", () => {
    const d = designFromConfig({ frame: { headline: "x".repeat(80) } as never }, urls);
    expect(d.frame.headline).toHaveLength(40);
  });
});

describe("configFromDesign", () => {
  it("rebuilds the URL from the destination, so a new address follows through", () => {
    const d = { ...DEFAULT_QR_DESIGN, destination: "website" as const };
    expect(configFromDesign(d, urls).url).toBe(urls.website);
    expect(configFromDesign({ ...d, destination: "menu" }, urls).url).toBe(urls.menu);
  });

  it("round-trips through designFromConfig", () => {
    const d = withPalette({ ...DEFAULT_QR_DESIGN, frame: { ...DEFAULT_QR_DESIGN.frame, layout: "sticker", stickerId: "seal", printSize: "s75", tableNumbers: true } }, QR_FRAMES[0].palettes[1]);
    const back = designFromConfig(configFromDesign(d, urls), urls);
    expect(sameDesign(back, d)).toBe(true);
  });

  it("stores the export width at 300 dpi", () => {
    expect(configFromDesign(DEFAULT_QR_DESIGN, urls).size).toBe(1240); // A6 width
  });
});

describe("frame catalogue", () => {
  it.each(QR_FRAMES.map((f) => [f.id, f] as const))("%s has artwork and palettes", (_id, frame) => {
    expect(frameRenderer(frame.id)).not.toBeNull();
    expect(frame.palettes.length).toBeGreaterThanOrEqual(1);
  });

  it("has unique ids", () => {
    expect(new Set(QR_FRAMES.map((f) => f.id)).size).toBe(QR_FRAMES.length);
  });

  it.each(QR_FRAMES.flatMap((f) => f.palettes.map((p) => [`${f.id}/${p.id}`, p] as const)))(
    "%s keeps the code dark on light with good contrast",
    (_name, palette) => {
      const d = withPalette(DEFAULT_QR_DESIGN, palette);
      expect(contrastRatio(d.dataColor, d.backgroundFill)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(d.finderColor, d.backgroundFill)).toBeGreaterThanOrEqual(3);
      expect(luminance(d.dataColor)).toBeLessThan(luminance(d.backgroundFill));
    },
  );

  it("puts frames drawn for the business type first, then universal ones", () => {
    const list = recommendedFrames("card", "pizzeria");
    const exact = list.filter((f) => f.businessTypes.includes("pizzeria"));
    expect(list.slice(0, exact.length)).toEqual(exact);
    expect(exact.map((f) => f.id)).toEqual(expect.arrayContaining(["trattoria", "olive"]));
    expect(list.slice(exact.length).every((f) => f.families === "all")).toBe(true);
    expect(new Set(list.map((f) => f.id)).size).toBe(list.length);
  });

  it.each(BUSINESS_TYPES.filter((b) => b.id !== "generic").map((b) => [b.id] as const))(
    "has at least three table cards drawn for %s",
    (id) => {
      expect(QR_FRAMES.filter((f) => f.format === "card" && f.businessTypes.includes(id)).length).toBeGreaterThanOrEqual(3);
    },
  );

  it("has plenty of each format", () => {
    expect(QR_FRAMES.filter((f) => f.format === "card").length).toBeGreaterThanOrEqual(76);
    expect(QR_FRAMES.filter((f) => f.format === "sticker").length).toBeGreaterThanOrEqual(28);
  });

  it("returns the selected frame for the layout, or null for a bare code", () => {
    expect(activeFrame({ ...DEFAULT_QR_DESIGN.frame, layout: "sticker" })?.id).toBe("badge");
    expect(activeFrame({ ...DEFAULT_QR_DESIGN.frame, layout: "none" })).toBeNull();
  });

  it("has three print sizes per layout", () => {
    expect(Object.values(QR_PRINT_SIZES).every((s) => s.length === 3)).toBe(true);
  });
});

describe("brandPalette and tableLabel", () => {
  it("builds a palette from the site colours, or nothing without them", () => {
    expect(brandPalette({ primaryColor: "#aa3300", textPrimaryColor: "#eeeeee" })).toMatchObject({ accent: "#aa3300", ink: "#1C1526" });
    expect(brandPalette({ primaryColor: "" })).toBeNull();
  });

  it("labels a table only when numbers are on", () => {
    expect(tableLabel({ ...DEFAULT_QR_DESIGN.frame, tableNumbers: true, tablePrefix: "Mesa" }, 7)).toBe("Mesa 7");
    expect(tableLabel({ ...DEFAULT_QR_DESIGN.frame, tableNumbers: false }, 7)).toBe("");
  });
});
