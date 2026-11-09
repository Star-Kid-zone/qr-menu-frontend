import { describe, it, expect } from 'vitest';
import { ADMIN_NAV, SUPERADMIN_NAV, isNavItemActive, getSectionLabel } from './navigation';

const allAdminItems = ADMIN_NAV.flatMap((g) => g.items);

describe('admin navigation', () => {
  it('uses the agreed section names', () => {
    expect(allAdminItems.map((i) => i.label)).toEqual([
      'Home', 'Menu', 'Website', 'QR menu', 'Reviews', 'Social posts', 'Shifts', 'Checklists', 'Team members', 'Settings',
    ]);
  });

  it('highlights exactly one item for every admin page, including moved and sub-pages', () => {
    const pages = [
      '/admin/home', '/admin/listmenu', '/admin/addmenu', '/admin/editmenu/312', '/admin/listbusiness',
      '/admin/qr-menu', '/admin/addqrcode', '/admin/listreview', '/admin/addreview', '/admin/social-media', '/admin/schedule',
      '/admin/checklists', '/admin/staff', '/admin/settings', '/admin/listpayment',
    ];
    for (const path of pages) {
      const active = allAdminItems.filter((item) => isNavItemActive(item, path)).map((i) => i.label);
      expect(active, path).toHaveLength(1);
    }
  });

  it('names the section for the mobile top bar', () => {
    expect(getSectionLabel(ADMIN_NAV, '/admin/editmenu/312')).toBe('Menu');
    expect(getSectionLabel(ADMIN_NAV, '/admin/settings')).toBe('Settings');
  });
});

describe('super admin navigation', () => {
  it('only marks Overview active on the overview itself', () => {
    const overview = SUPERADMIN_NAV[0].items[0];
    expect(isNavItemActive(overview, '/superadmin')).toBe(true);
    expect(isNavItemActive(overview, '/superadmin/users')).toBe(false);
  });

  it('includes the weekly posters page', () => {
    expect(SUPERADMIN_NAV.flatMap((g) => g.items).some((i) => i.href === '/superadmin/weekly-posters')).toBe(true);
  });
});
