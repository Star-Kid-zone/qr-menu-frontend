"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  PiCheckCircleBold,
  PiInfoBold,
  PiWarningBold,
  PiXBold,
  PiXCircleBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";

export type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

const DEFAULT_DURATION = 4000;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

const EMPTY_TOASTS: ToastItem[] = [];

function getServerSnapshot(): ToastItem[] {
  // Must return a stable reference — a fresh `[]` here trips React's
  // "The result of getServerSnapshot should be cached" warning/error.
  return EMPTY_TOASTS;
}

function subscribeToMount() {
  return () => {};
}

function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

function pushToast(variant: ToastVariant, message: string, duration = DEFAULT_DURATION) {
  const id = nextId++;
  toasts = [...toasts, { id, variant, message }];
  notify();
  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

/** Drop-in replacement for react-toastify's imperative `toast` API. */
export const toast = {
  success: (message: string, duration?: number) => pushToast("success", message, duration),
  error: (message: string, duration?: number) => pushToast("error", message, duration),
  info: (message: string, duration?: number) => pushToast("info", message, duration),
  warning: (message: string, duration?: number) => pushToast("warning", message, duration),
  dismiss: dismissToast,
};

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof PiCheckCircleBold; classes: string; iconClasses: string }> = {
  success: {
    icon: PiCheckCircleBold,
    classes: "border-success/25 bg-success/10",
    iconClasses: "text-success",
  },
  error: {
    icon: PiXCircleBold,
    classes: "border-destructive/25 bg-destructive/10",
    iconClasses: "text-destructive",
  },
  warning: {
    icon: PiWarningBold,
    classes: "border-warning/25 bg-warning/10",
    iconClasses: "text-warning",
  },
  info: {
    icon: PiInfoBold,
    classes: "border-primary/25 bg-primary/10",
    iconClasses: "text-primary",
  },
};

function ToastCard({ id, variant, message }: ToastItem) {
  const { icon: Icon, classes, iconClasses } = VARIANT_STYLES[variant];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-card p-4 shadow-neu-md backdrop-blur-sm",
        classes,
      )}
      role="status"
    >
      <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center", iconClasses)}>
        <Icon className="size-5" />
      </span>
      <p className="flex-1 text-sm font-medium leading-snug text-foreground">{message}</p>
      <button
        type="button"
        onClick={() => dismissToast(id)}
        aria-label="Dismiss notification"
        className="mt-0.5 shrink-0 rounded-lg p-0.5 text-muted-foreground/70 transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
      >
        <PiXBold className="size-4" />
      </button>
    </motion.div>
  );
}

/** Mount once near the root of the app — renders any queued toasts via a portal. */
export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(subscribeToMount, () => true, () => false);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <ToastCard key={item.id} {...item} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
