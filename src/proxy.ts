import { NextResponse, type NextRequest } from "next/server";
import { APP_BASE_URL, SERVER_API_BASE_URL } from "@/config/app.constants";
import { classifyHost, isAdminPath, isLocalDevHost } from "@/utils/tenantHost";

/**
 * Request routing by host (Next 16 "proxy", formerly middleware).
 *
 * - Restaurant hosts (tenant subdomains and verified custom domains) never serve
 *   the admin app: /admin, /login, … redirect to the app domain.
 * - A custom domain is looked up once per minute per host; a verified one is
 *   passed to the pages as the TENANT_SLUG_HEADER, an unknown one gets a 404.
 * - TENANT_SLUG_HEADER is always stripped from the incoming request first, so
 *   a client can never choose which restaurant a page renders.
 */
export const TENANT_SLUG_HEADER = "x-qr-tenant-slug";

const CACHE_TTL_MS = 60_000;
const MISS_TTL_MS = 30_000;
const domainCache = new Map<string, { slug: string | null; expires: number }>();

async function lookupCustomDomain(domain: string): Promise<string | null> {
  const now = Date.now();
  const hit = domainCache.get(domain);
  if (hit && hit.expires > now) return hit.slug;

  let slug: string | null = null;
  let ttl = MISS_TTL_MS;
  try {
    const res = await fetch(`${SERVER_API_BASE_URL}/public/domains/${encodeURIComponent(domain)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const json = (await res.json()) as { data?: { slug?: string } };
      slug = json.data?.slug ?? null;
      if (slug) ttl = CACHE_TTL_MS;
    } else if (res.status >= 500) {
      // Backend trouble: don't cache, so the next request retries.
      return null;
    }
  } catch {
    return null;
  }
  domainCache.set(domain, { slug, expires: now + ttl });
  if (domainCache.size > 5000) domainCache.delete(domainCache.keys().next().value!);
  return slug;
}

/** Test hook. */
export function clearDomainCache() {
  domainCache.clear();
}

const UNKNOWN_DOMAIN_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Site not found</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#fafafa;color:#222"><main style="text-align:center;padding:24px"><h1 style="font-size:1.4rem">This website isn't set up yet</h1><p style="color:#555">If this is your restaurant, finish connecting the domain in your dashboard.</p></main></body></html>`;

const normaliseHost = (h: string) => h.trim().toLowerCase().replace(/\.$/, "");

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete(TENANT_SLUG_HEADER);

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  const hostKind = classifyHost(host);
  const { pathname, search } = request.nextUrl;

  if (hostKind.kind !== "platform" && isAdminPath(pathname)) {
    const target = new URL(`${pathname}${search}`, APP_BASE_URL);
    // Guards against a redirect loop: skip when the app lives on this same host, and on local
    // dev hosts (the dev server maps a redirect to "localhost" back onto "<slug>.localhost").
    if (target.host !== normaliseHost(host) && !isLocalDevHost(host)) {
      return NextResponse.redirect(target, 307);
    }
  }

  if (hostKind.kind === "custom") {
    const slug = await lookupCustomDomain(hostKind.domain);
    if (!slug) {
      return new NextResponse(UNKNOWN_DOMAIN_PAGE, { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
    }
    headers.set(TENANT_SLUG_HEADER, slug);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Pages only: skip Next internals, API routes and files with an extension (images, robots.txt…).
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
