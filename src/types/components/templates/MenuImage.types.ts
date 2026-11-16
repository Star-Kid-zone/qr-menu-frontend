import type { Menu } from "@/types";

export type MenuImageProps = {
      item: Menu;
      primary: string;
      secondary: string;
      className?: string;
      style?: import("react").CSSProperties;
    };
