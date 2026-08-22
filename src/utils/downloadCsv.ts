import api from '@/services/api.service';

/**
 * Fetches a CSV export endpoint through the authenticated axios instance
 * (a plain `<a href>`/`window.open` would hit the backend without the
 * Bearer token and 401, since auth here is header-based, not cookie-based)
 * and triggers a browser download from the resulting blob.
 */
export async function downloadCsv(url: string, filename: string) {
  const response = await api.get(url, { responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
