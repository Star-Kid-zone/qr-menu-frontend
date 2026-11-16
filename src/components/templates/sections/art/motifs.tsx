import type { ReactNode } from "react";

/**
 * Decorative SVG motifs for section dividers. Each is one tile of a repeating
 * <pattern>, drawn with `currentColor` so it takes whatever colour the divider
 * sets (the theme's accent) — one motif works with every palette.
 */
export interface ArtMotif {
  value: string;
  label: string;
  /** Pattern tile size in px. */
  w: number;
  h: number;
  tile: ReactNode;
}

const sw = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ART_MOTIFS: readonly ArtMotif[] = [
  {
    value: "wave",
    label: "Soft wave",
    w: 48,
    h: 24,
    tile: <path {...sw} d="M0 12 C 8 4, 16 4, 24 12 S 40 20, 48 12" />,
  },
  {
    value: "arabesque",
    label: "Arabesque star",
    w: 32,
    h: 32,
    tile: (
      <g {...sw}>
        <path d="M16 4 L19 13 L28 16 L19 19 L16 28 L13 19 L4 16 L13 13 Z" />
        <path d="M8 8 L24 24 M24 8 L8 24" strokeWidth={0.75} opacity={0.6} />
        <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    value: "tile",
    label: "Terracotta tile",
    w: 28,
    h: 28,
    tile: (
      <g {...sw}>
        <path d="M14 2 L26 14 L14 26 L2 14 Z" />
        <circle cx="14" cy="14" r="3" />
      </g>
    ),
  },
  {
    value: "rangoli",
    label: "Rangoli petals",
    w: 36,
    h: 36,
    tile: (
      <g {...sw}>
        {[0, 45, 90, 135].map((a) => (
          <ellipse key={a} cx="18" cy="18" rx="3.5" ry="10" transform={`rotate(${a} 18 18)`} />
        ))}
        <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    value: "seigaiha",
    label: "Seigaiha waves",
    w: 32,
    h: 16,
    tile: (
      <g {...sw} strokeWidth={1.2}>
        <path d="M0 16 A16 16 0 0 1 32 16" />
        <path d="M5 16 A11 11 0 0 1 27 16" />
        <path d="M10 16 A6 6 0 0 1 22 16" />
      </g>
    ),
  },
  {
    value: "zigzag",
    label: "Zigzag",
    w: 24,
    h: 16,
    tile: <path {...sw} strokeWidth={2.5} d="M0 12 L6 4 L12 12 L18 4 L24 12" />,
  },
  {
    value: "leaf",
    label: "Leaf vine",
    w: 48,
    h: 24,
    tile: (
      <g {...sw}>
        <path d="M0 12 H48" opacity={0.6} />
        <path d="M14 12 C 14 5, 22 3, 24 4 C 23 9, 19 12, 14 12 Z" />
        <path d="M34 12 C 34 19, 42 21, 44 20 C 43 15, 39 12, 34 12 Z" />
      </g>
    ),
  },
  {
    value: "lattice",
    label: "Window lattice",
    w: 32,
    h: 32,
    tile: (
      <g {...sw}>
        <rect x="4" y="4" width="24" height="24" />
        <path d="M4 16 H12 V8 M28 16 H20 V24 M16 4 V10 M16 28 V22" />
      </g>
    ),
  },
  {
    value: "papel",
    label: "Papel picado",
    w: 40,
    h: 28,
    tile: (
      <g {...sw}>
        <path d="M0 4 H40" />
        <path d="M4 4 V18 L12 24 L20 18 V4" />
        <circle cx="12" cy="12" r="2.5" />
      </g>
    ),
  },
  {
    value: "dots",
    label: "Dots",
    w: 16,
    h: 16,
    tile: <circle cx="8" cy="8" r="2" fill="currentColor" />,
  },
];

export const ART_MOTIF_MAP: ReadonlyMap<string, ArtMotif> = new Map(ART_MOTIFS.map((m) => [m.value, m]));
