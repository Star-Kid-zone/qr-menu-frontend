"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ChangeEvent,
  type Ref,
} from "react";
import Image from "@/components/ui/Image";
import { motion, AnimatePresence } from "framer-motion";
import { Input, toast } from "@/components/ui";
import {
  PiCheckBold,
  PiCopyBold,
  PiCreditCardBold,
  PiLinkBold,
  PiImageBold,
  PiUploadSimpleBold,
  PiCheckCircleFill,
} from "react-icons/pi";
import { cn, isSafeExternalUrl } from "@/utils";
import { springDefault, easeOutTransition } from "@/lib/motion";

export type PaymentMethodType = "url" | "image";

export interface PaymentFormInitialData {
  type: PaymentMethodType;
  link?: string | null;
  qrImage?: string | null;
}

/** Validated snapshot of the form, produced on demand via `getPayload()`. */
export interface PaymentFormPayload {
  type: PaymentMethodType;
  link: string | null;
  /** Newly selected file that still needs to be uploaded, if any. */
  file: File | null;
  /** Previously stored QR image URL, kept when no new file was selected. */
  existingQrImage: string | null;
}

export interface PaymentFormHandle {
  /** Validates the current form state; shows a toast and returns null if invalid. */
  getPayload: () => PaymentFormPayload | null;
}

export interface PaymentFormProps {
  mode: "create" | "edit";
  initialData?: PaymentFormInitialData | null;
}

const PAYMENT_TYPES = [
  {
    value: "url" as const,
    label: "Payment Link",
    sublabel: "Direct customers to your payment gateway URL",
    icon: PiLinkBold,
  },
  {
    value: "image" as const,
    label: "QR Image Upload",
    sublabel: "Upload a QR code image for customers to scan",
    icon: PiImageBold,
  },
];

/**
 * Shared payment method form (tabs + URL field + QR dropzone) used by both
 * the add and edit payment pages. Owns local form state and exposes a
 * `getPayload()` imperative handle so the host page can drive validation and
 * perform the (mode-specific) save request itself.
 */
function PaymentFormBase(
  { mode, initialData }: PaymentFormProps,
  ref: Ref<PaymentFormHandle>,
) {
  const [paymentType, setPaymentType] = useState<PaymentMethodType>(
    initialData?.type ?? "url",
  );
  const [paymentLink, setPaymentLink] = useState(initialData?.link ?? "");
  const [existingQrImage, setExistingQrImage] = useState<string | null>(
    initialData?.qrImage ?? null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync in initial data once it arrives (e.g. after the edit page's fetch
  // resolves). Adjusted during render rather than in an effect, per React's
  // "adjusting state when a prop changes" pattern.
  const [syncedInitialData, setSyncedInitialData] = useState(initialData);
  if (initialData !== syncedInitialData) {
    setSyncedInitialData(initialData);
    if (initialData) {
      setPaymentType(initialData.type ?? "url");
      setPaymentLink(initialData.link ?? "");
      setExistingQrImage(initialData.qrImage ?? null);
      setFile(null);
    }
  }

  // Create exactly one object URL per selected file (not on every render),
  // and revoke it whenever the file changes or the component unmounts.
  const newFilePreviewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => {
    return () => {
      if (newFilePreviewUrl) {
        URL.revokeObjectURL(newFilePreviewUrl);
      }
    };
  }, [newFilePreviewUrl]);

  useImperativeHandle(
    ref,
    () => ({
      getPayload: () => {
        if (paymentType === "image") {
          if (!file && !existingQrImage) {
            toast.error("Please select a QR code image.");
            return null;
          }
        } else if (!paymentLink.trim()) {
          toast.error("Please enter a payment URL.");
          return null;
        } else if (!isSafeExternalUrl(paymentLink)) {
          toast.error("Payment URL must start with http:// or https://");
          return null;
        }

        return {
          type: paymentType,
          link: paymentType === "url" ? paymentLink : null,
          file: paymentType === "image" ? file : null,
          existingQrImage: paymentType === "image" ? existingQrImage : null,
        };
      },
    }),
    [paymentType, paymentLink, file, existingQrImage],
  );

  const handleCopyCurrentLink = async () => {
    if (!initialData?.link) return;
    try {
      await navigator.clipboard.writeText(initialData.link);
      setCopied(true);
      toast.success("Payment link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy payment link");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const isNewFilePreview = Boolean(newFilePreviewUrl);
  const previewUrl = newFilePreviewUrl ?? existingQrImage;

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Left — Method selector */}
      <div className="flex flex-col gap-3 lg:col-span-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <PiCreditCardBold size={15} />
            </div>
            <div>
              <p className="text-overline text-primary">Checkout Setup</p>
            </div>
          </div>
          <p className="mt-2 text-sm font-bold text-foreground">Payment Configuration</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Choose how customers pay at checkout.
          </p>
        </div>

        {/* Type selector */}
        <div className="flex flex-col gap-2" role="tablist" aria-label="Payment method type">
          {PAYMENT_TYPES.map(({ value, label, sublabel, icon: Icon }) => {
            const selected = paymentType === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setPaymentType(value)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    selected ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className={cn("text-sm font-semibold", selected ? "text-foreground" : "text-muted-foreground")}>
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
                </div>
                {selected && (
                  <PiCheckCircleFill size={18} className="mt-0.5 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Existing data badge (edit mode) */}
        {mode === "edit" && (initialData?.link || initialData?.qrImage) && (
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="mb-2 text-overline text-muted-foreground">
              Current {initialData?.type === "image" ? "Image" : "Link"}
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-success/10 text-success dark:bg-success dark:text-success">
                <PiCheckBold size={12} />
              </span>
              {initialData?.type === "image" && initialData?.qrImage ? (
                <span className="relative size-7 shrink-0 overflow-hidden rounded border border-border bg-card">
                  <Image src={initialData.qrImage} alt="Current QR" fill className="object-contain p-0.5" />
                </span>
              ) : null}
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {initialData?.type === "image" ? "QR code image on file" : initialData?.link}
              </p>
              {initialData?.type !== "image" && initialData?.link ? (
                <button
                  type="button"
                  onClick={handleCopyCurrentLink}
                  title="Copy payment link"
                  aria-label="Copy payment link"
                  className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  {copied ? <PiCheckBold size={11} className="text-success" /> : <PiCopyBold size={11} />}
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Right — Form content */}
      <div className="flex flex-col lg:col-span-3">
        <div className="h-full rounded-xl border border-border bg-card p-6">
          <AnimatePresence mode="wait" initial={false}>
            {paymentType === "url" ? (
              <motion.div
                key="url"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={easeOutTransition}
                className="flex h-full flex-col gap-4"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">Payment Gateway URL</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Enter the URL customers will be redirected to when they tap Pay.
                  </p>
                </div>
                <label htmlFor="payment-url" className="sr-only">Payment Gateway URL</label>
                <div className="relative">
                  <PiLinkBold
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="payment-url"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="https://paypal.me/yourname"
                    className="h-10 pl-9"
                  />
                </div>

                <div className="mt-auto rounded-xl border border-border bg-muted/40 p-4">
                  <p className="mb-2 text-xs font-semibold text-foreground">Supported gateways</p>
                  <div className="flex flex-wrap gap-2">
                    {["PayPal", "Stripe", "Razorpay", "Paytm", "GPay", "PhonePe", "Custom"].map((g) => (
                      <span
                        key={g}
                        className="rounded-md border border-border bg-card px-3 py-1 text-caption font-medium text-muted-foreground"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={easeOutTransition}
                className="flex h-full flex-col gap-4"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">Upload QR Code Image</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Upload a QR code image that customers can scan to pay.
                  </p>
                </div>

                <label htmlFor="payment-qr-upload" className="sr-only">Payment QR Image</label>
                <div className="group relative flex flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-primary/5 has-[:focus-visible]:border-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                  <input
                    id="payment-qr-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3 p-6">
                      <div className="relative size-36 overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
                        {isNewFilePreview ? (
                          <Image
                            src={previewUrl}
                            alt="QR code preview"
                            fill
                            sizes="144px"
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={previewUrl}
                            alt="QR code preview"
                            fill
                            sizes="144px"
                            className="object-contain p-1"
                          />
                        )}
                      </div>
                      <p className="text-xs font-medium text-primary">Click anywhere to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-8">
                      <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-transform group-hover:scale-105 group-hover:text-primary">
                        <PiUploadSimpleBold size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                          {mode === "edit" ? "Click to upload new QR code" : "Click to upload QR code"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, SVG · Max 5 MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export const PaymentForm = forwardRef(PaymentFormBase);
