import type { MenuBlueprint } from '@/services/superadmin.service';

export type PreviewTab = 'dishes' | 'branding' | 'story' | 'offers' | 'gallery_faqs';

export type EditorTab = 'basic' | 'dishes' | 'theme' | 'story' | 'offers_faqs';

export interface BlueprintCardProps {
  blueprint: MenuBlueprint;
  isDefault: boolean;
  savingConfig: boolean;
  onPreview: (bp: MenuBlueprint, tab?: PreviewTab) => void;
  onEdit: (bp: MenuBlueprint) => void;
  onDelete: (bp: MenuBlueprint) => void;
  onReset: (bp: MenuBlueprint) => void;
  onSetDefault: (id: string) => void;
}

export interface BlueprintPreviewModalProps {
  blueprint: MenuBlueprint | null;
  defaultBlueprintId: string;
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  onClose: () => void;
  onSetDefault: (id: string) => void;
}

export interface BlueprintEditorModalProps {
  blueprint: MenuBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedBp: MenuBlueprint) => void;
}
