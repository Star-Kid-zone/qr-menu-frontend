import { LANDING_THEME_OPTIONS, MENU_THEME_OPTIONS } from "./theme.constants";
export { LANDING_THEME_OPTIONS, MENU_THEME_OPTIONS };
export * from "./templatePalettes.constants";
import type {
  WorkspaceColorField,
  WorkspaceLayoutOption,
  MenuColorKey,
  WorkspaceToggleOption,
  MenuColorField,
  ColourRole,
  ColourSet,
  MenuColourTheme,
} from "@/types/admin/workspace/workspace.types";

export type { MenuColorField, ColourRole, ColourSet, MenuColourTheme };

export const WORKSPACE_COLOR_FIELDS: WorkspaceColorField[] = [
  { name: "primary_color",        label: "Primary (buttons/highlights)" },
  { name: "secondary_color",      label: "Secondary (cards/surfaces)" },
  { name: "accent_color",         label: "Accent (page background)" },
];

export const WORKSPACE_EXTENDED_COLOR_FIELDS: WorkspaceColorField[] = [
  { name: "text_primary_color",   label: "Text primary" },
  { name: "text_secondary_color", label: "Text secondary" },
  { name: "accent_text_color",    label: "Text on buttons" },
  { name: "border_color",         label: "Borders" },
  { name: "footer_bg_color",      label: "Footer background" },
  { name: "section_bg_color",     label: "Section background" },
];

export const MENU_COLOR_FIELDS: MenuColorField[] = [
  { name: "menu_primary_color",   label: "Primary (buttons/highlights)" },
  { name: "menu_secondary_color", label: "Secondary (cards/surfaces)" },
  { name: "menu_accent_color",    label: "Accent (page background)" },
];

export const MENU_EXTENDED_COLOR_FIELDS: MenuColorField[] = [
  { name: "menu_text_primary_color",   label: "Text primary" },
  { name: "menu_text_secondary_color", label: "Text secondary" },
  { name: "menu_accent_text_color",    label: "Text on buttons" },
  { name: "menu_border_color",         label: "Borders" },
  { name: "menu_footer_bg_color",      label: "Footer background" },
  { name: "menu_section_bg_color",     label: "Section background" },
];

/** Sentinel selected to reveal the free-text fallback input in DropdownWithCustomInput. */
export const CUSTOM_OPTION_VALUE = "__custom__";

// Curated from the exact `fontFamily` values used across every landing/menu template
// (see templatePalettes.ts) plus a few extra common choices, so selecting any template's
// layout always has a matching preset. Falls back to free text via CUSTOM_OPTION_VALUE.
export const FONT_FAMILY_OPTIONS = [
  { value: '"Inter","Plus Jakarta Sans",system-ui,sans-serif', label: 'Inter' },
  { value: '"DM Sans","Inter",sans-serif',                     label: 'DM Sans' },
  { value: '"Lato","Helvetica Neue",sans-serif',                label: 'Lato' },
  { value: '"Josefin Sans",sans-serif',                         label: 'Josefin Sans' },
  { value: '"Playfair Display",Georgia,serif',                  label: 'Playfair Display (plain)' },
  { value: '"Cormorant Garamond","Fraunces",Georgia,serif',     label: 'Cormorant Garamond (Fraunces)' },
  { value: '"EB Garamond",Georgia,serif',                       label: 'EB Garamond' },
  { value: '"Audiowide","Orbitron",monospace',                  label: 'Audiowide' },
  { value: '"Bangers","Impact",cursive,sans-serif',             label: 'Bangers' },
  { value: '"Bebas Neue","Impact",sans-serif',                  label: 'Bebas Neue (Impact)' },
  { value: '"Bebas Neue","Oswald","Impact",system-ui,sans-serif', label: 'Bebas Neue (Oswald)' },
  { value: '"Caveat","Patrick Hand","Kalam",cursive,sans-serif', label: 'Caveat (Kalam)' },
  { value: '"Caveat","Patrick Hand","Lato",cursive,sans-serif',  label: 'Caveat (Lato)' },
  { value: '"Caveat","Patrick Hand",cursive,sans-serif',         label: 'Caveat' },
  { value: '"Cinzel Decorative",serif',                          label: 'Cinzel Decorative' },
  { value: '"Comic Sans MS","Patrick Hand",cursive',             label: 'Comic Sans MS (Patrick Hand)' },
  { value: '"Comic Sans MS","Times New Roman",serif',            label: 'Comic Sans MS (Times)' },
  { value: '"Comic Sans MS","Trebuchet MS",cursive,sans-serif',  label: 'Comic Sans MS (Trebuchet)' },
  { value: '"Cormorant Garamond","Lora",Georgia,serif',          label: 'Cormorant Garamond (Lora)' },
  { value: '"Cormorant Garamond","Playfair Display",Georgia,serif', label: 'Cormorant Garamond (Playfair)' },
  { value: '"Cormorant Garamond",Georgia,serif',                 label: 'Cormorant Garamond' },
  { value: '"Courier New",Courier,monospace',                    label: 'Courier New' },
  { value: '"Crimson Text","Lora","Playfair Display",Georgia,serif', label: 'Crimson Text (Lora)' },
  { value: '"Crimson Text","Playfair Display",Georgia,serif',    label: 'Crimson Text' },
  { value: '"Georgia","Lora",serif',                             label: 'Georgia' },
  { value: '"Helvetica Neue","Arial",sans-serif',                label: 'Helvetica Neue' },
  { value: '"Libre Baskerville",Georgia,serif',                  label: 'Libre Baskerville' },
  { value: '"Lora","Crimson Text",Georgia,serif',                label: 'Lora' },
  { value: '"Noto Serif JP","Noto Serif",serif',                 label: 'Noto Serif JP' },
  { value: '"Nunito","Fredoka One","Inter",system-ui,sans-serif', label: 'Nunito (Fredoka One)' },
  { value: '"Nunito","Inter",system-ui,sans-serif',              label: 'Nunito' },
  { value: '"Nunito","Quicksand","Inter",system-ui,sans-serif',  label: 'Nunito (Quicksand)' },
  { value: '"Orbitron","Rajdhani",sans-serif',                   label: 'Orbitron' },
  { value: '"Orbitron","Share Tech Mono",monospace',             label: 'Orbitron (Share Tech Mono)' },
  { value: '"Oswald","Bebas Neue","Impact",system-ui,sans-serif', label: 'Oswald (Bebas Neue)' },
  { value: '"Oswald","Bebas Neue",system-ui,sans-serif',         label: 'Oswald' },
  { value: '"Oswald","Impact",system-ui,sans-serif',             label: 'Oswald (Impact)' },
  { value: '"Pacifico","Lobster","Georgia",cursive,serif',       label: 'Pacifico' },
  { value: '"Playfair Display","Lora",Georgia,serif',            label: 'Playfair Display (Lora)' },
  { value: '"Playfair Display","Space Grotesk",Georgia,sans-serif', label: 'Playfair Display (Space Grotesk)' },
  { value: '"Press Start 2P","Courier New",monospace',           label: 'Press Start 2P' },
  { value: '"Rajdhani","Orbitron",sans-serif',                   label: 'Rajdhani' },
  { value: '"Roboto","Inter",system-ui,sans-serif',              label: 'Roboto' },
  { value: '"Satisfy",cursive',                                   label: 'Satisfy' },
  { value: '"Segoe UI","Inter",system-ui,sans-serif',            label: 'Segoe UI' },
  { value: '"Share Tech Mono","Courier New",monospace',          label: 'Share Tech Mono' },
  { value: '"Space Grotesk","Inter",system-ui,sans-serif',       label: 'Space Grotesk' },
  { value: '"Trebuchet MS","Segoe UI",sans-serif',               label: 'Trebuchet MS' },
  { value: CUSTOM_OPTION_VALUE,                                   label: 'Custom…' },
] as const;

// Curated from the exact `cardStyle` values used across every landing/menu template
// (see templatePalettes.ts). Falls back to free text via CUSTOM_OPTION_VALUE.
export const CARD_STYLE_OPTIONS = [
  { value: 'rounded-none',  label: 'Square' },
  { value: 'rounded-lg',    label: 'Slightly rounded' },
  { value: 'rounded-xl',    label: 'Rounded' },
  { value: 'rounded-2xl',   label: 'More rounded' },
  { value: 'rounded-3xl',   label: 'Very rounded' },
  { value: 'rounded-lg shadow-sm',                    label: 'Slightly rounded + soft shadow' },
  { value: 'rounded-lg shadow-md',                    label: 'Slightly rounded + medium shadow' },
  { value: 'rounded-xl shadow-sm',                    label: 'Rounded + soft shadow' },
  { value: 'rounded-xl border border-slate-700',      label: 'Rounded + slate border' },
  { value: 'rounded-2xl shadow-neu',                  label: 'More rounded + neumorphic shadow' },
  { value: 'rounded-2xl border border-pink-500/20',   label: 'More rounded + pink border' },
  { value: 'rounded-3xl shadow-lg',                   label: 'Very rounded + large shadow' },
  { value: 'border border-[#0a3050]',                 label: 'Bordered (deep navy)' },
  { value: 'border border-blue-500/20',               label: 'Bordered (blue)' },
  { value: 'border border-cyan-500/20',               label: 'Bordered (cyan)' },
  { value: 'border border-indigo-500/20',             label: 'Bordered (indigo)' },
  { value: 'border border-indigo-500/20 bg-indigo-500/5', label: 'Bordered (indigo) + tinted fill' },
  { value: 'border border-purple-500/20',             label: 'Bordered (purple)' },
  { value: CUSTOM_OPTION_VALUE,                        label: 'Custom…' },
] as const;

export const HEADING_CLASS_OPTIONS = [
  { value: '',                                       label: 'Normal' },
  { value: 'uppercase tracking-wide',                 label: 'Uppercase — wide tracking' },
  { value: 'uppercase tracking-widest',                label: 'Uppercase — widest tracking' },
  { value: 'uppercase tracking-widest font-black',     label: 'Uppercase — bold widest tracking' },
  { value: 'uppercase tracking-[0.1em]',               label: 'Uppercase — subtle spacing' },
  { value: 'uppercase tracking-[0.15em]',              label: 'Uppercase — extra spacing' },
  { value: 'uppercase',                                label: 'Uppercase' },
  { value: 'italic',                                   label: 'Elegant italic' },
  { value: 'italic tracking-wide',                      label: 'Italic — wide tracking' },
  { value: 'tracking-tight',                            label: 'Tight tracking' },
  { value: 'font-light tracking-widest',                label: 'Light — widest tracking' },
] as const;

export const HERO_OVERLAY_OPTIONS = [
  { value: 'linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.3))',                                    label: 'Classic dark fade' },
  { value: 'linear-gradient(to bottom, rgba(15,23,42,0.5), rgba(99,102,241,0.4))',                          label: 'Slate to indigo fade' },
  { value: 'linear-gradient(to bottom, rgba(5,10,20,0.6), rgba(0,170,255,0.35))',                           label: 'Midnight to cyan fade' },
  { value: 'linear-gradient(to bottom, rgba(26,18,8,0.6), rgba(201,168,76,0.3))',                           label: 'Warm amber fade' },
  { value: 'linear-gradient(to bottom, rgba(30,58,30,0.5), rgba(90,138,74,0.4))',                           label: 'Forest green fade' },
  { value: 'linear-gradient(to bottom, rgba(61,43,31,0.5), rgba(196,149,106,0.4))',                         label: 'Earthy desert fade' },
  { value: 'linear-gradient(to bottom, rgba(2,14,26,0.6), rgba(10,158,216,0.35))',                          label: 'Oceanic deep fade' },
  { value: 'linear-gradient(135deg, rgba(26,10,46,0.55), rgba(255,107,157,0.4))',                           label: 'Pink & purple duotone' },
  { value: 'linear-gradient(135deg, rgba(5,10,20,0.6), rgba(0,245,255,0.25), rgba(255,0,128,0.2))',         label: 'Holographic tri-tone' },
  { value: 'linear-gradient(to bottom, rgba(10,10,10,0.65), rgba(0,255,65,0.2))',                           label: 'Matrix green fade' },
  { value: 'linear-gradient(to bottom, rgba(17,17,17,0.5), rgba(17,17,17,0.55))',                            label: 'Minimal dark fade' },
  { value: 'none',                                                                                          label: 'None' },
] as const;

export const THEME_BADGE_OPTIONS = [
  { value: 'Curated · Modern · Delicious',            label: 'Curated · Modern · Delicious' },
  { value: '★ Fun · Fresh · Flavourful ★',             label: '★ Fun · Fresh · Flavourful ★' },
  { value: '🌿 Wild · Lush · Tropical',                 label: '🌿 Wild · Lush · Tropical' },
  { value: '♻ Sustainable · Seasonal · Conscious',     label: '♻ Sustainable · Seasonal · Conscious' },
  { value: '✦ Art · Beauty · Mastery ✦',               label: '✦ Art · Beauty · Mastery ✦' },
  { value: 'BOLD · HONEST · DIRECT',                   label: 'BOLD · HONEST · DIRECT' },
  { value: '> OPTIMISING FLAVOUR PARAMETERS',          label: '> OPTIMISING FLAVOUR PARAMETERS' },
  { value: '🎨 Illustrated with Joy',                   label: '🎨 Illustrated with Joy' },
  { value: 'One Colour · Infinite Depth',              label: 'One Colour · Infinite Depth' },
  { value: 'Grid · Order · Precision',                 label: 'Grid · Order · Precision' },
  { value: CUSTOM_OPTION_VALUE,                        label: 'Custom…' },
] as const;

export const THEME_MARQUEE_OPTIONS = [
  { value: 'Bento Style · Modern Dining',                        label: 'Bento Style · Modern Dining' },
  { value: 'Cartoon Vibes · Real Good Food',                     label: 'Cartoon Vibes · Real Good Food' },
  { value: 'Jungle Lush · Tropical Flavours · Wild Dining',      label: 'Jungle Lush · Tropical Flavours · Wild Dining' },
  { value: 'Eco Design · Planet-First Dining',                   label: 'Eco Design · Planet-First Dining' },
  { value: 'AI-Powered Kitchen · Human Soul',                    label: 'AI-Powered Kitchen · Human Soul' },
  { value: 'Modernism · Form · Function · Flavour',              label: 'Modernism · Form · Function · Flavour' },
  { value: 'Editorial · Curated · Published Daily',              label: 'Editorial · Curated · Published Daily' },
  { value: 'Grid Minimal · Structured Dining',                   label: 'Grid Minimal · Structured Dining' },
  { value: 'Nature Inspired · Seasonal · Foraged',                label: 'Nature Inspired · Seasonal · Foraged' },
  { value: 'Renaissance · Classical · Timeless Craft',           label: 'Renaissance · Classical · Timeless Craft' },
  { value: CUSTOM_OPTION_VALUE,                                  label: 'Custom…' },
] as const;

export const HERO_TAGLINE_OPTIONS = [
  { value: 'Fresh flavours, made with care',            label: 'Fresh flavours, made with care' },
  { value: 'Where every dish tells a story',            label: 'Where every dish tells a story' },
  { value: 'Crafted daily, served with pride',          label: 'Crafted daily, served with pride' },
  { value: 'A taste of something better',               label: 'A taste of something better' },
  { value: 'Good food, good company',                   label: 'Good food, good company' },
  { value: 'Seasonal ingredients, timeless taste',       label: 'Seasonal ingredients, timeless taste' },
  { value: CUSTOM_OPTION_VALUE,                          label: 'Custom…' },
] as const;

export const MENU_LAYOUT_OPTIONS: WorkspaceLayoutOption[] = MENU_THEME_OPTIONS;

export const LANDING_LAYOUT_OPTIONS: WorkspaceLayoutOption[] =
  LANDING_THEME_OPTIONS;

// Keys are stored per site (`landing_structure`) and kept stable; the designs behind them were
// rebuilt as full layouts (components/templates/sections/layouts) that each show every section.
export const LANDING_STRUCTURE_OPTIONS = [
  { value: '',                 label: 'Default — clean and simple (follows the style template)' },
  { value: 'split',            label: 'Royal Luxe — opulent dark-and-gold hotel dining' },
  { value: 'minimal',          label: 'Odyssey Classic — calm Italian editorial, full-bleed photos' },
  { value: 'magazine',         label: 'Trattoria — classic printed-menu look with ornament bands' },
  { value: 'cards',            label: 'Legend — huge headlines, warm colour blocks, round photos' },
  { value: 'dashboard',        label: 'Bento — modern tile grid' },
  { value: 'tabs',             label: 'Street Pop — loud stickers, coupons, zigzag edges' },
  { value: 'story',            label: "Chef's Journal — numbered chapters, tasting-menu courses" },
  { value: 'sidebar-right',    label: 'Café Notebook — paper, doodles, polaroids, sticky info card' },
  { value: 'compact',          label: 'Link Card — mobile-first link-in-bio storefront' },
  { value: 'horizontal-split', label: 'Zen Grid — minimal hairlines, numbered sections' },
] as const;

export const MENU_STRUCTURE_OPTIONS = [
  // '' = "Match my layout": the menu designed for the chosen page layout (or the template's menu for the original layouts).
  { value: '',          label: 'Match my layout — the menu designed for your page layout' },
  { value: 'list',       label: 'Classic list — grouped list + filter chips' },
  { value: 'grid',       label: 'Photo grid — image-forward item grid' },
  { value: 'sidebar',    label: 'Sidebar — sticky nav, one category at a time' },
  { value: 'tabs',       label: 'Tabs — horizontal tab bar' },
  { value: 'accordion',  label: 'Fold-out sections — collapsible sections' },
  { value: 'magazine',   label: 'Magazine — editorial banner rows' },
  { value: 'compact',    label: 'Compact list — dense printed-menu look' },
  { value: 'masonry',    label: 'Photo wall — Pinterest-style photo grid' },
  { value: 'story',      label: 'Story — full-width category banners' },
  { value: 'bento',      label: 'Bento tiles — dashboard-style tile grid' },
  // Site system (docs/site-system/PLAN.md §2.5)
  { value: 'bill-of-fare',    label: 'Bill of fare — framed card with dotted price lines' },
  { value: 'spotlight',       label: 'Spotlight — one category at a time, large rows' },
  { value: 'magazine-spread', label: 'Magazine spread — a feature dish per category' },
  { value: 'drinks-list',     label: 'Drinks list — style, origin, ABV and a column per size' },
  { value: 'shop-shelf',      label: 'Shop shelf — product cards with stock and size' },
  { value: 'garden-cards',    label: 'Garden cards — soft rounded cards' },
  { value: 'catch-board',     label: 'Catch board — chalkboard, market prices' },
  { value: 'grill-board',     label: 'Grill board — big price tiles' },
  { value: 'bento-box',       label: 'Bento box — compartments per category' },
  { value: 'market-stalls',   label: 'Market stalls — a striped awning per category' },
  { value: 'deco-card',       label: 'Deco card — symmetric two columns' },
  { value: 'jukebox',         label: 'Jukebox — pick a selection, it flips in' },
] as const;

export const WORKSPACE_TOGGLE_OPTIONS: WorkspaceToggleOption[] = [
  {
    id: "menubtn_status",
    label: "Menu button",
    description: "Show the menu entry point",
  },
  {
    id: "paybtn_status",
    label: "Payment button",
    description: "Enable payment CTA",
  },
  {
    id: "reviewbtn_status",
    label: "Review button",
    description: "Collect guest feedback",
  },
  {
    id: "special_offerstatus",
    label: "Special offers",
    description: "Highlight promotions",
  },
  {
    id: "announcement_enabled",
    label: "Announcement banner",
    description: "Display a short message on the landing page",
  },
];

export const ADD_WORKSPACE_FORM_ID = 'add-workspace-form';

export const STOCK_HERO_PHOTOS: readonly { url: string; label: string }[] = [
  { url: "/landing/fine-dining/hero.jpg", label: "Fine dining" },
  { url: "/landing/casual-bistro/hero.jpg", label: "Bistro" },
  { url: "/landing/pasta-italian/hero.jpg", label: "Italian" },
  { url: "/landing/street-food/hero.jpg", label: "Street food" },
  { url: "/landing/japanese-fusion/hero.jpg", label: "Night market" },
  { url: "/landing/industrial-grill/hero.jpg", label: "Grill" },
  { url: "/landing/cafe-bakery/hero.jpg", label: "Café" },
  { url: "/landing/colorful-brunch/hero.jpg", label: "Brunch" },
  { url: "/landing/garden-outdoor/hero.jpg", label: "Garden" },
  { url: "/landing/cocktail-bar/hero.jpg", label: "Bar" },
  { url: "/landing/vintage-diner/hero.jpg", label: "Diner" },
] as const;

export const ROLE_FIELD: Record<ColourRole, MenuColorKey> = {
  primary: "menu_primary_color",
  secondary: "menu_secondary_color",
  accent: "menu_accent_color",
  textPrimary: "menu_text_primary_color",
  textSecondary: "menu_text_secondary_color",
  accentText: "menu_accent_text_color",
  borderColor: "menu_border_color",
  footerBg: "menu_footer_bg_color",
  sectionBg: "menu_section_bg_color",
};

export const LANDING_ROLE_FIELD: Record<ColourRole, string> = {
  primary: "primary_color",
  secondary: "secondary_color",
  accent: "accent_color",
  textPrimary: "text_primary_color",
  textSecondary: "text_secondary_color",
  accentText: "accent_text_color",
  borderColor: "border_color",
  footerBg: "footer_bg_color",
  sectionBg: "section_bg_color",
};

export const MENU_COLOUR_THEMES: MenuColourTheme[] = [
  { id: "warm-cream", name: "Warm Cream", colors: { accent: "#fdf6e9", secondary: "#ffffff", sectionBg: "#f6ead2", primary: "#c2410c", textPrimary: "#2b1d0e", textSecondary: "#6b5844", accentText: "#ffffff", borderColor: "#e8d9bd", footerBg: "#2b1d0e" } },
  { id: "fresh-green", name: "Fresh Green", colors: { accent: "#f3f8f1", secondary: "#ffffff", sectionBg: "#e4efe0", primary: "#2f7d4f", textPrimary: "#14301f", textSecondary: "#4c6b57", accentText: "#ffffff", borderColor: "#cfe0d3", footerBg: "#14301f" } },
  { id: "ocean-blue", name: "Ocean Blue", colors: { accent: "#f1f6fb", secondary: "#ffffff", sectionBg: "#e1ecf7", primary: "#1d5fb4", textPrimary: "#0f2540", textSecondary: "#4a6280", accentText: "#ffffff", borderColor: "#cbdcee", footerBg: "#0f2540" } },
  { id: "sunset", name: "Sunset", colors: { accent: "#fff7f0", secondary: "#ffffff", sectionBg: "#ffe8d6", primary: "#e8590c", textPrimary: "#3b1d0a", textSecondary: "#7c5538", accentText: "#ffffff", borderColor: "#f6d5bb", footerBg: "#3b1d0a" } },
  { id: "berry", name: "Berry", colors: { accent: "#fbf3f7", secondary: "#ffffff", sectionBg: "#f5e1ea", primary: "#a3194f", textPrimary: "#34101f", textSecondary: "#7a4a5c", accentText: "#ffffff", borderColor: "#ecd0db", footerBg: "#34101f" } },
  { id: "lavender", name: "Lavender", colors: { accent: "#f6f4fc", secondary: "#ffffff", sectionBg: "#e9e4f8", primary: "#6d4ac7", textPrimary: "#201438", textSecondary: "#62577e", accentText: "#ffffff", borderColor: "#d9d1f0", footerBg: "#201438" } },
  { id: "clean-slate", name: "Clean Slate", colors: { accent: "#f6f7f9", secondary: "#ffffff", sectionBg: "#eceef2", primary: "#111827", textPrimary: "#111827", textSecondary: "#5b6472", accentText: "#ffffff", borderColor: "#dde0e6", footerBg: "#111827" } },
  { id: "midnight", name: "Midnight", colors: { accent: "#0f172a", secondary: "#1e293b", sectionBg: "#182236", primary: "#38bdf8", textPrimary: "#f1f5f9", textSecondary: "#a3b1c6", accentText: "#0b1220", borderColor: "#2b3a52", footerBg: "#020617" } },
  { id: "charcoal-gold", name: "Charcoal & Gold", colors: { accent: "#16130e", secondary: "#231e16", sectionBg: "#2d261b", primary: "#d4a853", textPrimary: "#f5ecd9", textSecondary: "#bfb299", accentText: "#16130e", borderColor: "#43392a", footerBg: "#0c0a07" } },
  { id: "forest-night", name: "Forest Night", colors: { accent: "#0f1a14", secondary: "#17261d", sectionBg: "#1e3226", primary: "#5fbf8a", textPrimary: "#e8f5ec", textSecondary: "#a2c2ae", accentText: "#0a140e", borderColor: "#2e4a39", footerBg: "#08110b" } },
] as const;

export const LANDING_PARTS = [
  {
    id: "page",
    label: "Page & footer",
    summary: "The background behind everything, the bands between sections, and the footer.",
    controls: [
      { kind: "color", name: "accent_color", label: "Page background", hint: "Behind everything", paletteKey: "accent" },
      { kind: "color", name: "section_bg_color", label: "Section bands", hint: "Alternating section backgrounds", paletteKey: "sectionBg" },
      { kind: "color", name: "footer_bg_color", label: "Footer background", hint: "Bottom of the page", paletteKey: "footerBg" },
    ],
  },
  {
    id: "cards",
    label: "Cards",
    summary: "The cards that hold offers, reviews and other content.",
    controls: [
      { kind: "color", name: "secondary_color", label: "Card background", hint: "Cards and surfaces", paletteKey: "secondary" },
      { kind: "color", name: "border_color", label: "Lines", hint: "Borders and dividers", paletteKey: "borderColor" },
      { kind: "shape", name: "card_style", label: "Card shape", paletteKey: "cardStyle" },
    ],
  },
  {
    id: "text",
    label: "Text",
    summary: "The typeface, heading style and text colours.",
    controls: [
      { kind: "font", name: "font_family", label: "Typeface", paletteKey: "fontFamily" },
      { kind: "heading", name: "heading_class", label: "Heading style", paletteKey: "headingClass" },
      { kind: "color", name: "text_primary_color", label: "Headings & body", hint: "Main text", paletteKey: "textPrimary" },
      { kind: "color", name: "text_secondary_color", label: "Supporting text", hint: "Descriptions and captions", paletteKey: "textSecondary" },
    ],
  },
  {
    id: "accent",
    label: "Buttons & highlights",
    summary: "The colour that draws the eye: buttons, links and highlights.",
    controls: [
      { kind: "color", name: "primary_color", label: "Highlight colour", hint: "Buttons, links, highlights", paletteKey: "primary" },
      { kind: "color", name: "accent_text_color", label: "Text on buttons", hint: "Label inside buttons", paletteKey: "accentText" },
    ],
  },
  {
    id: "hero",
    label: "Hero image",
    summary: "The big photo at the top of your page, and the tint laid over it.",
    controls: [{ kind: "overlay", name: "hero_overlay", label: "Photo tint", paletteKey: "heroOverlay" }],
  },
  {
    id: "words",
    label: "Wording",
    summary: "The short lines guests read at the top of your page.",
    controls: [
      { kind: "text", name: "hero_tagline", label: "Tagline", hint: "Under your name in the hero", placeholder: "Fresh flavours, made with care", paletteKey: "heroTagline" },
      { kind: "text", name: "theme_badge", label: "Badge", hint: "Small label above the tagline", placeholder: "Curated · Modern · Delicious", paletteKey: "badge" },
      { kind: "text", name: "theme_marquee", label: "Scrolling strip", hint: "Text that scrolls across the page", placeholder: "Modern Dining · Fresh Daily", paletteKey: "marqueeText" },
    ],
  },
  {
    id: "show",
    label: "What guests see",
    summary: "Choose which buttons and sections appear on your page.",
    controls: [],
  },
] as const;

export const OCCASION_REGION_LABELS = {
  india: 'India',
  gulf: 'Gulf',
  western: 'Western',
  general: 'Any time',
} as const;

export const HERO_IMAGE_UPLOAD = {
  ACCEPT: 'image/jpeg,image/png,image/webp',
  MAX_MB: 8,
} as const;

export const PHONE_PREVIEW_DEVICES = [
  { id: 'sm', label: 'S', name: 'iPhone SE', width: 375, height: 667 },
  { id: 'md', label: 'M', name: 'iPhone 14', width: 390, height: 844 },
  { id: 'lg', label: 'L', name: 'iPhone 14 Pro Max', width: 430, height: 932 },
] as const;

export const PHONE_BEZEL_BORDER = 10;
export const PHONE_CONTAINER_WIDTH = 260;

export const WORKSPACE_CURATED_PICKS = {
  TYPE: 'curated-list',
  MAX: 12,
} as const;

export const WORKSPACE_FONTS_SHOWN = 6;

export const MENU_PARTS = [
  {
    id: "page",
    label: "Page",
    summary: "The background guests scroll over, and the footer.",
    controls: [
      { kind: "color", name: "menu_accent_color", label: "Page background", hint: "Behind everything", paletteKey: "accent" },
      { kind: "color", name: "menu_footer_bg_color", label: "Footer background", hint: "Bottom of the page", paletteKey: "footerBg" },
    ],
  },
  {
    id: "header",
    label: "Bars & headers",
    summary: "The top bar, category headers and the lines between things.",
    controls: [
      { kind: "color", name: "menu_secondary_color", label: "Bar background", hint: "Header and category bars", paletteKey: "secondary" },
      { kind: "color", name: "menu_border_color", label: "Lines", hint: "Borders and dividers", paletteKey: "borderColor" },
    ],
  },
  {
    id: "card",
    label: "Dish cards",
    summary: "The card each dish sits on.",
    controls: [
      { kind: "color", name: "menu_section_bg_color", label: "Card background", hint: "Behind each dish", paletteKey: "sectionBg" },
      { kind: "shape", name: "menu_card_style", label: "Card shape", hint: "Corners and shadow", paletteKey: "cardStyle" },
    ],
  },
  {
    id: "text",
    label: "Text",
    summary: "The typeface and the colours of dish names and descriptions.",
    controls: [
      { kind: "font", name: "menu_font_family", label: "Typeface", hint: "Used across the whole menu", paletteKey: "fontFamily" },
      { kind: "color", name: "menu_text_primary_color", label: "Dish names", hint: "Main text", paletteKey: "textPrimary" },
      { kind: "color", name: "menu_text_secondary_color", label: "Descriptions", hint: "Supporting text", paletteKey: "textSecondary" },
    ],
  },
  {
    id: "accent",
    label: "Prices & buttons",
    summary: "The colour that draws the eye: prices, highlights and the Pay bill button.",
    controls: [
      { kind: "color", name: "menu_primary_color", label: "Highlight colour", hint: "Prices, category titles, buttons", paletteKey: "primary" },
      { kind: "color", name: "menu_accent_text_color", label: "Text on buttons", hint: "Label inside the Pay bill button", paletteKey: "accentText" },
    ],
  },
] as const;


