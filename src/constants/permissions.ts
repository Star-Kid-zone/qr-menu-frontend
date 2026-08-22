/**
 * Mirrors updatedbackend/src/constants/permissions.ts — fixed permission
 * "units" the sidebar/tabs are gated by, and the two fixed staff role presets.
 */
export const PERMISSION_UNITS = [
  'dashboard',
  'analytics',
  'workspace',
  'menu',
  'payments',
  'reviews',
  'marketing',
  'qr-assets',
] as const;

export type PermissionUnit = (typeof PERMISSION_UNITS)[number];

export type StaffRole = 'manager' | 'staff';

export const ROLE_PERMISSIONS: Record<StaffRole, PermissionUnit[]> = {
  manager: ['dashboard', 'analytics', 'workspace', 'menu', 'payments', 'reviews', 'marketing', 'qr-assets'],
  staff: ['menu', 'workspace'],
};
