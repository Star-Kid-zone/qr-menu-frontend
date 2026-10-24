import type { AxiosResponse } from 'axios';

/**
 * Safely unwraps an API response payload.
 * If payload is `{ success: true, data: T }` or `{ data: T }`, extracts `data`.
 * Otherwise returns the payload as-is.
 */
export function unwrapApiResponse<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    'data' in (payload as Record<string, unknown>) &&
    (payload as Record<string, unknown>).data !== undefined
  ) {
    return (payload as Record<string, unknown>).data as T;
  }
  return payload as T;
}

/**
 * Safely extracts data from an Axios response promise or value.
 */
export async function unwrapAxiosResponse<T>(
  promiseOrResponse: Promise<AxiosResponse<any>> | AxiosResponse<any>
): Promise<T> {
  const res = await promiseOrResponse;
  return unwrapApiResponse<T>(res?.data ?? res);
}
