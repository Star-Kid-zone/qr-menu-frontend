import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  overline?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Shared SectionHeader for major sub-sections inside complex pages
 * (e.g. tabs, settings panels, dashboard groupings).
 */
export function SectionHeader({
  title,
  description,
  overline,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-0.5 min-w-0">
        {overline ? (
          <p className="text-overline text-muted-foreground">{overline}</p>
        ) : null}
        <h2 className="text-h2 text-foreground font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-caption text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export default SectionHeader;

