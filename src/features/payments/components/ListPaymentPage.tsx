"use client";

import { useState, useRef } from "react";
import { invalidateWorkspace, useWorkspace } from "@/hooks/useWorkspace";
import { workspaceService } from "@/services/workspace.service";
import Image from "@/components/ui/Image";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { ReactQRCode } from "@lglab/react-qr-code";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
import { Notice } from "@/components/ui/Notice";
import { LoadErrorNotice } from "@/components/feedback/LoadErrorNotice";
import { PaymentForm, type PaymentFormHandle } from "./PaymentForm";
import { savePaymentMethod } from "../savePayment";
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiQrCodeBold,
  PiLinkBold,
  PiImageBold,
  PiArrowSquareOutBold,
  PiCheckCircleFill,
} from "react-icons/pi";

/**
 * Bill payment: view, add, change and remove the one payment method guests
 * see behind "Pay bill", all on this page (edits happen in place).
 */
export function ListPaymentPage({ startEditing = false }: { startEditing?: boolean }) {
  const { data, loading, error: loadError, refetch } = useWorkspace();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(startEditing);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const formRef = useRef<PaymentFormHandle>(null);

  const handleSave = async () => {
    const payload = formRef.current?.getPayload();
    if (!payload) return;
    setSaving(true);
    setSaveError(null);
    try {
      await savePaymentMethod(payload);
      toast.success("Bill payment saved");
      setEditing(false);
      await fetchWorkspace();
    } catch (err) {
      setSaveError(getApiErrorMessage(err, "Couldn't save the payment method. Try again."));
    } finally {
      setSaving(false);
    }
  };

  // After a save or delete, read the payment settings fresh.
  const fetchWorkspace = async () => {
    invalidateWorkspace();
    await refetch();
  };

  // ConfirmDeleteModal shows the success toast or the inline error.
  const handleDelete = async () => {
    await workspaceService.updateWorkspace({
      payment: { type: "url", link: null, qrImage: null },
    });
    await fetchWorkspace();
  };

  const hasPayment = data?.payment?.link || data?.payment?.qrImage;
  const isImage = data?.payment?.type === "image";
  const paymentLink = isImage ? data?.payment?.qrImage : data?.payment?.link;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {
          editing ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => { setEditing(false); setSaveError(null); }} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={() => void handleSave()} loading={saving}>
                Save changes
              </Button>
            </div>
          ) : hasPayment ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setEditing(true)}
                variant="secondary"
                size="sm"
                leftIcon={<PiPencilSimpleBold size={14} />}
              >
                Edit
              </Button>
              <Button
                onClick={() => setDeleteOpen(true)}
                variant="danger"
                size="sm"
                leftIcon={<PiTrashBold size={14} />}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)} leftIcon={<PiPlusBold size={14} />}>
              Add payment method
            </Button>
          )
        }
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {loadError && !loading ? (
          <LoadErrorNotice title="We couldn't load your bill payment settings" message={loadError} onRetry={fetchWorkspace} />
        ) : loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : editing ? (
          <div className="space-y-4">
            {saveError ? <Notice tone="error">{saveError}</Notice> : null}
            <PaymentForm
              ref={formRef}
              mode={hasPayment ? "edit" : "create"}
              initialData={
                data?.payment
                  ? {
                      type: data.payment.type === "image" ? "image" : "url",
                      link: data.payment.link,
                      qrImage: data.payment.qrImage,
                    }
                  : null
              }
            />
          </div>
        ) : !hasPayment ? (
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <EmptyState
              icon={<PiQrCodeBold size={32} />}
              title="Let guests pay from their phone"
              description="Add a payment link or a UPI/QR image. Guests reach it with the Pay bill button on your website and menu."
              action={
                <Button onClick={() => setEditing(true)} leftIcon={<PiPlusBold size={15} />}>
                  Add payment method
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {/* Left — QR Preview Panel */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Status card */}
              <div className="flex items-center gap-3 rounded-xl border border-success/15 bg-success/10 p-4 dark:border-success dark:bg-success/40">
                <PiCheckCircleFill size={20} className="shrink-0 text-success dark:text-success" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-success dark:text-success">Active & Visible</p>
                  <p className="text-xs text-success dark:text-success">Currently shown to customers</p>
                </div>
                <span className="flex shrink-0 items-center gap-2 rounded-lg border border-success/15 bg-white px-3 py-1 text-caption font-bold text-success dark:border-success dark:bg-success dark:text-success">
                  {isImage ? <PiImageBold size={11} /> : <PiLinkBold size={11} />}
                  {isImage ? "Image" : "URL"}
                </span>
              </div>

              {/* QR Box */}
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border bg-card">
                <div className="flex flex-col items-center gap-4 p-8">
                  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    {paymentLink ? (
                      !isImage ? (
                        <ReactQRCode value={paymentLink} size={160} level="H" marginSize={2} />
                      ) : (
                        <div className="relative h-40 w-40">
                          <Image src={paymentLink} alt="Payment QR" fill className="object-contain" />
                        </div>
                      )
                    ) : (
                      <div className="flex h-40 w-40 items-center justify-center text-muted-foreground/30">
                        <PiQrCodeBold size={64} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-xs font-medium text-muted-foreground">
                    <PiQrCodeBold size={13} />
                    Scan to Pay
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Details Panel */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              {/* Method type header */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    {isImage ? <PiImageBold size={18} /> : <PiLinkBold size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {isImage ? "Payment Image" : "Payment Link"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isImage ? "QR code image uploaded" : "Gateway URL configured"}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/40 p-1">
                  <p className="mb-2 px-2 pt-1 text-caption font-bold text-muted-foreground">
                    {isImage ? "Image URL" : "Destination URL"}
                  </p>
                  {paymentLink ? (
                    <div className="flex items-center gap-2 rounded-md bg-card p-3">
                      <PiLinkBold size={14} className="shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">{paymentLink}</span>
                      {!isImage && (
                        <a
                          href={paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                        >
                          <PiArrowSquareOutBold size={13} />
                        </a>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Remove bill payment?"
        description="Guests will no longer see a Pay bill button. You can add a payment method again at any time."
        confirmLabel="Remove"
        entityName="payment method"
        successMessage="Bill payment removed"
      />
    </div>
  );
}

