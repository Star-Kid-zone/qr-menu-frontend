"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { ReactQRCode } from "@lglab/react-qr-code";
import { workspaceService, WorkspaceData } from "@/services/workspace.service";
import { toast } from "@/components/ui/toast";
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiQrCodeBold,
  PiLinkBold,
  PiImageBold,
} from "react-icons/pi";
import { fadeInUp } from "@/lib/motion";

export default function ListPaymentPage() {
  const router = useRouter();
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchWorkspace = async () => {
    try {
      const res = await workspaceService.getWorkspace();
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment settings");
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const handleDelete = async () => {
    await workspaceService.updateWorkspace({
      payment: {
        type: "url",
        link: null,
        qrImage: null,
      }
    });
    toast.success("Payment method removed");
    await fetchWorkspace();
  };

  const hasPayment = data?.payment?.link || data?.payment?.qrImage;
  const isImage = data?.payment?.type === "image";
  const paymentLink = isImage ? data?.payment?.qrImage : data?.payment?.link;

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Payment Methods"
        description="Manage how customers pay you at checkout."
        actions={
          hasPayment ? (
            <>
              <Button
                onClick={() => router.push("/admin/editpayment")}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <PiPencilSimpleBold size={16} />
                Edit
              </Button>
              <Button onClick={() => setDeleteOpen(true)} variant="danger" className="w-full sm:w-auto">
                <PiTrashBold size={16} />
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push("/admin/addpayment")} className="w-full sm:w-auto">
              <PiPlusBold size={16} />
              Add Payment
            </Button>
          )
        }
      />

      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="min-h-0 flex-1">
        {hasPayment ? (
          <Card className="h-full overflow-y-auto">
            <CardContent className="flex flex-col gap-5 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-4 shadow-neu-inset-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-clay-gradient text-primary-foreground shadow-neu-sm">
                    {isImage ? <PiImageBold size={20} /> : <PiLinkBold size={20} />}
                  </span>
                  <div>
                    <p className="text-body font-semibold text-foreground">
                      {isImage ? "Payment Image" : "Payment Link"}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      Currently visible to your customers
                    </p>
                  </div>
                </div>
                <Badge tone="primary">
                  {isImage ? <PiImageBold size={14} /> : <PiLinkBold size={14} />}
                  {isImage ? "Image" : "URL"}
                </Badge>
              </div>

              <div className="flex flex-col items-start gap-6 md:flex-row">
                {/* QR / Image Preview */}
                <div className="flex w-full shrink-0 flex-col items-center rounded-lg border border-border bg-muted/50 p-6 md:w-auto">
                  {paymentLink ? (
                    <div className="rounded-md border border-border bg-card p-3 shadow-xs">
                      {!isImage ? (
                        <ReactQRCode value={paymentLink} size={160} level={"H"} marginSize={4} />
                      ) : (
                        <div className="relative flex h-[160px] w-[160px] items-center justify-center">
                          <Image src={paymentLink} alt="Payment QR code" fill className="object-contain" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-[160px] w-[160px] flex-col items-center justify-center gap-2 rounded-md border border-border bg-muted text-muted-foreground">
                      <PiQrCodeBold size={40} />
                      <span className="text-caption">No QR Code</span>
                    </div>
                  )}

                  <p className="mt-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-caption text-muted-foreground shadow-xs">
                    <PiQrCodeBold size={14} /> Scan to Pay
                  </p>
                </div>

                {/* Destination detail */}
                <div className="w-full flex-grow">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="mb-3 text-caption text-muted-foreground">
                      {isImage ? "Image Preview" : "Destination URL"}
                    </p>

                    {isImage && paymentLink ? (
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-fit overflow-hidden rounded-md border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 text-caption text-primary-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 ease-out group-hover:opacity-100">
                          View Full Size
                        </div>
                        <Image src={paymentLink} alt="Payment QR full preview" width={300} height={144} className="h-36 w-auto object-contain p-2" />
                      </a>
                    ) : paymentLink ? (
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-md border border-border bg-card p-4 text-body text-primary underline decoration-primary/30 underline-offset-4 shadow-xs transition-colors duration-150 ease-out hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <PiLinkBold className="shrink-0 text-muted-foreground" size={20} />
                        <span className="break-all">{paymentLink}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={<PiPlusBold size={36} />}
            title="No Payment Method Added"
            description="Add a payment link or upload a QR code image to start accepting payments."
            action={
              <Button onClick={() => router.push("/admin/addpayment")} size="lg">
                Create Payment Method
              </Button>
            }
          />
        )}
      </motion.div>

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
