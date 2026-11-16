import type { OccasionDefinition, OccasionRegion } from '../types';

/**
 * The 32 occasion looks (docs/site-system/PLAN.md §2.8). Nothing here turns
 * on by itself: the owner switches an occasion on, chooses how strong it is, and turns it off.
 *
 * - `tints[0]` is the banner colour (and the accent at "full" strength);
 *   `ink` must read on it (occasions.test checks 4.5:1).
 * - `ornaments.border` names the decoration band (OccasionOverlay);
 *   `divider` / `corner` reuse the existing motif and corner sets.
 * - Suggested banner and specials-category wording only fill the owner's
 *   form; the owner's own banner always wins.
 */

type Input = Omit<OccasionDefinition, 'ornaments'> & { border: string; divider?: string; corner?: string };

const o = ({ border, divider = 'dots', corner = 'fleuron', ...rest }: Input): OccasionDefinition => ({
  ...rest,
  ornaments: { border, divider, corner },
});

const INDIA: OccasionDefinition[] = [
  o({ id: 'diwali', region: 'india', label: 'Diwali', tints: ['#7A1E48', '#F2A900', '#E25822'], ink: '#FFF6E0', border: 'diyas', divider: 'rangoli', lottie: 'diya', bannerSuggestion: 'Happy Diwali from all of us', specialsCategorySuggestion: 'Diwali specials', badgeIcon: 'fest-diya' }),
  o({ id: 'holi', region: 'india', label: 'Holi', tints: ['#C2185B', '#1E88E5', '#43A047', '#FDD835'], ink: '#FFFFFF', border: 'splash', lottie: 'colour-burst', bannerSuggestion: 'Happy Holi! Come and play with colour', specialsCategorySuggestion: 'Holi specials', badgeIcon: 'fest-splash' }),
  o({ id: 'navratri-dussehra', region: 'india', label: 'Navratri and Dussehra', tints: ['#8E1C2E', '#E65100', '#FBC02D'], ink: '#FFF8E7', border: 'toran', divider: 'rangoli', lottie: 'dandiya', bannerSuggestion: 'Navratri greetings: garba nights are here', specialsCategorySuggestion: 'Navratri thali', badgeIcon: 'fest-marigold' }),
  o({ id: 'durga-puja', region: 'india', label: 'Durga Puja', tints: ['#9B1B30', '#D4A017', '#F5F0E6'], ink: '#FFFFFF', border: 'toran', divider: 'rangoli', lottie: 'marigold', bannerSuggestion: 'Shubho Pujo!', specialsCategorySuggestion: 'Pujo specials', badgeIcon: 'fest-marigold' }),
  o({ id: 'ganesh-chaturthi', region: 'india', label: 'Ganesh Chaturthi', tints: ['#B23A00', '#F9A825', '#2E7D32'], ink: '#FFFFFF', border: 'toran', divider: 'rangoli', lottie: 'marigold', bannerSuggestion: 'Ganpati Bappa Morya!', specialsCategorySuggestion: 'Modak and festive sweets', badgeIcon: 'fest-modak' }),
  o({ id: 'onam', region: 'india', label: 'Onam', tints: ['#2E5E1A', '#F2C230', '#F5F0DC'], ink: '#FFFFFF', border: 'leaves', divider: 'leaf', corner: 'leaf', lottie: 'boat', bannerSuggestion: 'Happy Onam: the sadya is served', specialsCategorySuggestion: 'Onam sadya', badgeIcon: 'fest-boat' }),
  o({ id: 'pongal-sankranti', region: 'india', label: 'Pongal and Sankranti', tints: ['#8D3B0F', '#F4B400', '#3B7D23'], ink: '#FFFFFF', border: 'kites', divider: 'rangoli', lottie: 'kite', bannerSuggestion: 'Happy Pongal and Sankranti', specialsCategorySuggestion: 'Pongal specials', badgeIcon: 'fest-pot' }),
  o({ id: 'raksha-bandhan', region: 'india', label: 'Raksha Bandhan', tints: ['#AD1457', '#FFB300', '#5E35B1'], ink: '#FFFFFF', border: 'stars', lottie: 'rakhi', bannerSuggestion: 'Happy Raksha Bandhan', specialsCategorySuggestion: 'Sweets for your sibling', badgeIcon: 'fest-rakhi' }),
  o({ id: 'india-independence-day', region: 'india', label: 'Independence Day (India)', tints: ['#1B5E20', '#FF9933', '#000080'], ink: '#FFFFFF', border: 'flags', lottie: 'flag', bannerSuggestion: 'Happy Independence Day', specialsCategorySuggestion: 'Tricolour specials', badgeIcon: 'fest-flag' }),
  o({ id: 'india-republic-day', region: 'india', label: 'Republic Day (India)', tints: ['#1B5E20', '#FF9933', '#000080'], ink: '#FFFFFF', border: 'flags', lottie: 'flag', bannerSuggestion: 'Happy Republic Day', specialsCategorySuggestion: 'Tricolour specials', badgeIcon: 'fest-flag' }),
];

const GULF: OccasionDefinition[] = [
  o({ id: 'ramadan', region: 'gulf', label: 'Ramadan', tints: ['#123B4A', '#C9A227', '#F3E9D2'], ink: '#FFF7E0', border: 'lanterns', divider: 'arabesque', lottie: 'lantern', bannerSuggestion: 'Ramadan Kareem: iftar served from sunset', specialsCategorySuggestion: 'Iftar and suhoor', badgeIcon: 'fest-lantern' }),
  o({ id: 'eid-al-fitr', region: 'gulf', label: 'Eid al-Fitr', tints: ['#0F5132', '#D4AF37', '#FAF3E0'], ink: '#FFFFFF', border: 'lanterns', divider: 'arabesque', lottie: 'crescent', bannerSuggestion: 'Eid Mubarak', specialsCategorySuggestion: 'Eid feast', badgeIcon: 'fest-crescent' }),
  o({ id: 'eid-al-adha', region: 'gulf', label: 'Eid al-Adha', tints: ['#3E2A14', '#D4AF37', '#F5EBDD'], ink: '#FFFFFF', border: 'lanterns', divider: 'arabesque', lottie: 'crescent', bannerSuggestion: 'Eid al-Adha Mubarak', specialsCategorySuggestion: 'Eid feast', badgeIcon: 'fest-crescent' }),
  o({ id: 'uae-national-day', region: 'gulf', label: 'UAE National Day', tints: ['#00732F', '#CE1126', '#000000'], ink: '#FFFFFF', border: 'flags', lottie: 'flag', bannerSuggestion: 'Happy UAE National Day', specialsCategorySuggestion: 'National Day specials', badgeIcon: 'fest-flag' }),
  o({ id: 'saudi-national-day', region: 'gulf', label: 'Saudi National Day', tints: ['#006C35', '#C8A951', '#FFFFFF'], ink: '#FFFFFF', border: 'flags', lottie: 'flag', bannerSuggestion: 'Happy Saudi National Day', specialsCategorySuggestion: 'National Day specials', badgeIcon: 'fest-flag' }),
  o({ id: 'saudi-founding-day', region: 'gulf', label: 'Saudi Founding Day', tints: ['#5B3A1E', '#C8A951', '#006C35'], ink: '#FFFFFF', border: 'flags', divider: 'arabesque', lottie: 'flag', bannerSuggestion: 'Happy Founding Day', specialsCategorySuggestion: 'Founding Day specials', badgeIcon: 'fest-flag' }),
  o({ id: 'qatar-national-day', region: 'gulf', label: 'Qatar National Day', tints: ['#8A1538', '#FFFFFF', '#D9C6CD'], ink: '#FFFFFF', border: 'flags', lottie: 'flag', bannerSuggestion: 'Happy Qatar National Day', specialsCategorySuggestion: 'National Day specials', badgeIcon: 'fest-flag' }),
  o({ id: 'kuwait-national-day', region: 'gulf', label: 'Kuwait National Day', tints: ['#007A3D', '#CE1126', '#000000'], ink: '#FFFFFF', border: 'flags', lottie: 'flag', bannerSuggestion: 'Happy Kuwait National Day', specialsCategorySuggestion: 'National Day specials', badgeIcon: 'fest-flag' }),
];

const WESTERN: OccasionDefinition[] = [
  o({ id: 'christmas', region: 'western', label: 'Christmas', tints: ['#B3121D', '#1B5E20', '#F5E6C8'], ink: '#FFFFFF', border: 'snow', divider: 'leaf', lottie: 'baubles', bannerSuggestion: 'Merry Christmas', specialsCategorySuggestion: 'Christmas menu', badgeIcon: 'fest-tree' }),
  o({ id: 'new-years-eve', region: 'western', label: "New Year's Eve", tints: ['#14213D', '#FCA311', '#E5E5E5'], ink: '#FFFFFF', border: 'stars', lottie: 'fireworks', bannerSuggestion: 'Ring in the new year with us', specialsCategorySuggestion: "New Year's Eve menu", badgeIcon: 'fest-firework' }),
  o({ id: 'valentines-day', region: 'western', label: "Valentine's Day", tints: ['#9D174D', '#F9A8D4', '#FCE7F3'], ink: '#FFFFFF', border: 'hearts', lottie: 'hearts', bannerSuggestion: 'Book a table for two this Valentine’s', specialsCategorySuggestion: "Valentine's menu", badgeIcon: 'heart' }),
  o({ id: 'easter', region: 'western', label: 'Easter', tints: ['#6B4E9B', '#F6D55C', '#A7D8B9'], ink: '#FFFFFF', border: 'bunting', divider: 'leaf', lottie: 'egg', bannerSuggestion: 'Happy Easter', specialsCategorySuggestion: 'Easter brunch', badgeIcon: 'fest-egg' }),
  o({ id: 'halloween', region: 'western', label: 'Halloween', tints: ['#1A1A1A', '#F57C00', '#6A1B9A'], ink: '#FFFFFF', border: 'stars', lottie: 'pumpkin', bannerSuggestion: 'Happy Halloween', specialsCategorySuggestion: 'Spooky specials', badgeIcon: 'fest-pumpkin' }),
  o({ id: 'thanksgiving', region: 'western', label: 'Thanksgiving', tints: ['#7C2D12', '#D97706', '#FDE68A'], ink: '#FFFFFF', border: 'leaves', divider: 'leaf', corner: 'leaf', lottie: 'leaves', bannerSuggestion: 'Happy Thanksgiving', specialsCategorySuggestion: 'Thanksgiving feast', badgeIcon: 'fest-maple' }),
  o({ id: 'st-patricks-day', region: 'western', label: "St Patrick's Day", tints: ['#14532D', '#22C55E', '#FDE68A'], ink: '#FFFFFF', border: 'bunting', lottie: 'shamrock', bannerSuggestion: "Happy St Patrick's Day", specialsCategorySuggestion: 'Irish specials', badgeIcon: 'fest-shamrock' }),
  o({ id: 'mothers-day', region: 'western', label: "Mother's Day", tints: ['#9F1239', '#FBCFE8', '#FFF1F2'], ink: '#FFFFFF', border: 'hearts', lottie: 'hearts', bannerSuggestion: "Treat her this Mother's Day", specialsCategorySuggestion: "Mother's Day menu", badgeIcon: 'heart' }),
  o({ id: 'fathers-day', region: 'western', label: "Father's Day", tints: ['#1E3A5F', '#93C5FD', '#F1F5F9'], ink: '#FFFFFF', border: 'bunting', lottie: 'cheers', bannerSuggestion: "Bring Dad along this Father's Day", specialsCategorySuggestion: "Father's Day menu", badgeIcon: 'fest-tie' }),
  o({ id: 'oktoberfest', region: 'western', label: 'Oktoberfest', tints: ['#1E3A8A', '#FFFFFF', '#FACC15'], ink: '#FFFFFF', border: 'bunting', lottie: 'beer', bannerSuggestion: "O'zapft is! Oktoberfest is on", specialsCategorySuggestion: 'Oktoberfest specials', badgeIcon: 'pint' }),
];

const GENERAL: OccasionDefinition[] = [
  o({ id: 'grand-opening', region: 'general', label: 'Grand opening', tints: ['#1F2937', '#F59E0B', '#FDE68A'], ink: '#FFFFFF', border: 'bunting', lottie: 'confetti', bannerSuggestion: "We're open! Come and celebrate with us", specialsCategorySuggestion: 'Opening offers', badgeIcon: 'fest-bunting' }),
  o({ id: 'anniversary', region: 'general', label: 'Anniversary', tints: ['#4C1D95', '#F59E0B', '#EDE9FE'], ink: '#FFFFFF', border: 'stars', lottie: 'cake', bannerSuggestion: 'Thank you for celebrating our anniversary with us', specialsCategorySuggestion: 'Anniversary specials', badgeIcon: 'fest-cake' }),
  o({ id: 'summer', region: 'general', label: 'Summer', tints: ['#0E7490', '#FACC15', '#FDE68A'], ink: '#FFFFFF', border: 'bunting', lottie: 'sun', bannerSuggestion: 'Our summer menu is here', specialsCategorySuggestion: 'Summer specials', badgeIcon: 'fest-sun' }),
  o({ id: 'winter', region: 'general', label: 'Winter', tints: ['#1E3A8A', '#BFDBFE', '#F8FAFC'], ink: '#FFFFFF', border: 'snow', lottie: 'snowfall', bannerSuggestion: 'Warm up with our winter menu', specialsCategorySuggestion: 'Winter warmers', badgeIcon: 'fest-snowflake' }),
];

export const OCCASIONS: readonly OccasionDefinition[] = [...INDIA, ...GULF, ...WESTERN, ...GENERAL];

const BY_ID: ReadonlyMap<string, OccasionDefinition> = new Map(OCCASIONS.map((x) => [x.id, x]));

export function getOccasion(id: string | null | undefined): OccasionDefinition | null {
  return (id && BY_ID.get(id)) || null;
}

export const OCCASION_REGIONS: readonly OccasionRegion[] = ['india', 'gulf', 'western', 'general'];

export function occasionsByRegion(): Record<OccasionRegion, OccasionDefinition[]> {
  const out = { india: [], gulf: [], western: [], general: [] } as Record<OccasionRegion, OccasionDefinition[]>;
  for (const x of OCCASIONS) out[x.region].push(x);
  return out;
}
