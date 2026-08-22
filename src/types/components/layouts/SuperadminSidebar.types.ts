import type { ReactNode } from "react";

export type SuperadminSidebarProps = {
      isOpen: boolean;
      toggleSidebar: () => void;
    };
export type NavItem = { path: string; icon: ReactNode; text: string; description: string };
