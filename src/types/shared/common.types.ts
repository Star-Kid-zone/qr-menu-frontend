import type { IconType } from 'react-icons';
import type { PermissionUnit } from '@/types/auth/auth.types';

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
  maxSizeBytes?: number;
}

export type Readability = 'good' | 'large-only' | 'poor';

export type StoreListener = () => void;

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

/** Callback for a parameterless change signal (e.g. services/workspaceEvents.ts). */
export type ChangeListener = () => void;
