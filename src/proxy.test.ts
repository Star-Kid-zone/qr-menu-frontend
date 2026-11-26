import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearDomainCache, proxy } from "./proxy";
import { classifyHost, isAdminPath } from "@/utils/tenantHost";
import { getTenantCanonicalUrl } from "@/config/app.constants";

const ROOT = "feastowl.com";

describe("classifyHost", () => {
  it.each([
    ["localhost:3000", "platform"],
    ["127.0.0.1:3000", "platform"],
    ["192.168.1.20:3000", "platform"],
    ["feastowl.com", "platform"],
    ["app.feastowl.com", "platform"],
    ["a.b.feastowl.com", "platform"],
    ["main.d1a2b3.amplifyapp.com", "platform"],
    ["vimal.feastowl.com", "tenant"],
    ["vimal.localhost:3000", "tenant"],
    ["www.pizzaroma.com", "custom"],
    ["pizzaroma.co.uk", "custom"],
    ["feastowl.com.evil.io", "custom"],
  ])("%s → %s", (host, kind) => {
    expect(classifyHost(host, ROOT).kind).toBe(kind);
  });
});

describe("isAdminPath", () => {
  it("matches the admin app's pages only", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/listbusiness")).toBe(true);
    expect(isAdminPath("/login")).toBe(true);
    expect(isAdminPath("/menu")).toBe(false);
    expect(isAdminPath("/administrators-special")).toBe(false);
  });
});

describe("getTenantCanonicalUrl", () => {
  it("prefers a verified custom domain, else the subdomain", () => {
    expect(getTenantCanonicalUrl({ custom_domain: "www.pizzaroma.com", public_slug: "vimal" })).toBe("https://www.pizzaroma.com");
    // Tests run with the app on localhost:3000, so the subdomain form is the local one.
    expect(getTenantCanonicalUrl({ public_slug: "vimal" })).toBe("http://vimal.localhost:3000");
    expect(getTenantCanonicalUrl({ custom_domain: "javascript:alert(1)", public_slug: "vimal" })).toBe("http://vimal.localhost:3000");
  });
});

describe("proxy", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    clearDomainCache();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  const req = (url: string, headers: Record<string, string> = {}) =>
    new NextRequest(url, { headers: { host: new URL(url).host, ...headers } });
  /** Where a rewrite sends the request (Next exposes it on the response), or null for no rewrite. */
  const rewrittenTo = (res: Response) => {
    const target = res.headers.get("x-middleware-rewrite");
    return target ? new URL(target).pathname + new URL(target).search : null;
  };

  it("rewrites a tenant subdomain's / and /menu to the cached tenant-site route, keeping the query", async () => {
    expect(rewrittenTo(await proxy(req("http://vimal.localhost:3000/")))).toBe("/tenant-site/vimal");
    expect(rewrittenTo(await proxy(req("http://Vimal.feastowl.com/menu?table=4")))).toBe("/tenant-site/vimal/menu?table=4");
  });

  it("leaves the apex marketing page and unknown apex paths alone (no /<slug> guest sites)", async () => {
    expect(rewrittenTo(await proxy(req("http://localhost:3000/")))).toBeNull();
    const apexSlug = await proxy(req("http://localhost:3000/vimal"));
    expect(rewrittenTo(apexSlug)).toBeNull();
  });

  it("refuses direct requests to the internal tenant-site route on any host", async () => {
    expect((await proxy(req("http://localhost:3000/tenant-site/vimal"))).status).toBe(404);
    expect((await proxy(req("http://other.localhost:3000/tenant-site/vimal/menu"))).status).toBe(404);
    expect((await proxy(req("http://localhost:3000/tenant-site"))).status).toBe(404);
  });

  it("serves a verified custom domain as its restaurant, using a cache", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, data: { slug: "vimal" } }), { status: 200 }));
    const res = await proxy(req("https://www.pizzaroma.com/menu"));
    expect(rewrittenTo(res)).toBe("/tenant-site/vimal/menu");
    await proxy(req("https://www.pizzaroma.com/"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/public\/domains\/www\.pizzaroma\.com$/);
  });

  it("answers 404 for an unknown custom domain", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 404 }));
    const res = await proxy(req("https://unknown-example.com/"));
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("isn't set up yet");
  });

  it("doesn't cache a backend outage", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 502 }));
    expect((await proxy(req("https://www.pizzaroma.com/"))).status).toBe(404);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: { slug: "vimal" } }), { status: 200 }));
    expect(rewrittenTo(await proxy(req("https://www.pizzaroma.com/")))).toBe("/tenant-site/vimal");
  });

  it("sends admin pages on restaurant hosts to the app", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { slug: "vimal" } }), { status: 200 }));
    const res = await proxy(req("https://www.pizzaroma.com/admin/listbusiness?tab=x"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/admin\/listbusiness\?tab=x$/);
    expect(res.headers.get("location")).not.toContain("pizzaroma");
  });

  it("never redirects in a loop: local dev subdomains keep serving admin pages", async () => {
    const res = await proxy(req("http://vimal.localhost:3000/admin"));
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("leaves platform hosts and tenant subdomains alone", async () => {
    expect((await proxy(req("http://localhost:3000/admin"))).status).toBe(200);
    const sub = await proxy(req("http://vimal.localhost:3000/menu"));
    expect(sub.status).toBe(200);
    expect(rewrittenTo(await proxy(req("http://localhost:3000/admin")))).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
