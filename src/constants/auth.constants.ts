import type { PermissionUnit, StaffRole } from '@/types';

export type { PermissionUnit, StaffRole };

/**
 * Auth, roles, permissions and staff access constants.
 * Mirrors qr-backend/.../constants/permissions.ts & auth.constants.ts.
 */

export const PERMISSION_UNITS = [
  'dashboard',
  'analytics',
  'workspace',
  // View-only access to website settings; edits need 'workspace'.
  'workspace-read',
  'menu',
  'payments',
  'reviews',
  'marketing',
  'qr-assets',
  'operations',
] as const;

export const ROLE_PERMISSIONS: Record<StaffRole, PermissionUnit[]> = {
  manager: ['dashboard', 'analytics', 'workspace', 'menu', 'payments', 'reviews', 'marketing', 'qr-assets', 'operations'],
  staff: ['menu', 'workspace-read', 'operations'],
};

export const ROLE_OPTIONS: { value: StaffRole; label: string; description: string; can: string[] }[] = [
  {
    value: 'manager',
    label: 'Manager',
    description: 'Runs the restaurant day to day.',
    can: ['Dashboard & analytics', 'Menu', 'Payments & reviews', 'Marketing & QR assets', 'Shifts & checklists', 'Website settings'],
  },
  {
    value: 'staff',
    label: 'Staff',
    description: 'Works the floor and the menu.',
    can: ['Menu', 'Shifts & checklists', 'View website settings (read only)'],
  },
];

export const ROLE_COPY = {
  manager: { label: 'Manager', access: 'Everything except managing team members.' },
  staff: { label: 'Staff', access: 'Menu, shifts and checklists. Can view the website settings but not change them.' },
} as const;

/** Pages that belong to the admin app, never to a restaurant's public host. */
export const ADMIN_PATH_PREFIXES = ['/admin', '/superadmin', '/login', '/register', '/forgot-password'];

export const PASSWORD_GENERATION = {
  DEFAULT_LENGTH: 12,
  CHARS: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',
} as const;

export const OTP_RESEND_SECONDS = 60;

export const AUTH_PANEL_COPY: Record<string, { heading: string; body: string }> = {
  '/login': {
    heading: 'Your menu, right where you left it.',
    body: 'Update dishes, answer reviews and check how many guests scanned today.',
  },
  '/register': {
    heading: 'Put your menu on every table.',
    body: 'Add your dishes, choose a look and print your QR codes in one sitting.',
  },
  '/forgot-password': {
    heading: 'Back in a couple of minutes.',
    body: "We'll email a 6-digit code to the address you sign in with.",
  },
};

export const LOGIN_DEFAULT_VALUES = {
  identifier: '',
  password: '',
  remember: false,
};

export const REGISTER_DEFAULT_VALUES = {
  businessName: '',
  email: '',
  password: '',
};

export const FORGOT_PASSWORD_DEFAULT_VALUES = {
  email: '',
};

export const EMPTY_STAFF_FORM = {
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'staff' as StaffRole,
  active: true,
};

export const INVALID_USER_ERROR = 'Invalid user identification token.';
