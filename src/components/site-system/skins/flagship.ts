import type { SkinDefinition, SkinFamily } from '../types';
import { FAMILY_DEFAULTS } from './families';

/**
 * The 12 hand-designed skins, one per family (docs/site-system/PLAN.md §2.6).
 * Each pairs a display face with a separate reading face; skins.test.ts
 * checks every one for readable contrast.
 */

type FlagshipInput = Omit<SkinDefinition, 'shape' | 'iconStyle' | 'ornaments' | 'background' | 'tempo' | 'headingClass'> &
  Partial<Pick<SkinDefinition, 'shape' | 'iconStyle' | 'ornaments' | 'background' | 'tempo' | 'headingClass'>>;

function skin(input: FlagshipInput): SkinDefinition {
  const d = FAMILY_DEFAULTS[input.family as SkinFamily];
  return {
    headingClass: '',
    shape: d.shape,
    iconStyle: d.iconStyle,
    ornaments: d.ornaments,
    background: { texture: d.texture },
    tempo: d.tempo,
    ...input,
  };
}

const darkOverlay = 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.25))';

export const FLAGSHIP_SKINS: readonly SkinDefinition[] = [
  skin({
    id: 'royal-velvet',
    family: 'royal-classic',
    label: 'Royal velvet',
    description: 'Wine velvet and old gold on ivory, with a high-contrast serif. Made for ceremony.',
    palette: { bg: '#F6EFE3', surface: '#FFFAF1', accent: '#6E1F3F', accentText: '#FFF6E5', text: '#24121F', textMuted: '#5B4753', border: '#D8C49A', band: '#EEE2CC', footer: '#24121F' },
    fonts: { display: '"Cormorant Garamond","Playfair Display",Georgia,serif', body: '"Mulish","Inter",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(36,18,31,0.55), rgba(110,31,63,0.35))',
  }),
  skin({
    id: 'ivory-atelier',
    family: 'luxury-minimal',
    label: 'Ivory atelier',
    description: 'Quiet ivory, bronze details and wide spacing. Lets the food speak.',
    palette: { bg: '#FAF8F5', surface: '#FFFFFF', accent: '#7A5F3E', accentText: '#FFFFFF', text: '#1C1A17', textMuted: '#605A52', border: '#E6E0D6', band: '#F2EEE7', footer: '#1C1A17' },
    fonts: { display: '"Marcellus","Cormorant Garamond",Georgia,serif', body: '"Manrope","Inter",system-ui,sans-serif' },
    heroOverlay: darkOverlay,
  }),
  skin({
    id: 'fresh-grid',
    family: 'modern-minimal',
    label: 'Fresh grid',
    description: 'Crisp white with herb green. Clear, quick and easy to scan.',
    palette: { bg: '#FFFFFF', surface: '#F6F8F7', accent: '#1B6B4E', accentText: '#FFFFFF', text: '#111827', textMuted: '#4B5563', border: '#E3E8E6', band: '#F1F5F3', footer: '#0F1F18' },
    fonts: { display: '"Inter Tight","Inter",system-ui,sans-serif', body: '"Inter",system-ui,sans-serif' },
    heroOverlay: darkOverlay,
  }),
  skin({
    id: 'broadsheet',
    family: 'editorial',
    label: 'Broadsheet',
    description: 'Newsprint white, ink black and a single press red. Reads like a food column.',
    palette: { bg: '#FBFAF7', surface: '#FFFFFF', accent: '#A8231B', accentText: '#FFFFFF', text: '#161616', textMuted: '#4F4F4F', border: '#D9D6CF', band: '#F1EEE7', footer: '#161616' },
    fonts: { display: '"Playfair Display",Georgia,serif', body: '"Source Serif 4","Georgia",serif' },
    heroOverlay: darkOverlay,
  }),
  skin({
    id: 'farmhouse',
    family: 'warm-rustic',
    label: 'Farmhouse',
    description: 'Kraft paper, rust and charcoal. Warm, hand-made and unfussy.',
    palette: { bg: '#F4ECDD', surface: '#FBF6EC', accent: '#8E4220', accentText: '#FFFFFF', text: '#2E2117', textMuted: '#65513F', border: '#D9C7AA', band: '#EADFC9', footer: '#2E2117' },
    fonts: { display: '"Bitter","Georgia",serif', body: '"Nunito Sans","Inter",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(46,33,23,0.55), rgba(142,66,32,0.25))',
  }),
  skin({
    id: 'glasshouse',
    family: 'botanical',
    label: 'Glasshouse',
    description: 'Pale sage and deep fern green. Fresh, calm and leafy.',
    palette: { bg: '#F3F6EE', surface: '#FFFFFF', accent: '#2F6B3F', accentText: '#FFFFFF', text: '#1D2B1F', textMuted: '#4E5F53', border: '#D3DFCD', band: '#E6EEDF', footer: '#1D2B1F' },
    fonts: { display: '"DM Serif Display","Georgia",serif', body: '"DM Sans","Inter",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(29,43,31,0.5), rgba(47,107,63,0.3))',
  }),
  skin({
    id: 'block-party',
    family: 'bold-pop',
    label: 'Block party',
    description: 'Butter yellow, tomato orange and thick black lines. Loud and fun.',
    palette: { bg: '#FFF4D6', surface: '#FFFFFF', accent: '#C9401B', accentText: '#FFFFFF', text: '#1A1A1A', textMuted: '#3D3D3D', border: '#1A1A1A', band: '#FFE3A3', footer: '#1A1A1A' },
    fonts: { display: '"Archivo Black","Archivo",system-ui,sans-serif', body: '"Archivo",system-ui,sans-serif' },
    heroOverlay: darkOverlay,
  }),
  skin({
    id: 'diner-print',
    family: 'retro-vintage',
    label: 'Diner print',
    description: 'Old menu-card cream with teal ink and a poster headline.',
    palette: { bg: '#F2E8D5', surface: '#FBF5E9', accent: '#17506B', accentText: '#FFFFFF', text: '#2A1F14', textMuted: '#62503D', border: '#CDBB9C', band: '#E8DABF', footer: '#2A1F14' },
    fonts: { display: '"Abril Fatface","Playfair Display",Georgia,serif', body: '"Work Sans","Inter",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(42,31,20,0.55), rgba(23,80,107,0.3))',
  }),
  skin({
    id: 'after-hours',
    family: 'neon-night',
    label: 'After hours',
    description: 'Midnight purple with hot pink light. For bars and late kitchens.',
    palette: { bg: '#0E0B16', surface: '#191326', accent: '#FF4F95', accentText: '#0E0B16', text: '#F3EEFF', textMuted: '#B9ADD0', border: '#33284A', band: '#140F20', footer: '#07050C' },
    fonts: { display: '"Bebas Neue","Oswald",system-ui,sans-serif', body: '"Inter",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(14,11,22,0.65), rgba(255,79,149,0.2))',
  }),
  skin({
    id: 'orbit',
    family: 'futurist',
    label: 'Orbit',
    description: 'Deep navy with aqua light and a technical sans.',
    palette: { bg: '#0B1220', surface: '#121B2E', accent: '#4FD1C5', accentText: '#08121E', text: '#E6EEF8', textMuted: '#9DB0C8', border: '#24344F', band: '#0F182A', footer: '#060B14' },
    fonts: { display: '"Space Grotesk","Inter",system-ui,sans-serif', body: '"Inter",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(11,18,32,0.65), rgba(79,209,197,0.2))',
  }),
  skin({
    id: 'soft-clay',
    family: 'soft-glass-clay',
    label: 'Soft clay',
    description: 'Lavender clay, rounded shapes and a friendly rounded face.',
    palette: { bg: '#F1ECF7', surface: '#FFFFFF', accent: '#5B3FC4', accentText: '#FFFFFF', text: '#241C3A', textMuted: '#584F70', border: '#E0D8EE', band: '#E9E2F4', footer: '#241C3A' },
    fonts: { display: '"Fredoka","Nunito",system-ui,sans-serif', body: '"Nunito",system-ui,sans-serif' },
    heroOverlay: 'linear-gradient(to bottom, rgba(36,28,58,0.5), rgba(91,63,196,0.25))',
  }),
  skin({
    id: 'arcade',
    family: 'pixel-90s',
    label: 'Arcade',
    description: 'Pixel headlines, cobalt and sunshine. Playful and nostalgic.',
    palette: { bg: '#F5F0E1', surface: '#FFFFFF', accent: '#2340D6', accentText: '#FFFFFF', text: '#121212', textMuted: '#3A3A3A', border: '#121212', band: '#FFE9A8', footer: '#121212' },
    fonts: { display: '"Press Start 2P","VT323",monospace', body: '"IBM Plex Sans","Inter",system-ui,sans-serif' },
    heroOverlay: darkOverlay,
  }),
];
