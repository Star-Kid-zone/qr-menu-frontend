import {
  PiCakeBold,
  PiConfettiBold,
  PiFireBold,
  PiForkKnifeBold,
  PiHeartBold,
  PiLeafBold,
  PiMartiniBold,
  PiSnowflakeBold,
  PiSparkleBold,
  PiStarBold,
  PiSunBold,
  PiTagBold,
} from "react-icons/pi";
import type { PosterTemplateConfig } from "@/types/marketing";

export const POSTER_CATEGORIES = [
  "Daily Special",
  "New Menu Item",
  "Offer & Discount",
  "Grand Opening",
  "Happy Hour & Events",
  "Seasonal & Festive",
] as const;

// Design space: 1080x1350 (4:5 — Instagram's recommended portrait post ratio) for every template,
// so the gallery grid and editor never have to juggle mixed aspect ratios.
const W = 1080;
const H = 1350;

export const POSTER_TEMPLATES: PosterTemplateConfig[] = [
  {
    slug: "daily-special-bold",
    name: "Bold Daily Special",
    category: "Daily Special",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(160deg, #ff7a45 0%, #d6336c 100%)" },
    decorations: [
      { type: "circle", xPct: -10, yPct: -8, sizePct: 45, color: "#ffffff", opacity: 0.08 },
      { type: "circle", xPct: 70, yPct: 78, sizePct: 55, color: "#ffffff", opacity: 0.08 },
      { type: "icon", xPct: 8, yPct: 8, sizePct: 8, icon: PiForkKnifeBold, color: "#ffffff", opacity: 0.9 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "TODAY'S SPECIAL", maxLength: 30, xPct: 8, yPct: 20, widthPct: 84, fontSizePct: 4.2, fontWeight: 700, color: "#ffe8dd", align: "left", letterSpacingPx: 2, textTransform: "uppercase" },
      { id: "headline", label: "Headline", defaultText: "Grilled Salmon Bowl", maxLength: 60, xPct: 8, yPct: 28, widthPct: 84, fontSizePct: 8.5, fontWeight: 800, color: "#ffffff", align: "left", lineHeight: 1.1 },
      { id: "subtext", label: "Subtext", defaultText: "Fresh catch, served daily with citrus glaze.", maxLength: 90, xPct: 8, yPct: 48, widthPct: 78, fontSizePct: 3.4, fontWeight: 500, color: "#ffe8dd", align: "left", lineHeight: 1.4 },
      { id: "price", label: "Price", defaultText: "$14.99", maxLength: 20, xPct: 8, yPct: 84, widthPct: 60, fontSizePct: 7, fontWeight: 800, color: "#ffffff", align: "left" },
    ],
  },
  {
    slug: "daily-special-minimal",
    name: "Minimal Daily Special",
    category: "Daily Special",
    width: W,
    height: H,
    background: { type: "solid", value: "#fdfaf6" },
    decorations: [
      { type: "line", xPct: 8, yPct: 40, widthPct: 30, color: "#1a1a1a", thicknessPx: 3 },
      { type: "icon", xPct: 84, yPct: 6, sizePct: 8, icon: PiLeafBold, color: "#2d6a4f", opacity: 0.9 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "Chef's Pick of the Day", maxLength: 40, xPct: 8, yPct: 30, widthPct: 84, fontSizePct: 3.6, fontWeight: 600, color: "#8b6914", align: "left", textTransform: "uppercase", letterSpacingPx: 1.5 },
      { id: "headline", label: "Headline", defaultText: "Wild Mushroom Risotto", maxLength: 60, xPct: 8, yPct: 44, widthPct: 84, fontSizePct: 7.6, fontWeight: 700, color: "#1a1a1a", align: "left", fontFamily: '"Cormorant Garamond",Georgia,serif' },
      { id: "subtext", label: "Subtext", defaultText: "Slow-cooked, finished with truffle oil.", maxLength: 90, xPct: 8, yPct: 58, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#555555", align: "left", lineHeight: 1.5 },
      { id: "price", label: "Price", defaultText: "$18", maxLength: 20, xPct: 8, yPct: 86, widthPct: 50, fontSizePct: 6, fontWeight: 700, color: "#1a1a1a", align: "left" },
    ],
  },
  {
    slug: "new-item-modern",
    name: "Modern New Arrival",
    category: "New Menu Item",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" },
    decorations: [
      { type: "circle", xPct: 60, yPct: -6, sizePct: 60, color: "#facc15", opacity: 0.12 },
      { type: "icon", xPct: 8, yPct: 8, sizePct: 7, icon: PiSparkleBold, color: "#facc15" },
    ],
    textFields: [
      { id: "badge", label: "Badge", defaultText: "NEW ON THE MENU", maxLength: 30, xPct: 8, yPct: 22, widthPct: 84, fontSizePct: 3.6, fontWeight: 700, color: "#facc15", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "Truffle Butter Steak", maxLength: 60, xPct: 8, yPct: 30, widthPct: 84, fontSizePct: 8, fontWeight: 800, color: "#f8fafc", align: "left", lineHeight: 1.1 },
      { id: "subtext", label: "Subtext", defaultText: "Available for a limited time only.", maxLength: 90, xPct: 8, yPct: 50, widthPct: 78, fontSizePct: 3.4, fontWeight: 500, color: "#cbd5e1", align: "left", lineHeight: 1.4 },
    ],
  },
  {
    slug: "new-item-badge",
    name: "Badge New Arrival",
    category: "New Menu Item",
    width: W,
    height: H,
    background: { type: "solid", value: "#faf6ee" },
    decorations: [
      { type: "circle", xPct: 8, yPct: 20, sizePct: 22, color: "#e05585", opacity: 1 },
    ],
    textFields: [
      { id: "badge", label: "Badge text", defaultText: "NEW", maxLength: 10, xPct: 8, yPct: 27, widthPct: 22, fontSizePct: 3.6, fontWeight: 800, color: "#ffffff", align: "center", textTransform: "uppercase" },
      { id: "headline", label: "Headline", defaultText: "Strawberry Matcha Latte", maxLength: 60, xPct: 8, yPct: 46, widthPct: 84, fontSizePct: 7.4, fontWeight: 700, color: "#2d2016", align: "left" },
      { id: "subtext", label: "Subtext", defaultText: "A sweet twist on our house matcha.", maxLength: 90, xPct: 8, yPct: 60, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#6b4c2a", align: "left", lineHeight: 1.5 },
      { id: "price", label: "Price", defaultText: "$6.50", maxLength: 20, xPct: 8, yPct: 86, widthPct: 50, fontSizePct: 6, fontWeight: 700, color: "#e05585", align: "left" },
    ],
  },
  {
    slug: "offer-discount-splash",
    name: "Bold Discount Splash",
    category: "Offer & Discount",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(150deg, #cc2200 0%, #7a0a12 100%)" },
    decorations: [
      { type: "circle", xPct: -15, yPct: 55, sizePct: 70, color: "#ffffff", opacity: 0.06 },
      { type: "icon", xPct: 82, yPct: 8, sizePct: 9, icon: PiTagBold, color: "#ffffff", opacity: 0.85 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "LIMITED TIME OFFER", maxLength: 30, xPct: 8, yPct: 24, widthPct: 84, fontSizePct: 3.8, fontWeight: 700, color: "#ffd6cc", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "discount", label: "Discount", defaultText: "50% OFF", maxLength: 20, xPct: 8, yPct: 32, widthPct: 84, fontSizePct: 13, fontWeight: 800, color: "#ffffff", align: "left", lineHeight: 1 },
      { id: "subtext", label: "Subtext", defaultText: "On all orders above $30. This weekend only.", maxLength: 90, xPct: 8, yPct: 62, widthPct: 78, fontSizePct: 3.4, fontWeight: 500, color: "#ffd6cc", align: "left", lineHeight: 1.4 },
    ],
  },
  {
    slug: "offer-discount-clean",
    name: "Clean Discount Card",
    category: "Offer & Discount",
    width: W,
    height: H,
    background: { type: "solid", value: "#ffffff" },
    decorations: [
      { type: "rect", xPct: 8, yPct: 8, widthPct: 84, heightPct: 84, color: "transparent", borderRadiusPct: 4, opacity: 1 },
      { type: "line", xPct: 8, yPct: 8, widthPct: 84, color: "#111111", thicknessPx: 2 },
      { type: "line", xPct: 8, yPct: 92, widthPct: 84, color: "#111111", thicknessPx: 2 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "WEEKEND DEAL", maxLength: 30, xPct: 10, yPct: 16, widthPct: 80, fontSizePct: 3.6, fontWeight: 700, color: "#555555", align: "center", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "discount", label: "Discount", defaultText: "BUY 1 GET 1", maxLength: 20, xPct: 10, yPct: 38, widthPct: 80, fontSizePct: 9, fontWeight: 800, color: "#111111", align: "center", lineHeight: 1.1 },
      { id: "subtext", label: "Subtext", defaultText: "Valid on all pizzas, Fri-Sun.", maxLength: 90, xPct: 10, yPct: 58, widthPct: 80, fontSizePct: 3.2, fontWeight: 500, color: "#555555", align: "center", lineHeight: 1.4 },
    ],
  },
  {
    slug: "happy-hour-neon",
    name: "Neon Happy Hour",
    category: "Happy Hour & Events",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 100%)" },
    decorations: [
      { type: "circle", xPct: 65, yPct: 10, sizePct: 50, color: "#c084fc", opacity: 0.15 },
      { type: "icon", xPct: 8, yPct: 8, sizePct: 8, icon: PiMartiniBold, color: "#f472b6" },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "HAPPY HOUR", maxLength: 30, xPct: 8, yPct: 24, widthPct: 84, fontSizePct: 4.4, fontWeight: 700, color: "#f472b6", align: "left", textTransform: "uppercase", letterSpacingPx: 3 },
      { id: "headline", label: "Headline", defaultText: "Half-Price Cocktails", maxLength: 60, xPct: 8, yPct: 32, widthPct: 84, fontSizePct: 8, fontWeight: 800, color: "#ffffff", align: "left", lineHeight: 1.1 },
      { id: "subtext", label: "Subtext", defaultText: "Every weekday, 5-7 PM.", maxLength: 90, xPct: 8, yPct: 52, widthPct: 78, fontSizePct: 3.4, fontWeight: 500, color: "#e0d8ff", align: "left", lineHeight: 1.4 },
    ],
  },
  {
    slug: "happy-hour-retro",
    name: "Retro Diner Hour",
    category: "Happy Hour & Events",
    width: W,
    height: H,
    background: { type: "solid", value: "#f2e5c7" },
    decorations: [
      { type: "circle", xPct: 70, yPct: 68, sizePct: 40, color: "#c4543c", opacity: 0.9 },
      { type: "circle", xPct: -8, yPct: -6, sizePct: 30, color: "#d4a24c", opacity: 0.9 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "EVERY FRIDAY NIGHT", maxLength: 30, xPct: 8, yPct: 22, widthPct: 84, fontSizePct: 3.8, fontWeight: 700, color: "#8b4513", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "Live Music & Good Eats", maxLength: 60, xPct: 8, yPct: 30, widthPct: 84, fontSizePct: 7.4, fontWeight: 700, color: "#2c2a26", align: "left", fontFamily: '"Fraunces","Cormorant Garamond",Georgia,serif' },
      { id: "subtext", label: "Subtext", defaultText: "Doors open at 7 PM. No cover charge.", maxLength: 90, xPct: 8, yPct: 46, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#5a5650", align: "left", lineHeight: 1.5 },
    ],
  },
  {
    slug: "grand-opening-classic",
    name: "Classic Grand Opening",
    category: "Grand Opening",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(180deg, #1a1208 0%, #231a0a 100%)" },
    decorations: [
      { type: "line", xPct: 8, yPct: 34, widthPct: 20, color: "#c9a24b", thicknessPx: 3 },
      { type: "icon", xPct: 84, yPct: 8, sizePct: 8, icon: PiStarBold, color: "#c9a24b" },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "GRAND OPENING", maxLength: 30, xPct: 8, yPct: 24, widthPct: 84, fontSizePct: 4.2, fontWeight: 700, color: "#c9a24b", align: "left", textTransform: "uppercase", letterSpacingPx: 3 },
      { id: "headline", label: "Headline", defaultText: "Come Celebrate With Us", maxLength: 60, xPct: 8, yPct: 40, widthPct: 84, fontSizePct: 6.6, fontWeight: 700, color: "#f3e9d2", align: "left", fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif' },
      { id: "subtext", label: "Subtext", defaultText: "Saturday, June 14th — Free tastings all day.", maxLength: 90, xPct: 8, yPct: 56, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#cfc4a8", align: "left", lineHeight: 1.5 },
    ],
  },
  {
    slug: "grand-opening-festive",
    name: "Festive Grand Opening",
    category: "Grand Opening",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(150deg, #ff6b9d 0%, #6366f1 100%)" },
    decorations: [
      { type: "icon", xPct: 10, yPct: 10, sizePct: 8, icon: PiConfettiBold, color: "#ffffff", opacity: 0.9 },
      { type: "icon", xPct: 80, yPct: 68, sizePct: 8, icon: PiConfettiBold, color: "#ffffff", opacity: 0.7 },
      { type: "circle", xPct: 70, yPct: -8, sizePct: 40, color: "#ffffff", opacity: 0.1 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "WE'RE OPEN!", maxLength: 30, xPct: 8, yPct: 26, widthPct: 84, fontSizePct: 4.4, fontWeight: 800, color: "#ffffff", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "Grand Opening Weekend", maxLength: 60, xPct: 8, yPct: 34, widthPct: 84, fontSizePct: 7.2, fontWeight: 800, color: "#ffffff", align: "left", lineHeight: 1.1 },
      { id: "subtext", label: "Subtext", defaultText: "20% off your first visit — this weekend only.", maxLength: 90, xPct: 8, yPct: 54, widthPct: 78, fontSizePct: 3.4, fontWeight: 500, color: "#fdf2f8", align: "left", lineHeight: 1.4 },
    ],
  },
  {
    slug: "seasonal-winter",
    name: "Cozy Winter Menu",
    category: "Seasonal & Festive",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%)" },
    decorations: [
      { type: "icon", xPct: 8, yPct: 8, sizePct: 8, icon: PiSnowflakeBold, color: "#2563eb" },
      { type: "icon", xPct: 80, yPct: 78, sizePct: 8, icon: PiSnowflakeBold, color: "#2563eb", opacity: 0.6 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "WINTER SPECIALS", maxLength: 30, xPct: 8, yPct: 26, widthPct: 84, fontSizePct: 3.8, fontWeight: 700, color: "#1e3a8a", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "Warm Up With Our Soups", maxLength: 60, xPct: 8, yPct: 34, widthPct: 84, fontSizePct: 6.8, fontWeight: 700, color: "#1e293b", align: "left" },
      { id: "subtext", label: "Subtext", defaultText: "Fresh, hearty, and made daily through February.", maxLength: 90, xPct: 8, yPct: 50, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#475569", align: "left", lineHeight: 1.5 },
    ],
  },
  {
    slug: "seasonal-summer",
    name: "Bright Summer Menu",
    category: "Seasonal & Festive",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(160deg, #fde047 0%, #fb923c 100%)" },
    decorations: [
      { type: "icon", xPct: 78, yPct: 8, sizePct: 10, icon: PiSunBold, color: "#ffffff", opacity: 0.9 },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "SUMMER MENU", maxLength: 30, xPct: 8, yPct: 26, widthPct: 84, fontSizePct: 4, fontWeight: 700, color: "#7c2d12", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "Cool Down, Eat Fresh", maxLength: 60, xPct: 8, yPct: 34, widthPct: 84, fontSizePct: 7.2, fontWeight: 800, color: "#431407", align: "left" },
      { id: "subtext", label: "Subtext", defaultText: "New salads, smoothies & shaved ice all season.", maxLength: 90, xPct: 8, yPct: 52, widthPct: 78, fontSizePct: 3.4, fontWeight: 500, color: "#7c2d12", align: "left", lineHeight: 1.4 },
    ],
  },
  {
    slug: "weekend-brunch",
    name: "Weekend Brunch",
    category: "Daily Special",
    width: W,
    height: H,
    background: { type: "solid", value: "#fef0f5" },
    decorations: [
      { type: "circle", xPct: 68, yPct: 10, sizePct: 30, color: "#f0b8d0", opacity: 0.8 },
      { type: "icon", xPct: 8, yPct: 8, sizePct: 7, icon: PiCakeBold, color: "#e05585" },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "SAT & SUN, 9AM-2PM", maxLength: 30, xPct: 8, yPct: 26, widthPct: 84, fontSizePct: 3.6, fontWeight: 700, color: "#8a5a70", align: "left", textTransform: "uppercase", letterSpacingPx: 1.5 },
      { id: "headline", label: "Headline", defaultText: "Weekend Brunch is Back", maxLength: 60, xPct: 8, yPct: 34, widthPct: 84, fontSizePct: 6.8, fontWeight: 700, color: "#3a1428", align: "left", fontFamily: "\"Satisfy\",cursive" },
      { id: "subtext", label: "Subtext", defaultText: "Bottomless mimosas with every entree.", maxLength: 90, xPct: 8, yPct: 50, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#8a5a70", align: "left", lineHeight: 1.5 },
    ],
  },
  {
    slug: "combo-deal-split",
    name: "Split Combo Deal",
    category: "Offer & Discount",
    width: W,
    height: H,
    background: { type: "solid", value: "#111111" },
    decorations: [
      { type: "rect", xPct: 0, yPct: 62, widthPct: 100, heightPct: 38, color: "#facc15", opacity: 1 },
      { type: "icon", xPct: 8, yPct: 8, sizePct: 8, icon: PiFireBold, color: "#facc15" },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "COMBO DEAL", maxLength: 30, xPct: 8, yPct: 24, widthPct: 84, fontSizePct: 4, fontWeight: 700, color: "#facc15", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "Burger + Fries + Drink", maxLength: 60, xPct: 8, yPct: 32, widthPct: 84, fontSizePct: 7, fontWeight: 800, color: "#ffffff", align: "left", lineHeight: 1.15 },
      { id: "price", label: "Price", defaultText: "Only $9.99", maxLength: 20, xPct: 8, yPct: 74, widthPct: 84, fontSizePct: 7.5, fontWeight: 800, color: "#111111", align: "left" },
    ],
  },
  {
    slug: "thank-you-loyalty",
    name: "Loyalty Thank You",
    category: "Happy Hour & Events",
    width: W,
    height: H,
    background: { type: "gradient", value: "linear-gradient(160deg, #d0e8d0 0%, #eaf4e4 100%)" },
    decorations: [
      { type: "icon", xPct: 8, yPct: 8, sizePct: 8, icon: PiHeartBold, color: "#2d6a4f" },
    ],
    textFields: [
      { id: "eyebrow", label: "Eyebrow", defaultText: "THANK YOU", maxLength: 30, xPct: 8, yPct: 26, widthPct: 84, fontSizePct: 4.2, fontWeight: 700, color: "#1b4332", align: "left", textTransform: "uppercase", letterSpacingPx: 2 },
      { id: "headline", label: "Headline", defaultText: "One Year With Our Community", maxLength: 60, xPct: 8, yPct: 34, widthPct: 84, fontSizePct: 6.4, fontWeight: 700, color: "#1e3a1e", align: "left" },
      { id: "subtext", label: "Subtext", defaultText: "Enjoy a free dessert on your next visit, on us.", maxLength: 90, xPct: 8, yPct: 50, widthPct: 78, fontSizePct: 3.2, fontWeight: 500, color: "#3a4a35", align: "left", lineHeight: 1.5 },
    ],
  },
];

export function getPosterTemplate(slug: string): PosterTemplateConfig | undefined {
  return POSTER_TEMPLATES.find((t) => t.slug === slug);
}
