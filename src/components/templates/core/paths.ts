import { routes } from '@/config/routes';

import { getTenantSlugFromHost } from '@/utils/tenantHost';

export function publicMenuPath(userId: number, tenantSlug?: string | null, isSubdomain?: boolean): string {
  const s = typeof tenantSlug === 'string' ? tenantSlug.trim().toLowerCase() : '';
  if (!s) return routes.user.menu(userId);
  if (isSubdomain) return '/menu';
  return routes.user.menuBySlug(s);
}

export function publicLandingPath(userId: number, tenantSlug?: string | null, isSubdomain?: boolean): string {
  const s = typeof tenantSlug === 'string' ? tenantSlug.trim().toLowerCase() : '';
  if (!s) return routes.user.landing(userId);
  if (isSubdomain) return '/';
  return routes.user.landingBySlug(s);
}
