"use client";

import React from "react";
import Image from "@/components/ui/Image";
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  FormField,
} from "@/components/ui";
import {
  PiWalletBold,
  PiStarBold,
  PiFloppyDiskBold,
  PiArrowSquareOutBold,
} from "react-icons/pi";
import type { UserDetailResponse, PaymentFormData } from "../types";

interface UserPaymentsReviewsTabProps {
  detail: UserDetailResponse;
  paymentForm: PaymentFormData;
  setPaymentForm: React.Dispatch<React.SetStateAction<PaymentFormData>>;
  paymentSaving: boolean;
  handleSavePaymentReview: (e: React.FormEvent) => Promise<void>;
}

export function UserPaymentsReviewsTab({
  detail,
  paymentForm,
  setPaymentForm,
  paymentSaving,
  handleSavePaymentReview,
}: UserPaymentsReviewsTabProps) {
  const primaryWorkspace = detail.workspaces?.[0];

  return (
    <div className="space-y-6 pb-8">
      <form onSubmit={handleSavePaymentReview} className="space-y-6">
        {/* Payment Gateway Settings */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2">
              <PiWalletBold className="size-5 text-primary" />
              <h2 className="text-h3 font-bold text-foreground">
                Payment Link & Gateway Setup
              </h2>
            </div>
            <Badge tone={paymentForm.paymentLink ? "success" : "neutral"}>
              {paymentForm.paymentLink ? "Gateway Configured" : "Unset"}
            </Badge>
          </div>

          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormField label="Payment Method Type">
                  <Select
                    value={paymentForm.paymentType}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentType: e.target.value,
                      })
                    }
                  >
                    <option value="url">Direct Gateway URL</option>
                    <option value="qr_image">Uploaded QR Code Image</option>
                    <option value="both">Both URL & QR Code</option>
                  </Select>
                </FormField>

                <FormField label="Payment Gateway Checkout URL">
                  <Input
                    value={paymentForm.paymentLink}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentLink: e.target.value,
                      })
                    }
                    placeholder="https://buy.stripe.com/..."
                  />
                </FormField>

                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={paymentSaving}
                    leftIcon={<PiFloppyDiskBold size={15} />}
                  >
                    Save Payment & Review Config
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-caption font-bold text-muted-foreground mb-2">
                  Payment QR Code Image
                </p>
                {primaryWorkspace?.paymentQrImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative size-40 overflow-hidden rounded-xl border border-border bg-card p-2">
                      <Image
                        src={primaryWorkspace.paymentQrImage}
                        alt="Payment QR"
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-full">
                      {primaryWorkspace.paymentQrImage}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                    <PiWalletBold className="size-8 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      No custom payment QR code image uploaded yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Google Reviews Configuration */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2">
              <PiStarBold className="size-5 text-primary" />
              <h2 className="text-h3 font-bold text-foreground">
                Google Review Direct Redirect
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <FormField label="Google Review / Business Link">
              <Input
                value={paymentForm.reviewLink}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    reviewLink: e.target.value,
                  })
                }
                placeholder="https://g.page/r/..."
              />
            </FormField>

            {primaryWorkspace?.googlePlaceId && (
              <p className="text-xs text-muted-foreground">
                Extracted Google Place ID:{" "}
                <span className="font-mono text-foreground font-semibold">
                  {primaryWorkspace.googlePlaceId}
                </span>
              </p>
            )}

            {paymentForm.reviewLink && (
              <a
                href={paymentForm.reviewLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                Test Google Review Link <PiArrowSquareOutBold size={13} />
              </a>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
