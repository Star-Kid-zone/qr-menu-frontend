import type { UserRole, ImpersonationSession } from '@/types';
import type { PermissionUnit } from '@/constants/permissions';
import { STORAGE_KEYS, CSRF_COOKIE_NAME } from '@/constants/storage.constants';

const isBrowser = typeof window !== 'undefined';

export const storageKeys = STORAGE_KEYS;

export type { ImpersonationSession };


function getRawCookie(name: string): string | null {
  if (!isBrowser) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRawStorageItem(key: string): string | null {
  if (!isBrowser) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting item from local storage:', error);
    return null;
  }
}

export function getStorageItem<T>(key: string, fallback: T | null = null): T | null {
  const item = getRawStorageItem(key);

  if (item === null) {
    return fallback;
  }

  try {
    return JSON.parse(item) as T;
  } catch {
    return item as T;
  }
}

export function getJsonStorageItem<T>(key: string, fallback: T | null = null): T | null {
  return getStorageItem<T>(key, fallback);
}

export function setRawStorageItem(key: string, value: string): void {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting item in local storage:', error);
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item in local storage:', error);
  }
}

export function setJsonStorageItem<T>(key: string, value: T): void {
  setStorageItem(key, value);
}

export function removeStorageItem(key: string): void {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from local storage:', error);
  }
}

export function clearStorage(): void {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
}

/**
 * The access and refresh tokens both live in httpOnly cookies set by the
 * backend — unreadable by JS, so an XSS payload can't exfiltrate them. The
 * browser attaches them automatically via `withCredentials` (see
 * api.service.ts); there is nothing for the frontend to store or read for
 * the tokens themselves.
 *
 * `isAuthenticated()`/`getCsrfToken()` instead read the CSRF double-submit
 * cookie, which is deliberately non-httpOnly — its presence doubles as a
 * "do we have a session" signal, and its value is echoed back as the
 * X-CSRF-Token header on mutating requests.
 */
export function isAuthenticated(): boolean {
  return !!getRawCookie(CSRF_COOKIE_NAME);
}

export function getCsrfToken(): string | null {
  return getRawCookie(CSRF_COOKIE_NAME);
}

export function getStoredUserRole(): UserRole | null {
  const value = getRawStorageItem(storageKeys.userRole);
  return value === 'admin' || value === 'superadmin' || value === 'user' ? value : null;
}

export function setStoredUserRole(role: UserRole) {
  setRawStorageItem(storageKeys.userRole, role);
}

export function clearStoredUserRole(): void {
  removeStorageItem(storageKeys.userRole);
}

export function getCurrentRole(): UserRole | 'guest' {
  return getStoredUserRole() ?? 'guest';
}

/** `null` = full owner access. A stored array means a staff-issued token limited to those units. */
export function getStoredPermissions(): PermissionUnit[] | null {
  return getJsonStorageItem<PermissionUnit[]>(storageKeys.permissions, null);
}

export function setStoredPermissions(permissions: PermissionUnit[] | null | undefined) {
  if (!permissions) {
    removeStorageItem(storageKeys.permissions);
    return;
  }
  setJsonStorageItem(storageKeys.permissions, permissions);
}

export function clearStoredPermissions(): void {
  removeStorageItem(storageKeys.permissions);
}

export function getOrCreateVisitorId(factory: () => string) {
  const currentValue = getRawStorageItem(storageKeys.visitorId);

  if (currentValue) {
    return currentValue;
  }

  const nextValue = factory();
  setRawStorageItem(storageKeys.visitorId, nextValue);
  return nextValue;
}

export function getImpersonationSession(): ImpersonationSession | null {
  return getJsonStorageItem<ImpersonationSession>(storageKeys.impersonation, null);
}

export function setImpersonationSession(session: ImpersonationSession): void {
  setJsonStorageItem(storageKeys.impersonation, session);
}

export function clearImpersonationSession(): void {
  removeStorageItem(storageKeys.impersonation);
}

export function getActiveWorkspaceId(): string | null {
  return getRawStorageItem(storageKeys.activeWorkspaceId);
}

export function setActiveWorkspaceId(workspaceId: string | null | undefined): void {
  if (!workspaceId) {
    removeStorageItem(storageKeys.activeWorkspaceId);
    return;
  }
  setRawStorageItem(storageKeys.activeWorkspaceId, workspaceId);
}
