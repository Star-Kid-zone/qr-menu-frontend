import { describe, it, expect } from "vitest";
import { buildTenantMetadata, readBusinessSeo } from "./public-seo";

describe("buildTenantMetadata", () => {
  const base = { title: "Menu — Cafe", description: "d", canonicalUrl: "https://cafe.example.com/menu", siteName: "Cafe" };

  it("sets canonical, Open Graph and Twitter fields", () => {
    const m = buildTenantMetadata({ ...base, imageUrl: "https://img/logo.png" });
    expect(m.alternates?.canonical).toBe(base.canonicalUrl);
    expect(m.openGraph).toMatchObject({ title: base.title, url: base.canonicalUrl, siteName: "Cafe", type: "website", images: [{ url: "https://img/logo.png" }] });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: ["https://img/logo.png"] });
  });

  it("emits empty image lists when there is no logo", () => {
    const m = buildTenantMetadata(base);
    expect(m.openGraph).toMatchObject({ images: [] });
    expect(m.twitter).toMatchObject({ images: [] });
  });

  it("brands the page as the restaurant, not FeastOwl", () => {
    const withLogo = buildTenantMetadata({ ...base, imageUrl: "https://img/logo.png" });
    expect(withLogo.icons).toEqual({ icon: "https://img/logo.png", apple: "https://img/logo.png" });
    expect(withLogo.manifest).toBeNull();
    expect(withLogo.applicationName).toBe("Cafe");
    expect(withLogo.title).toEqual({ absolute: base.title });
    // Without a logo the FeastOwl icon from the root layout stays.
    expect(buildTenantMetadata(base).icons).toBeUndefined();
  });
});

describe("readBusinessSeo", () => {
  it("falls back to tagline, then to a default name", () => {
    expect(readBusinessSeo({ business_name: " Cafe ", tagline: "Hot", logo_url: "u" })).toEqual({ name: "Cafe", description: "Hot", logoUrl: "u" });
    expect(readBusinessSeo({ description: "Desc", tagline: "Hot" }).description).toBe("Desc");
    expect(readBusinessSeo(null)).toEqual({ name: "Restaurant", description: "", logoUrl: undefined });
  });

  it("reads the logo and copy from settings, where the public API actually puts them", () => {
    const seo = readBusinessSeo({ business_name: "Cafe" }, { logo_url: "https://i/logo.png", hero_tagline: "Fresh daily", story_body: "Long story" });
    expect(seo).toEqual({ name: "Cafe", description: "Fresh daily", logoUrl: "https://i/logo.png" });
    expect(readBusinessSeo({}, { story_body: "Our story" }).description).toBe("Our story");
  });

  it("clips long descriptions to 160 characters", () => {
    const d = readBusinessSeo({}, { story_body: "a".repeat(400) }).description;
    expect(d).toHaveLength(160);
    expect(d.endsWith("…")).toBe(true);
  });
});
