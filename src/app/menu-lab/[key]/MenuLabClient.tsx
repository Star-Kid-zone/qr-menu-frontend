"use client";

import { MenuPreviewRenderer } from "@/features/workspace/components/MenuPreviewRenderer";
import { menuSample } from "./sample";

export function MenuLabClient({ structure, dark, theme, skin, business }: { structure: string; dark: boolean; theme: string; skin?: string; business?: string }) {
  return <MenuPreviewRenderer data={menuSample(structure, dark, theme, { skin, business })} />;
}
