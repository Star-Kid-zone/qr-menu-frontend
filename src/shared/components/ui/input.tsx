import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { InputProps } from "@/types/components/ui/Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      fullWidth = true,
      invalid,
      startSlot,
      endSlot,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-bold text-foreground transition-all placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/5 disabled:opacity-50 disabled:bg-muted",
          invalid &&
            "border-destructive focus:border-destructive focus:ring-destructive/10",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
