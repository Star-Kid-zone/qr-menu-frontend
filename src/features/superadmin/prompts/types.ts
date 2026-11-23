import type { PlatformPrompt, PromptFormData } from '@/types';

export type { PromptFormData };

export interface PromptCardProps {
  prompt: PlatformPrompt;
  copiedId: string | null;
  onCopy: (p: PlatformPrompt) => void;
  onUseInStudio: (p: PlatformPrompt) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEdit: (p: PlatformPrompt, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onPreviewRef: (url: string) => void;
}

export interface PromptModalProps {
  isOpen: boolean;
  editingPrompt: PlatformPrompt | null;
  form: PromptFormData;
  setForm: React.Dispatch<React.SetStateAction<PromptFormData>>;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onUploadRefImage: (file?: File) => void;
  uploadingRefImage: boolean;
}

export interface PromptLightboxProps {
  imageUrl: string | null;
  onClose: () => void;
}
