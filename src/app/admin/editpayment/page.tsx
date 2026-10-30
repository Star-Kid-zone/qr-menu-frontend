"use client";

import { EditPaymentPage } from "@/features/payments";
import { PermissionGuard } from "@/components/auth";

export default function Page() {
  return (
    <PermissionGuard requiredUnit="payments">
      <EditPaymentPage />
    </PermissionGuard>
  );
}
