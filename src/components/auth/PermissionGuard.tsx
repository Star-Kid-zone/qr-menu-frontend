"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PiLock } from "react-icons/pi";
import { usePermissions } from "@/hooks/usePermissions";
import type { PermissionUnit } from "@/constants/permissions";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getLandingRoute } from "@/config/landing";
import { getStoredUserRole } from "@/utils/storage";

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
  const { ready, hasPermission, isStaff, permissions } = usePermissions();
  // Until stored permissions are readable, don't mount the page: its requests
  // would run with owner access assumed and be refused for staff.
  if (!ready) return null;

  const blocked = (requireOwner && isStaff) || (requiredUnit && !hasPermission(requiredUnit));
  if (!blocked) return <>{children}</>;

  const home = getLandingRoute(getStoredUserRole(), permissions);
  return (
    <EmptyState
      icon={<PiLock className="size-7" />}
      title={requireOwner ? "Only the owner can open this page" : "Your role can't open this page"}
      description="Ask the restaurant owner if you need access."
      action={
        <Link href={home} className={buttonVariants({ variant: "primary" })}>
          Go to my start page
        </Link>
      }
    />
  );
}
