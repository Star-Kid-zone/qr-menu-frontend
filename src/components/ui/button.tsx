import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "@/types/components/ui/Button.types";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-clay-gradient text-primary-foreground shadow-[0_6px_16px_-4px_hsl(var(--primary)/0.55)] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-4px_hsl(var(--primary)/0.6)] active:translate-y-0 active:scale-[0.98] transition-all",
  secondary:
    "border border-border/60 bg-card text-foreground shadow-neu-sm hover:bg-accent hover:text-accent-foreground hover:shadow-neu hover:-translate-y-0.5 active:translate-y-0 active:scale-100 active:shadow-neu-inset-sm transition-all",
  outline:
    "border-2 border-primary/30 bg-transparent text-foreground hover:border-primary/60 hover:bg-accent active:scale-[0.98] transition-all",
  ghost:
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-all",
  danger:
    "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-[0.98] transition-all",
  destructive:
    "bg-destructive text-destructive-foreground shadow-[0_6px_16px_-4px_hsl(var(--destructive)/0.5)] hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:scale-[0.98] transition-all",
  subtle:
    "border border-border/60 bg-accent text-accent-foreground shadow-neu-inset-sm hover:shadow-neu-inset active:scale-100 transition-all",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 rounded-xl px-3 text-xs",
  md: "h-10 rounded-xl px-4 text-sm",
  lg: "h-12 rounded-2xl px-6 text-sm",
  icon: "size-11 rounded-xl p-0",
};

const buttonBaseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Returns the Button primitive's visual classes for non-<button> elements
 * that must render the same look (e.g. a Next.js <Link> styled as a button).
 * Keeps a single source of truth for variant/size/base styling.
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    buttonBaseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      leadingIcon,
      trailingIcon,
      startIcon,
      endIcon,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const resolvedLeftIcon = leftIcon ?? leadingIcon ?? startIcon;
    const resolvedRightIcon = rightIcon ?? trailingIcon ?? endIcon;

    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {!loading && resolvedLeftIcon}
        <span>{children}</span>
        {!loading && resolvedRightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
