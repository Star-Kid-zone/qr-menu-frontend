"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { ReactQRCode } from "@lglab/react-qr-code";
import { workspaceService, WorkspaceData } from "@/services/workspace.service";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils/errors";
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

export function ListPaymentPage() {
  const router = useRouter();
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWorkspace = async () => {
    try {
      const res = await workspaceService.getWorkspace();
      setData(res.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load payment settings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const handleDelete = async () => {
    try {
      await workspaceService.updateWorkspace({
        payment: { type: "url", link: null, qrImage: null },
      });
      toast.success("Payment method removed");
      await fetchWorkspace();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove payment method"));
    }
  };

  const hasPayment = data?.payment?.link || data?.payment?.qrImage;
  const isImage = data?.payment?.type === "image";
  const paymentLink = isImage ? data?.payment?.qrImage : data?.payment?.link;

  return (
    <div className="flex h-full flex-col gap-0">
      {/* Header */}
      <PageHeader
        title="Payment Methods"
        description="Manage how customers pay you at checkout."
        actions={
          hasPayment ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push("/admin/editpayment")}
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
            <Button
              onClick={() => router.push("/admin/addpayment")}
              size="sm"
              leftIcon={<PiPlusBold size={14} />}
            >
              Add Payment
            </Button>
          )
        }
      />

      {/* Body */}
      <div className="min-h-0 flex-1 pt-3 sm:pt-4 flex flex-col">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : !hasPayment ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 md:p-6 flex flex-col">
            <EmptyState
              icon={<PiQrCodeBold size={32} />}
              title="No payment method yet"
              description="Add a payment link or QR code image to start accepting payments from customers."
              action={
                <Button
                  onClick={() => router.push("/admin/addpayment")}
                  leftIcon={<PiPlusBold size={15} />}
                >
                  Add Payment Method
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-5">
            {/* Left — QR Preview Panel */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Status card */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
                <PiCheckCircleFill size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Active & Visible</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">Currently shown to customers</p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
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
                  <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
                    <PiQrCodeBold size={13} />
                    Scan to Pay
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Details Panel */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              {/* Method type header */}
              <div className="rounded-xl border border-border bg-card p-5">
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
                  <p className="mb-2 px-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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

              {/* Instructions */}
              <div className="flex-1 rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-sm font-semibold text-foreground">How it works</p>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Customer opens your menu QR code" },
                    { step: "2", text: isImage ? "They scan your payment QR image to pay" : "They tap the Pay button and land on your payment page" },
                    { step: "3", text: "Payment is completed on your gateway" },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {step}
                      </span>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  ))}
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
        title="Remove Payment Method"
        description="Are you sure you want to remove this payment method? Customers will no longer see it at checkout."
        confirmLabel="Delete"
        entityName="payment method"
      />
    </div>
  );
}

