import type { WorkspaceSettingsFormValues } from "@/types/admin/workspace/workspace.types";
import type { SectionInstance } from "../types";
import { getBusinessType, KIT_BUSINESS_TYPE, resolveBusinessType } from "@/components/site-system/business-types";
import { getSkin } from "@/components/site-system/skins";
import { skinFormValues } from "@/components/site-system/skins/formValues";

/**
 * Restaurant-type kits: one click sets a coherent look for a cuisine — business
 * type, layout, style, section order and decorative dividers, with the menu
 * matching the layout. Owners then change anything they like.
 *
 * A kit never touches content (menu items, photos, story, hours) and never hides
 * a content section — it only sets the order, so whatever the owner has written
 * shows up in every look. Its starter
 * wording (tagline, badge, scrolling strip) only fills fields the owner left empty.
 */

/**
 * A kit is a recipe (docs/site-system/PLAN.md §2.1): a business type, which
 * brings its recommended layout and style, plus a section order and starter
 * wording. Colours, fonts and shapes come from the style.
 */
export interface RestaurantKit {
  id: string;
  label: string;
  description: string;
  copy: { tagline: string; badge: string; marquee: string };
  /** Landing page sections, in order (dividers use an art motif as their variant). */
  sections: SectionInstance[];
}

/** What applying a kit sets: the business type and its first recommended layout and style. */
export function kitRecipe(kit: Pick<RestaurantKit, "id">): { businessType: string; layout: string; skinId: string } {
  const business = getBusinessType(KIT_BUSINESS_TYPE[kit.id]) ?? resolveBusinessType({});
  return { businessType: business.id, layout: business.recommended.layouts[0] ?? "", skinId: business.recommended.skins[0] ?? "" };
}
const s = (type: string, extra: Partial<SectionInstance> = {}): SectionInstance => ({ id: extra.id ?? type, type, ...extra });
const divider = (n: number, motif: string): SectionInstance => s("divider", { id: n === 1 ? "divider" : `divider-${n}`, variant: motif });



export const RESTAURANT_KITS: readonly RestaurantKit[] = [
  {
    id: "italian-trattoria",
    label: "Italian trattoria",
    description: "Warm cream and terracotta, elegant serif, story-led.",
    copy: { tagline: "Handmade pasta, slow-cooked sauces", badge: "Cucina di casa", marquee: "Pasta fresca · Wood-fired · Made with love" },
    sections: [s("intro", { variant: "simple" }), s("announcement"), s("hero"), s("story"), divider(1, "tile"), s("signature-dishes"), s("popular-items"), s("offers"), s("gallery"), s("reviews"), divider(2, "tile"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "pizzeria",
    label: "Pizzeria",
    description: "Bold red and cream, condensed type, menu-first.",
    copy: { tagline: "Wood-fired, by the slice or the whole pie", badge: "Fresh dough daily", marquee: "Wood-fired · Hand-stretched · Hot from the oven" },
    sections: [s("announcement"), s("hero", { variant: "banner" }), s("marquee"), s("popular-items"), s("offers"), divider(1, "zigzag"), s("signature-dishes"), s("reviews"), s("gallery", { variant: "strip" }), s("visit"), s("faq"), s("story"), s("stats"), s("footer")],
  },
  {
    id: "arabian-mandi",
    label: "Arabian / Mandi",
    description: "Sand and emerald with gold, arabesque dividers.",
    copy: { tagline: "Slow-cooked mandi, served the traditional way", badge: "Halal · Family seating", marquee: "Mandi · Mezze · Arabic coffee" },
    sections: [s("intro"), s("announcement"), s("hero"), divider(1, "arabesque"), s("signature-dishes"), s("story"), s("popular-items"), s("offers"), divider(2, "arabesque"), s("reviews"), s("gallery"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "north-indian",
    label: "North Indian",
    description: "Saffron and spice tones, rangoli dividers.",
    copy: { tagline: "Tandoor-fired, slow-simmered, full of flavour", badge: "Since our first tandoor", marquee: "Tandoor · Curries · Fresh naan" },
    sections: [s("intro"), s("announcement"), s("hero"), s("signature-dishes"), divider(1, "rangoli"), s("popular-items"), s("offers"), s("story"), s("reviews"), divider(2, "rangoli"), s("gallery"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "south-indian",
    label: "South Indian",
    description: "Banana-leaf greens, friendly rounded type.",
    copy: { tagline: "Crisp dosas, fluffy idlis, strong filter coffee", badge: "Pure veg", marquee: "Dosa · Idli · Filter coffee" },
    sections: [s("intro"), s("announcement"), s("hero"), s("popular-items"), divider(1, "leaf"), s("signature-dishes"), s("offers"), s("story"), s("reviews"), s("gallery"), divider(2, "leaf"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "burger-joint",
    label: "Burger joint",
    description: "Dark with a punchy yellow, big condensed type.",
    copy: { tagline: "Smashed, stacked and made to order", badge: "Fresh, never frozen", marquee: "Smash burgers · Loaded fries · Thick shakes" },
    sections: [s("announcement"), s("hero"), s("marquee"), s("popular-items"), divider(1, "zigzag"), s("offers"), s("signature-dishes"), s("reviews"), s("gallery", { variant: "strip" }), s("visit"), s("faq"), s("story"), s("stats"), s("footer")],
  },
  {
    id: "cafe",
    label: "Café & bakery",
    description: "Coffee browns and soft cream, relaxed and airy.",
    copy: { tagline: "Good coffee, fresh bakes, slow mornings", badge: "Baked this morning", marquee: "Espresso · Pastries · Brunch" },
    sections: [s("intro"), s("announcement"), s("hero", { variant: "split" }), s("popular-items"), divider(1, "wave"), s("story"), s("gallery", { variant: "strip" }), s("offers"), s("reviews"), s("visit"), s("faq"), s("signature-dishes"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "japanese",
    label: "Japanese",
    description: "Calm paper white with vermilion, quiet serif.",
    copy: { tagline: "Seasonal fish, rice and patience", badge: "Omakase available", marquee: "Sushi · Ramen · Sake" },
    sections: [s("intro"), s("announcement"), s("hero", { variant: "split" }), s("signature-dishes"), divider(1, "seigaiha"), s("story"), s("popular-items"), s("gallery"), s("reviews"), divider(2, "seigaiha"), s("visit"), s("faq"), s("offers"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "lebanese-mezze",
    label: "Lebanese mezze",
    description: "Olive greens and white stone, sharing plates first.",
    copy: { tagline: "Mezze to share, grills from the charcoal", badge: "Made for sharing", marquee: "Hummus · Shawarma · Fresh flatbread" },
    sections: [s("intro", { variant: "simple" }), s("announcement"), s("hero"), s("popular-items"), divider(1, "arabesque"), s("signature-dishes"), s("story"), s("offers"), s("gallery"), s("reviews"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "turkish-grill",
    label: "Turkish grill",
    description: "Deep red and warm cream, Iznik-style tiles.",
    copy: { tagline: "Charcoal kebabs, fresh pide, strong tea", badge: "Ocakbaşı grill", marquee: "Kebab · Pide · Baklava" },
    sections: [s("announcement"), s("hero"), s("signature-dishes"), divider(1, "tile"), s("popular-items"), s("offers"), s("story"), s("gallery"), s("reviews"), divider(2, "tile"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "chinese",
    label: "Chinese",
    description: "Lucky red on warm white, window-lattice details.",
    copy: { tagline: "Wok-fired, hand-pulled, made fresh", badge: "Family recipes", marquee: "Dim sum · Noodles · Wok specials" },
    sections: [s("announcement"), s("hero"), s("popular-items"), divider(1, "lattice"), s("signature-dishes"), s("offers"), s("story"), s("reviews"), s("gallery"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "mexican-taqueria",
    label: "Mexican taqueria",
    description: "Sunny cream with teal, papel picado bunting.",
    copy: { tagline: "Tacos al pastor, fresh salsas, cold aguas frescas", badge: "Hecho a mano", marquee: "Tacos · Burritos · Churros" },
    sections: [s("announcement"), s("hero", { variant: "banner" }), divider(1, "papel"), s("popular-items"), s("offers"), s("signature-dishes"), s("gallery", { variant: "strip" }), s("reviews"), divider(2, "papel"), s("visit"), s("faq"), s("story"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "steakhouse",
    label: "Steakhouse",
    description: "Dark wood and brass, refined and reservation-ready.",
    copy: { tagline: "Dry-aged cuts, fire-grilled to order", badge: "Since the first fire", marquee: "Ribeye · Tomahawk · Fine wine" },
    sections: [s("announcement"), s("hero"), s("story"), divider(1, "dots"), s("signature-dishes"), s("reviews"), s("gallery"), s("offers"), s("visit"), s("faq"), s("popular-items"), s("marquee"), s("stats"), s("footer")],
  },
  {
    id: "seafood",
    label: "Seafood",
    description: "Sea blues on crisp white, catch-of-the-day first.",
    copy: { tagline: "Today's catch, cooked simply", badge: "Fresh off the boat", marquee: "Grilled fish · Prawns · Oysters" },
    sections: [s("announcement"), s("hero"), s("signature-dishes"), divider(1, "wave"), s("popular-items"), s("offers"), s("story"), s("gallery"), s("reviews"), divider(2, "wave"), s("visit"), s("faq"), s("marquee"), s("stats"), s("footer")],
  },
];

export const RESTAURANT_KIT_MAP: ReadonlyMap<string, RestaurantKit> = new Map(RESTAURANT_KITS.map((k) => [k.id, k]));

/**
 * True when a field holds the owner's own words. Empty, or another kit's
 * starter wording, does not count, so switching kits replaces the old
 * kit's tagline instead of leaving it behind.
 */
function ownWording(value: string | undefined, field: keyof RestaurantKit["copy"]): boolean {
  const v = value?.trim();
  return Boolean(v) && !RESTAURANT_KITS.some((k) => k.copy[field] === v);
}
/**
 * Form values a kit sets: business type, layout and style (the style's
 * colours, fonts and shapes, exactly as picking it in the style gallery), with
 * the menu matching the layout. Starter wording only fills empty fields.
 */
export function kitFormValues(
  kit: RestaurantKit,
  current: Pick<WorkspaceSettingsFormValues, "hero_tagline" | "theme_badge" | "theme_marquee">,
): Partial<WorkspaceSettingsFormValues> {
  const recipe = kitRecipe(kit);
  const skin = getSkin(recipe.skinId);
  return {
    business_type: recipe.businessType,
    landing_structure: recipe.layout,
    landing_theme: "",
    menu_structure: "",
    menu_skin_id: "",
    ...(skin ? (skinFormValues(skin) as Partial<WorkspaceSettingsFormValues>) : {}),
    ...(ownWording(current.hero_tagline, "tagline") ? {} : { hero_tagline: kit.copy.tagline }),
    ...(ownWording(current.theme_badge, "badge") ? {} : { theme_badge: kit.copy.badge }),
    ...(ownWording(current.theme_marquee, "marquee") ? {} : { theme_marquee: kit.copy.marquee }),
  };
}