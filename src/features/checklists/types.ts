import type { ChecklistItem, ChecklistTemplateType } from '@/types';

export interface TemplateFormState {
  id: string | null;
  name: string;
  type: ChecklistTemplateType;
  active: boolean;
  items: ChecklistItem[];
}
