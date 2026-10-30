import { describe, it, expect } from 'vitest';
import { getApiErrorMessage } from './errors';

describe('getApiErrorMessage', () => {
  it('returns fallback when err is null, undefined, or empty', () => {
    expect(getApiErrorMessage(null, 'Default error')).toBe('Default error');
    expect(getApiErrorMessage(undefined, 'Fallback error')).toBe('Fallback error');
    expect(getApiErrorMessage({}, 'Empty object fallback')).toBe('Empty object fallback');
  });

  it('extracts direct error string from response.data.error', () => {
    const err = {
      response: {
        data: {
          error: 'Invalid credentials provided',
        },
      },
    };
    expect(getApiErrorMessage(err, 'Fallback')).toBe('Invalid credentials provided');
  });

  it('extracts message from response.data.message when error is absent', () => {
    const err = {
      response: {
        data: {
          message: 'Operation was successful',
        },
      },
    };
    expect(getApiErrorMessage(err, 'Fallback')).toBe('Operation was successful');
  });

  it('formats multiple validation details into comma-separated message', () => {
    const err = {
      response: {
        data: {
          details: [
            { field: 'price', message: 'Price must be positive' },
            { field: 'item', message: 'Item name is required' },
          ],
        },
      },
    };
    expect(getApiErrorMessage(err, 'Fallback')).toBe('Price must be positive, Item name is required');
  });

  it('falls back to Error.message if not an Axios response error', () => {
    const err = new Error('Network connection timeout');
    expect(getApiErrorMessage(err, 'Fallback')).toBe('Network connection timeout');
  });
});

