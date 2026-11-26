"use client";

import { Notice } from "@/components/ui/Notice";
import { Button } from "@/components/ui/button";

/**
 * The standard "this didn't load" state: the error text plus a retry button. Pages render it
 * instead of an empty list or form, so a failed request is never mistaken for "no data".
 */
export function LoadErrorNotice({
  title = "We couldn't load this",
  message,
  onRetry,
  className,
}: {
  title?: string;
  message: string;
  onRetry: () => void | Promise<void>;
  className?: string;
}) {
  return (
    <Notice
      tone="error"
      title={title}
      className={className}
      action={
        <Button variant="secondary" onClick={() => void onRetry()}>
          Try again
        </Button>
      }
    >
      {message}
    </Notice>
  );
}
