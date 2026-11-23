import api from './api.service';
import type { ScannedItem, ScanResponse } from '@/types/admin/menu/menu.types';

export type { ScannedItem, ScanResponse };

export const menuScanService = {
  /**
   * Uploads a menu photo to POST /menu/scan and returns Gemini-extracted items.
   * NO items are saved to the database at this point — the caller reviews
   * and then calls menuService.createMenu() for each approved item.
   */
  scan: (file: File) => {
    const formData = new FormData();
    formData.append('menuImage', file);
    return api.post<ScanResponse>('/menu/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
