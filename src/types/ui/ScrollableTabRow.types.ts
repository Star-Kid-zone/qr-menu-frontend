import type { ReactNode } from "react";

export interface ScrollableTabRowProps {
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
