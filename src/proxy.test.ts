import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearDomainCache, proxy, TENANT_SLUG_HEADER } from "./proxy";
import { classifyHost, isAdminPath } from "@/utils/tenantHost";
import { getTenantCanonicalUrl } from "@/config/app.constants";

const ROOT = "mynagaram.com";

describe("classifyHost", () => {
  it.each([
    ["localhost:3000", "platform"],
    ["127.0.0.1:3000", "platform"],
    ["192.168.1.20:3000", "platform"],
    ["mynagaram.com", "platform"],
    ["app.mynagaram.com", "platform"],
    ["a.b.mynagaram.com", "platform"],
    ["main.d1a2b3.amplifyapp.com", "platform"],
    ["vimal.mynagaram.com", "tenant"],
    ["vimal.localhost:3000", "tenant"],
    ["www.pizzaroma.com", "custom"],
    ["pizzaroma.co.uk", "custom"],
    ["mynagaram.com.evil.io", "custom"],
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
    expect(getTenantCanonicalUrl({ public_slug: "vimal" })).toMatch(/^https:\/\/vimal\./);
    expect(getTenantCanonicalUrl({ custom_domain: "javascript:alert(1)", public_slug: "vimal" })).toMatch(/^https:\/\/vimal\./);
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
  const forwardedSlug = (res: Response) => res.headers.get(`x-middleware-request-${TENANT_SLUG_HEADER}`);

  it("never lets a client choose the restaurant: the header is stripped", async () => {
    const res = await proxy(req("http://localhost:3000/", { [TENANT_SLUG_HEADER]: "someone-else" }));
    expect(forwardedSlug(res)).toBeNull();
    expect(res.headers.get("x-middleware-override-headers") ?? "").not.toContain(`${TENANT_SLUG_HEADER}`);
  });

  it("serves a verified custom domain as its restaurant, using a cache", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, data: { slug: "vimal" } }), { status: 200 }));
    const res = await proxy(req("https://www.pizzaroma.com/menu"));
    expect(forwardedSlug(res)).toBe("vimal");
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
    expect(forwardedSlug(await proxy(req("https://www.pizzaroma.com/")))).toBe("vimal");
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
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
