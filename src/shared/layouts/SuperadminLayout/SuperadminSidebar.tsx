'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PiChartLineUpBold,
  PiGaugeBold,
  PiImagesBold,
  PiUsersThreeBold,
  PiBookBookmarkBold,
  PiMegaphoneBold,
  PiNotebookBold,
  PiXBold,
} from 'react-icons/pi';
import { routes } from '@/config/routes';
import { SuperadminSidebarProps, NavItem } from "@/types/components/layouts/SuperadminSidebar.types";

const items: NavItem[] = [
  {
    path: routes.superadmin.home,
    icon: <PiGaugeBold />,
    text: 'Overview',
    description: 'Platform health and scale',
  },
  {
    path: routes.superadmin.users,
    icon: <PiUsersThreeBold />,
    text: 'Users & tenants',
    description: 'Accounts and workspaces',
  },
  {
    path: routes.superadmin.blueprints,
    icon: <PiBookBookmarkBold />,
    text: 'Onboarding templates',
    description: 'Default signup menus',
  },
  {
    path: routes.superadmin.announcements,
    icon: <PiMegaphoneBold />,
    text: 'Broadcasts',
    description: 'Tenant dashboard banners',
  },
  {
    path: routes.superadmin.analytics,
    icon: <PiChartLineUpBold />,
    text: 'Analytics',
    description: 'Traffic across all sites',
  },
  {
    path: routes.superadmin.creativeStudio,
    icon: <PiImagesBold />,
    text: 'Creative Studio',
    description: 'AI assets, decoder & tenant packs',
  },
  {
    path: routes.superadmin.prompts,
    icon: <PiNotebookBold />,
    text: 'Prompt Library',
    description: 'AI prompts & visual references',
  },
];


export function SuperadminSidebar({ isOpen, toggleSidebar }: SuperadminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[17rem] flex-col overflow-hidden border-r border-border bg-card transition-[transform,width] duration-200 lg:z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 animate-blob rounded-full bg-clay-violet/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 animate-blob-slow animate-blob-delay rounded-full bg-clay-orange/15 blur-3xl"
        />

        <div className={`relative flex h-16 shrink-0 items-center justify-between border-b border-border px-5 ${isOpen ? '' : 'lg:justify-center lg:px-2'}`}>
          <div className={`flex items-center gap-2.5 ${isOpen ? '' : 'lg:flex-col'}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              SA
            </div>
            {isOpen && (
              <div>
                <p className="text-h3 text-foreground">Platform</p>
                <p className="text-caption uppercase tracking-wider text-muted-foreground">Super admin</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <PiXBold size={16} />
          </button>
        </div>

        <nav className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {items.map((item) => {
              const active =
                item.path === routes.superadmin.home
                  ? pathname === routes.superadmin.home || pathname === '/superadmin/'
                  : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={!isOpen ? item.text : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-body transition-all ${
                    isOpen ? '' : 'justify-center'
                  } ${
                    active
                      ? 'bg-primary font-semibold text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-0.5'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                >
                  <span className={`text-lg ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.text}</span>
                      <span className={`block text-caption ${active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{item.description}</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={`shrink-0 border-t border-border px-4 py-4 ${isOpen ? '' : 'lg:px-2'}`} />
      </aside>
    </>
  );
}
