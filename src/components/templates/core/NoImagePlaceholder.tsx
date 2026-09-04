"use client";

import type { SVGProps } from "react";
import { LuUtensilsCrossed } from "react-icons/lu";

export interface NoImagePlaceholderProps {
  primary?: string;
  secondary?: string;
  className?: string;
  label?: string;
  iconSize?: "sm" | "md" | "lg";
}

/**
 * Crossed spoon and fork "Image Not Available" placeholder for menu dishes.
 * Features an aesthetic backdrop tinting with the tenant's brand colors
 * and crossed utensils icon.
 */
export function NoImagePlaceholder({
  primary = "#171717",
  secondary = "#64748b",
  className = "",
  label = "No Image",
  iconSize = "md",
}: NoImagePlaceholderProps) {
  const iconSizes = {
    sm: "size-4",
    md: "size-6",
    lg: "size-9",
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden border border-black/5 dark:border-white/10 p-2 text-center select-none ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 45%, ${primary}1f 0%, ${secondary}30 100%)`,
      }}
      aria-label="Image not available"
      title="Image not available"
    >
      <div
        className="flex items-center justify-center rounded-full p-2 backdrop-blur-xs transition-transform duration-200"
        style={{
          backgroundColor: `${primary}18`,
          color: primary,
          boxShadow: `0 2px 8px ${primary}15`,
        }}
      >
        <LuUtensilsCrossed className={`${iconSizes[iconSize]} shrink-0 stroke-[1.8]`} />
      </div>

      {label && (
        <span
          className="mt-1.5 max-w-[90%] truncate font-mono text-[9px] font-semibold uppercase tracking-wider opacity-85"
          style={{ color: secondary }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default NoImagePlaceholder;
