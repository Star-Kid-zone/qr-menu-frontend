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
