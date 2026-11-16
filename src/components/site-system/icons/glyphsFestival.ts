import type { Glyph } from './glyphs';

/**
 * Festival badge icons (PLAN §2.7, occasions). Same layered format as the
 * other glyphs: o outline, f fill, d detail, s solid. 24×24, inside 2…22.
 * Prefixed `fest-` so they never clash with menu icons.
 */

const c = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
const star = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}z`;
};
const flame = (cx: number, top: number, h: number) => `M${cx} ${top}c${h * 0.35} ${h * 0.4} ${h * 0.45} ${h * 0.65} ${h * 0.25} ${h}h${-h * 0.5}c${-h * 0.2} ${-h * 0.35} ${-h * 0.1} ${-h * 0.6} ${h * 0.25} ${-h}z`;

const EGG = 'M12 3.5c3.2 0 6.5 5.2 6.5 9.5a6.5 6.5 0 0 1-13 0c0-4.3 3.3-9.5 6.5-9.5z';

export const FESTIVAL: Record<string, Glyph> = {
  // Diwali: an oil lamp with its flame.
  'fest-diya': {
    o: `M3.5 14h17c-1 3.8-4.4 6-8.5 6s-7.5-2.2-8.5-6z${flame(12, 3.5, 8)}`,
    f: 'M3.5 14h17c-1 3.8-4.4 6-8.5 6s-7.5-2.2-8.5-6z',
    d: 'M7 17h10',
  },
  // Holi: a splash of colour.
  'fest-splash': {
    o: 'M12 3.5c1.6 2.4 4.6 1.4 5.6 3.9s-1 3.6.5 5.6 1.4 5-1.6 6-4.5-.1-6 1.5-5.6-1.5-5.1-4-2-4-.5-5.6 2.6-6 3.1-2.1 2-5.4 2-5.4z',
    s: `${c(19.5, 4.5, 1)}${c(4.2, 19.5, 1.2)}${c(20, 17, 0.8)}`,
  },
  // Navratri / Durga Puja: a marigold.
  'fest-marigold': {
    o: c(12, 12, 8.5),
    f: c(12, 12, 8.5),
    d: `${c(12, 12, 4.5)}M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.8 2.8M15.2 15.2 18 18M18 6l-2.8 2.8M8.8 15.2 6 18`,
    s: c(12, 12, 1.8),
  },
  // Ganesh Chaturthi: a modak.
  'fest-modak': {
    o: 'M12 3c-.8 3-6.5 8-6.5 12a6.5 6.5 0 0 0 13 0c0-4-5.7-9-6.5-12z',
    d: 'M12 6.5v14M9 9.5c-1.2 3-1.4 6.5-.5 10M15 9.5c1.2 3 1.4 6.5.5 10',
  },
  // Onam: a snake boat.
  'fest-boat': {
    o: 'M2.5 15h19c-2 3.5-5 5-9.5 5S4.5 18.5 2.5 15zM2.5 15c0-3 .8-6 2.5-8.5',
    f: 'M2.5 15h19c-2 3.5-5 5-9.5 5S4.5 18.5 2.5 15z',
    d: 'M8 15v-3.5M11 15v-3.5M14 15v-3.5M17 15v-3.5',
  },
  // Pongal: a pot boiling over.
  'fest-pot': {
    o: 'M7 9.5h10c1.8 1.8 2.5 3.7 2.5 5.5a7.5 6 0 0 1-15 0c0-1.8.7-3.7 2.5-5.5zM8.5 9.5V7.5h7v2',
    f: 'M7 9.5h10c1.8 1.8 2.5 3.7 2.5 5.5a7.5 6 0 0 1-15 0c0-1.8.7-3.7 2.5-5.5z',
    d: 'M5 14.5h14M10.5 6c0-1.5 1.5-1.5 1.5-3M14 6c0-1 1-1.5 1-2.5',
  },
  // Raksha Bandhan: a rakhi on its thread.
  'fest-rakhi': {
    o: `M2.5 12h5M16.5 12h5${c(12, 12, 4.5)}`,
    f: c(12, 12, 4.5),
    d: 'M12 7.5v9M7.5 12h9M8.8 8.8l6.4 6.4M15.2 8.8l-6.4 6.4',
    s: c(12, 12, 1.6),
  },
  // Independence / National days: a flag.
  'fest-flag': {
    o: 'M5 21V3.5M5 4h13l-3 4.5 3 4.5H5',
    f: 'M5 4h13l-3 4.5 3 4.5H5z',
  },
  // Ramadan: a hanging lantern (fanous).
  'fest-lantern': {
    o: 'M12 1.8v1.7M9 3.5h6l2.5 3.5v10L15 20.5H9L6.5 17V7z',
    f: 'M9 3.5h6l2.5 3.5v10L15 20.5H9L6.5 17V7z',
    d: 'M6.5 7h11M6.5 17h11M12 7v10M9.2 9.5v5M14.8 9.5v5',
  },
  // Eid: crescent and star.
  'fest-crescent': {
    o: 'M14.5 3.2A8.8 8.8 0 1 0 20.8 17 7.2 7.2 0 1 1 14.5 3.2z',
    s: star(17.8, 7.5, 2.6),
  },
  // Christmas: a fir tree.
  'fest-tree': {
    o: 'M12 2.5l5 6h-2.5l4 5.5h-3l4 5H4.5l4-5h-3l4-5.5H7zM12 19v2.5',
    f: 'M12 2.5l5 6h-2.5l4 5.5h-3l4 5H4.5l4-5h-3l4-5.5H7z',
    s: `${c(10, 11.5, 0.9)}${c(14, 15, 0.9)}${c(9, 16.5, 0.9)}`,
  },
  // New Year: a firework burst.
  'fest-firework': {
    o: 'M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5',
    s: c(12, 12, 1.7),
  },
  // Easter: a painted egg.
  'fest-egg': {
    o: EGG,
    d: 'M6.2 11.5l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 1.6 1.2M6 15.5h12',
  },
  // Halloween: a pumpkin.
  'fest-pumpkin': {
    o: 'M12 6.5c-4.5 0-8 3-8 7s3.5 7 8 7 8-3 8-7-3.5-7-8-7zM12 6.5c0-2 1-3.5 3-4',
    f: 'M12 6.5c-4.5 0-8 3-8 7s3.5 7 8 7 8-3 8-7-3.5-7-8-7z',
    d: 'M12 6.5v14M8 7.5c-1.5 2-2 4-2 6s.5 4 2 6M16 7.5c1.5 2 2 4 2 6s-.5 4-2 6',
  },
  // Thanksgiving: a maple leaf.
  'fest-maple': {
    o: 'M12 21.5V16M12 16l-6.5-1 1.2-2.2-3.2-3 3.2-1-1-3.2 3.2 1.1L10 3.5l2 2 2-2 1.1 3.2 3.2-1.1-1 3.2 3.2 1-3.2 3 1.2 2.2z',
    f: 'M12 16l-6.5-1 1.2-2.2-3.2-3 3.2-1-1-3.2 3.2 1.1L10 3.5l2 2 2-2 1.1 3.2 3.2-1.1-1 3.2 3.2 1-3.2 3 1.2 2.2z',
  },
  // St Patrick's Day: a shamrock.
  'fest-shamrock': {
    o: `${c(12, 7.5, 3.3)}${c(7.5, 12.8, 3.3)}${c(16.5, 12.8, 3.3)}M12 12.5v9`,
    f: `${c(12, 7.5, 3.3)}${c(7.5, 12.8, 3.3)}${c(16.5, 12.8, 3.3)}`,
  },
  // Father's Day: a tie.
  'fest-tie': {
    o: 'M10 3h4l-1 3.2 2.7 10.3L12 20.5l-3.7-4L11 6.2z',
    d: 'M11 6.2h2',
  },
  // Grand opening: bunting.
  'fest-bunting': {
    o: 'M2.5 5c6 3 13 3 19 0',
    d: 'M5 6.3l1.4 5.4 2.2-4.5M10.3 7.4l1.7 5.4 1.7-5.4M15.4 7.2l2.2 4.5 1.4-5.4',
  },
  // Anniversary: a cake with candles.
  'fest-cake': {
    o: 'M4.5 11.5h15v9h-15zM8 11.5V8M12 11.5V8M16 11.5V8',
    f: 'M4.5 11.5h15v9h-15z',
    d: 'M4.5 15c2.5 1.5 5 1.5 7.5 0s5-1.5 7.5 0',
    s: `M8 4.5c.8.7.8 2 0 2.5-.8-.5-.8-1.8 0-2.5zM12 4.5c.8.7.8 2 0 2.5-.8-.5-.8-1.8 0-2.5zM16 4.5c.8.7.8 2 0 2.5-.8-.5-.8-1.8 0-2.5z`,
  },
  // Summer: the sun.
  'fest-sun': {
    o: c(12, 12, 4.5),
    f: c(12, 12, 4.5),
    d: 'M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1',
  },
  // Winter: a snowflake.
  'fest-snowflake': {
    o: 'M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6',
    d: 'M9.8 4.4 12 6.6l2.2-2.2M9.8 19.6l2.2-2.2 2.2 2.2M4.4 10.9l3 .8.8-3M19.6 13.1l-3-.8-.8 3M4.4 13.1l3-.8.8 3M19.6 10.9l-3 .8-.8-3',
  },
};
