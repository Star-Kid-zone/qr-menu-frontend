import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { invalidateWorkspace, loadWorkspace, useWorkspace } from './useWorkspace';
import { workspaceService } from '@/services/workspace.service';
import { workspaceChanged } from '@/services/workspaceEvents';

vi.mock('@/services/workspace.service', () => ({
  workspaceService: { getWorkspace: vi.fn() },
}));

const getWorkspace = workspaceService.getWorkspace as Mock;

describe('useWorkspace / loadWorkspace', () => {
  beforeEach(() => {
    getWorkspace.mockReset();
    invalidateWorkspace();
  });

  it('shares one request between callers', async () => {
    getWorkspace.mockResolvedValue({ data: { publicSlug: 'cafe' } });
    const [a, b] = await Promise.all([loadWorkspace(), loadWorkspace()]);
    expect(a).toEqual({ publicSlug: 'cafe' });
    expect(b).toBe(a);
    expect(getWorkspace).toHaveBeenCalledTimes(1);
  });

  it('does not cache a failed request', async () => {
    getWorkspace.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ data: { publicSlug: 'cafe' } });
    await expect(loadWorkspace()).rejects.toThrow('offline');
    await expect(loadWorkspace()).resolves.toEqual({ publicSlug: 'cafe' });
    expect(getWorkspace).toHaveBeenCalledTimes(2);
  });

  it('refetches after a saved change', async () => {
    getWorkspace.mockResolvedValueOnce({ data: { publicSlug: 'old' } }).mockResolvedValue({ data: { publicSlug: 'new' } });
    const { result } = renderHook(() => useWorkspace());
    await waitFor(() => expect(result.current.data?.publicSlug).toBe('old'));

    act(() => workspaceChanged());

    await waitFor(() => expect(result.current.data?.publicSlug).toBe('new'));
    expect(getWorkspace).toHaveBeenCalledTimes(2);
  });

  it('reports a load failure as an error message', async () => {
    getWorkspace.mockImplementation(() => Promise.reject(new Error('boom')));
    const { result } = renderHook(() => useWorkspace());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });
});
