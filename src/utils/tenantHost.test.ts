import { describe, expect, it } from "vitest";
import { getTenantSlugFromHost, isLocalDevHost, PLATFORM_SUBDOMAINS } from "./tenantHost";

const ROOT = "mynagaram.com";

describe("getTenantSlugFromHost", () => {
  it.each([
    ["vimalrestaurant.localhost:3000", "vimalrestaurant"],
    ["vimal.localhost", "vimal"],
    ["VIMAL.LOCALHOST:3000", "vimal"],
    ["vimal.mynagaram.com", "vimal"],
    ["vimal.mynagaram.com:443", "vimal"],
    ["vimal.mynagaram.com.", "vimal"],
    ["cafe-roma-42.mynagaram.com", "cafe-roma-42"],
  ])("resolves tenant host %s -> %s", (host, slug) => {
    expect(getTenantSlugFromHost(host, ROOT)).toBe(slug);
  });

  it.each([
    // platform hosts
    "localhost:3000",
    "127.0.0.1:3000",
    "mynagaram.com",
    "www.mynagaram.com",
    "app.mynagaram.com",
    "api.mynagaram.com",
    "apigateway.mynagaram.com",
    "app.localhost:3000",
    // deeper than one label
    "a.b.mynagaram.com",
    "a.b.localhost",
    // unrelated domains must never be read as a tenant (custom domains go through a lookup instead)
    "menu.pizzaroma.com",
    "pizzaroma.co.uk",
    "www.pizzaroma.com",
    "vimal.mynagaram.com.evil.com",
    "evilmynagaram.com",
    // invalid labels
    "-vimal.localhost",
    "vimal-.mynagaram.com",
    "vi_mal.localhost",
    "",
  ])("returns null for %s", (host) => {
    expect(getTenantSlugFromHost(host, ROOT)).toBeNull();
  });

  it("does not treat a root domain written with stray dots differently", () => {
    expect(getTenantSlugFromHost("vimal.mynagaram.com", ".mynagaram.com.")).toBe("vimal");
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

  it.each(["mynagaram.com", "vimal.mynagaram.com", "localhost.evil.com", "notlocalhost"])("%s is not local", (h) => {
    expect(isLocalDevHost(h)).toBe(false);
  });
});
