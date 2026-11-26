import React, { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import type { TableContainerProps } from "@/types/ui/Table.types";

export type { TableContainerProps };

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, maxHeight, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
      {...props}
    >
      <div
        className={cn("w-full overflow-x-auto", maxHeight && "overflow-y-auto")}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {children}
      </div>
    </div>
  ),
);
TableContainer.displayName = "TableContainer";

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-left text-sm text-foreground border-collapse", className)}
      {...props}
    />
  ),
);
Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("border-b border-border bg-muted/40", className)}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 py-3 text-left align-middle text-overline text-muted-foreground font-bold tracking-wider whitespace-nowrap",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("px-4 py-4 align-middle text-body text-foreground", className)}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-xs text-muted-foreground", className)}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";

