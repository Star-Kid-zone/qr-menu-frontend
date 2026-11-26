import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AdminDashboardPage } from './AdminDashboardPage';

const mockGetDashboard = vi.fn();
const mockGetStats = vi.fn();
const mockLoadWorkspace = vi.fn();

vi.mock('@/services/analytics.service', () => ({
  analyticsService: {
    getDashboard: (...args: unknown[]) => mockGetDashboard(...args),
  },
}));

vi.mock('@/services/menu.service', () => ({
  menuService: {
    getStats: (...args: unknown[]) => mockGetStats(...args),
  },
}));

vi.mock('@/hooks/useWorkspace', () => ({
  loadWorkspace: (...args: unknown[]) => mockLoadWorkspace(...args),
  invalidateWorkspace: vi.fn(),
}));

vi.mock('@/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: () => false }),
}));

const emptyDashboard = {
  summary: { totalVisits: 0, uniqueVisitors: 0, totalClicks: 0, totalSearches: 0 },
  today: { visits: 0, visitors: 0, newVisitors: 0, returningVisitors: 0, clicks: 0, searches: 0 },
  previous: { visits: 0, visitors: 0, clicks: 0, searches: 0 },
  visitHistory: [],
  visitorTrend: [],
  topMenuItems: [],
  visitsByHour: [],
  acquisition: [],
  clickBreakdown: {},
  topSearches: [],
  zeroResultSearches: [],
};

const sampleMenuStats = {
  total: 8,
  available: 8,
  unavailable: 0,
  popular: 6,
  byCategory: [{ category: 'Artisan Bakery', count: 2 }],
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadWorkspace.mockResolvedValue({ publicSlug: 'cafe', business: { name: 'Cafe' } });
    mockGetStats.mockResolvedValue({ data: sampleMenuStats });
  });

  it('shows FirstScansGuide and MenuCatalogCard without empty analytics cards when there are no visits', async () => {
    mockGetDashboard.mockResolvedValue(emptyDashboard);

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('No visits in the last 30 days')).toBeInTheDocument();
    });

    expect(screen.getByText('No visits recorded today yet.')).toBeInTheDocument();
    expect(screen.getByText('Dishes by category')).toBeInTheDocument();
    expect(screen.queryByText('Visits per day')).not.toBeInTheDocument();
    expect(screen.queryByText('New and returning visitors')).not.toBeInTheDocument();
    expect(screen.queryByText('Most viewed dishes')).not.toBeInTheDocument();
    expect(screen.queryByText('What guests searched for')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/No change vs/)).not.toBeInTheDocument();
  });

  it('shows analytics cards and accurate empty search copy when visits exist without searches', async () => {
    mockGetDashboard.mockResolvedValue({
      ...emptyDashboard,
      summary: { totalVisits: 12, uniqueVisitors: 8, totalClicks: 3, totalSearches: 0 },
      today: { visits: 2, visitors: 2, newVisitors: 2, returningVisitors: 0, clicks: 1, searches: 0 },
      visitHistory: [{ date: '2026-11-24', count: 12 }],
    });

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Visits per day')).toBeInTheDocument();
    });

    expect(screen.getByText('No menu searches yet.')).toBeInTheDocument();
    expect(screen.queryByText(/Every search found a dish/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });
});
