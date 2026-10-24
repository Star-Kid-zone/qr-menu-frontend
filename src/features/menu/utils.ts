import type { MenuItem } from "./types";

export function getItemDisplayName(item: MenuItem): string {
  return item.item || item.name || "";
}
