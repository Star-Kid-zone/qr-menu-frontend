import type { HTMLAttributes, ReactNode } from "react";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** When true, keeps page within fixed bounds without outer vertical scroll */
  fixed?: boolean;
  /** When true (default), hides the visible scrollbar while preserving scroll functionality */
  hideScrollbar?: boolean;
}
