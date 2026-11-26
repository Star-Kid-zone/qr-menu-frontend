import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AddMenuPage } from './AddMenuPage';
import { EditMenuPage } from './EditMenuPage';
import { menuService } from '@/services/menu.service';
import { workspaceService } from '@/services/workspace.service';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams('name=Masala%20Dosa'),
}));
vi.mock('@/services/menu.service', () => ({
  menuService: { getMenu: vi.fn(), createMenu: vi.fn(), updateMenu: vi.fn() },
}));
vi.mock('@/services/workspace.service', () => ({
  workspaceService: { getWorkspace: vi.fn() },
}));
vi.mock('@/services/industry.service', () => ({
  default: {
    getCategories: vi.fn().mockResolvedValue({ data: [{ id: '1', name: 'Mains' }] }),
    getTypes: vi.fn().mockResolvedValue({ data: [{ id: '2', name: 'Veg' }] }),
  },
}));
// The scanner pulls in heavy upload code that these tests don't exercise.
vi.mock('./MenuScanModal', () => ({ MenuScanModal: () => null }));

const getMenu = menuService.getMenu as Mock;

describe('MenuItemForm via the add / edit pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (workspaceService.getWorkspace as Mock).mockResolvedValue({
      data: { business: { industryId: '5' }, currency: { symbol: '₹' }, theme: {} },
    });
  });

  it('add: prefills the name from ?name= and uses the workspace currency', async () => {
    render(<AddMenuPage />);
    expect(screen.getByLabelText(/Dish name/)).toHaveValue('Masala Dosa');
    await waitFor(() => expect(screen.getByText(/Price \(₹\)/)).toBeInTheDocument());
  });

  it('add: blocks submit and names every missing required field', async () => {
    render(<AddMenuPage />);
    await waitFor(() => expect(screen.getByRole('option', { name: 'Mains' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Add dish' }));
    expect(await screen.findByText('Enter a price')).toBeInTheDocument();
    expect(screen.getByText('Enter a category')).toBeInTheDocument();
    expect(menuService.createMenu).not.toHaveBeenCalled();
  });

  it('edit: fills the form from the loaded dish', async () => {
    getMenu.mockResolvedValue({
      data: { id: '3', item: 'Paneer Tikka', price: '240.00', category: 'Mains', type: 'Veg', availability: true, availabilityTime: 'Lunch,Dinner' },
    });
    render(<EditMenuPage menuId="3" />);
    expect(await screen.findByDisplayValue('Paneer Tikka')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lunch' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('edit: shows an error with a retry instead of an empty form when the dish fails to load', async () => {
    getMenu.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({
      data: { id: '3', item: 'Paneer Tikka', price: '240.00', category: 'Mains', type: 'Veg', availability: true },
    });
    render(<EditMenuPage menuId="3" />);
    expect(await screen.findByText("We couldn't load this dish")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Dish name/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByDisplayValue('Paneer Tikka')).toBeInTheDocument();
  });
});
