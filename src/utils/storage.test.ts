import { describe, it, expect, beforeEach } from 'vitest';
import {
  getActiveWorkspaceId,
  setActiveWorkspaceId,
  getStoredUserRole,
  setStoredUserRole,
  clearStoredUserRole,
  getStoredPermissions,
  setStoredPermissions,
  clearStoredPermissions,
  getImpersonationSession,
  setImpersonationSession,
  clearImpersonationSession,
  clearStorage,
} from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('active workspace storage', () => {
    it('returns null when active workspace is not set', () => {
      expect(getActiveWorkspaceId()).toBeNull();
    });

    it('sets and retrieves active workspace id', () => {
      setActiveWorkspaceId('ws_xyz_123');
      expect(getActiveWorkspaceId()).toBe('ws_xyz_123');
    });

    it('removes active workspace id when passed null or undefined', () => {
      setActiveWorkspaceId('ws_xyz_123');
      expect(getActiveWorkspaceId()).toBe('ws_xyz_123');

      setActiveWorkspaceId(null);
      expect(getActiveWorkspaceId()).toBeNull();
    });
  });

  describe('user role storage', () => {
    it('sets and retrieves valid user roles', () => {
      setStoredUserRole('admin');
      expect(getStoredUserRole()).toBe('admin');

      setStoredUserRole('superadmin');
      expect(getStoredUserRole()).toBe('superadmin');
    });

    it('clears stored user role', () => {
      setStoredUserRole('admin');
      clearStoredUserRole();
      expect(getStoredUserRole()).toBeNull();
    });
  });

  describe('permissions storage', () => {
    it('returns null for default (full owner access)', () => {
      expect(getStoredPermissions()).toBeNull();
    });

    it('stores and retrieves staff permissions list', () => {
      setStoredPermissions(['menu', 'operations']);
      expect(getStoredPermissions()).toEqual(['menu', 'operations']);
    });

    it('clears stored permissions', () => {
      setStoredPermissions(['menu']);
      clearStoredPermissions();
      expect(getStoredPermissions()).toBeNull();
    });
  });

  describe('impersonation session storage', () => {
    it('stores and retrieves impersonation session data', () => {
      const session = {
        isImpersonating: true,
        originalSuperadminId: 'sa_1',
        targetUserId: 'user_99',
        targetUserName: 'Chef John',
      };
      setImpersonationSession(session);
      expect(getImpersonationSession()).toEqual(session);
    });

    it('clears impersonation session', () => {
      setImpersonationSession({
        isImpersonating: true,
        originalSuperadminId: 'sa_1',
        targetUserId: 'user_99',
        targetUserName: 'Chef John',
      });
      clearImpersonationSession();
      expect(getImpersonationSession()).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('wipes everything in storage', () => {
      setActiveWorkspaceId('ws_1');
      setStoredUserRole('admin');
      clearStorage();
      expect(getActiveWorkspaceId()).toBeNull();
      expect(getStoredUserRole()).toBeNull();
    });
  });
});

