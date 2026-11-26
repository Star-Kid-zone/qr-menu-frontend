import { describe, expect, it } from "vitest";
import { buildTenantUrlForHost, getTenantSlugFromHost, isLocalDevHost, PLATFORM_SUBDOMAINS } from "./tenantHost";

const ROOT = "feastowl.com";

describe("getTenantSlugFromHost", () => {
  it.each([
    ["vimalrestaurant.localhost:3000", "vimalrestaurant"],
    ["vimal.localhost", "vimal"],
    ["VIMAL.LOCALHOST:3000", "vimal"],
    ["vimal.feastowl.com", "vimal"],
    ["vimal.feastowl.com:443", "vimal"],
    ["vimal.feastowl.com.", "vimal"],
    ["cafe-roma-42.feastowl.com", "cafe-roma-42"],
  ])("resolves tenant host %s -> %s", (host, slug) => {
    expect(getTenantSlugFromHost(host, ROOT)).toBe(slug);
  });

  it.each([
    // platform hosts
    "localhost:3000",
    "127.0.0.1:3000",
    "feastowl.com",
    "www.feastowl.com",
    "app.feastowl.com",
    "api.feastowl.com",
    "apigateway.feastowl.com",
    "app.localhost:3000",
    // deeper than one label
    "a.b.feastowl.com",
    "a.b.localhost",
    // unrelated domains must never be read as a tenant (custom domains go through a lookup instead)
    "menu.pizzaroma.com",
    "pizzaroma.co.uk",
    "www.pizzaroma.com",
    "vimal.feastowl.com.evil.com",
    "evilfeastowl.com",
    // invalid labels
    "-vimal.localhost",
    "vimal-.feastowl.com",
    "vi_mal.localhost",
    "",
  ])("returns null for %s", (host) => {
    expect(getTenantSlugFromHost(host, ROOT)).toBeNull();
  });

  it("does not treat a root domain written with stray dots differently", () => {
    expect(getTenantSlugFromHost("vimal.feastowl.com", ".feastowl.com.")).toBe("vimal");
  });

  it("never returns a platform subdomain", () => {
    for (const label of PLATFORM_SUBDOMAINS) {
      expect(getTenantSlugFromHost(`${label}.${ROOT}`, ROOT)).toBeNull();
      expect(getTenantSlugFromHost(`${label}.localhost`, ROOT)).toBeNull();
    }
  });
});

describe("isLocalDevHost", () => {
  it.each(["localhost", "localhost:3000", "127.0.0.1:3000", "vimal.localhost:3000"])("%s is local", (h) => {
    expect(isLocalDevHost(h)).toBe(true);
  });

  it.each(["feastowl.com", "vimal.feastowl.com", "localhost.evil.com", "notlocalhost"])("%s is not local", (h) => {
    expect(isLocalDevHost(h)).toBe(false);
  });
});

describe("buildTenantUrlForHost", () => {
  it.each([
    ["localhost:3000", "http:", "http://vimal.localhost:3000/menu"],
    ["127.0.0.1:3000", "http:", "http://vimal.localhost:3000/menu"],
    ["app.localhost:3000", "http", "http://vimal.localhost:3000/menu"],
    ["localhost", "http:", "http://vimal.localhost/menu"],
  ])("keeps local dev on <slug>.localhost (%s)", (host, proto, expected) => {
    expect(buildTenantUrlForHost("Vimal", host, proto, "/menu")).toBe(expected);
  });

  it.each(["feastowl.com", "www.feastowl.com", "app.feastowl.com", "main.d123.amplifyapp.com", "feastowl.com:443"])(
    "uses the root domain in production, never the current host (%s)",
    (host) => {
      expect(buildTenantUrlForHost("vimal", host, "https:", "menu")).toBe("https://vimal.feastowl.com/menu");
    },
  );

  it("returns an empty string without a slug", () => {
    expect(buildTenantUrlForHost("  ", "localhost:3000")).toBe("");
    expect(buildTenantUrlForHost(null, "feastowl.com")).toBe("");
  });
});
