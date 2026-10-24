"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PiShieldWarningBold } from "react-icons/pi";
import { usePermissions } from "@/hooks/usePermissions";
import type { PermissionUnit } from "@/constants/permissions";
import { Button } from "@/shared/components";
import { routes } from "@/config/routes";

interface PermissionGuardProps {
  children: ReactNode;
  requiredUnit?: PermissionUnit;
  requireOwner?: boolean;
}

export function PermissionGuard({
  children,
  requiredUnit,
  requireOwner = false,
}: PermissionGuardProps) {
  const router = useRouter();
  const { hasPermission, isStaff } = usePermissions();

  if (requireOwner && isStaff) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <PiShieldWarningBold className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Owner Access Only</h2>
        <p className="max-w-md text-sm text-muted-foreground mb-6">
          Only the workspace owner can access staff management and team settings.
        </p>
        <Button onClick={() => router.push(routes.admin.home)} variant="primary">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (requiredUnit && !hasPermission(requiredUnit)) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
          <PiShieldWarningBold className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Access Restricted</h2>
        <p className="max-w-md text-sm text-muted-foreground mb-6">
          Your staff account does not have permission to access the &quot;{requiredUnit}&quot; module. Please contact your workspace manager or administrator.
        </p>
        <Button onClick={() => router.push(routes.admin.home)} variant="primary">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
