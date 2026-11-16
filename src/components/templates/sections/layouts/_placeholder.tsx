import { LANDING_SECTION_MAP } from "../landing/registry";
import type { LandingSectionProps } from "../types";
import { LANDING_SECTION_TYPES, type LayoutDefinition, type LayoutFrameProps, type LandingSectionType } from "./types";

/** Temporary stand-in used while a layout is being designed: default sections in a plain frame. */
export function makePlaceholderLayout(key: string, label: string): LayoutDefinition {
  const sections = Object.fromEntries(
    LANDING_SECTION_TYPES.map((type) => [type, LANDING_SECTION_MAP.get(type)!.component]),
  ) as Record<LandingSectionType, React.ComponentType<LandingSectionProps>>;
  return {
    key,
    label,
    description: "Being redesigned.",
    Frame: ({ children }: LayoutFrameProps) => <>{children}</>,
    sections,
  };
}
