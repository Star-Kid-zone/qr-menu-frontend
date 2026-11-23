"use client";

import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PiList } from "react-icons/pi";
import { ADMIN_NAV, SUPERADMIN_NAV, getSectionLabel, type NavGroup } from "@/config/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { useShellIdentity } from "@/hooks/useShellIdentity";
import { getRawStorageItem, setRawStorageItem } from "@/utils/storage";
import { cn } from "@/utils/cn";
import { STORAGE_KEYS, STORAGE_EVENTS } from "@/constants/storage.constants";
import { AppSidebar, ViewWebsiteLink } from "./AppSidebar";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

const COLLAPSED_KEY = STORAGE_KEYS.sidebarCollapsed;
const COLLAPSED_EVENT = STORAGE_EVENTS.sidebarCollapsed;

// Labels are the navigation, so the menu starts expanded. A person's own
// choice is remembered; with no choice yet, narrow laptops start collapsed.
function readCollapsed(): boolean {
  const stored = getRawStorageItem(COLLAPSED_KEY);
  if (stored !== null) return stored === "true";
  return window.innerWidth < 1280;
}

function subscribeCollapsed(onChange: () => void) {
  window.addEventListener(COLLAPSED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener(COLLAPSED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener("resize", onChange);
  };
}

interface AppShellProps {
  area: "admin" | "superadmin";
  /** Banners shown above every page (support mode, platform announcements). */
  banners?: ReactNode;
  children: ReactNode;
}

/** The one app frame for the restaurant area and the super admin area. */
export function AppShell({ area, banners, children }: AppShellProps) {
  const pathname = usePathname();
  const identity = useShellIdentity(area);
  const { hasPermission, isStaff, canViewWebsite } = usePermissions();
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setRawStorageItem(COLLAPSED_KEY, String(!readCollapsed()));
    window.dispatchEvent(new Event(COLLAPSED_EVENT));
  }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const groups: NavGroup[] = useMemo(() => {
    const source = area === "superadmin" ? SUPERADMIN_NAV : ADMIN_NAV;
    if (area === "superadmin") return source;
    return source
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.ownerOnly) return !isStaff;
          if (item.anyOf) return item.anyOf.some((unit) => hasPermission(unit));
          if (!item.unit) return true;
          return item.unit === "workspace" ? canViewWebsite : hasPermission(item.unit);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [area, isStaff, canViewWebsite, hasPermission]);

  const title =
    area === "superadmin" ? "Platform admin" : identity?.restaurantName ?? " ";
  const sectionLabel = getSectionLabel(groups, pathname);

  return (
    <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-body-medium focus:shadow-lg focus:outline-2 focus:outline-primary"
      >
        Skip to content
      </a>

      <AppSidebar
        groups={groups}
        identity={identity}
        title={title}
        subtitle={area === "admin" && identity?.websiteUrl ? <ViewWebsiteLink href={identity.websiteUrl} /> : undefined}
        headerExtra={area === "admin" ? <WorkspaceSwitcher showSingle={false} /> : undefined}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        drawerOpen={drawerOpen}
        onCloseDrawer={closeDrawer}
      />

      <div
        className={cn(
          "flex h-dvh min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-200 motion-reduce:transition-none",
          collapsed ? "lg:ml-[4.5rem]" : "lg:ml-[17rem]"
        )}
      >
        {/* Phones and tablets only: the desktop sidebar already shows where you are. */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="-ml-2 rounded-md p-2 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PiList aria-hidden className="size-5" />
          </button>
          <p className="min-w-0 truncate text-body-medium text-foreground">{sectionLabel || title}</p>
        </div>

        {banners}

        <main id="main-content" tabIndex={-1} className="min-h-0 flex-1 overflow-hidden p-4 focus:outline-none sm:p-6 lg:p-8">
          <div className="mx-auto h-full w-full min-w-0 max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
