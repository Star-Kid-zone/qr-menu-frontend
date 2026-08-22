/**
 * Extract tenant subdomain for public landing (e.g. `vimal` from `vimal.localhost`).
 * Returns null for bare localhost, 127.0.0.1, or `www` only.
 */
export function getTenantSlugFromHost(hostname: string): string | null {
  const h = hostname.split(':')[0].toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1') return null;
  const parts = h.split('.');
  if (parts.length < 2) return null;
  const first = parts[0];
  if (!first || first === 'www') return null;
  // vimal.localhost -> vimal
  if (parts[parts.length - 1] === 'localhost' && parts.length === 2) {
    return first;
  }
  // tenant.example.com (not bare example.com)
  if (parts.length >= 3) {
    return first;
  }
  // example.com — no tenant subdomain
  return null;
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
