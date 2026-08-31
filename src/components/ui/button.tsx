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
    "bg-primary text-primary-foreground shadow-sm hover:-translate-y-px hover:bg-primary/90 hover:shadow-md active:translate-y-0 active:scale-[0.98] transition-all",
  secondary:
    "border border-border bg-card text-foreground shadow-sm hover:bg-muted hover:text-foreground hover:-translate-y-px active:translate-y-0 active:scale-100 transition-all",
  outline:
    "border border-primary/30 bg-transparent text-primary hover:border-primary/70 hover:bg-primary/5 active:scale-[0.98] transition-all",
  ghost:
    "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.98] transition-all",
  danger:
    "border border-destructive/20 bg-destructive/8 text-destructive hover:bg-destructive/15 active:scale-[0.98] transition-all",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:-translate-y-px hover:opacity-90 active:translate-y-0 active:scale-[0.98] transition-all",
  subtle:
    "border border-border bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-100 transition-all",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 rounded-lg px-3 text-xs",
  md: "h-9 rounded-lg px-4 text-sm",
  lg: "h-10 rounded-lg px-5 text-sm",
  icon: "size-9 rounded-lg p-0",
};

const buttonBaseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

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
