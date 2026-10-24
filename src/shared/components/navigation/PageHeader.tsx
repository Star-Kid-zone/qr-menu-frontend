import { cn } from "@/utils/cn";
import { PageHeaderProps } from "@/types/components/ui/PageHeader.types";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  onBack,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {eyebrow ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-card px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent"
              >
                {backLabel}
              </button>
            ) : null}
            <h1 className="text-h1 text-foreground break-words">
              {title}
            </h1>
          </div>
          {description ? (
            <p className="text-body text-muted-foreground max-w-2xl break-words">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex w-full flex-shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:w-auto">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export default PageHeader;
