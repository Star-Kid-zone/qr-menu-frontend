import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TenantSchema } from "./TenantSchema";
import type { RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";

const make = (business: Record<string, unknown>, extra: Partial<RawPublicSiteData> = {}) =>
  ({ user_id: 1, settings: { public_slug: "cafe" }, business, payment: null, review: null, gallery: [], offers: [], menuItems: [], ...extra }) as RawPublicSiteData;

const parse = (html: string) => JSON.parse(html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "").replace(/\u003c/g, "<"));

describe("TenantSchema", () => {
  it("omits empty optional fields instead of emitting blanks", () => {
    const json = parse(renderToStaticMarkup(<TenantSchema data={make({ business_name: "Cafe", phone: "  ", address: "", logo_url: "" })} />));
    expect(json).toMatchObject({ "@type": "Restaurant", name: "Cafe" });
    for (const key of ["image", "telephone", "address", "description"]) expect(json).not.toHaveProperty(key);
  });

  it("includes fields that are filled in", () => {
    const json = parse(renderToStaticMarkup(<TenantSchema data={make({ business_name: "Cafe", phone: "123", address: "1 Main St" }, { settings: { public_slug: "cafe", logo_url: "https://i/l.png", hero_tagline: "Hot" } })} />));
    expect(json).toMatchObject({ telephone: "123", image: ["https://i/l.png"], description: "Hot", address: { streetAddress: "1 Main St" } });
  });

  it("escapes < so tenant text cannot close the script tag", () => {
    const html = renderToStaticMarkup(<TenantSchema data={make({ business_name: "</script><script>alert(1)</script>" })} />);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it("renders nothing without a business", () => {
    expect(renderToStaticMarkup(<TenantSchema data={make({}, { business: null })} />)).toBe("");
  });
});
