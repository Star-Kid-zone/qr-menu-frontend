import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { LandingTemplateProps, RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";
import { LayoutPage } from "./LayoutPage";
import { LAYOUTS } from "./registry";
import { LANDING_SECTION_TYPES } from "./types";
import { LANDING_SECTIONS } from "../landing/registry";

/**
 * The contract every designed layout must meet: it shows ALL of a
 * restaurant's content, follows the owner's order and hidden sections, and
 * never crashes on an empty site.
 */

const full: RawPublicSiteData = {
  user_id: 1,
  settings: {
    public_slug: "vimal",
    logo_url: "/logo.png",
    banner_url: "/banner.jpg",
    announcement_enabled: 1,
    announcement_text: "Open late Fridays",
    theme_badge: "Since 1998",
    hero_tagline: "Fresh daily tagline",
    theme_marquee: "Wood fired marquee",
    story_headline: "Our roots headline",
    story_body: "Three generations of cooks.",
    stats: [{ label: "Years open", value: "25" }, { label: "Dishes", value: "80" }],
    menubtn_status: 1,
    paybtn_status: 1,
    reviewbtn_status: 1,
  },
  business: {
    business_name: "Vimal Kitchen",
    phone: "+911234567",
    address: "1 Main Street",
    email: "hello@vimal.example",
    whatsapp_number: "+91 999",
    location_url: "https://maps.example.com/x",
    website_url: "vimal.example",
    social_links: [{ url: "https://instagram.com/v", platform: "instagram", name: "Instagram" }],
    availability: [{ day: "Monday", startTime: "09:00", endTime: "22:00" }],
  },
  payment: { payment_link: "https://pay.example.com", payment_type: "url" },
  review: { review_link: "https://g.page/r/x" },
  gallery: [{ image_url: "/g1.jpg" }, { image_url: "/g2.jpg" }, { image_url: "/g3.jpg" }],
  offers: [{ title: "Lunch deal offer", description: "Two for one", offer_value: "20", offer_type: "percentage" }],
  menuItems: [
    { id: 1, item: "Signature Biryani", description: "Spiced rice", price: "12", popular: false, image_url: "/b.jpg", category: "Mains" },
    { id: 2, item: "Popular Dosa", description: "Crisp", price: "6", popular: true, image_url: null, category: "Breakfast" },
  ] as unknown as RawPublicSiteData["menuItems"],
  faqs: [{ question: "Is there parking?", answer: "Yes, free parking." }],
  googleReviews: [{ id: 1, authorName: "Asha Review", authorPhotoUrl: null, rating: 5, text: "Great food", relativePublishDescription: "a week ago" }],
  currency: { symbol: "₹" },
};

const empty: RawPublicSiteData = { user_id: 2, settings: {}, business: null, payment: null, review: null, gallery: [], offers: [], menuItems: [] };

const Link: LandingTemplateProps["LinkComponent"] = ({ to, children, className, style }) => (
  <a href={to} className={className} style={style}>{children}</a>
);

function html(layoutIndex: number, data: RawPublicSiteData, siteDocument?: unknown) {
  const layout = LAYOUTS[layoutIndex];
  const d = siteDocument === undefined ? data : { ...data, settings: { ...data.settings, site_document: siteDocument } };
  return renderToStaticMarkup(
    <LayoutPage layout={layout} data={d} routeSlug="vimal" themeSlug="swiss-international" menuHref="/menu" onPay={() => {}} onReview={() => {}} track={() => {}} LinkComponent={Link} />,
  );
}

/** Every section on (incl. the ones hidden by default) + a divider, in registry order. */
const ALL_ON = { version: 1, landing: { sections: LANDING_SECTIONS.map((d) => ({ id: d.type, type: d.type, ...(d.type === "divider" ? { variant: "tile" } : {}) })) } };

const MUST_SHOW: Array<[string, string]> = [
  ["business name", "Vimal Kitchen"],
  ["announcement", "Open late Fridays"],
  ["hero tagline", "Fresh daily tagline"],
  ["scrolling strip", "Wood fired marquee"],
  ["stats", "Years open"],
  ["story", "Our roots headline"],
  ["signature dish", "Signature Biryani"],
  ["popular item", "Popular Dosa"],
  ["offer", "Lunch deal offer"],
  ["gallery photo", "g2.jpg"],
  ["review", "Asha Review"],
  ["opening hours", "Monday"],
  ["address", "1 Main Street"],
  ["phone", "+911234567"],
  ["FAQ", "Is there parking?"],
  ["menu link", 'href="/menu"'],
  ["copyright", String(new Date().getFullYear())],
];

describe.each(LAYOUTS.map((l, i) => [l.label, i] as const))("layout: %s", (_label, i) => {
  const layout = LAYOUTS[i];

  it("implements every section type", () => {
    for (const type of LANDING_SECTION_TYPES) expect(typeof layout.sections[type]).toBe("function");
  });

  it.each(MUST_SHOW)("shows the %s", (_what, needle) => {
    expect(html(i, full, ALL_ON)).toContain(needle);
  });

  it("draws the decorative divider as an SVG", () => {
    const out = html(i, full, ALL_ON);
    const divider = out.split('data-section-type="divider"')[1] ?? "";
    expect(divider.slice(0, 4000)).toMatch(/<svg/);
  });

  it("has a navigation bar linking to real sections", () => {
    const out = html(i, full, ALL_ON);
    const links = [...out.matchAll(/href="#(section-[a-z0-9_-]+)"/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const id of links) expect(out).toContain(`id="${id}"`);
  });

  it("leaves hidden sections out and follows the saved order", () => {
    const doc = { version: 1, landing: { sections: [{ id: "faq", type: "faq" }, { id: "hero", type: "hero" }, { id: "offers", type: "offers", hidden: true }] } };
    const out = html(i, full, doc);
    expect(out).not.toContain("Lunch deal offer");
    expect(out.indexOf('data-section-type="faq"')).toBeLessThan(out.indexOf('data-section-type="hero"'));
  });

  it("renders an empty site without crashing", () => {
    expect(() => html(i, empty)).not.toThrow();
    expect(html(i, empty).length).toBeGreaterThan(200);
  });
});

describe("layout registry", () => {
  it("keeps the ten saved keys so existing sites carry over, plus the site-system layouts", () => {
    const original = ["cards", "compact", "dashboard", "horizontal-split", "magazine", "minimal", "sidebar-right", "split", "story", "tabs"];
    const keys = LAYOUTS.map((l) => l.key);
    for (const k of original) expect(keys).toContain(k);
    expect(keys.filter((k) => !original.includes(k)).sort()).toEqual(
      ["atelier-editorial", "bazaar", "conservatory", "ember", "grand-hall", "midnight-diner", "noir-salon", "pier", "supper-club", "tatami"],
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

});
