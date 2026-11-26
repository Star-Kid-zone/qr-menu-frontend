import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import api, { type ApiEnvelopeFields } from './api.service';
import * as storage from '@/utils/storage';

// Axios keeps registered interceptors on an internal `handlers` array that its
// public typings don't expose; this is the slice of that shape the tests read.
type InterceptorHandlers<V> = { handlers: Array<{ fulfilled: (value: V) => V }> };

const requestHandlers = () =>
  (api.interceptors.request as unknown as InterceptorHandlers<InternalAxiosRequestConfig>).handlers;
const responseHandlers = () =>
  (api.interceptors.response as unknown as InterceptorHandlers<AxiosResponse & ApiEnvelopeFields>).handlers;

describe('API Service (Axios Client & Interceptors)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is configured with credentials enabled for httpOnly cookies', () => {
    expect(api.defaults.withCredentials).toBe(true);
  });

  it('sets standard json and requested-with headers', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
    expect(api.defaults.headers['X-Requested-With']).toBe('XMLHttpRequest');
  });

  it('unwraps standardized ApiResponse envelope { success: true, data: T } in response interceptor', () => {
    const rawAxiosResponse: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {
        success: true,
        message: 'Menu fetched',
        data: [{ id: '1', item: 'Pizza' }],
        meta: { total: 1 },
        requestId: 'req-123',
      },
    };

    // Find the response fulfillment interceptor
    const interceptor = responseHandlers()[0]?.fulfilled;
    expect(typeof interceptor).toBe('function');

    const processed = interceptor(rawAxiosResponse);
    expect(processed.data).toEqual([{ id: '1', item: 'Pizza' }]);
    expect(processed.message).toBe('Menu fetched');
    expect(processed.requestId).toBe('req-123');
  });

  it('attaches X-CSRF-Token on mutating requests (POST)', () => {
    vi.spyOn(storage, 'getCsrfToken').mockReturnValue('mock-csrf-token-abc');

    const config: InternalAxiosRequestConfig = {
      method: 'post',
      headers: new AxiosHeaders(),
    };

    const interceptor = requestHandlers()[0]?.fulfilled;
    expect(typeof interceptor).toBe('function');

    const result = interceptor(config);
    expect(result.headers['X-CSRF-Token']).toBe('mock-csrf-token-abc');
  });

  it('does NOT attach X-CSRF-Token on safe read requests (GET)', () => {
    vi.spyOn(storage, 'getCsrfToken').mockReturnValue('mock-csrf-token-abc');

    const config: InternalAxiosRequestConfig = {
      method: 'get',
      headers: new AxiosHeaders(),
    };

    const interceptor = requestHandlers()[0]?.fulfilled;
    const result = interceptor(config);
    expect(result.headers['X-CSRF-Token']).toBeUndefined();
  });

  it('never sends X-Workspace-Id: the backend resolves the workspace from the logged-in user', () => {
    vi.spyOn(storage, 'getActiveWorkspaceId').mockReturnValue('999');

    const config: InternalAxiosRequestConfig = {
      method: 'get',
      headers: new AxiosHeaders(),
    };

    const interceptor = requestHandlers()[0]?.fulfilled;
    const result = interceptor(config);
    expect(result.headers['X-Workspace-Id']).toBeUndefined();
  });

  describe('401 handling and token refresh', () => {
    const originalAdapter = api.defaults.adapter;
    const replace = vi.fn();

    const respond = (config: InternalAxiosRequestConfig, status: number): Promise<AxiosResponse> => {
      const response: AxiosResponse = { status, statusText: '', headers: {}, config, data: {} };
      return status < 400
        ? Promise.resolve(response)
        : Promise.reject(new AxiosError('fail', String(status), config, null, response));
    };

    const stubLocation = (pathname: string) =>
      vi.stubGlobal('location', { pathname, origin: 'http://localhost:3000', replace });

    beforeEach(() => {
      replace.mockClear();
    });

    afterEach(() => {
      api.defaults.adapter = originalAdapter;
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('refreshes and retries even when the CSRF marker cookie is missing on a protected path', async () => {
      stubLocation('/admin/menu');
      vi.spyOn(storage, 'isAuthenticated').mockReturnValue(false);
      const calls: string[] = [];
      let menuHits = 0;
      api.defaults.adapter = (config) => {
        calls.push(config.url ?? '');
        if (config.url === '/auth/refresh') return respond(config, 200);
        return respond(config, ++menuHits === 1 ? 401 : 200);
      };

      const res = await api.get('/menu');

      expect(res.status).toBe(200);
      expect(calls).toEqual(['/menu', '/auth/refresh', '/menu']);
      expect(replace).not.toHaveBeenCalled();
    });

    it('does not attempt a refresh or redirect on a public page with no session', async () => {
      stubLocation('/menu/some-restaurant');
      vi.spyOn(storage, 'isAuthenticated').mockReturnValue(false);
      const calls: string[] = [];
      api.defaults.adapter = (config) => {
        calls.push(config.url ?? '');
        return respond(config, 401);
      };

      await expect(api.get('/something')).rejects.toBeDefined();

      expect(calls).toEqual(['/something']);
      expect(replace).not.toHaveBeenCalled();
    });

    it('redirects to login with session_expired when the refresh fails', async () => {
      stubLocation('/admin/menu');
      vi.spyOn(storage, 'isAuthenticated').mockReturnValue(true);
      vi.spyOn(storage, 'clearStorage').mockImplementation(() => undefined);
      api.defaults.adapter = (config) => respond(config, config.url === '/auth/refresh' ? 403 : 401);

      await expect(api.get('/menu')).rejects.toBeDefined();

      expect(replace).toHaveBeenCalledWith(expect.stringContaining('/login?reason=session_expired'));
    });
  });
});

