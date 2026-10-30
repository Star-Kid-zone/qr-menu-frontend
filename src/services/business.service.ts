import api from './api.service';
import { workspaceService, type WorkspaceBusinessProfile } from './workspace.service';

/**
 * Business Service
 * In this multi-tenant architecture, business profile details (name, phone, address, etc.)
 * belong to the tenant's workspace and are managed via `/api/workspace`.
 *
 * For direct business profile mutations, prefer using `workspaceService`.
 */
export const businessService = {
  /**
   * Retrieves the current tenant's workspace which includes the business profile.
   */
  getBusinessProfile: () => workspaceService.getWorkspace(),

  /**
   * Updates business profile fields through the workspace endpoint.
   */
  updateBusinessProfile: (business: WorkspaceBusinessProfile) =>
    workspaceService.updateWorkspace({ business }),

  /**
   * Industry taxonomy queries
   */
  getIndustries: () => api.get('/industries'),
};

