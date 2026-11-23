import { PiArrowLeft } from "react-icons/pi";
import { cn } from "@/utils/cn";
import { PageHeaderProps } from "@/types/ui/PageHeader.types";

/**
 * The single page heading: the page's only <h1>, one sentence of context and
 * the page's actions (primary last, on the right). An icon-only back button
 * sits beside the title on sub-pages. No eyebrow labels: if a title needs one, rewrite it.
 */
export function PageHeader({
  title,
  description,
  actions,
  onBack,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  // The button is icon-only, so the destination lives in the accessible name
  // and tooltip: "Menu" -> "Back to Menu"; labels already starting with "Back" are kept.
  const backAriaLabel = /^back\b/i.test(backLabel) ? backLabel : `Back to ${backLabel}`;
  return (
    <div className={cn("flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={backAriaLabel}
            title={backAriaLabel}
            className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
          >
            <PiArrowLeft aria-hidden className="size-5" />
          </button>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-h1 text-foreground break-words">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-body text-muted-foreground break-words">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}

export default PageHeader;
