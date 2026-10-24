"use client";

import { useEffect, useState } from "react";
import { getStoredPermissions } from "@/utils/storage";
import type { PermissionUnit } from "@/constants/permissions";

/**
 * `null` = full owner access (no filtering). A staff-issued session has a
 * stored permissions array limiting which units are visible/usable.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionUnit[] | null>(() =>
    typeof window !== "undefined" ? getStoredPermissions() : null
  );

  useEffect(() => {
    const onStorage = () => setPermissions(getStoredPermissions());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hasPermission = (unit: PermissionUnit) => permissions === null || permissions.includes(unit);
  const isStaff = permissions !== null;

  return { permissions, hasPermission, isStaff };
}
