"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import { PaymentForm, type PaymentFormHandle } from "@/components/admin/PaymentForm";
import { workspaceService } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

function AddPaymentPageContent() {
  const router = useRouter();
  const formRef = useRef<PaymentFormHandle>(null);
  const [submitting, setSubmitting] = useState(false);

  const goToList = () => router.push("/admin/listpayment");

  const handleSubmit = async () => {
    const payload = formRef.current?.getPayload();
    if (!payload) return;

    setSubmitting(true);
    try {
      let qrImageUrl: string | null = null;
      if (payload.type === "image" && payload.file) {
        const formData = new FormData();
        formData.append("image", payload.file);
        const res = await workspaceService.uploadPaymentQr(formData);
        qrImageUrl = res.data.url;
      }

      await workspaceService.updateWorkspace({
        payment: {
          type: payload.type,
          link: payload.type === "url" ? payload.link : null,
          qrImage: payload.type === "image" ? qrImageUrl : null,
        },
      });

      toast.success("Payment method created successfully!");
      goToList();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create payment method"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminFormPage
      title="Add Payment Method"
      onBack={goToList}
      backLabel="Back to payment methods"
      onCancel={goToList}
      onSubmit={handleSubmit}
      submitLabel="Add Payment"
      submitting={submitting}
    >
      <PaymentForm ref={formRef} mode="create" />
    </AdminFormPage>
  );
}

export default function AddPaymentPage() {
  return (
    <PermissionGuard requiredUnit="payments">
      <AddPaymentPageContent />
    </PermissionGuard>
  );
}
