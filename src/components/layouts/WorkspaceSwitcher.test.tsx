import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AxiosHeaders } from 'axios';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { workspaceService, type WorkspaceListItem } from '@/services/workspace.service';
import * as storage from '@/utils/storage';

vi.mock('@/services/workspace.service', () => ({
  workspaceService: {
    listWorkspaces: vi.fn(),
  },
}));

vi.mock('@/utils/storage', async () => {
  const actual = await vi.importActual<typeof import('@/utils/storage')>('@/utils/storage');
  return {
    ...actual,
    getActiveWorkspaceId: vi.fn(),
    setActiveWorkspaceId: vi.fn(),
  };
});

describe('WorkspaceSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when workspace list is empty', async () => {
    vi.mocked(workspaceService.listWorkspaces).mockResolvedValueOnce({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    const { container } = render(<WorkspaceSwitcher />);

    await waitFor(() => {
      expect(workspaceService.listWorkspaces).toHaveBeenCalled();
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders single workspace badge when only one workspace exists', async () => {
    const singleWorkspace: WorkspaceListItem = {
      id: 'ws-1',
      publicSlug: 'downtown-bistro',
      themeColour: '#ff0000',
      defaultTimezone: 'UTC',
      role: 'owner',
      isDefault: true,
    };

    vi.mocked(workspaceService.listWorkspaces).mockResolvedValueOnce({
      data: [singleWorkspace],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    render(<WorkspaceSwitcher />);

    await waitFor(() => {
      expect(screen.getByTestId('single-workspace-badge')).toBeInTheDocument();
    });

    expect(screen.getByText('downtown-bistro')).toBeInTheDocument();
  });

  it('renders dropdown when multiple workspaces exist and handles selection', async () => {
    const workspaces: WorkspaceListItem[] = [
      {
        id: 'ws-1',
        publicSlug: 'location-alpha',
        themeColour: '#111111',
        defaultTimezone: 'UTC',
        role: 'owner',
        isDefault: true,
      },
      {
        id: 'ws-2',
        publicSlug: 'location-beta',
        themeColour: '#222222',
        defaultTimezone: 'UTC',
        role: 'manager',
        isDefault: false,
      },
    ];

    vi.mocked(workspaceService.listWorkspaces).mockResolvedValueOnce({
      data: workspaces,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    vi.mocked(storage.getActiveWorkspaceId).mockReturnValue('ws-1');

    const handleSwitch = vi.fn();
    render(<WorkspaceSwitcher onSwitch={handleSwitch} />);

    await waitFor(() => {
      expect(screen.getByTestId('workspace-select')).toBeInTheDocument();
    });

    const select = screen.getByTestId('workspace-select') as HTMLSelectElement;
    expect(select.value).toBe('ws-1');

    // Change to location-beta (ws-2)
    fireEvent.change(select, { target: { value: 'ws-2' } });

    expect(storage.setActiveWorkspaceId).toHaveBeenCalledWith('ws-2');
    expect(handleSwitch).toHaveBeenCalledWith('ws-2');
  });
});

