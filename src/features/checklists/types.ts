import type { ChecklistItem, ChecklistTemplateType } from '@/services/checklist.service';

export interface TemplateFormState {
  id: string | null;
  name: string;
  type: ChecklistTemplateType;
  active: boolean;
  items: ChecklistItem[];
}
