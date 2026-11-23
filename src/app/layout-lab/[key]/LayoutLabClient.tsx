"use client";

import { LayoutPage } from "@/components/templates/sections/layouts/LayoutPage";
import { LAYOUT_MAP } from "@/components/templates/sections/layouts/registry";
import { LANDING_SECTIONS } from "@/components/templates/sections/landing/registry";
import type { LandingTemplateProps, RawPublicSiteData } from "@/types/public/templates/rawPublicSiteData.types";

const IMG = (set: string, f: string) => `/landing/${set}/${f}`;

/** A realistic, fully-populated restaurant so every section has something to show. */
const SAMPLE: RawPublicSiteData = {
  user_id: 1,
  settings: {
    public_slug: "lab",
    logo_url: IMG("pasta-italian", "dish.jpg"),
    banner_url: IMG("fine-dining", "hero.jpg"),
    announcement_enabled: 1,
    announcement_text: "Now open for Sunday brunch · 10am – 3pm",
    theme_badge: "Since 1998",
    hero_tagline: "Wood-fired, slow-cooked, made with love",
    theme_marquee: "Fresh pasta · Wood-fired pizza · Natural wine",
    story_headline: "Three generations at the same stove",
    story_body:
      "Nonna opened our doors with six tables and a single wood oven. Today her grandchildren still roll the pasta by hand every morning, buy from the same farms, and keep the oven burning from noon until the last guest leaves.",
    stats: [
      { label: "Years serving", value: "25+" },
      { label: "Dishes made daily", value: "60" },
      { label: "Happy guests", value: "120k" },
      { label: "Google rating", value: "4.8★" },
    ],
    // A coherent owner palette (without one, content defaults give a navy page under dark text).
    accent_color: "#FAF7F2",
    secondary_color: "#FFFFFF",
    primary_color: "#8C3B2A",
    text_primary_color: "#1F1A17",
    text_secondary_color: "#5C534C",
    accent_text_color: "#FFFFFF",
    border_color: "#E5DDD3",
    footer_bg_color: "#F1EBE3",
    section_bg_color: "#F4EEE6",
    font_family: '"Cormorant Garamond","Playfair Display",Georgia,serif',
    menubtn_status: 1,
    paybtn_status: 1,
    reviewbtn_status: 1,
    // Every section on (dividers use a motif), in the registry order.
    site_document: {
      version: 1,
      landing: {
        sections: LANDING_SECTIONS.filter((d) => d.type !== "intro").map((d) => ({
          id: d.type,
          type: d.type,
          ...(d.type === "divider" ? { variant: "tile" } : {}),
          ...(d.type === "curated-list" ? { props: { title: "Chef's picks this week", itemIds: ["1", "5", "6", "4"] } } : {}),
        })),
      },
    },
    amenities: [
      { id: "wifi" }, { id: "valet", note: "From 7pm" }, { id: "wheelchair" }, { id: "private-dining", note: "Up to 14 guests" },
      { id: "outdoor-seating" }, { id: "card-payment" }, { id: "air-conditioning" }, { id: "reservations" },
    ],
  },
  business: {
    business_name: "Casa Nonna",
    phone: "+91 98765 43210",
    address: "12 Market Street, Bandra West, Mumbai",
    email: "hello@casanonna.example",
    whatsapp_number: "+91 98765 43210",
    location_url: "https://maps.google.com/?q=Bandra",
    website_url: "casanonna.example",
    social_links: [
      { url: "https://instagram.com/casanonna", platform: "instagram", name: "Instagram" },
      { url: "https://facebook.com/casanonna", platform: "facebook", name: "Facebook" },
    ],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => ({
      day,
      ...(i === 0 ? {} : { startTime: "12:00", endTime: i >= 5 ? "23:30" : "22:30" }),
    })),
  },
  payment: { payment_link: "https://pay.example.com", payment_type: "url" },
  review: { review_link: "https://g.page/r/example" },
  gallery: ["fine-dining/scene.jpg", "pasta-italian/hero.jpg", "pasta-italian/scene.jpg", "casual-bistro/scene.jpg", "garden-outdoor/hero.jpg", "cafe-bakery/scene.jpg"].map((p) => ({
    image_url: `/landing/${p}`,
  })),
  offers: [
    { title: "Weekday lunch set", description: "Starter, pasta and dessert for one price, Mon–Fri.", offer_value: "20", offer_type: "percentage", image_url: IMG("pasta-italian", "dish.jpg") },
    { title: "Pizza night", description: "Every Tuesday: second pizza half price.", badge_text: "Tuesdays" },
    { title: "Birthday dessert", description: "A dessert on us when you celebrate here." , badge_text: "Free" },
  ],
  menuItems: [
    { id: 1, item: "Tagliatelle al ragù", description: "Hand-cut egg pasta, eight-hour beef ragù.", price: "640", popular: true, image_url: IMG("pasta-italian", "dish.jpg"), category: "Pasta" },
    { id: 2, item: "Margherita DOP", description: "San Marzano, fior di latte, basil.", price: "520", popular: true, image_url: IMG("street-food", "dish.jpg"), category: "Pizza" },
    { id: 3, item: "Burrata & heirloom tomato", description: "Creamy burrata, basil oil, sea salt.", price: "580", popular: false, image_url: IMG("garden-outdoor", "dish.jpg"), category: "Starters" },
    { id: 4, item: "Tiramisù della casa", description: "Mascarpone, espresso, cocoa.", price: "360", popular: true, image_url: IMG("cafe-bakery", "dish.jpg"), category: "Dessert" },
    { id: 5, item: "Risotto ai funghi", description: "Carnaroli, porcini, aged parmesan.", price: "690", popular: false, image_url: IMG("fine-dining", "dish.jpg"), category: "Mains" },
    { id: 6, item: "Grilled branzino", description: "Lemon, capers, charred greens.", price: "980", popular: true, image_url: IMG("seafood-coastal", "dish.jpg"), category: "Mains" },
  ] as unknown as RawPublicSiteData["menuItems"],
  faqs: [
    { question: "Do you take reservations?", answer: "Yes — call or WhatsApp us; walk-ins are welcome too." },
    { question: "Is there parking?", answer: "Free valet parking from 7pm, street parking at lunch." },
    { question: "Do you have vegetarian options?", answer: "Around half our menu is vegetarian, and pasta can be made vegan." },
  ],
  googleReviews: [
    { id: 1, authorName: "Ananya R.", authorPhotoUrl: null, rating: 5, text: "Best fresh pasta in the city. The ragù tastes like a Sunday at home.", relativePublishDescription: "2 weeks ago" },
    { id: 2, authorName: "Marco D.", authorPhotoUrl: null, rating: 5, text: "Proper wood-fired pizza and lovely staff. We'll be back.", relativePublishDescription: "a month ago" },
    { id: 3, authorName: "Priya S.", authorPhotoUrl: null, rating: 4, text: "Cozy room, generous portions, great tiramisù.", relativePublishDescription: "3 months ago" },
  ],
  currency: { symbol: "₹" },
  awards: [
    { id: "1", title: "Best Italian restaurant", publisher: "Times Food Guide", year: 2025, url: null, logoUrl: null },
    { id: "2", title: "Bib Gourmand", publisher: "City Dining Awards", year: 2024, url: "https://example.com", logoUrl: null },
    { id: "3", title: "Top 50 pasta in India", publisher: "Condé Traveller", year: 2023, url: null, logoUrl: null },
  ],
  team: [
    { id: "1", name: "Lucia Romano", role: "Head chef", bio: "Trained in Bologna; rolls every sheet of pasta by hand before noon.", photoUrl: IMG("fine-dining", "scene.jpg") },
    { id: "2", name: "Arjun Mehta", role: "Pizzaiolo", bio: "Keeps the wood oven at 450° from lunch until close.", photoUrl: IMG("street-food", "hero.jpg") },
    { id: "3", name: "Sara Fernandes", role: "Front of house", bio: null, photoUrl: null },
  ],
  events: [
    { id: "1", title: "Truffle supper", description: "Six courses around fresh white truffle, with wine pairings.", startsAt: "2099-11-28T13:30:00.000Z", endsAt: "2099-11-28T17:00:00.000Z", imageUrl: null, linkUrl: "https://example.com" },
    { id: "2", title: "Sunday jazz brunch", description: "A trio from noon; brunch menu all afternoon.", startsAt: "2099-12-06T06:30:00.000Z", endsAt: null, imageUrl: null, linkUrl: null },
  ],
};

const Link: LandingTemplateProps["LinkComponent"] = ({ to, children, className, style, onClick }) => (
  <a href={to} className={className} style={style} onClick={onClick}>
    {children}
  </a>
);

/** A dark owner palette (the Steakhouse kit's), to check every layout on dark colours too. */
const DARK_SETTINGS = {
  accent_color: "#17120F",
  secondary_color: "#221A16",
  primary_color: "#C8A165",
  text_primary_color: "#F5EFE6",
  text_secondary_color: "#BFB3A3",
  accent_text_color: "#17120F",
  border_color: "#3A2E27",
  footer_bg_color: "#0E0B09",
  section_bg_color: "#1E1713",
};

/** Owner colour columns cleared, so a chosen skin shows its own palette. */
const NO_OWNER_COLOURS = Object.fromEntries(
  ["accent_color", "secondary_color", "primary_color", "text_primary_color", "text_secondary_color", "accent_text_color", "border_color", "footer_bg_color", "section_bg_color", "font_family"].map((k) => [k, ""]),
);

export function LayoutLabClient({
  layoutKey,
  theme,
  dark = false,
  data,
  skin,
  business,
  occasion,
  intensity,
}: {
  layoutKey: string;
  theme: string;
  dark?: boolean;
  data?: RawPublicSiteData;
  /** ?skin=<skin id>: render with that skin's own palette (owner colours cleared). */
  skin?: string;
  /** ?business=<business type id> */
  business?: string;
  /** ?occasion=<occasion id>&intensity=full|subtle — switched on */
  occasion?: string;
  intensity?: string;
}) {
  const layout = LAYOUT_MAP.get(layoutKey);
  if (!layout) return <p style={{ padding: 24 }}>Unknown layout “{layoutKey}”. Try: {[...LAYOUT_MAP.keys()].join(", ")}</p>;
  let sample: RawPublicSiteData = data ?? (dark ? { ...SAMPLE, settings: { ...SAMPLE.settings, ...DARK_SETTINGS } } : SAMPLE);
  if (skin) sample = { ...sample, settings: { ...sample.settings, ...NO_OWNER_COLOURS, skin_id: skin } };
  if (business) sample = { ...sample, settings: { ...sample.settings, business_type: business } };
  if (occasion) {
    const doc = (sample.settings.site_document ?? { version: 1 }) as Record<string, unknown>;
    sample = {
      ...sample,
      settings: { ...sample.settings, site_document: { ...doc, occasion: { id: occasion, intensity: intensity === "full" ? "full" : "subtle" } } },
    };
  }
  return (
    <LayoutPage
      layout={layout}
      data={sample}
      routeSlug="lab"
      themeSlug={theme}
      menuHref="#menu"
      onPay={() => {}}
      onReview={() => {}}
      track={() => {}}
      LinkComponent={Link}
    />
  );
}
