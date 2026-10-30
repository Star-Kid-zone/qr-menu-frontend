import { routes } from '@/config/routes';

export function publicMenuPath(userId: number, tenantSlug?: string | null, isSubdomain?: boolean): string {
  const s = typeof tenantSlug === 'string' ? tenantSlug.trim().toLowerCase() : '';
  if (!s) return routes.user.menu(userId);
  return isSubdomain ? '/menu' : `/${s}/menu`;
}

export function publicLandingPath(userId: number, tenantSlug?: string | null, isSubdomain?: boolean): string {
  const s = typeof tenantSlug === 'string' ? tenantSlug.trim().toLowerCase() : '';
  if (!s) return routes.user.landing(userId);
  return isSubdomain ? '/' : `/${s}`;
}
