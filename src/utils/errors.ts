export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    err.response.data &&
    typeof err.response.data === 'object'
  ) {
    const data = err.response.data as {
      error?: unknown;
      message?: unknown;
      details?: Array<{ field?: string; message?: string }>;
    };

    if (Array.isArray(data.details) && data.details.length > 0) {
      const messages = data.details
        .map((d) => d.message || (d.field ? `${d.field} is invalid` : ''))
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(', ');
      }
    }

    if (typeof data.error === 'string') return data.error;
    if (typeof data.message === 'string') return data.message;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
}
