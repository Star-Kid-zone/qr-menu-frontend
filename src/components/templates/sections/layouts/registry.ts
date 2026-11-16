import type { LayoutDefinition } from "./types";
import { layout as royalLuxe } from "./royal-luxe";
import { layout as odysseyClassic } from "./odyssey-classic";
import { layout as trattoria } from "./trattoria";
import { layout as legend } from "./legend";
import { layout as bento } from "./bento";
import { layout as streetPop } from "./street-pop";
import { layout as chefsJournal } from "./chefs-journal";
import { layout as cafeNotebook } from "./cafe-notebook";
import { layout as linkCard } from "./link-card";
import { layout as zenGrid } from "./zen-grid";
import { layout as grandHall } from "./grand-hall";
import { layout as noirSalon } from "./noir-salon";
import { layout as atelierEditorial } from "./atelier-editorial";
import { layout as conservatory } from "./conservatory";
import { layout as pier } from "./pier";
import { layout as ember } from "./ember";
import { layout as tatami } from "./tatami";
import { layout as bazaar } from "./bazaar";
import { layout as supperClub } from "./supper-club";
import { layout as midnightDiner } from "./midnight-diner";

/** The designed layouts, keyed by the `landing_structure` value saved for a site. */
export const LAYOUTS: readonly LayoutDefinition[] = [
  // Site-system layouts (docs/site-system/PLAN.md §2.4).
  grandHall,
  noirSalon,
  atelierEditorial,
  conservatory,
  pier,
  ember,
  tatami,
  bazaar,
  supperClub,
  midnightDiner,
  // The original ten.
  royalLuxe,
  odysseyClassic,
  trattoria,
  legend,
  bento,
  streetPop,
  chefsJournal,
  cafeNotebook,
  linkCard,
  zenGrid,
];

export const LAYOUT_MAP: ReadonlyMap<string, LayoutDefinition> = new Map(LAYOUTS.map((l) => [l.key, l]));
