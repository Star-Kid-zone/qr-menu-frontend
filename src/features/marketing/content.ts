import { APP_NAME, TENANT_ROOT_DOMAIN } from "@/config/app.constants";
import { LANDING_THEME_OPTIONS } from "@/components/templates/landing/constants";

/*
 * Every line on the marketing page describes something the product does today.
 * Check the code before adding a claim: no ordering, no table payments, no
 * invented numbers or testimonials.
 */

export const BRAND = APP_NAME;
export const ROOT_DOMAIN = TENANT_ROOT_DOMAIN;

/** Number of looks a restaurant can choose from for its website and menu (one list drives both). */
export const LOOK_COUNT = LANDING_THEME_OPTIONS.length;

/**
 * Looks that have a photo set under public/landing/<slug>/. Only these are
 * shown in the photo band; the full list of looks lives in the template constants.
 */
export const LOOKS_WITH_PHOTOS: { slug: string; label: string; ext?: "png" | "jpg"; photo?: "hero" | "dish" | "scene" }[] = [
  { slug: "fine-dining", label: "Fine dining" },
  { slug: "cafe-bakery", label: "Cafe & bakery" },
  { slug: "street-food", label: "Street food" },
  { slug: "japanese-fusion", label: "Japanese fusion" },
  { slug: "dark-bar", label: "Dark bar" },
  { slug: "garden-outdoor", label: "Garden" },
  { slug: "casual-bistro", label: "Casual bistro" },
  { slug: "seafood-coastal", label: "Seafood" },
  { slug: "cocktail-bar", label: "Cocktail bar" },
  { slug: "colorful-brunch", label: "Brunch" },
  { slug: "pasta-italian", label: "Italian" },
  { slug: "industrial-grill", label: "Grill house" },
  { slug: "nordic-minimal", label: "Nordic minimal", photo: "scene" },
  { slug: "vintage-diner", label: "Vintage diner" },
  { slug: "botanical", label: "Botanical" },
];

export const GUEST_SCREENS = [
  {
    id: "menu",
    title: "The menu, with photos and prices",
    body: "Dishes with photos, descriptions and prices, marked veg or non-veg, with spice level and calories when you add them. Guests can search it. Switch a dish off in your dashboard and it disappears straight away.",
  },
  {
    id: "website",
    title: `A website at your-restaurant.${TENANT_ROOT_DOMAIN}`,
    body: "Your story, offers, photos, opening hours, address and phone number, plus the Google reviews you choose to show. Use your own domain if you have one.",
  },
  {
    id: "pay",
    title: "Pay bill and Review buttons",
    body: "Pay bill opens your payment link or shows your payment QR code, so guests pay you directly. Review takes them straight to your Google review page.",
  },
] as const;

export const DASHBOARD_AREAS = [
  {
    id: "menu",
    title: "Menu",
    body: "Add dishes one at a time, import a CSV file, or photograph a printed menu and let AI read the dishes for you to check. Change prices in bulk and switch dishes off when they sell out.",
  },
  {
    id: "website",
    title: "Website",
    body: `Choose one of ${LOOK_COUNT} looks for your website and menu, pick colours, write your story, and add offers, photos, questions and opening hours. Check it on a phone preview before guests see it.`,
  },
  {
    id: "qr",
    title: "QR codes",
    body: "Download your QR code as PNG or SVG for table cards, stickers and posters. Guests scan with the phone camera, nothing to install.",
  },
  {
    id: "reviews",
    title: "Reviews",
    body: "Connect your Google Business Profile to see reviews in one place. Reply with a suggested reply you can edit, or turn on automatic replies. Pick which reviews appear on your website.",
  },
  {
    id: "social",
    title: "Social posts",
    body: "Connect Facebook, Instagram, X and LinkedIn. Write a post once, send it now or schedule it, and use the ready-made weekly posters.",
  },
  {
    id: "team",
    title: "Team",
    body: "Give managers and staff their own sign-in with only the access they need. Plan shifts and keep opening and closing checklists.",
  },
  {
    id: "visits",
    title: "Visits",
    body: "See how many people opened your menu and website, which buttons they tapped, what they searched for, and which searches found no dish.",
  },
] as const;

export const STEPS = [
  { title: "Create your account", body: "Sign up with your mobile number and the code we text you." },
  { title: "Add your dishes", body: "Type them in, import a CSV file, or scan a printed menu." },
  { title: "Choose how it looks", body: "Pick a look and colours, then check it on the phone preview." },
  { title: "Put the QR code on your tables", body: "Download it and print it for tables, the counter and the door." },
];

export const FAQS = [
  {
    question: "Do guests need to download an app?",
    answer:
      "No. Guests point their phone camera at the QR code and your menu opens in their browser. There is nothing to install and no account to create.",
  },
  {
    question: "What hardware do we need?",
    answer: "None. You manage your menu, website and reviews from any phone, tablet or laptop you already have.",
  },
  {
    question: "How quickly can we mark a dish as sold out or change a price?",
    answer:
      "Switch a dish off or edit its price in your dashboard and the menu guests see changes as soon as you save. You never reprint a menu.",
  },
  {
    question: "Can guests order or pay at the table through the menu?",
    answer:
      "Not through the menu itself. The Pay bill button opens the payment link or payment QR code you set up, and guests pay you directly.",
  },
  {
    question: "How do Google reviews work?",
    answer:
      "Your menu and website show a Review button that opens your Google review page. Once you connect your Google Business Profile, reviews appear in your dashboard, where you can reply and choose which ones to show on your website.",
  },
  {
    question: "Can my staff use it too?",
    answer:
      "Yes. Add managers and staff with their phone numbers. Staff can look after the menu, shifts and checklists without being able to change your website or settings.",
  },
  {
    question: "Can we use our own domain?",
    answer: `Yes. Every restaurant gets your-restaurant.${TENANT_ROOT_DOMAIN}. If you own a domain, point it at us from Settings and your website and menu answer on it.`,
  },
];
