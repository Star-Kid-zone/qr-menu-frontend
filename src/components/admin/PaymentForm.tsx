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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PiCheckBold,
  PiCopyBold,
  PiCreditCardBold,
  PiLinkBold,
  PiImageBold,
  PiUploadSimpleBold,
} from "react-icons/pi";
import { cn } from "@/lib/utils";
import { springDefault, easeOutTransition } from "@/lib/motion";
import { isSafeExternalUrl } from "@/utils/url";

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
  { value: "url" as const, label: "Gateway URL", icon: PiLinkBold },
  { value: "image" as const, label: "QR Image Upload", icon: PiImageBold },
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
  // "adjusting state when a prop changes" pattern — avoids an extra render
  // pass and the react-hooks/set-state-in-effect cascading-render warning.
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

  // A newly-selected file always takes precedence over a previously stored image.
  const isNewFilePreview = Boolean(newFilePreviewUrl);
  const previewUrl = newFilePreviewUrl ?? existingQrImage;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="pb-4">
          <div className="mb-1 flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-clay-gradient text-primary-foreground shadow-neu-sm">
              <PiCreditCardBold size={20} />
            </span>
            <p className="text-caption font-semibold uppercase tracking-[0.2em] text-primary">Checkout Setup</p>
          </div>
          <CardTitle className="text-h2 text-foreground">Payment Configuration</CardTitle>
          <p className="text-body text-muted-foreground">
            Choose how customers pay you and preview it before it goes live.
          </p>

          <div
            role="tablist"
            aria-label="Payment method type"
            className="mt-2 flex gap-1 rounded-md border border-border bg-muted p-1.5"
          >
            {PAYMENT_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={paymentType === value}
                onClick={() => setPaymentType(value)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-caption transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  paymentType === value
                    ? "text-primary"
                    : "text-muted-foreground hover:text-accent-foreground",
                )}
              >
                {paymentType === value && (
                  <motion.span
                    layoutId={`paymentTypeHighlight-${mode}`}
                    className="absolute inset-0 -z-10 rounded-md bg-card shadow-xs"
                    transition={springDefault}
                  />
                )}
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          {mode === "edit" && (initialData?.link || initialData?.qrImage) ? (
            <div>
              <p className="mb-1.5 text-caption font-semibold text-foreground">
                Current {initialData.type === "image" ? "Payment Image" : "Payment Link"}
              </p>
              <div className="clay-inset flex items-center gap-2 border border-border/60 bg-muted/40 p-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                  <PiCheckBold size={14} />
                </span>
                {initialData.type === "image" && initialData.qrImage ? (
                  <span className="relative size-8 shrink-0 overflow-hidden rounded-md border border-border bg-card">
                    <Image src={initialData.qrImage} alt="Current QR code" fill className="object-contain p-1" />
                  </span>
                ) : null}
                <p className="min-w-0 flex-1 truncate text-caption text-muted-foreground">
                  {initialData.type === "image" ? "QR code image on file" : initialData.link}
                </p>
                {initialData.type !== "image" && initialData.link ? (
                  <button
                    type="button"
                    onClick={handleCopyCurrentLink}
                    title="Copy payment link"
                    aria-label="Copy payment link"
                    className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-neu-sm transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-primary/30 hover:bg-accent hover:text-primary active:scale-[0.95]"
                  >
                    {copied ? <PiCheckBold size={14} className="text-success" /> : <PiCopyBold size={14} />}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            {paymentType === "url" ? (
              <motion.div
                key="url"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={easeOutTransition}
              >
                <label htmlFor="payment-url" className="mb-1 block text-body font-semibold text-foreground">
                  Payment Gateway URL
                </label>
                <p className="mb-3 text-caption text-muted-foreground">
                  Direct customers to your external payment portal.
                </p>
                <Input
                  id="payment-url"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="e.g. https://paypal.me/yourname"
                  className="h-12"
                />
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={easeOutTransition}
                className="space-y-3"
              >
                <label htmlFor="payment-qr-upload" className="block text-caption text-muted-foreground">
                  Payment QR Image
                </label>
                <div className="group relative overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center transition-colors duration-200 ease-out hover:border-primary/40 hover:bg-accent/40 has-[:focus-visible]:border-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40">
                  <input
                    id="payment-qr-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />

                  {previewUrl ? (
                    <div className="relative w-full space-y-4">
                      <div className="relative mx-auto size-32 overflow-hidden rounded-md border border-border bg-card p-2 shadow-xs">
                        {isNewFilePreview ? (
                          // blob preview, cannot be optimized
                          <Image
                            src={previewUrl}
                            alt="QR code preview"
                            fill
                            sizes="128px"
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={previewUrl}
                            alt="QR code preview"
                            fill
                            sizes="128px"
                            className="object-contain p-2"
                          />
                        )}
                      </div>
                      <p className="text-caption text-primary">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover:scale-110">
                        <PiUploadSimpleBold size={28} />
                      </div>
                      <div>
                        <p className="text-body font-semibold text-foreground">
                          {mode === "edit" ? "Click to upload new QR code" : "Click to upload QR code"}
                        </p>
                        <p className="mt-1 text-caption text-muted-foreground">PNG, JPG, SVG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export const PaymentForm = forwardRef(PaymentFormBase);
