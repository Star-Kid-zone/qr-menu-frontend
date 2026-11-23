"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  PiCheckCircleFill,
  PiInfoFill,
  PiWarningFill,
  PiXCircleFill,
  PiXBold,
} from "react-icons/pi";
import { cn } from "@/utils/cn";
import { UI_TIMING } from "@/constants/app.constants";
import type { ToastVariant, ToastItem } from "@/types/ui/Toast.types";

export type { ToastVariant, ToastItem };

const DEFAULT_DURATION = UI_TIMING.toastAutoCloseMs;

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
  return EMPTY_TOASTS;
}

function subscribeToMount() {
  return () => {};
}

function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

function pushToast(
  variant: ToastVariant,
  message: string,
  titleOrDuration?: string | number,
  durationArg?: number,
) {
  const id = nextId++;
  let title: string | undefined;
  let duration: number = DEFAULT_DURATION;

  if (typeof titleOrDuration === "string") {
    title = titleOrDuration;
    if (typeof durationArg === "number") duration = durationArg;
  } else if (typeof titleOrDuration === "number") {
    duration = titleOrDuration;
  }

  toasts = [...toasts, { id, variant, title, message, duration }];
  notify();

  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

/** Imperative `toast` API with full status-color support. */
export const toast = {
  success: (message: string, titleOrDuration?: string | number, duration?: number) =>
    pushToast("success", message, titleOrDuration, duration),
  error: (message: string, titleOrDuration?: string | number, duration?: number) =>
    pushToast("error", message, titleOrDuration, duration),
  warning: (message: string, titleOrDuration?: string | number, duration?: number) =>
    pushToast("warning", message, titleOrDuration, duration),
  info: (message: string, titleOrDuration?: string | number, duration?: number) =>
    pushToast("info", message, titleOrDuration, duration),
  dismiss: dismissToast,
};

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: typeof PiCheckCircleFill;
    borderClass: string;
    accentClass: string;
    iconWrapperClass: string;
    progressBarClass: string;
    defaultTitle: string;
  }
> = {
  success: {
    icon: PiCheckCircleFill,
    borderClass: "border-success/40",
    accentClass: "bg-success/10",
    iconWrapperClass: "bg-success/20 text-success",
    progressBarClass: "bg-success",
    defaultTitle: "Success",
  },
  error: {
    icon: PiXCircleFill,
    borderClass: "border-destructive/40",
    accentClass: "bg-destructive/10",
    iconWrapperClass: "bg-destructive/20 text-destructive",
    progressBarClass: "bg-destructive",
    defaultTitle: "Error",
  },
  warning: {
    icon: PiWarningFill,
    borderClass: "border-warning/40",
    accentClass: "bg-warning/10",
    iconWrapperClass: "bg-warning/20 text-warning",
    progressBarClass: "bg-warning",
    defaultTitle: "Warning",
  },
  info: {
    icon: PiInfoFill,
    borderClass: "border-info/40",
    accentClass: "bg-info/10",
    iconWrapperClass: "bg-info/20 text-info",
    progressBarClass: "bg-info",
    defaultTitle: "Notice",
  },
};

function ToastCard({ id, variant, title, message, duration }: ToastItem) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const displayTitle = title || (message.length > 50 ? config.defaultTitle : undefined);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground p-4 shadow-xl backdrop-blur-md transition-all sm:max-w-md",
        config.borderClass,
      )}
      role="status"
    >
      {/* Subtle status tint layer */}
      <div className={cn("absolute inset-0 pointer-events-none opacity-40", config.accentClass)} />

      <div className="relative z-10 flex items-start gap-3">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-xl",
            config.iconWrapperClass,
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          {displayTitle ? (
            <h4 className="text-xs font-bold text-card-foreground/75 mb-1">
              {displayTitle}
            </h4>
          ) : null}
          <p className="text-sm font-semibold leading-relaxed text-card-foreground break-words">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dismissToast(id)}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-lg p-1 text-card-foreground/60 transition-colors hover:bg-card-foreground/10 hover:text-card-foreground"
        >
          <PiXBold className="size-4" />
        </button>
      </div>

      {/* Countdown progress timer line */}
      {duration > 0 ? (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-border/40">
          <motion.div
            className={cn("h-full", config.progressBarClass)}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </div>
      ) : null}
    </motion.div>
  );
}

/** Mount once near the root of the app — renders any queued toasts via a portal. */
export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(subscribeToMount, () => true, () => false);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[300] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <ToastCard key={item.id} {...item} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

export default toast;
