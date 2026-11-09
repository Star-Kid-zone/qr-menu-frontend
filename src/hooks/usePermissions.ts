"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getRawStorageItem, storageKeys } from "@/utils/storage";
import type { PermissionUnit } from "@/constants/permissions";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

// The raw string is a stable snapshot; parsing happens in useMemo.
const getSnapshot = () => getRawStorageItem(storageKeys.permissions);
// The server can't see localStorage. Using a fixed server snapshot lets React
// hydrate without a mismatch, then re-render with the stored permissions.
const getServerSnapshot = () => null;

const noopSubscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;

function parse(raw: string | null): PermissionUnit[] | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? (value as PermissionUnit[]) : null;
  } catch {
    return null;
  }
}

/**
 * `null` = full owner access (no filtering). A staff-issued session has a
 * stored permissions array limiting which units are visible/usable.
 */
export function usePermissions() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // False on the server and during hydration, when `permissions` is still the
  // server's owner-shaped null. Gate permission-dependent requests on it.
  const ready = useSyncExternalStore(noopSubscribe, isClient, isServer);
  const permissions = useMemo(() => parse(raw), [raw]);

  const hasPermission = (unit: PermissionUnit) => permissions === null || permissions.includes(unit);
  const isStaff = permissions !== null;
  // Website settings: 'workspace' can change them, 'workspace-read' can only look.
  const canViewWebsite = hasPermission("workspace") || hasPermission("workspace-read");
  const canEditWebsite = hasPermission("workspace");

  return { ready, permissions, hasPermission, isStaff, canViewWebsite, canEditWebsite };
}
