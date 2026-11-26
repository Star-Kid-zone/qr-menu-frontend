"use client";

import { useEffect, useState } from "react";
import { workspaceService } from "@/services/workspace.service";
import { onSessionChanged, onWorkspaceChanged } from "@/services/workspaceEvents";
import type { WorkspaceData } from "@/types/admin/workspace/workspace.types";
import { useAsyncData, type UseAsyncDataResult } from "./useAsyncData";

let pending: Promise<WorkspaceData> | null = null;

/**
 * The signed-in owner's workspace, fetched once and shared: every caller that asks while a
 * request is in flight (or after it resolved) gets the same promise. A failed request is not
 * cached, and a saved change (workspaceService.updateWorkspace) clears the copy.
 */
export function loadWorkspace(): Promise<WorkspaceData> {
  if (!pending) {
    const request = workspaceService.getWorkspace().then((res) => res.data);
    pending = request;
    // Only forget this request: a newer one may already have replaced it.
    request.catch(() => {
      if (pending === request) pending = null;
    });
  }
  return pending;
}

/** Drops the cached workspace so the next load refetches (tests call this between cases). */
export function invalidateWorkspace(): void {
  pending = null;
}

// Registered at module load, so it runs before any hook's refetch listener below.
onWorkspaceChanged(invalidateWorkspace);
onSessionChanged(invalidateWorkspace);

/** The cached workspace with loading/error state; refetches after a saved change. */
export function useWorkspace(): UseAsyncDataResult<WorkspaceData> {
  const [version, setVersion] = useState(0);
  useEffect(() => onWorkspaceChanged(() => setVersion((v) => v + 1)), []);
  return useAsyncData(loadWorkspace, [version], "Couldn't load your restaurant settings.");
}
