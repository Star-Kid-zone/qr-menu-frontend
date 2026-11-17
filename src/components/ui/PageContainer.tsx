import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** When true, keeps page within fixed bounds without outer vertical scroll */
  fixed?: boolean;
  /** When true (default), hides the visible scrollbar while preserving scroll functionality */
  hideScrollbar?: boolean;
}

/**
 * Universal PageContainer primitive.
 * Enforces consistent full-height flex column layout, normalized gap,
 * and reliable bottom scroll padding so tables, cards, and footers never clip.
 */
export function PageContainer({
  children,
  className,
  fixed = false,
  hideScrollbar = true,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full min-w-0 flex-col gap-4 sm:gap-4",
        fixed
          ? "min-h-0 overflow-hidden"
          : cn(
              "min-h-0 overflow-y-auto overflow-x-hidden pb-6",
              hideScrollbar ? "no-scrollbar" : "pr-0.5",
            ),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default PageContainer;

