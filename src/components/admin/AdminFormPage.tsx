import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";

interface AdminFormPageProps {
  title: string;
  description?: string;
  onBack: () => void;
  backLabel?: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  children: ReactNode;
}

/**
 * Shared scaffold for admin create/edit pages: PageHeader with a back button
 * plus a Cancel/Submit action pair, wrapping the page-specific form body.
 * Consolidates the "back button + PageHeader + Cancel/Submit footer" markup
 * that was previously hand-rolled per page with inconsistent back-button markup.
 */
export function AdminFormPage({
  title,
  description,
  onBack,
  backLabel = "Back",
  onCancel,
  onSubmit,
  submitLabel,
  submitting = false,
  children,
}: AdminFormPageProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title={title}
        description={description}
        onBack={onBack}
        backLabel={backLabel}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? "Saving..." : submitLabel}
            </Button>
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
