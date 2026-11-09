import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "@/types/components/ui/Button.types";

// Four real styles: primary (one per screen), secondary, ghost, destructive.
// `outline`, `subtle` and `danger` are kept as aliases so older call sites
// keep working while they are migrated.
const secondary = "border border-input bg-card text-foreground hover:bg-muted";
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary,
  outline: secondary,
  subtle: secondary,
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "border border-input bg-card text-destructive hover:bg-destructive/10",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-body-medium",
  icon: "size-10 p-0",
};

const buttonBaseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

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
        {children && (
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            {children}
          </span>
        )}
        {!loading && resolvedRightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
