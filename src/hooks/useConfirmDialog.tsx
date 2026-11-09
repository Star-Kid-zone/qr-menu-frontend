"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export interface ConfirmOptions {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "destructive" | "default";
}

/**
 * Promise-based replacement for the browser's `window.confirm()`.
 *
 *   const { confirm, confirmDialog } = useConfirmDialog();
 *   if (!(await confirm({ title, description, confirmLabel }))) return;
 *   ...
 *   return <>{...}{confirmDialog}</>;
 *
 * Resolves `true` on confirm and `false` on cancel/dismiss. A second call while
 * one is open cancels the first.
 */
export function useConfirmDialog() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback((next: ConfirmOptions) => {
    resolverRef.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(next);
    });
  }, []);

  const confirmDialog = options ? (
    <ConfirmationDialog
      isOpen
      onClose={() => settle(false)}
      onConfirm={() => settle(true)}
      title={options.title}
      description={options.description}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      tone={options.tone}
    />
  ) : null;

  return { confirm, confirmDialog };
}
