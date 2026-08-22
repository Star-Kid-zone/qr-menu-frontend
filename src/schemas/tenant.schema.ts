import * as z from 'zod';

/** Same rule as backend tenant slugs (lowercase in storage). */
export const TENANT_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeTenantSlug(raw: string): string {
  return raw.trim().toLowerCase();
}

export const tenantSlugSchema = z
  .string()
  .min(1, 'Enter a slug')
  .max(191, 'Slug is too long')
  .regex(
    TENANT_SLUG_REGEX,
    'Use lowercase letters, numbers, and single hyphens between segments (e.g. my-store)'
  );
