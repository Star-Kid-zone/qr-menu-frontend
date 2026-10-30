"use client";

import { AddPaymentPage } from "@/features/payments";
import { PermissionGuard } from "@/components/auth";

export default function Page() {
  return (
    <PermissionGuard requiredUnit="payments">
      <AddPaymentPage />
    </PermissionGuard>
  );
}
