import { describe, it, expect } from 'vitest';
import { getLandingRoute } from './landing';
import { ROLE_PERMISSIONS } from '@/constants/permissions';

describe('getLandingRoute', () => {
  it('sends the super admin to the platform overview', () => {
    expect(getLandingRoute('superadmin', null)).toBe('/superadmin');
  });

  it('sends an owner (no permission list) to the dashboard', () => {
    expect(getLandingRoute('admin', null)).toBe('/admin/home');
  });

  it('sends a manager to the dashboard', () => {
    expect(getLandingRoute('admin', ROLE_PERMISSIONS.manager)).toBe('/admin/home');
  });

  it('never sends floor staff to the dashboard they cannot open', () => {
    expect(getLandingRoute('admin', ROLE_PERMISSIONS.staff)).toBe('/admin/checklists');
  });

  it('falls back to the menu when operations is not granted', () => {
    expect(getLandingRoute('admin', ['menu'])).toBe('/admin/listmenu');
  });
});
