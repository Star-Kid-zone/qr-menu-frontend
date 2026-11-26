import { NextResponse, type NextRequest } from "next/server";
import { APP_BASE_URL, SERVER_API_BASE_URL } from "@/config/app.constants";
import { classifyHost, isAdminPath, isLocalDevHost } from "@/utils/tenantHost";
import {
  HTTP_STATUS,
  CACHE_TTL_MS,
  MISS_TTL_MS,
  PUBLIC_LANDING_PATH,
  PUBLIC_MENU_PATH,
  TENANT_SITE_PREFIX,
} from "@/constants";

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

/** The internal tenant-site path for a guest page, or null when the path is not a guest page. */
function tenantSitePath(slug: string, pathname: string): string | null {
  if (pathname === PUBLIC_LANDING_PATH) return `${TENANT_SITE_PREFIX}/${slug}`;
  if (pathname === PUBLIC_MENU_PATH) return `${TENANT_SITE_PREFIX}/${slug}${PUBLIC_MENU_PATH}`;
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The tenant-site route is internal: reachable only through the rewrite below, never directly.
  // Guest sites live on their own host only, never at a path of another host.
  if (pathname === TENANT_SITE_PREFIX || pathname.startsWith(`${TENANT_SITE_PREFIX}/`)) {
    return new NextResponse(null, { status: HTTP_STATUS.NOT_FOUND });
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  const hostKind = classifyHost(host);

  if (hostKind.kind !== "platform" && isAdminPath(pathname)) {
    const target = new URL(`${pathname}${search}`, APP_BASE_URL);
    // Guards against a redirect loop: skip when the app lives on this same host, and on local
    // dev hosts (the dev server maps a redirect to "localhost" back onto "<slug>.localhost").
    if (target.host !== normaliseHost(host) && !isLocalDevHost(host)) {
      return NextResponse.redirect(target, HTTP_STATUS.TEMPORARY_REDIRECT);
    }
  }

  let slug: string | null = hostKind.kind === "tenant" ? hostKind.slug : null;
  if (hostKind.kind === "custom") {
    slug = await lookupCustomDomain(hostKind.domain);
    if (!slug) {
      return new NextResponse(UNKNOWN_DOMAIN_PAGE, { status: HTTP_STATUS.NOT_FOUND, headers: { "content-type": "text/html; charset=utf-8" } });
    }
  }

  // Guest pages on a restaurant's host are served from the cached tenant-site route for that slug.
  // The browser keeps seeing / and /menu, so host-relative links keep working.
  const internal = slug ? tenantSitePath(slug.toLowerCase(), pathname) : null;
  if (internal) {
    return NextResponse.rewrite(new URL(`${internal}${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: skip Next internals, API routes and files with an extension (images, robots.txt…).
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
