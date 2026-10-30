"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { cn } from "@/utils/cn";

interface ScrollableTabRowProps {
  /** Direct children must be the tab/pill buttons themselves — required for CSS scroll-snap to align on them. */
  children: ReactNode;
  /** Changes whenever the active tab changes — triggers scrolling it into view. */
  activeKey: string;
  className?: string;
  scrollContainerClassName?: string;
  /** Tailwind class controlling the fade/background color behind the edge gradients and arrow buttons. Defaults to the card surface. */
  edgeFrom?: string;
  role?: string;
  "aria-label"?: string;
}

/**
 * Wraps a horizontally-scrollable row of tab/pill buttons with edge fades,
 * arrow buttons, scroll-snap, and auto-scroll-active-into-view.
 *
 * Each direct child button should carry `data-tab-active="true"` when selected
 * and a `snap-start` class for scroll-snap alignment.
 */
export function ScrollableTabRow({
  children,
  activeKey,
  className,
  scrollContainerClassName,
  edgeFrom = "from-card",
  role,
  "aria-label": ariaLabel,
}: ScrollableTabRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeEl = el.querySelector<HTMLElement>('[data-tab-active="true"]');
    activeEl?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    const raf = requestAnimationFrame(updateScrollState);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className={cn("relative min-w-0", className)}>
      {canScrollLeft && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent",
              edgeFrom,
            )}
          />
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollBy(-160)}
            className="absolute left-0.5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground sm:flex"
          >
            <PiCaretLeftBold className="size-3.5" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        role={role}
        aria-label={ariaLabel}
        className={cn(
          "flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory",
          scrollContainerClassName,
        )}
      >
        {children}
      </div>

      {canScrollRight && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l to-transparent",
              edgeFrom,
            )}
          />
          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollBy(160)}
            className="absolute right-0.5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground sm:flex"
          >
            <PiCaretRightBold className="size-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
