import api from './api.service';
import type { ChecklistTemplateType, ChecklistTemplate, ChecklistRun, TodayChecklistRun, CreateChecklistTemplateInput } from '@/types/admin/checklists/checklist.types';

export type { ChecklistTemplateType, ChecklistTemplate, ChecklistRun, TodayChecklistRun, CreateChecklistTemplateInput };

export const checklistService = {
  listTemplates: () => api.get<{ templates: ChecklistTemplate[] }>('/checklists/templates'),
  createTemplate: (data: CreateChecklistTemplateInput) =>
    api.post<{ template: ChecklistTemplate }>('/checklists/templates', data),
  updateTemplate: (id: string, data: Partial<CreateChecklistTemplateInput>) =>
    api.put<{ template: ChecklistTemplate }>(`/checklists/templates/${id}`, data),
  removeTemplate: (id: string) => api.delete<unknown>(`/checklists/templates/${id}`),

  today: () => api.get<{ runDate: string; runs: TodayChecklistRun[] }>('/checklists/runs/today'),
  history: (params?: { from?: string; to?: string }) =>
    api.get<{ runs: ChecklistRun[] }>('/checklists/runs', { params }),
  toggleItem: (runId: string, itemId: string, completed: boolean) =>
    api.patch<{ run: ChecklistRun }>(`/checklists/runs/${runId}/items/${itemId}`, { completed }),
};
