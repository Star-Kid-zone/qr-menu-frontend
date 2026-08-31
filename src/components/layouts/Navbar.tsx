"use client";

import { usePathname } from "next/navigation";
import { PiListBold, PiMoonBold, PiSignOutBold, PiSunBold } from "react-icons/pi";
import { useThemeContext } from "@/contexts/useThemeContext";
import { routes } from "@/config/routes";
import { logoutSession } from "@/utils/authSession";

export interface NavbarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  /** Which shell is rendering this navbar. Drives the identity chip fallback. */
  role?: "admin" | "superadmin";
  /** Label shown next to the identity avatar, e.g. "Administrator" or "Superadmin". */
  identityLabel?: string;
  /** Initials shown in the identity avatar, e.g. "AD" or "SA". */
  identityInitials?: string;
}

/**
 * Route -> readable page title, reusing the same labels defined for the
 * sidebar nav items (Sidebar.tsx / SuperadminSidebar.tsx) so the header
 * title stays consistent with the nav the user just clicked.
 */
const PAGE_TITLES: { path: string; text: string }[] = [
  { path: routes.admin.home, text: "Dashboard" },
  { path: routes.admin.analytics, text: "Analytics" },
  { path: routes.admin.listBusiness, text: "Workspace" },
  { path: routes.admin.listMenu, text: "Menu" },
  { path: routes.admin.addMenu, text: "Menu" },
  { path: routes.admin.listPayment, text: "Payments" },
  { path: routes.admin.addPayment, text: "Payments" },
  { path: routes.admin.listReview, text: "Reviews" },
  { path: routes.admin.addReview, text: "Reviews" },
  { path: routes.admin.socialMedia, text: "Marketing" },
  { path: routes.admin.addQrCode, text: "QR assets" },
  { path: routes.admin.listSetting, text: "Settings" },
  { path: routes.admin.addSetting, text: "Settings" },
  { path: routes.superadmin.analytics, text: "Analytics" },
  { path: routes.superadmin.users, text: "Users & tenants" },
  { path: routes.superadmin.home, text: "Overview" },
];

function toTitleCase(segment: string): string {
  return segment
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPageTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard";

  const match = PAGE_TITLES.filter((entry) => pathname.startsWith(entry.path)).sort(
    (a, b) => b.path.length - a.path.length
  )[0];

  if (match) return match.text;

  const lastSegment = pathname.split("/").filter(Boolean).pop();
  return lastSegment ? toTitleCase(lastSegment) : "Dashboard";
}

const Navbar = ({
  isOpen,
  toggleSidebar,
  role = "admin",
  identityLabel,
  identityInitials,
}: NavbarProps) => {
  const { mode, toggleTheme } = useThemeContext();
  const pathname = usePathname();

  const resolvedIdentityLabel = identityLabel ?? (role === "superadmin" ? "Superadmin" : "Administrator");
  const resolvedIdentityInitials = identityInitials ?? (role === "superadmin" ? "SA" : "AD");
  const pageTitle = getPageTitle(pathname);

  const handleLogout = () => {
    logoutSession();
  };

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-card/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 sm:px-6">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PiListBold size={16} />
          </button>

          <h1 className="truncate text-h3 text-foreground">
            {isOpen ? "" : pageTitle}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-caption text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {mode === "light" ? (
              <PiMoonBold size={14} className="shrink-0 text-primary" />
            ) : (
              <PiSunBold size={14} className="shrink-0 text-primary" />
            )}
            <span className="hidden sm:inline">{mode === "light" ? "Dark" : "Light"}</span>
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-2 pr-3 shadow-sm sm:flex">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-caption font-semibold text-primary-foreground">
              {resolvedIdentityInitials}
            </div>
            <span className="truncate text-caption font-semibold text-foreground">
              {resolvedIdentityLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-caption text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            aria-label="Log out"
          >
            <PiSignOutBold size={14} className="shrink-0" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
