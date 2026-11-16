import type { IconType } from "react-icons";
import {
  PiCalendarCheck,
  PiChartLineUp,
  PiForkKnife,
  PiGauge,
  PiGlobeSimple,
  PiHouse,
  PiImages,
  PiListChecks,
  PiMegaphone,
  PiNotebook,
  PiQrCode,
  PiShareNetwork,
  PiSpeakerHigh,
  PiStar,
  PiStorefront,
  PiUsersThree,
  PiGear,
} from "react-icons/pi";
import { routes } from "@/config/routes";
import type { PermissionUnit } from "@/constants/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: IconType;
  /** Permission needed to see the item; 'workspace' also admits view-only roles. */
  unit?: PermissionUnit;
  ownerOnly?: boolean;
  /** Visible when the role holds any one of these (for pages with mixed sections). */
  anyOf?: PermissionUnit[];
  /** Other routes that belong to this item (add/edit pages), for the active state. */
  match?: string[];
}

export interface NavGroup {
  /** Omit for the top group. Short, plain group names only. */
  label?: string;
  items: NavItem[];
}

/**
 * Restaurant area. Labels follow the glossary in docs/ux-audit/03 §5.
 * Routes stay as they are for now (renaming routes is a later step).
 */
export const ADMIN_NAV: NavGroup[] = [
  {
    items: [
      { label: "Home", href: routes.admin.home, icon: PiHouse, unit: "dashboard", match: ["/admin/analytics"] },
      { label: "Menu", href: routes.admin.listMenu, icon: PiForkKnife, unit: "menu", match: ["/admin/addmenu", "/admin/editmenu"] },
      { label: "Website", href: routes.admin.listBusiness, icon: PiStorefront, unit: "workspace" },
      { label: "QR menu", href: routes.admin.qrMenu, icon: PiQrCode, anyOf: ["qr-assets", "workspace"], match: ["/admin/addqrcode"] },
      { label: "Reviews", href: routes.admin.listReview, icon: PiStar, unit: "reviews", match: ["/admin/addreview"] },
      { label: "Social posts", href: routes.admin.socialMedia, icon: PiShareNetwork, unit: "marketing" },
    ],
  },
  {
    label: "Team",
    items: [
      { label: "Shifts", href: routes.admin.schedule, icon: PiCalendarCheck, unit: "operations" },
      { label: "Checklists", href: routes.admin.checklists, icon: PiListChecks, unit: "operations" },
      { label: "Team members", href: routes.admin.staff, icon: PiUsersThree, ownerOnly: true },
    ],
  },
  {
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: PiGear,
        // Business details need website edit rights; the other sections have their own.
        anyOf: ["workspace", "payments", "reviews", "marketing"],
        match: ["/admin/listpayment", "/admin/addpayment", "/admin/editpayment"]
      },
    ],
  },
];

export const SUPERADMIN_NAV: NavGroup[] = [
  {
    items: [
      { label: "Overview", href: routes.superadmin.home, icon: PiGauge },
      { label: "Restaurants", href: routes.superadmin.users, icon: PiStorefront },
      { label: "Analytics", href: routes.superadmin.analytics, icon: PiChartLineUp },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Announcements", href: routes.superadmin.announcements, icon: PiSpeakerHigh },
      { label: "Weekly posters", href: routes.superadmin.weeklyPosters, icon: PiMegaphone },
          { label: "Occasion wording", href: routes.superadmin.occasionPacks, icon: PiCalendarCheck },
    ],
  },
  {
    label: "Content library",
    items: [
      { label: "Starter menus", href: routes.superadmin.blueprints, icon: PiGlobeSimple },
      { label: "Creative studio", href: routes.superadmin.creativeStudio, icon: PiImages },
      { label: "Prompt library", href: routes.superadmin.prompts, icon: PiNotebook },
    ],
  },
];

/** True when `pathname` belongs to `item` (its own route or one of its sub-pages). */
export function isNavItemActive(item: NavItem, pathname: string | null): boolean {
  if (!pathname) return false;
  const roots = [item.href, ...(item.match ?? [])];
  // The superadmin overview is a prefix of every superadmin route: match it exactly.
  if (item.href === routes.superadmin.home) return pathname === item.href;
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`) || pathname.startsWith(root));
}

/** Label of the section the user is in, for the compact mobile top bar. */
export function getSectionLabel(groups: NavGroup[], pathname: string | null): string {
  for (const group of groups) {
    for (const item of group.items) if (isNavItemActive(item, pathname)) return item.label;
  }
  return "";
}
