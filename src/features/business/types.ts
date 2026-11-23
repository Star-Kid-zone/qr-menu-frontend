import type { ReactNode } from 'react';
import type { PermissionUnit } from '@/constants/permissions';

export type WorkspaceTabId =
  | 'workspace'
  | 'businesses'
  | 'public-site'
  | 'banners'
  | 'offers'
  | 'gallery'
  | 'content'
  | 'faqs'
  | 'reviews';

export interface WorkspaceTabConfig {
  id: WorkspaceTabId;
  label: string;
  description: string;
  icon: ReactNode;
  unit: PermissionUnit;
}

export type WebsiteSectionId = 'look' | 'content' | 'offers';

export interface WebsiteSectionConfig {
  id: WebsiteSectionId;
  label: string;
  tabs: WorkspaceTabId[];
}
