import type { InternalAxiosRequestConfig } from 'axios';

export type ApiEnvelopeFields = {
  meta?: unknown;
  message?: string;
  requestId?: string;
};

export type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
