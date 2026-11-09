import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/app.constants';
import { routes } from '@/config/routes';
import { getCsrfToken, getActiveWorkspaceId, isAuthenticated, clearStorage } from '@/utils/storage';
import { startGlobalLoading, endGlobalLoading } from '@/utils/globalLoading.store';

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  // Sends the httpOnly accessToken/refreshToken cookies automatically —
  // there is no token for the client to attach itself.
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    if (method && MUTATING_METHODS.has(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    const activeWsId = getActiveWorkspaceId();
    if (activeWsId) {
      config.headers['X-Workspace-Id'] = activeWsId;
    }
    startGlobalLoading();
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let refreshPromise: Promise<void> | null = null;

function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Envelope fields the response interceptor copies onto the Axios response before unwrapping `data`. */
export type ApiEnvelopeFields = {
  meta?: unknown;
  message?: string;
  requestId?: string;
};

api.interceptors.response.use(
  (response) => {
    endGlobalLoading();
    // Seamless unwrapping if backend sends standardized ApiResponse envelope: { success: true, data: ... }
    if (
      response.data &&
      typeof response.data === 'object' &&
      !Array.isArray(response.data) &&
      response.data.success === true &&
      'data' in response.data
    ) {
      const enveloped = response as AxiosResponse & ApiEnvelopeFields;
      enveloped.meta = response.data.meta;
      enveloped.message = response.data.message;
      enveloped.requestId = response.data.requestId;
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    endGlobalLoading();
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/staff-login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      const hadSessionMarker = isAuthenticated();
      const onProtectedPath =
        typeof window !== 'undefined' &&
        (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/superadmin'));

      // Public page with no session at all: nothing to refresh, nothing to redirect.
      if (!hadSessionMarker && !onProtectedPath) {
        return Promise.reject(error);
      }

      try {
        // The CSRF marker cookie may be missing while the httpOnly refresh cookie
        // is still valid, so always let the server decide. A successful refresh
        // re-issues access, refresh and CSRF cookies. Concurrent 401s share one
        // in-flight refresh, and the retried request just needs re-issuing.
        await refreshAccessToken();

        return api(originalRequest);
      } catch (refreshError) {
        clearStorage();
        window.location.replace(`${window.location.origin}${routes.public.login}?reason=session_expired`);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
