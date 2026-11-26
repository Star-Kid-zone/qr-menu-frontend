import type { Menu } from "@/types";

export type MenuImageProps = {
      item: Menu;
      primary: string;
      secondary: string;
      className?: string;
      style?: import("react").CSSProperties;
      /** Rendered width for the image optimiser. Defaults to the fixed size in className (thumbnails), else card width. */
      sizes?: string;
    };
