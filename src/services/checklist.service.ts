import api from './api.service';

export type ChecklistTemplateType = 'opening' | 'closing' | 'custom';
export type ChecklistRunStatus = 'pending' | 'in_progress' | 'completed';

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

export interface ChecklistItemStatus {
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

export const checklistService = {
  listTemplates: () => api.get<{ templates: ChecklistTemplate[] }>('/checklists/templates'),
  createTemplate: (data: CreateChecklistTemplateInput) =>
    api.post<{ template: ChecklistTemplate }>('/checklists/templates', data),
  updateTemplate: (id: string, data: Partial<CreateChecklistTemplateInput>) =>
    api.put<{ template: ChecklistTemplate }>(`/checklists/templates/${id}`, data),
  removeTemplate: (id: string) => api.delete(`/checklists/templates/${id}`),

  today: () => api.get<{ runDate: string; runs: TodayChecklistRun[] }>('/checklists/runs/today'),
  history: (params?: { from?: string; to?: string }) =>
    api.get<{ runs: ChecklistRun[] }>('/checklists/runs', { params }),
  toggleItem: (runId: string, itemId: string, completed: boolean) =>
    api.patch<{ run: ChecklistRun }>(`/checklists/runs/${runId}/items/${itemId}`, { completed }),
};
