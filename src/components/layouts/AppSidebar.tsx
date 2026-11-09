"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiArrowSquareOut, PiCaretLeftBold, PiX } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { isNavItemActive, type NavGroup } from "@/config/navigation";
import type { ShellIdentity } from "@/hooks/useShellIdentity";
import { AccountMenu } from "./AccountMenu";

interface AppSidebarProps {
  groups: NavGroup[];
  identity: ShellIdentity | null;
  /** Big name at the top: the restaurant, or "Platform admin" for super admins. */
  title: string;
  /** Optional line under the title, e.g. a "View website" link. */
  subtitle?: ReactNode;
  /** Slot under the title, e.g. the location switcher. */
  headerExtra?: ReactNode;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

export function AppSidebar({
  groups,
  identity,
  title,
  subtitle,
  headerExtra,
  collapsed,
  onToggleCollapsed,
  drawerOpen,
  onCloseDrawer,
}: AppSidebarProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);

  // Mobile drawer: Escape closes it and focus moves into it while open.
  useEffect(() => {
    if (!drawerOpen) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseDrawer();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, onCloseDrawer]);

  // Close the drawer after navigating on mobile.
  useEffect(() => {
    onCloseDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Collapsed only applies to the desktop rail; the mobile drawer is always full.
  const compact = collapsed && !drawerOpen;

  return (
    <>
      <div
        aria-hidden
        onClick={onCloseDrawer}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 lg:hidden",
          drawerOpen ? "block" : "hidden"
        )}
      />

      <aside
        ref={panelRef}
        aria-label="Main"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh flex-col border-r border-border bg-card transition-[transform,width] duration-200 motion-reduce:transition-none",
          "w-[17rem] lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
          compact && "lg:w-[4.5rem]"
        )}
      >
        {/* Edge handle: always in view, on the border between the menu and the page. */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand menu" : "Collapse menu"}
          className="group absolute -right-3.5 top-7 z-10 hidden size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 motion-reduce:transition-none lg:flex"
        >
          <PiCaretLeftBold
            aria-hidden
            className={cn("size-3.5 transition-transform duration-200 motion-reduce:transition-none", collapsed && "rotate-180")}
          />
        </button>

        <div className={cn("shrink-0 px-4 pt-6 pb-4", compact && "lg:px-3")}>
          <div className="flex items-start justify-between gap-2">
            {compact ? (
              <span
                aria-hidden
                className="hidden size-10 items-center justify-center rounded-lg bg-primary text-body-medium text-primary-foreground lg:flex"
              >
                {title.trim().charAt(0).toUpperCase()}
              </span>
            ) : null}
            <div className={cn("min-w-0", compact && "lg:sr-only")}>
              <p className="text-h3 leading-snug text-foreground break-words">{title}</p>
              {subtitle ? <div className="mt-1 text-caption text-muted-foreground">{subtitle}</div> : null}
            </div>
            <button
              type="button"
              onClick={onCloseDrawer}
              aria-label="Close menu"
              className="-mr-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <PiX aria-hidden className="size-5" />
            </button>
          </div>
          {headerExtra && !compact ? <div className="mt-3">{headerExtra}</div> : null}
        </div>

        <nav aria-label="Sections" className={cn("min-h-0 flex-1 overflow-y-auto px-3 pb-4", compact && "lg:px-2")}>
          {groups.map((group, i) => (
            <div key={group.label ?? `group-${i}`} className={cn(i > 0 && "mt-6")}>
              {group.label ? (
                <p className={cn("mb-1 px-3 text-caption text-muted-foreground", compact && "lg:sr-only")}>{group.label}</p>
              ) : null}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isNavItemActive(item, pathname);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        title={compact ? item.label : undefined}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-md px-3 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          compact && "lg:justify-center lg:px-0",
                          active
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon aria-hidden className="size-5 shrink-0" />
                        <span className={cn("truncate", compact && "lg:sr-only")}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={cn("shrink-0 border-t border-border p-3", compact && "lg:px-2")}>
          <AccountMenu identity={identity} compact={compact} />
        </div>
      </aside>
    </>
  );
}

/** Small "View website" link used as the sidebar subtitle in the restaurant area. */
export function ViewWebsiteLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:underline"
    >
      View website
      <PiArrowSquareOut aria-hidden className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
