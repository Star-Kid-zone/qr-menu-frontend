"use client";

import { ListPaymentPage } from "@/features/payments";
import { PermissionGuard } from "@/components/auth";

export default function Page() {
  return (
    <PermissionGuard requiredUnit="payments">
      <ListPaymentPage />
    </PermissionGuard>
  );
}
