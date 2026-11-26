export type ChecklistTemplateType = 'opening' | 'closing' | 'custom';
type ChecklistRunStatus = 'pending' | 'in_progress' | 'completed';

export interface ChecklistItem {
  id: string;
  label: string;
  required?: boolean;
  order: number;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  type: ChecklistTemplateType;
  items: ChecklistItem[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChecklistItemStatus {
  itemId: string;
  completed: boolean;
  completedByStaffId: string | null;
  completedAt: string | null;
}

export interface ChecklistRun {
  id: string;
  templateId: string;
  runDate: string;
  itemStatus: ChecklistItemStatus[];
  status: ChecklistRunStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodayChecklistRun {
  template: ChecklistTemplate;
  run: ChecklistRun;
}

export interface CreateChecklistTemplateInput {
  name: string;
  type?: ChecklistTemplateType;
  items?: ChecklistItem[];
  active?: boolean;
}
