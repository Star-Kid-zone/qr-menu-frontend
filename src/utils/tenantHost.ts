import { TENANT_ROOT_DOMAIN } from '@/config/app.constants';

/**
 * Subdomains the platform itself serves (admin app, API, CDN…), never a tenant.
 * Deliberately small: a restaurant may already own a slug such as `shop` or
 * `demo`, and listing it here would take their site offline. The backend's
 * RESERVED_PUBLIC_SLUGS (qr-backend/.../constants/reservedSlugs.constants.ts)
 * is a superset that stops new tenants from claiming any of these.
 */
export const PLATFORM_SUBDOMAINS: ReadonlySet<string> = new Set([
  'www', 'app', 'api', 'apigateway', 'admin', 'superadmin',
  'cdn', 'static', 'assets', 'media', 'mail',
]);

/** One DNS label in the shape the backend allows for a public slug. */
const SLUG_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function normaliseHostname(host: string): string {
  // Drop the port and any trailing dot ("vimal.mynagaram.com." is the same host).
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
 *   - `<slug>.<TENANT_ROOT_DOMAIN>` (production, e.g. vimal.mynagaram.com)
 *
 * Everything else returns null: the bare root domain, platform subdomains
 * (app., www., api.), deeper hosts (a.b.mynagaram.com) and unrelated domains.
 * Before this was strict, `app.mynagaram.com` resolved to tenant "app" and a
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

function buildPublicTenantUrl(publicSlug: string | null | undefined, path = '/'): string {
  if (!publicSlug?.trim()) return '';
  if (typeof window === 'undefined') return '';
  const { protocol, hostname, port } = window.location;
  const portSuffix = port ? `:${port}` : '';
  const slug = publicSlug.trim().toLowerCase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const h = hostname.toLowerCase();

  if (h === 'localhost' || h === '127.0.0.1') {
    return `${protocol}//${slug}.localhost${portSuffix}${normalizedPath}`;
  }

  const parts = h.split('.');
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    const rest = parts.slice(1).join('.');
    return `${protocol}//${slug}.${rest}${portSuffix}${normalizedPath}`;
  }

  if (parts.length >= 2) {
    const rest = parts.slice(1).join('.');
    return `${protocol}//${slug}.${rest}${portSuffix}${normalizedPath}`;
  }

  return `${protocol}//${slug}.${h}${portSuffix}${normalizedPath}`;
}

/** Build a public landing URL for a slug (same port + protocol as current app). */
export function buildPublicLandingUrl(publicSlug: string | null | undefined): string {
  return buildPublicTenantUrl(publicSlug, '/');
}

/** Build a public menu URL for a slug (same port + protocol as current app). */
export function buildPublicMenuUrl(publicSlug: string | null | undefined): string {
  return buildPublicTenantUrl(publicSlug, '/menu');
}

/** Server-side construction of a tenant's subdomain URL given the request host and proto */
export function buildPublicTenantUrlServer(
  publicSlug: string | null | undefined,
  host: string,
  proto = 'http',
  path = '/'
): string {
  if (!publicSlug?.trim()) return '';
  const [hostname, port] = host.split(':');
  const portSuffix = port ? `:${port}` : '';
  const slug = publicSlug.trim().toLowerCase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const h = hostname.toLowerCase();

  if (h === 'localhost' || h === '127.0.0.1') {
    return `${proto}://${slug}.localhost${portSuffix}${normalizedPath}`;
  }

  const parts = h.split('.');
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    const rest = parts.slice(1).join('.');
    return `${proto}://${slug}.${rest}${portSuffix}${normalizedPath}`;
  }

  if (parts.length >= 2) {
    const rest = parts.slice(1).join('.');
    return `${proto}://${slug}.${rest}${portSuffix}${normalizedPath}`;
  }

  return `${proto}://${slug}.${h}${portSuffix}${normalizedPath}`;
}

/**
 * Hosts that serve the platform itself even though they aren't the root
 * domain: deploy previews and the like. Extend with NEXT_PUBLIC_PLATFORM_HOSTS
 * (comma-separated hostnames or ".suffix" entries).
 */
const PLATFORM_HOST_SUFFIXES = ['.amplifyapp.com', '.vercel.app', '.cloudfront.net'];

function extraPlatformHosts(): string[] {
  return (process.env.NEXT_PUBLIC_PLATFORM_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

export type HostKind =
  | { kind: 'platform' }
  | { kind: 'tenant'; slug: string }
  /** Not ours: a restaurant's own domain, looked up via the API. */
  | { kind: 'custom'; domain: string };

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

/** Pages that belong to the admin app, never to a restaurant's public host. */
export const ADMIN_PATH_PREFIXES = ['/admin', '/superadmin', '/login', '/register', '/forgot-password'];

export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
