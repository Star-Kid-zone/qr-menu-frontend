import type { LandingSectionDefinition } from "../types";
import { AnnouncementSection, HeroSection, MarqueeSection } from "./opening";
import { StatsSection, StorySection } from "./about";
import { PopularItemsSection, SignatureDishesSection } from "./food";
import { GallerySection, OffersSection, ReviewsSection } from "./engage";
import { FaqSection, FooterSection, VisitSection } from "./visit";
import { DividerSection } from "./divider";
import { IntroSection } from "./intro";
import { ART_MOTIFS } from "../art/motifs";
import { AmenitiesSection, AwardsSection, CuratedListSection, EventsSection, TeamSection } from "./siteContent";

/**
 * Every section a landing page can show. Array order is the default page
 * order — the exact order the original single-file BaseTemplate rendered, so
 * a site with no saved layout looks unchanged.
 *
 * Adding a section: append it where it belongs with `defaultVisible: false`
 * (sites that already saved a layout get it hidden until the owner turns it on).
 */
export const LANDING_SECTIONS: readonly LandingSectionDefinition[] = [
  {
    type: "intro", label: "Opening screen", description: "A short welcome with your logo when guests arrive.", group: "opening", component: IntroSection,
    // Added after sites were customised: off until a kit or the owner turns it on.
    defaultVisible: false,
    variants: [{ value: "steam", label: "Steaming cup" }, { value: "simple", label: "Logo and name" }],
  },
  { type: "announcement", label: "Announcement bar", description: "A short message across the top of the page.", group: "opening", component: AnnouncementSection, defaultVisible: true },
  {
    type: "hero", label: "Hero", description: "Big photo with your name, tagline and main buttons.", group: "opening", component: HeroSection, defaultVisible: true,
    variants: [{ value: "full", label: "Full screen" }, { value: "split", label: "Text beside photo" }, { value: "banner", label: "Short banner" }],
  },
  { type: "marquee", label: "Scrolling strip", description: "A band of text that scrolls across the page.", group: "opening", component: MarqueeSection, defaultVisible: true },
  { type: "stats", label: "Numbers", description: "Up to four headline figures.", group: "about", component: StatsSection, defaultVisible: true },
  { type: "story", label: "Our story", description: "Your story with a photo.", group: "about", component: StorySection, defaultVisible: true },
  // Site system sections: added after sites were customised, so off until the owner turns them on.
  { type: "team", label: "Team", description: "The people in your kitchen and front of house.", group: "about", component: TeamSection, defaultVisible: false },
  { type: "signature-dishes", label: "Signature dishes", description: "The dishes you're known for.", group: "food", component: SignatureDishesSection, defaultVisible: true },
  { type: "popular-items", label: "Popular items", description: "What guests order most.", group: "food", component: PopularItemsSection, defaultVisible: true },
  { type: "curated-list", label: "Hand-picked list", description: "A short list of items you choose, with its own title.", group: "food", component: CuratedListSection, defaultVisible: false },
  { type: "offers", label: "Offers", description: "Current deals.", group: "engage", component: OffersSection, defaultVisible: true },
  { type: "events", label: "Events", description: "Upcoming nights, tastings and live music.", group: "engage", component: EventsSection, defaultVisible: false },
  {
    type: "gallery", label: "Photos", description: "A grid of restaurant and food photos.", group: "trust", component: GallerySection, defaultVisible: true,
    variants: [{ value: "grid", label: "Grid" }, { value: "strip", label: "Scrolling strip" }],
  },
  { type: "reviews", label: "Google reviews", description: "The Google reviews you chose to feature.", group: "trust", component: ReviewsSection, defaultVisible: true },
  { type: "awards", label: "Awards and press", description: "Awards, guides and articles that mention you.", group: "trust", component: AwardsSection, defaultVisible: false },
  { type: "visit", label: "Hours & contact", description: "Opening hours, address, phone and social links.", group: "visit", component: VisitSection, defaultVisible: true },
  { type: "amenities", label: "Amenities", description: "Parking, Wi-Fi, accessibility and other facilities.", group: "visit", component: AmenitiesSection, defaultVisible: false },
  { type: "faq", label: "Questions", description: "Answers to common questions.", group: "visit", component: FaqSection, defaultVisible: true },
  {
    type: "divider", label: "Decorative divider", description: "A themed pattern band between sections.", group: "global", component: DividerSection,
    // Added after sites were customised: hidden until a kit or the owner turns it on.
    defaultVisible: false,
    variants: ART_MOTIFS.map((m) => ({ value: m.value, label: m.label })),
  },
  { type: "footer", label: "Footer", description: "Your name, links and copyright at the bottom.", group: "global", component: FooterSection, defaultVisible: true },
];

export const LANDING_SECTION_MAP: ReadonlyMap<string, LandingSectionDefinition> = new Map(
  LANDING_SECTIONS.map((d) => [d.type, d]),
);
