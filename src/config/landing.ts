import { routes } from "@/config/routes";
import type { PermissionUnit } from "@/constants/permissions";

/**
 * The first page a signed-in person should see. Every "go back" or
 * "go home" action uses this too, so nobody is sent to a page their role
 * can't open.
 *
 * `permissions === null` means an owner session (full access).
 */
export function getLandingRoute(
  role: string | null | undefined,
  permissions: PermissionUnit[] | null | undefined
): string {
  if (role === "superadmin") return routes.superadmin.home;
  if (!permissions) return routes.admin.home;
  if (permissions.includes("dashboard")) return routes.admin.home;
  if (permissions.includes("operations")) return routes.admin.checklists;
  if (permissions.includes("menu")) return routes.admin.listMenu;
  return routes.admin.listBusiness;
}
