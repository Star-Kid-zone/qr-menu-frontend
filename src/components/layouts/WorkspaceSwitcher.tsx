"use client";

import { useEffect, useState } from "react";
import { PiStorefrontBold } from "react-icons/pi";
import { workspaceService, type WorkspaceListItem } from "@/services/workspace.service";
import { getActiveWorkspaceId, setActiveWorkspaceId } from "@/utils/storage";

export interface WorkspaceSwitcherProps {
  className?: string;
  onSwitch?: (workspaceId: string) => void;
  /** Show a badge when there is only one location. The sidebar already names it. */
  showSingle?: boolean;
}

export const WorkspaceSwitcher = ({ className = "", onSwitch, showSingle = true }: WorkspaceSwitcherProps) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaces() {
      try {
        const res = await workspaceService.listWorkspaces();
        if (!isMounted) return;

        const list = Array.isArray(res.data) ? res.data : [];
        setWorkspaces(list);

        if (list.length > 0) {
          const storedId = getActiveWorkspaceId();
          const matched = list.find((w) => w.id === storedId);
          const defaultWs = list.find((w) => w.isDefault) || list[0];
          const resolvedId = matched ? matched.id : defaultWs.id;

          setActiveId(resolvedId);
          if (!matched) {
            setActiveWorkspaceId(resolvedId);
          }
        }
      } catch (err) {
        // Fallback silently if offline or unauthorized
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWorkspaces();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (!newId || newId === activeId) return;

    setActiveId(newId);
    setActiveWorkspaceId(newId);

    if (onSwitch) {
      onSwitch(newId);
    } else {
      // Reload page to rehydrate tenant-scoped queries with the updated X-Workspace-Id
      window.location.reload();
    }
  };

  if (loading || workspaces.length === 0) {
    return null;
  }

  // Single location: Show sleek identity badge
  if (workspaces.length === 1) {
    if (!showSingle) return null;
    const single = workspaces[0];
    const label = single.publicSlug || "Main Store";
    return (
      <div
        className={`hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1 text-caption text-muted-foreground shadow-sm sm:inline-flex ${className}`}
        title={`Active location: ${label} (${single.role})`}
        data-testid="single-workspace-badge"
      >
        <PiStorefrontBold size={14} className="shrink-0 text-primary" />
        <span className="max-w-[140px] truncate font-medium text-foreground">{label}</span>
      </div>
    );
  }

  // Multiple locations: Show switchable dropdown
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1 text-caption text-foreground shadow-sm transition hover:border-primary/40 ${className}`}
      data-testid="multi-workspace-select-container"
    >
      <PiStorefrontBold size={14} className="shrink-0 text-primary" />
      <select
        aria-label="Select location"
        value={activeId || ""}
        onChange={handleChange}
        className="cursor-pointer bg-transparent text-caption font-medium text-foreground outline-none transition"
        data-testid="workspace-select"
      >
        {workspaces.map((ws) => (
          <option key={ws.id} value={ws.id} className="bg-card text-foreground">
            {ws.publicSlug || `Branch (${ws.id.slice(0, 6)})`}
            {ws.isDefault ? " (Primary)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
};


