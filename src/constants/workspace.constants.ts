import { LANDING_THEME_OPTIONS } from "@/components/templates/landing/constants";
import { MENU_THEME_OPTIONS } from "@/components/templates/menu/constants";
import type {
  WorkspaceColorField,
  WorkspaceLayoutOption,
  MenuColorKey,
  WorkspaceToggleOption,
} from "@/types/workspace.types";

export interface MenuColorField {
  name: MenuColorKey;
  label: string;
}

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

export const LANDING_STRUCTURE_OPTIONS = [
  { value: '',                 label: 'Default (follows template)' },
  { value: 'split',            label: 'Split — fixed sidebar + scrollable content' },
  { value: 'minimal',          label: 'Minimal — fullscreen hero + 3 dishes + footer' },
  { value: 'magazine',         label: 'Magazine — editorial hero + story/stats sidebar' },
  { value: 'cards',            label: 'Stacked Cards — every section as its own card' },
  { value: 'dashboard',        label: 'Bento Dashboard — variable-sized tile grid' },
  { value: 'tabs',             label: 'Tabbed — Menu / About / Reviews / Visit tabs' },
  { value: 'story',            label: 'Storytelling — full-bleed alternating narrative' },
  { value: 'sidebar-right',    label: 'Sidebar Right — menu-first, sidebar on the right' },
  { value: 'compact',          label: 'Compact Storefront — narrow link-in-bio style' },
  { value: 'horizontal-split', label: 'Horizontal Split — top hero band + 2-column body' },
] as const;

export const MENU_STRUCTURE_OPTIONS = [
  { value: '',          label: 'Default (follows template)' },
  { value: 'list',       label: 'List Classic — grouped list + filter chips' },
  { value: 'grid',       label: 'Grid Cards — image-forward item grid' },
  { value: 'sidebar',    label: 'Sidebar Categories — sticky nav, one category at a time' },
  { value: 'tabs',       label: 'Tabbed Categories — horizontal tab bar' },
  { value: 'accordion',  label: 'Accordion Categories — collapsible sections' },
  { value: 'magazine',   label: 'Magazine Menu — editorial banner rows' },
  { value: 'compact',    label: 'Compact Table — dense printed-menu look' },
  { value: 'masonry',    label: 'Masonry Gallery — Pinterest-style photo grid' },
  { value: 'story',      label: 'Story Menu — full-width category banners' },
  { value: 'bento',      label: 'Bento Menu — dashboard-style tile grid' },
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

