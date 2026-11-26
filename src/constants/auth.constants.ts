import type { AuthFeatureKey, AuthStageVariant, PermissionUnit, StaffRole } from '@/types';

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

export const OTP_RESEND_SECONDS = 60;

/** Which story the sign-in screens tell, by route. Anything unknown falls back to sign-in. */
export const AUTH_STAGE_BY_PATH: Record<string, AuthStageVariant> = {
  '/login': 'signin',
  '/register': 'register',
  '/forgot-password': 'reset',
};

/**
 * Copy beside the form. Every line describes something the product does today
 * (same rule as features/marketing/content.ts).
 */
export const AUTH_STAGE_COPY: Record<AuthStageVariant, { eyebrow: string; heading: string; body: string }> = {
  signin: {
    eyebrow: 'Welcome back',
    heading: 'Pick up where you left off.',
    body: 'Reply to new Google reviews, schedule this week’s posts and see how many guests opened your menu.',
  },
  register: {
    eyebrow: '14-day free trial',
    heading: 'Your restaurant online, in one sitting.',
    body: 'A menu guests open by scanning, a website of your own and your Google reviews, all run from one dashboard.',
  },
  reset: {
    eyebrow: 'Password reset',
    heading: 'Back in a couple of minutes.',
    body: 'We’ll email a 6-digit code to the address you sign in with. Your menu stays live while you reset.',
  },
};

/** The three things a new owner does after signing up, in order. */
export const REGISTER_STEPS = [
  { title: 'Add your dishes', body: 'Type them in, or photograph your printed menu and we read it for you.' },
  { title: 'Choose a look', body: 'Pick a style for your website and menu. Change it any time.' },
  { title: 'Print your QR codes', body: 'Put them on the tables. Guests scan with their camera, nothing to install.' },
] as const;

/** Cards in the swipeable strip under the form on phones (the desktop scene, flattened). */
export const AUTH_FEATURE_STRIP: { key: AuthFeatureKey; title: string; body: string }[] = [
  { key: 'menu', title: 'Menu on every table', body: 'Guests scan and see dishes, prices and veg marks. Mark a dish sold out in a tap.' },
  { key: 'website', title: 'Your own website', body: 'Hours, photos, offers and directions, at your own address.' },
  { key: 'reviews', title: 'Google reviews', body: 'See new reviews as they come in and reply from the dashboard.' },
  { key: 'social', title: 'Social posts', body: 'Write once, post to Instagram, Facebook, X and LinkedIn, now or later.' },
  { key: 'qr', title: 'QR codes', body: 'Design and print table cards that always open your latest menu.' },
];

/** Design size of the sign-in scene in px; it is scaled to fit the panel. */
export const AUTH_SCENE_SIZE = { width: 600, height: 480 } as const;

/** Sample restaurant the scene shows (the same one as the marketing page). */
export const AUTH_SAMPLE_RESTAURANT = {
  name: 'Annapoorna Kitchen',
  slug: 'annapoorna',
  tagline: 'Home-style Chettinad cooking',
  heroImage: '/landing/spicy-bold/hero.jpg',
  dishImage: '/landing/street-food/dish.jpg',
  reviewer: 'Priya S.',
  review: 'The ghee roast dosa was perfect. Lovely staff, quick service.',
  postCaption: 'Our masala blend, roasted and ground fresh every morning.',
} as const;

/**
 * Mirrors the backend's slugify at sign-up (controllers/auth/auth.controller.ts):
 * the public address is "<name, max 50 chars>-<6 random characters>".
 */
export const SLUG_PREVIEW = {
  MAX_BASE_LENGTH: 50,
  SUFFIX_PLACEHOLDER: 'xxxxxx',
  FALLBACK_BASE: 'your-restaurant',
} as const;

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
