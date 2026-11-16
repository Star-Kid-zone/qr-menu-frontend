import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { LandingTemplateProps, RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import { FULL_SITE, SPARSE_SITE } from "@/components/site-system/fixtures";
import { LANDING_SECTIONS } from "../landing/registry";
import { LayoutPage } from "./LayoutPage";
import { LAYOUTS } from "./registry";
import { LANDING_SECTION_TYPES } from "./types";
import { LAYOUT_MENU_PAIRS, MENU_STRUCTURE_MAP } from "@/components/templates/menu/structureRegistry";

/**
 * Content contract for the site-system layouts (docs/site-system/PLAN.md
 * Step 4): with every section on, each value in the FULL fixture appears on
 * the page; with only a name (SPARSE), no section draws an empty box and the
 * footer still has the name, links and credit.
 */

/** Every layout — the original ten included — meets the same contract. */
const SYSTEM = LAYOUTS;
const NEW_LAYOUTS = ["grand-hall", "noir-salon", "atelier-editorial", "conservatory", "pier", "ember", "tatami", "bazaar", "supper-club", "midnight-diner"];

const Link: LandingTemplateProps["LinkComponent"] = ({ to, children, className, style }) => (
  <a href={to} className={className} style={style}>{children}</a>
);

const ALL_ON = {
  version: 1,
  landing: {
    sections: LANDING_SECTIONS.filter((d) => d.type !== "intro").map((d) => ({
      id: d.type,
      type: d.type,
      ...(d.type === "divider" ? { variant: "tile" } : {}),
      ...(d.type === "curated-list" ? { props: { title: "Fixture curated title", itemIds: ["4", "2"] } } : {}),
    })),
  },
};

function render(layoutKey: string, data: RawPublicSiteData, doc: unknown = ALL_ON) {
  const layout = LAYOUTS.find((l) => l.key === layoutKey)!;
  const d = { ...data, settings: { ...data.settings, site_document: doc } };
  return renderToStaticMarkup(
    <LayoutPage layout={layout} data={d} routeSlug="fixture" themeSlug="serif-elegance" menuHref="/menu" onPay={() => {}} onReview={() => {}} track={() => {}} LinkComponent={Link} />,
  );
}

/** Visible text of an HTML fragment (tags dropped, entities left). */
const text = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const MUST_SHOW: Array<[string, string]> = [
  ["name", "Fixture Royal Kitchen"],
  ["tagline", "Fixture tagline: a royal table"],
  ["badge", "Fixture badge"],
  ["marquee", "Fixture marquee words"],
  ["announcement", "Fixture announcement"],
  ["story headline", "Fixture story headline"],
  ["story body", "Fixture story body about the kitchen."],
  ["stat", "Fixture stat label"],
  ["signature dish", "Fixture Dal Makhani"],
  ["popular item", "Fixture Garlic Naan"],
  ["curated list title", "Fixture curated title"],
  ["curated item size", "Full"],
  ["offer", "Fixture offer title"],
  ["gallery photo", "photo-204.jpg"],
  ["review", "Fixture Reviewer"],
  ["award", "Fixture award title"],
  ["award publisher", "Fixture publisher"],
  ["team member", "Fixture Chef Name"],
  ["team role", "Fixture head chef"],
  ["event", "Fixture event title"],
  ["amenity", "Free Wi-Fi"],
  ["amenity note", "Fixture parking note"],
  ["hours", "Saturday"],
  ["address", "Fixture Street 12, Fixture City"],
  ["phone", "+91 90000 00001"],
  ["email", "fixture@example.test"],
  ["WhatsApp", "+91 90000 00002"],
  ["directions", "https://maps.example.test/fixture"],
  ["website", "fixture.example.test"],
  ["social", "https://instagram.com/fixture"],
  ["FAQ", "Fixture question?"],
  ["menu link", 'href="/menu"'],
  ["copyright", String(new Date().getFullYear())],
  ["credit", "Digital menu by"],
];

describe.each(SYSTEM.map((l) => [l.label, l.key] as const))("site-system layout: %s", (_label, key) => {
  const layout = SYSTEM.find((l) => l.key === key)!;

  it("implements all 20 section types", () => {
    expect(LANDING_SECTION_TYPES).toHaveLength(20);
    for (const type of LANDING_SECTION_TYPES) expect(typeof layout.sections[type]).toBe("function");
  });

  it.each(MUST_SHOW)("shows the %s", (_what, needle) => {
    expect(render(key, FULL_SITE)).toContain(needle);
  });

  it("uses the skin's tokens and the motion kit", () => {
    const html = render(key, FULL_SITE);
    expect(html).toContain("--site-font-display");
    expect(html).toContain("--site-footer-text");
    expect(html).toContain("site-motion-kit");
    // overflow-x: hidden on the page root would silently disable every sticky header.
    expect(html).toContain("overflow-x-clip");
    expect(html).not.toMatch(/data-layout="[^"]+"[^>]*overflow-x-hidden|overflow-x-hidden[^>]*data-layout=/);
  });

  it("leaves no empty boxes on a site with only a name", () => {
    const html = render(key, SPARSE_SITE);
    const chunks = html.split(/(?=<div id="section-)/).slice(1);
    for (const chunk of chunks) {
      const type = chunk.match(/data-section-type="([a-z-]+)"/)?.[1];
      if (type === "divider" || type === "intro") continue;
      const inner = chunk.replace(/^<div[^>]*>/, "");
      // Either nothing at all, or something to read.
      if (inner.startsWith("</div>")) continue;
      expect(text(inner).length, `${type} renders a box with nothing in it`).toBeGreaterThan(0);
    }
  });

  it.each([
    ["hours but no contact details", { ...SPARSE_SITE, business: { business_name: "Fixture Half", availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }] } }],
    ["contact details but no hours", { ...SPARSE_SITE, business: { business_name: "Fixture Half", phone: "+91 1", address: "Fixture Lane" } }],
  ] as const)("never leaves an empty column in Visit with %s", (_what, data) => {
    const html = render(key, data as RawPublicSiteData);
    const visit = html.split('data-section-type="visit"')[1]?.split('<div id="section-')[0] ?? "";
    const doc = new DOMParser().parseFromString(`<div>${visit}`, "text/html");
    for (const grid of Array.from(doc.querySelectorAll("[class*='grid']"))) {
      if (!/\bgrid\b/.test(grid.getAttribute("class") ?? "")) continue;
      for (const cell of Array.from(grid.children)) {
        if (cell.getAttribute("aria-hidden") === "true") continue;
        const filled = (cell.textContent ?? "").trim().length > 0 || /^(img|svg|iframe|figure)$/i.test(cell.tagName) || cell.querySelector("img,svg,iframe,figure");
        expect(filled, `${key}: empty grid cell in Visit: <${cell.tagName.toLowerCase()} class="${cell.getAttribute("class")}">`).toBeTruthy();
      }
    }
  });

  it("still gives a sparse site a footer with its name, links and credit", () => {
    const footer = render(key, SPARSE_SITE).split("<footer")[1] ?? "";
    expect(footer).toContain("Fixture Sparse Cafe");
    expect(footer).toContain("Digital menu by");
    expect(footer).toContain("Back to top");
    expect(footer).toContain("Scan for the menu");
  });

  it("renders the business type's words when the owner chose one", () => {
    const pub = { ...FULL_SITE, settings: { ...FULL_SITE.settings, business_type: "pub" } };
    expect(render(key, pub)).toContain("See the drinks");
  });

  it.runIf(NEW_LAYOUTS.includes(key))("pairs with a menu structure that exists", () => {
    expect(layout.menuStructure).toBeTruthy();
    expect(MENU_STRUCTURE_MAP[layout.menuStructure!]).toBeTruthy();
    expect(LAYOUT_MENU_PAIRS[layout.key]).toBe(layout.menuStructure);
  });
});

describe("token-only rule (PLAN §3 rule 5)", () => {
  const root = join(process.cwd(), "src", "components", "templates");
  const files = [
    ...NEW_LAYOUTS.map((key) => ({ key })).map((l) => join(root, "sections", "layouts", l.key, "index.tsx")),
    ...["BillOfFare", "Spotlight", "MagazineSpread", "DrinksList", "ShopShelf", "GardenCards", "CatchBoard", "GrillBoard", "BentoBox", "MarketStalls", "DecoCard", "Jukebox"].map((n) => join(root, "menu", "_shared", "structures", `MenuStructure${n}.tsx`)),
  ];

  it.each(files.map((f) => [f.split(/[\\/]/).slice(-2).join("/"), f]))("%s has no colour or font literals", (_name, file) => {
    const src = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(src).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(src).not.toMatch(/\brgba?\(/);
    expect(src).not.toMatch(/fontFamily:\s*["'`]/);
    // A font-family that points at a token is fine; a named face is not.
    expect(src).not.toMatch(/font-family:(?!var\()/);
  });

  it("every site-system layout is registered with a unique key", () => {
    expect(LAYOUTS.map((l) => l.key).slice(0, NEW_LAYOUTS.length)).toEqual(NEW_LAYOUTS);
    expect(Object.keys(LAYOUT_MENU_PAIRS).sort()).toEqual([...NEW_LAYOUTS].sort());
  });
});
