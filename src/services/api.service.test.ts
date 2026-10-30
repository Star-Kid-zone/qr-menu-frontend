import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api.service';
import * as storage from '@/utils/storage';

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
    const rawAxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: {
        success: true,
        message: 'Menu fetched',
        data: [{ id: '1', item: 'Pizza' }],
        meta: { total: 1 },
        requestId: 'req-123',
      },
    };

    // Find the response fulfillment interceptor
    const interceptor = (api.interceptors.response as any).handlers[0]?.fulfilled;
    expect(typeof interceptor).toBe('function');

    const processed = interceptor(rawAxiosResponse);
    expect(processed.data).toEqual([{ id: '1', item: 'Pizza' }]);
    expect(processed.message).toBe('Menu fetched');
    expect(processed.requestId).toBe('req-123');
  });

  it('attaches X-CSRF-Token on mutating requests (POST)', () => {
    vi.spyOn(storage, 'getCsrfToken').mockReturnValue('mock-csrf-token-abc');

    const config = {
      method: 'post',
      headers: {} as any,
    };

    const interceptor = (api.interceptors.request as any).handlers[0]?.fulfilled;
    expect(typeof interceptor).toBe('function');

    const result = interceptor(config);
    expect(result.headers['X-CSRF-Token']).toBe('mock-csrf-token-abc');
  });

  it('does NOT attach X-CSRF-Token on safe read requests (GET)', () => {
    vi.spyOn(storage, 'getCsrfToken').mockReturnValue('mock-csrf-token-abc');

    const config = {
      method: 'get',
      headers: {} as any,
    };

    const interceptor = (api.interceptors.request as any).handlers[0]?.fulfilled;
    const result = interceptor(config);
    expect(result.headers['X-CSRF-Token']).toBeUndefined();
  });

  it('attaches X-Workspace-Id header when an active workspace is selected', () => {
    vi.spyOn(storage, 'getActiveWorkspaceId').mockReturnValue('999');

    const config = {
      method: 'get',
      headers: {} as any,
    };

    const interceptor = (api.interceptors.request as any).handlers[0]?.fulfilled;
    const result = interceptor(config);
    expect(result.headers['X-Workspace-Id']).toBe('999');
  });
});

