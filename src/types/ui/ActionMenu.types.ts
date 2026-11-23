import type { ReactNode } from "react";

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  /** Explains the item in one line under its label. */
  description?: string;
}

export interface ActionMenuProps {
  label?: string;
  items: ActionMenuItem[];
  align?: "start" | "end";
  tooltip?: string;
}
