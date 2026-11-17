import React from 'react';
import { cn } from '@/utils/cn';

export interface RestaurantLoaderIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  accentColor?: string;
}

const SIZE_MAP = {
  sm: 'size-9',
  md: 'size-14',
  lg: 'size-20',
  xl: 'size-28',
};

/**
 * Animated restaurant cloche icon with floating dome and rising aromatic steam.
 * Ideal for hospitality, food, and dining loading screens.
 */
export function RestaurantLoaderIcon({
  size = 'md',
  className,
  accentColor,
}: RestaurantLoaderIconProps) {
  const containerClass = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div
      className={cn('relative flex items-center justify-center', containerClass, className)}
      style={accentColor ? ({ color: accentColor } as React.CSSProperties) : undefined}
      aria-hidden="true"
    >
      {/* Soft warm ambient glow behind the platter */}
      <div
        className="absolute inset-1 rounded-full bg-primary/20 blur-xl animate-pulse"
        style={accentColor ? { backgroundColor: `${accentColor}33` } : undefined}
      />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 size-full text-primary drop-shadow-sm"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {/* Animated rising steam wisps */}
        <g className="text-primary/75" style={accentColor ? { color: accentColor } : undefined}>
          <path
            d="M24 20c-1.5-3 1-5 0-8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-steam-rise"
            style={{ animationDelay: '0ms' }}
          />
          <path
            d="M32 17c-1.5-3.5 1-6 0-9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-steam-rise"
            style={{ animationDelay: '350ms' }}
          />
          <path
            d="M40 20c-1.5-3 1-5 0-8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-steam-rise"
            style={{ animationDelay: '700ms' }}
          />
        </g>

        {/* Cloche dome group with gentle float */}
        <g className="animate-cloche-float">
          {/* Handle knob */}
          <circle cx="32" cy="22" r="3.2" className="fill-current" />
          <path d="M32 25v2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />

          {/* Dome cover */}
          <path
            d="M16 41c0-8.8 7.2-15 16-15s16 6.2 16 15H16z"
            className="fill-current/15 stroke-current"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Curved specular reflection */}
          <path
            d="M21 38c2.5-5 6.5-8.5 11-8.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="opacity-40"
          />
        </g>

        {/* Serving platter rim & base */}
        <ellipse
          cx="32"
          cy="43.5"
          rx="23"
          ry="3.8"
          className="fill-card stroke-current"
          strokeWidth="2.4"
        />
        <path
          d="M12 44c4 2.5 11 3.5 20 3.5s16-1 20-3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="opacity-45"
        />
      </svg>
    </div>
  );
}

export default RestaurantLoaderIcon;
