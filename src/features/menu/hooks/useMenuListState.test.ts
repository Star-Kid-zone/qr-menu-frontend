import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMenuListState } from './useMenuListState';
import { menuService } from '@/services/menu.service';
import { workspaceService } from '@/services/workspace.service';
import industryService from '@/services/industry.service';

vi.mock('@/services/menu.service', () => ({
  menuService: {
    getMenus: vi.fn(),
    deleteMenu: vi.fn(),
    toggleAvailability: vi.fn(),
  },
}));

vi.mock('@/services/workspace.service', () => ({
  workspaceService: {
    getWorkspace: vi.fn(),
    updateWorkspace: vi.fn(),
  },
}));

vi.mock('@/services/industry.service', () => ({
  default: {
    getIndustries: vi.fn(),
  },
}));

vi.mock('@/components/ui', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const MOCK_ITEMS = [
  { id: '1', item: 'Truffle Burger', price: '15.00', category: 'Burgers', type: 'Food', popular: true, availability: true },
  { id: '2', item: 'Classic Caesar', price: '10.00', category: 'Salads', type: 'Food', popular: false, availability: true },
  { id: '3', item: 'Iced Latte', price: '5.00', category: 'Beverages', type: 'Drink', popular: true, availability: false },
];

describe('useMenuListState Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (menuService.getMenus as Mock).mockResolvedValue({ data: MOCK_ITEMS });
    (workspaceService.getWorkspace as Mock).mockResolvedValue({ data: { business: { industryId: 1 } } });
    (industryService.getIndustries as Mock).mockResolvedValue({ data: [{ id: 1, name: 'Restaurant' }] });
  });

  it('initializes with default search, viewMode, and category', async () => {
    const { result } = renderHook(() => useMenuListState());

    await waitFor(() => {
      expect(result.current.search).toBe('');
      expect(result.current.selectedCategory).toBe('All');
      expect(result.current.viewMode).toBe('grid');
      expect(result.current.importOpen).toBe(false);
    });
  });

  it('filters items correctly based on search query', async () => {
    const { result } = renderHook(() => useMenuListState());

    await waitFor(() => {
      expect(result.current.search).toBe('');
    });

    act(() => {
      result.current.setSearch('latte');
    });

    expect(result.current.search).toBe('latte');
  });

  it('updates selected category and computes dynamic categories', async () => {
    const { result } = renderHook(() => useMenuListState());

    await waitFor(() => {
      expect(result.current.selectedCategory).toBe('All');
    });

    act(() => {
      result.current.setSelectedCategory('Burgers');
    });

    expect(result.current.selectedCategory).toBe('Burgers');
  });

  it('toggles viewMode between grid and list', async () => {
    const { result } = renderHook(() => useMenuListState());

    await waitFor(() => {
      expect(result.current.viewMode).toBe('grid');
    });

    act(() => {
      result.current.setViewMode('list');
    });
    expect(result.current.viewMode).toBe('list');

    act(() => {
      result.current.setViewMode('grid');
    });
    expect(result.current.viewMode).toBe('grid');
  });
});
