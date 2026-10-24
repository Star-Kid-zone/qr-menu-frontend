"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, AdminFormPage } from "@/shared/components";
import {
  PaymentForm,
  type PaymentFormHandle,
  type PaymentFormInitialData,
} from "@/features/payments";
import { workspaceService } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/shared/utils";
import { PermissionGuard } from "@/shared/auth";

function EditPaymentPageContent() {
  const router = useRouter();
  const formRef = useRef<PaymentFormHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<PaymentFormInitialData | null>(null);

  const goToList = () => router.push("/admin/listpayment");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await workspaceService.getWorkspace();
        const payment = res.data.payment;
        if (payment) {
          setInitialData({
            type: payment.type === "image" ? "image" : "url",
            link: payment.link,
            qrImage: payment.qrImage,
          });
        }
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load payment settings"));
      }
    };
    void fetchData();
  }, []);

  const handleSubmit = async () => {
    const payload = formRef.current?.getPayload();
    if (!payload) return;

    setSubmitting(true);
    try {
      let qrImageUrl: string | null = payload.existingQrImage;
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

      toast.success("Payment method updated successfully!");
      goToList();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update payment method"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminFormPage
      title="Edit Payment Method"
      onBack={goToList}
      backLabel="Back to payment methods"
      onCancel={goToList}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      submitting={submitting}
    >
      <PaymentForm ref={formRef} mode="edit" initialData={initialData} />
    </AdminFormPage>
  );
}

export default function EditPaymentPage() {
  return (
    <PermissionGuard requiredUnit="payments">
      <EditPaymentPageContent />
    </PermissionGuard>
  );
}
