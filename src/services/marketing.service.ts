import api from './api.service';
import type { PosterDesign } from '@/types/marketing';

export const marketingService = {
  getPosterDesigns: () => api.get<PosterDesign[]>('/workspace/posters/designs'),
  savePosterDesign: (data: FormData) =>
    api.post<{ message: string; design: PosterDesign }>('/workspace/posters/designs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  removePosterDesign: (id: string) => api.delete<{ message: string }>(`/workspace/posters/designs/${id}`),
};
