import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { SelectProps } from "@/types/components/ui/Select.types";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options = [],
      fullWidth = true,
      placeholder,
      invalid,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-bold text-foreground transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary/5 disabled:opacity-50 disabled:bg-muted appearance-none",
          invalid &&
            "border-destructive focus:border-destructive focus:ring-destructive/10",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";

export default Select;
