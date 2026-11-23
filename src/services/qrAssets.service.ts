import api from '@/services/api.service';

/**
 * Same-origin static files (the app's own font files) fetched as data URLs,
 * so exported QR artwork carries its fonts with it.
 */
export const qrAssetsService = {
  async fetchAsDataUrl(absoluteUrl: string): Promise<string> {
    const response = await api.get<Blob>(absoluteUrl, { responseType: 'blob', baseURL: '' });
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(response.data);
    });
  },
};
