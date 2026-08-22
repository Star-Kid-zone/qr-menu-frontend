import type { CSSProperties, ReactNode } from "react";

export type NextLinkAdapterProps = {
      to: string;
      className?: string;
      children?: ReactNode;
      onClick?: () => void;
      style?: CSSProperties;
    };
