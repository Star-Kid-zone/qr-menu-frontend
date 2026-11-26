import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { InputProps } from "@/types/ui/Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      fullWidth = true,
      invalid,
      startSlot: _startSlot,
      endSlot: _endSlot,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm font-normal text-foreground transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:bg-muted",
          invalid &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
          fullWidth && "w-full",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

