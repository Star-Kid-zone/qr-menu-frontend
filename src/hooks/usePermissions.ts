"use client";

import { useEffect, useState } from "react";
import { getStoredPermissions } from "@/utils/storage";
import type { PermissionUnit } from "@/constants/permissions";

/**
 * `null` = full owner access (no filtering). A staff-issued session has a
 * stored permissions array limiting which units are visible/usable.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionUnit[] | null>(null);

  useEffect(() => {
    setPermissions(getStoredPermissions());
  }, []);

  const hasPermission = (unit: PermissionUnit) => permissions === null || permissions.includes(unit);
  const isStaff = permissions !== null;

  return { permissions, hasPermission, isStaff };
}
