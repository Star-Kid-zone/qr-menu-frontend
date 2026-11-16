import type { IconStyle, OrnamentSet, SkinDefinition, SkinFamily, Tempo } from '../types';

/**
 * What every skin in a family shares unless it says otherwise
 * (docs/site-system/PLAN.md §2.6): icon style, ornament set, background
 * texture, shape and tempo. Colours and fonts always come from the skin.
 *
 * Ornament ids: `divider` is an ART_MOTIFS value (sections/art/motifs.tsx);
 * `frame`, `corner` and `pattern` are ids in site-system/ornaments.
 */
export interface FamilyDefaults {
  label: string;
  iconStyle: IconStyle;
  ornaments: OrnamentSet;
  texture: string;
  shape: SkinDefinition['shape'];
  tempo: Tempo;
}

export const FAMILY_DEFAULTS: Record<SkinFamily, FamilyDefaults> = {
  'royal-classic': {
    label: 'Royal and classic',
    iconStyle: 'engraved',
    ornaments: { divider: 'arabesque', frame: 'arch', corner: 'fleuron', pattern: 'damask' },
    texture: 'damask',
    shape: { radius: 4, card: 'rounded-sm', border: 'double', shadow: 'soft' },
    tempo: 1,
  },
  'luxury-minimal': {
    label: 'Luxury minimal',
    iconStyle: 'fine-line',
    ornaments: { divider: 'dots', frame: 'rect', corner: 'none', pattern: 'grain' },
    texture: 'grain',
    shape: { radius: 2, card: 'rounded-none', border: 'hairline', shadow: 'none' },
    tempo: 1,
  },
  'modern-minimal': {
    label: 'Modern minimal',
    iconStyle: 'line',
    ornaments: { divider: 'dots', frame: 'rounded', corner: 'none', pattern: 'none' },
    texture: 'none',
    shape: { radius: 12, card: 'rounded-xl', border: 'hairline', shadow: 'soft' },
    tempo: 1.2,
  },
  editorial: {
    label: 'Editorial',
    iconStyle: 'line',
    ornaments: { divider: 'lattice', frame: 'rect', corner: 'bracket', pattern: 'paper' },
    texture: 'paper',
    shape: { radius: 0, card: 'rounded-none', border: 'hairline', shadow: 'none' },
    tempo: 1,
  },
  'warm-rustic': {
    label: 'Warm and rustic',
    iconStyle: 'hand-drawn',
    ornaments: { divider: 'zigzag', frame: 'stamp', corner: 'twine', pattern: 'kraft' },
    texture: 'kraft',
    shape: { radius: 8, card: 'rounded-lg', border: 'hairline', shadow: 'soft' },
    tempo: 1.2,
  },
  botanical: {
    label: 'Botanical',
    iconStyle: 'hand-drawn',
    ornaments: { divider: 'leaf', frame: 'organic', corner: 'leaf', pattern: 'blobs' },
    texture: 'blobs',
    shape: { radius: 20, card: 'rounded-3xl', border: 'none', shadow: 'soft' },
    tempo: 1.2,
  },
  'bold-pop': {
    label: 'Bold and pop',
    iconStyle: 'filled',
    ornaments: { divider: 'zigzag', frame: 'sticker', corner: 'tape', pattern: 'halftone' },
    texture: 'halftone',
    shape: { radius: 14, card: 'rounded-2xl', border: 'double', shadow: 'lifted' },
    tempo: 1.6,
  },
  'retro-vintage': {
    label: 'Retro and vintage',
    iconStyle: 'engraved',
    ornaments: { divider: 'tile', frame: 'badge', corner: 'deco-fan', pattern: 'print-grain' },
    texture: 'print-grain',
    shape: { radius: 6, card: 'rounded-md', border: 'double', shadow: 'soft' },
    tempo: 1.2,
  },
  'neon-night': {
    label: 'Neon and night',
    iconStyle: 'neon',
    ornaments: { divider: 'wave', frame: 'glow', corner: 'none', pattern: 'night-gradient' },
    texture: 'night-gradient',
    shape: { radius: 10, card: 'rounded-xl', border: 'hairline', shadow: 'lifted' },
    tempo: 1.4,
  },
  futurist: {
    label: 'Futurist',
    iconStyle: 'duotone',
    ornaments: { divider: 'lattice', frame: 'notched', corner: 'bracket', pattern: 'grid' },
    texture: 'grid',
    shape: { radius: 6, card: 'rounded-md', border: 'hairline', shadow: 'none' },
    tempo: 1.4,
  },
  'soft-glass-clay': {
    label: 'Soft, glass and clay',
    iconStyle: 'duotone',
    ornaments: { divider: 'wave', frame: 'rounded', corner: 'none', pattern: 'frost' },
    texture: 'frost',
    shape: { radius: 24, card: 'rounded-3xl', border: 'none', shadow: 'lifted' },
    tempo: 1.2,
  },
  'pixel-90s': {
    label: 'Pixel and 90s',
    iconStyle: 'pixel',
    ornaments: { divider: 'tile', frame: 'pixel', corner: 'pixel', pattern: 'pixel' },
    texture: 'pixel',
    shape: { radius: 0, card: 'rounded-none', border: 'double', shadow: 'lifted' },
    tempo: 1.6,
  },
};
