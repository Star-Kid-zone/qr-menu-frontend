import { PageHeader } from "./PageHeader";
import { Button } from "./button";
import type { AdminFormPageProps } from "@/types/ui/AdminFormPage.types";

export type { AdminFormPageProps };

/**
 * Shared scaffold for admin create/edit pages: PageHeader with a back button
 * plus a Cancel/Submit action pair, wrapping the page-specific form body.
 * Enforces uniform padding and smooth overflow behavior.
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
  headerExtra,
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
          <div className="flex items-center gap-2">
            {headerExtra}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSubmit}
              loading={submitting}
            >
              {submitLabel}
            </Button>
          </div>
        }
      />

      <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-6">{children}</div>
    </div>
  );
}

export default AdminFormPage;
