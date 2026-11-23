/**
 * Storage & Cookie Keys.
 * Canonical keys used across localStorage, sessionStorage, and cookies.
 */

export const STORAGE_KEYS = {
  userRole: 'user',
  themeMode: 'theme-mode',
  visitorId: 'visitor_id',
  permissions: 'permissions',
  impersonation: 'impersonation_session',
  activeWorkspaceId: 'active_workspace_id',
  sidebarCollapsed: 'qr_sidebar_collapsed',
  announcementsDismissed: 'dismissed_announcements',
  menuOnboardingDismissed: 'qr_menu_onboarding_dismissed',
  staffViewMode: 'staff-view',
} as const;

export const STORAGE_EVENTS = {
  sidebarCollapsed: 'qr-sidebar-collapsed',
  staffViewChange: 'staff-view-changed',
  themeMode: 'qr-theme-mode',
} as const;

export const CSRF_COOKIE_NAME = 'csrfToken';
