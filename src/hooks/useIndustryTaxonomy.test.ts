import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useIndustryTaxonomy } from './useIndustryTaxonomy';
import industryService from '@/services/industry.service';

vi.mock('@/services/industry.service', () => ({
  default: { getCategories: vi.fn(), getTypes: vi.fn() },
}));

const getCategories = industryService.getCategories as Mock;
const getTypes = industryService.getTypes as Mock;

describe('useIndustryTaxonomy', () => {
  beforeEach(() => {
    getCategories.mockReset().mockResolvedValue({ data: [{ id: '1', name: 'Mains' }] });
    getTypes.mockReset().mockResolvedValue({ data: [{ id: '2', name: 'Veg' }] });
  });

  it('fetches nothing without a business type', async () => {
    const { result } = renderHook(() => useIndustryTaxonomy(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toEqual([]);
    expect(getCategories).not.toHaveBeenCalled();
  });

  it('loads categories and dish types together', async () => {
    const { result } = renderHook(() => useIndustryTaxonomy('7'));
    await waitFor(() => expect(result.current.categories).toHaveLength(1));
    expect(result.current.types).toEqual([{ id: '2', name: 'Veg' }]);
    expect(getCategories).toHaveBeenCalledWith('7');
  });

  it('appends a just-created category without refetching', async () => {
    const { result } = renderHook(() => useIndustryTaxonomy('7'));
    await waitFor(() => expect(result.current.categories).toHaveLength(1));
    act(() => result.current.addCategory({ id: '9', name: 'Desserts' } as never));
    expect(result.current.categories.map((c) => c.name)).toEqual(['Mains', 'Desserts']);
    expect(getCategories).toHaveBeenCalledTimes(1);
  });
});
