"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PiChartLineUpBold,
  PiForkKnifeBold,
  PiGridFourBold,
  PiMegaphoneBold,
  PiQrCodeBold,
  PiStarBold,
  PiStorefrontBold,
  PiUsersThreeBold,
  PiWalletBold,
  PiXBold,
} from "react-icons/pi";

import { routes } from "@/config/routes";
import { usePermissions } from "@/hooks/usePermissions";
import type { PermissionUnit } from "@/constants/permissions";

export interface NavItem {
  path: string;
  icon: ReactNode;
  text: string;
  description: string;
  unit?: PermissionUnit;
}

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  const { hasPermission, isStaff } = usePermissions();

  const rawGroups: { label: string; items: NavItem[] }[] = [
    {
      label: "Overview",
      items: [
        {
          path: routes.admin.home,
          icon: <PiGridFourBold />,
          text: "Dashboard",
          description: "Priorities and setup",
          unit: "dashboard",
        },
        {
          path: routes.admin.analytics,
          icon: <PiChartLineUpBold />,
          text: "Analytics",
          description: "Traffic and engagement",
          unit: "analytics",
        },
      ],
    },
    {
      label: "Guest touchpoints",
      items: [
        {
          path: routes.admin.listBusiness,
          icon: <PiStorefrontBold />,
          text: "Workspace",
          description: "Profiles, themes and controls",
          unit: "workspace",
        },
        {
          path: routes.admin.listMenu,
          icon: <PiForkKnifeBold />,
          text: "Menu",
          description: "Items and categories",
          unit: "menu",
        },
        {
          path: routes.admin.listPayment,
          icon: <PiWalletBold />,
          text: "Payments",
          description: "Checkout destinations",
          unit: "payments",
        },
        {
          path: routes.admin.listReview,
          icon: <PiStarBold />,
          text: "Reviews",
          description: "Reputation signals",
          unit: "reviews",
        },
      ],
    },
    {
      label: "Growth",
      items: [
        {
          path: routes.admin.socialMedia,
          icon: <PiMegaphoneBold />,
          text: "Marketing",
          description: "Social presence",
          unit: "marketing",
        },
        {
          path: routes.admin.addQrCode,
          icon: <PiQrCodeBold />,
          text: "QR assets",
          description: "Codes and printouts",
          unit: "qr-assets",
        },
      ],
    },
    // Staff management is never gated by a permission unit — it's owner-only,
    // hidden entirely for any session carrying a permissions claim.
    ...(!isStaff
      ? [
          {
            label: "Team",
            items: [
              {
                path: routes.admin.staff,
                icon: <PiUsersThreeBold />,
                text: "Staff",
                description: "Manager & staff accounts",
              },
            ],
          },
        ]
      : []),
  ];

  const menuGroups = rawGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.unit || hasPermission(item.unit)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[17rem] flex-col overflow-hidden border-r border-border bg-card transition-[transform,width] duration-200 lg:z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:w-20 lg:translate-x-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 animate-blob rounded-full bg-clay-orange/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 animate-blob-slow animate-blob-delay rounded-full bg-clay-violet/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 animate-blob-slow rounded-full bg-clay-coral/15 blur-3xl"
        />

        <div className={`relative flex h-16 shrink-0 items-center justify-between border-b border-border px-5 ${isOpen ? "" : "lg:justify-center lg:px-2"}`}>
          <div className={`flex items-center gap-2.5 ${isOpen ? "" : "lg:flex-col"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-clay-gradient text-sm font-bold text-primary-foreground shadow-neu-sm">
              QR
            </div>
            {isOpen && <p className="text-h3 text-foreground">Admin</p>}
          </div>

          <button
            onClick={toggleSidebar}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <PiXBold size={16} />
          </button>
        </div>

        <nav className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-6">
              {isOpen && (
                <h3 className="mb-2 px-3 text-caption uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname?.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      title={!isOpen ? item.text : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-body transition-all ${
                        isOpen ? "" : "justify-center"
                      } ${
                        active
                          ? "bg-clay-gradient font-semibold text-primary-foreground shadow-neu-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
                      }`}
                      onClick={() => {
                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <span className={`text-lg ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {item.icon}
                      </span>
                      {isOpen && <span className="min-w-0 flex-1 truncate">{item.text}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={`relative shrink-0 border-t border-border px-4 py-4 ${isOpen ? "" : "lg:px-2"}`}>
          {isOpen && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-clay-gradient-violet text-caption font-semibold text-primary-foreground shadow-neu-sm">
                AD
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-caption font-semibold text-foreground">Administrator</span>
                <span className="text-caption text-muted-foreground">v2.0.0</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
