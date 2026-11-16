"use client";

import { useState } from "react";

/**
 * The studio panel the owner has open, remembered for the visit, so pressing
 * Edit or Save (which re-mounts the studio) keeps them on the same panel.
 */
export function useRememberedPanel<T extends string>(key: string, fallback: T): [T, (id: T) => void] {
  const storageKey = `studio-panel-${key}`;
  const [active, setActive] = useState<T>(() => {
    try {
      return (window.sessionStorage.getItem(storageKey) as T | null) || fallback;
    } catch {
      return fallback;
    }
  });
  const set = (id: T) => {
    setActive(id);
    try {
      window.sessionStorage.setItem(storageKey, id);
    } catch {
      /* storage blocked: still works for this mount */
    }
  };
  return [active, set];
}
