import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import BaseTemplate from "@/components/templates/landing/_shared/BaseTemplate";
import { LANDING_THEME_DATA } from "@/components/templates/landing/_shared/themeData";
import type { LandingTemplateProps, RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";
import { SectionsPanel } from "@/features/workspace/components/SectionsPanel";
import type { SiteDocument } from "../types";
import { LANDING_SECTIONS } from "./registry";

const Link: LandingTemplateProps["LinkComponent"] = ({ to, children }) => <a href={to}>{children}</a>;

function html(siteDocument: unknown): string {
  const data: RawPublicSiteData = {
    user_id: 1,
    settings: { site_document: siteDocument, menubtn_status: 1 },
    business: { business_name: "Vimal Kitchen" },
    payment: null,
    review: null,
    gallery: Array.from({ length: 9 }, (_, i) => ({ image_url: `/g${i + 1}.jpg` })),
    offers: [],
    menuItems: [],
  };
  return renderToStaticMarkup(
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
}

const withVariant = (type: string, variant: string) => ({ version: 1, landing: { sections: [{ id: type, type, variant }] } });

describe("section variants on the default page", () => {
  it("every variant list starts with the default and has unique values", () => {
    for (const def of LANDING_SECTIONS) {
      if (!def.variants) continue;
      expect(new Set(def.variants.map((v) => v.value)).size).toBe(def.variants.length);
    }
  });

  it("hero: full by default, shorter as a banner, two columns when split", () => {
    expect(html(null)).toContain("h-[100svh]");
    expect(html(withVariant("hero", "banner"))).toContain("h-[55svh]");
    const split = html(withVariant("hero", "split"));
    expect(split).not.toContain("h-[100svh]");
    expect(split).toContain("lg:grid-cols-2");
    expect(split).toContain("Vimal Kitchen");
  });

  it("gallery: grid shows 6 photos, strip shows up to 12 in a focusable scroll region", () => {
    const count = (h: string) => (h.match(/alt="Gallery \d+"/g) ?? []).length;
    expect(count(html(null))).toBe(6);
    const strip = html(withVariant("gallery", "strip"));
    expect(count(strip)).toBe(9);
    expect(strip).toMatch(/role="region"[^>]*tabindex="0"|tabindex="0"[^>]*role="region"/i);
  });

  it("an unknown variant falls back to the default design", () => {
    expect(html(withVariant("hero", "does-not-exist"))).toContain("h-[100svh]");
  });
});

describe("variant picker in the Sections panel", () => {
  it("stores a non-default design and clears it when set back to the default", () => {
    const onChange = vi.fn();
    const { rerender } = render(<SectionsPanel value={null} structureKey="" disabled={false} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Hero design"), { target: { value: "split" } });
    const doc = onChange.mock.calls[0][0] as SiteDocument;
    expect(doc.landing?.sections.find((s) => s.type === "hero")?.variant).toBe("split");

    rerender(<SectionsPanel value={doc} structureKey="" disabled={false} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Hero design"), { target: { value: "full" } });
    const back = onChange.mock.calls[1][0] as SiteDocument;
    expect(back.landing?.sections.find((s) => s.type === "hero")?.variant).toBeUndefined();
  });

  it("in a designed layout, only offers designs that layout uses (no choice the preview would ignore)", () => {
    render(<SectionsPanel value={null} structureKey="dashboard" disabled={false} onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Hero design")).toBeNull();
    expect(screen.queryByLabelText("Photos design")).toBeNull();
    expect(screen.getByLabelText("Decorative divider design")).toBeInTheDocument();
    expect(screen.getByLabelText("Opening screen design")).toBeInTheDocument();
  });
});
