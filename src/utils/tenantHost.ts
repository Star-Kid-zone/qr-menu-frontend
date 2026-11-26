import { TENANT_ROOT_DOMAIN } from '@/config/app.constants';
import type { HostKind } from '@/types';
import {
  PLATFORM_SUBDOMAINS,
  PLATFORM_HOST_SUFFIXES,
  ADMIN_PATH_PREFIXES,
  SLUG_LABEL_REGEX,
  IPV4_REGEX,
} from '@/constants';

export { PLATFORM_SUBDOMAINS };
export type { HostKind };

const SLUG_LABEL = SLUG_LABEL_REGEX;

function normaliseHostname(host: string): string {
  // Drop the port and any trailing dot ("vimal.feastowl.com." is the same host).
  return host.split(':')[0].trim().toLowerCase().replace(/\.$/, '');
}

function normaliseRootDomain(rootDomain: string): string {
  return rootDomain.trim().toLowerCase().replace(/^\.+|\.+$/g, '');
}

/** Local development host (localhost, 127.0.0.1, or any *.localhost). */
export function isLocalDevHost(host: string): boolean {
  const h = normaliseHostname(host);
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.localhost');
}

/**
 * Extract the tenant slug from a request host.
 *
 * Only two shapes count as a tenant:
 *   - `<slug>.localhost`            (local dev)
 *   - `<slug>.<TENANT_ROOT_DOMAIN>` (production, e.g. vimal.feastowl.com)
 *
 * Everything else returns null: the bare root domain, platform subdomains
 * (app., www., api.), deeper hosts (a.b.feastowl.com) and unrelated domains.
 * Before this was strict, `app.feastowl.com` resolved to tenant "app" and a
 * foreign host such as `menu.pizzaroma.com` resolved to tenant "menu".
 */
export function getTenantSlugFromHost(host: string, rootDomain: string = TENANT_ROOT_DOMAIN): string | null {
  const h = normaliseHostname(host);
  if (!h) return null;

  const root = normaliseRootDomain(rootDomain);
  let label: string | null = null;

  if (h.endsWith('.localhost')) {
    label = h.slice(0, -'.localhost'.length);
  } else if (root && h.endsWith(`.${root}`)) {
    label = h.slice(0, -(root.length + 1));
  }

  if (!label || label.includes('.')) return null;
  if (!SLUG_LABEL.test(label)) return null;
  if (PLATFORM_SUBDOMAINS.has(label)) return null;
  return label;
}

/**
 * Build a tenant URL relative to the host the app is running on:
 *   - local dev (localhost, 127.0.0.1, *.localhost) -> `<proto>//<slug>.localhost:<port><path>`
 *   - anywhere else (feastowl.com, www., app., deploy previews) -> `https://<slug>.<TENANT_ROOT_DOMAIN><path>`
 * The production form never derives the domain from the current host, so the
 * apex (`feastowl.com`) does not turn into `<slug>.com`.
 */
export function buildTenantUrlForHost(
  publicSlug: string | null | undefined,
  currentHost: string,
  protocol = 'https:',
  path = '/',
): string {
  if (!publicSlug?.trim()) return '';
  const slug = publicSlug.trim().toLowerCase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (isLocalDevHost(currentHost)) {
    const port = currentHost.trim().split(':')[1];
    const proto = protocol.endsWith(':') ? protocol : `${protocol}:`;
    return `${proto}//${slug}.localhost${port ? `:${port}` : ''}${normalizedPath}`;
  }

  return `https://${slug}.${normaliseRootDomain(TENANT_ROOT_DOMAIN)}${normalizedPath}`;
}

function buildPublicTenantUrl(publicSlug: string | null | undefined, path = '/'): string {
  if (typeof window === 'undefined') return '';
  return buildTenantUrlForHost(publicSlug, window.location.host, window.location.protocol, path);
}

/** Build a public landing URL for a slug (same port + protocol as current app). */
export function buildPublicLandingUrl(publicSlug: string | null | undefined): string {
  return buildPublicTenantUrl(publicSlug, '/');
}

/** Build a public menu URL for a slug (same port + protocol as current app). */
export function buildPublicMenuUrl(publicSlug: string | null | undefined): string {
  return buildPublicTenantUrl(publicSlug, '/menu');
}

/**
 * Hosts that serve the platform itself even though they aren't the root
 * domain: deploy previews and the like. Extend with NEXT_PUBLIC_PLATFORM_HOSTS
 * (comma-separated hostnames or ".suffix" entries).
 */


function extraPlatformHosts(): string[] {
  return (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

const IPV4 = IPV4_REGEX;

/** Classify a request host. Never trusts anything but the host string itself. */
export function classifyHost(host: string, rootDomain: string = TENANT_ROOT_DOMAIN): HostKind {
  const h = normaliseHostname(host);
  if (!h || h === 'localhost' || IPV4.test(h) || h.startsWith('[')) return { kind: 'platform' };

  const slug = getTenantSlugFromHost(h, rootDomain);
  if (slug) return { kind: 'tenant', slug };

  const root = normaliseRootDomain(rootDomain);
  if (h.endsWith('.localhost') || h === root || (root && h.endsWith(`.${root}`))) return { kind: 'platform' };

  const extras = extraPlatformHosts();
  const suffixes = [...PLATFORM_HOST_SUFFIXES, ...extras.filter((e) => e.startsWith('.'))];
  if (extras.includes(h) || suffixes.some((s) => h.endsWith(s))) return { kind: 'platform' };

  return { kind: 'custom', domain: h };
}



export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
