import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { SelectProps } from "@/types/components/ui/Select.types";
import { PiCaretDownBold } from "react-icons/pi";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options = [],
      fullWidth = true,
      placeholder,
      invalid,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative", fullWidth ? "w-full" : "inline-block")}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-input bg-card pl-3 pr-8 py-2 text-sm font-normal text-foreground transition-colors outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:bg-muted cursor-pointer",
            invalid &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          aria-invalid={invalid || undefined}
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
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <PiCaretDownBold size={13} />
        </span>
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
