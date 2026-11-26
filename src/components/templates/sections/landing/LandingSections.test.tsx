import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BaseTemplate from "@/components/templates/landing/_shared/BaseTemplate";
import { LANDING_THEME_DATA } from "@/components/templates/landing/_shared/themeData";
import type { LandingTemplateProps, RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";
import { LANDING_SECTIONS } from "./registry";

const Link: LandingTemplateProps["LinkComponent"] = ({ to, children }) => <a href={to}>{children}</a>;

function renderSite(siteDocument: unknown) {
  const data: RawPublicSiteData = {
    user_id: '1',
    settings: { site_document: siteDocument, story_headline: "Our roots", menubtn_status: 1 },
    business: { business_name: "Vimal Kitchen", phone: "+911234" },
    payment: null,
    review: null,
    gallery: [],
    offers: [],
    menuItems: [],
    faqs: [{ question: "Parking?", answer: "Yes" }],
  };
  const html = renderToStaticMarkup(
    <BaseTemplate
      theme={LANDING_THEME_DATA["swiss-international"]}
      data={data}
      routeSlug="vimal"
      menuHref="/menu"
      onPay={() => {}}
      onReview={() => {}}
      track={() => {}}
      LinkComponent={Link}
    />,
  );
  // Parsed into a detached element: attaching it would make happy-dom try to fetch the Google Fonts <link>.
  const container = document.createElement("div");
  container.innerHTML = html;
  const queryByText = (text: string) =>
    Array.from(container.querySelectorAll("*")).find((el) => el.children.length === 0 && el.textContent === text) ?? null;
  return { container, queryByText };
}

const renderedTypes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[data-section-type]")).map((el) => el.getAttribute("data-section-type"));

describe("landing sections", () => {
  it("registers unique types", () => {
    const typesList = LANDING_SECTIONS.map((d) => d.type);
    expect(new Set(typesList).size).toBe(typesList.length);
  });

  it("renders every default-visible section in default order when the site is not customised", () => {
    const { container } = renderSite(null);
    // Sections added later (e.g. dividers) start hidden, so an untouched site looks as it always did.
    expect(renderedTypes(container)).toEqual(LANDING_SECTIONS.filter((d) => d.defaultVisible).map((d) => d.type));
  });

  it("follows the saved order and leaves hidden sections out", () => {
    const { container, queryByText } = renderSite({
      version: 1,
      landing: {
        sections: [
          { id: "faq", type: "faq" },
          { id: "hero", type: "hero" },
          { id: "story", type: "story", hidden: true },
          { id: "footer", type: "footer", hidden: true },
        ],
      },
    });
    const order = renderedTypes(container);
    expect(order.indexOf("faq")).toBeLessThan(order.indexOf("hero"));
    expect(order).not.toContain("story");
    expect(order).not.toContain("footer");
    expect(queryByText("Our roots")).toBeNull();
    expect(queryByText("Parking?")).not.toBeNull();
  });

  it("exposes the theme as CSS variables on the page root", () => {
    const { container } = renderSite(null);
    const root = container.querySelector(".min-h-dvh") as HTMLElement;
    expect(root.style.getPropertyValue("--site-accent")).not.toBe("");
  });
});

describe("footer position", () => {
  it("always renders last, whatever order was saved", async () => {
    const { visibleSections } = await import("../document");
    const known = { has: () => true };
    const order = visibleSections([{ id: "footer", type: "footer" }, { id: "stats", type: "stats" }, { id: "hero", type: "hero" }], known).map((s) => s.type);
    expect(order).toEqual(["stats", "hero", "footer"]);
  });
});