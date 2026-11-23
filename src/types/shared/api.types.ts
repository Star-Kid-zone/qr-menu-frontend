import type { InternalAxiosRequestConfig } from 'axios';
import type { HTTP_STATUS, HTTP_METHODS } from '@/constants/http.constants';

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: string;
}

/** Error body from Express `errorResponse` (status: false, message, data) */
export interface ApiError {
  error?: string;
  message?: string;
  status?: boolean;
}

export type ApiEnvelopeFields = {
  meta?: unknown;
  message?: string;
  requestId?: string;
};

export type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
