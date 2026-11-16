import type { RawPublicSiteData } from "@/types/components/templates/rawPublicSiteData.types";

const IMG = (set: string, f: string) => `/landing/${set}/${f}`;

type Item = {
  item: string;
  description: string;
  price: string;
  category: string;
  type: string;
  popular?: boolean;
  image?: string | null;
  dietaryTags?: string[];
  spiceLevel?: number;
  allergens?: string[];
  calories?: number;
};

/**
 * A realistic menu that exercises every visual case: 8 categories of uneven
 * size, dishes with and without photos, long names and descriptions, dietary
 * tags, spice levels, popular flags, veg / non-veg types.
 */
const ITEMS: Item[] = [
  { item: "Burrata & heirloom tomato", description: "Creamy burrata, basil oil, flaky sea salt.", price: "580", category: "Starters", type: "Veg", popular: true, image: IMG("garden-outdoor", "dish.jpg"), dietaryTags: ["vegetarian", "gluten_free"], allergens: ["dairy"] },
  { item: "Crispy calamari", description: "Lemon aioli, charred lemon.", price: "520", category: "Starters", type: "Non-Veg", image: IMG("seafood-coastal", "dish.jpg"), allergens: ["shellfish", "egg"] },
  { item: "Garlic bread", description: "Wood-fired focaccia, roasted garlic butter.", price: "260", category: "Starters", type: "Veg", image: null, dietaryTags: ["vegetarian"] },
  { item: "Margherita DOP", description: "San Marzano tomato, fior di latte, fresh basil, extra-virgin olive oil.", price: "520", category: "Pizza", type: "Veg", popular: true, image: IMG("street-food", "dish.jpg"), dietaryTags: ["vegetarian"] },
  { item: "Diavola", description: "Spicy salami, chilli honey, smoked mozzarella.", price: "640", category: "Pizza", type: "Non-Veg", image: IMG("spicy-bold", "dish.jpg"), spiceLevel: 3 },
  { item: "Quattro formaggi with truffle honey and toasted walnuts", description: "Four Italian cheeses on a crisp sourdough base, finished with truffle honey.", price: "720", category: "Pizza", type: "Veg", image: null, dietaryTags: ["vegetarian"], allergens: ["nuts", "dairy"] },
  { item: "Tagliatelle al ragù", description: "Hand-cut egg pasta, eight-hour beef ragù.", price: "640", category: "Pasta", type: "Non-Veg", popular: true, image: IMG("pasta-italian", "dish.jpg"), calories: 820 },
  { item: "Cacio e pepe", description: "Tonnarelli, pecorino romano, cracked black pepper.", price: "560", category: "Pasta", type: "Veg", image: IMG("fine-dining", "dish.jpg"), dietaryTags: ["vegetarian"] },
  { item: "Arrabbiata", description: "Penne, fiery tomato and garlic sauce.", price: "480", category: "Pasta", type: "Veg", image: null, dietaryTags: ["vegan"], spiceLevel: 2 },
  { item: "Grilled branzino", description: "Lemon, capers, charred greens.", price: "980", category: "Mains", type: "Non-Veg", image: IMG("seafood-coastal", "hero.jpg"), dietaryTags: ["gluten_free"] },
  { item: "Chicken Milanese", description: "Crumbed chicken, rocket, parmesan.", price: "780", category: "Mains", type: "Non-Veg", image: IMG("industrial-grill", "dish.jpg") },
  { item: "Risotto ai funghi", description: "Carnaroli, porcini, aged parmesan.", price: "690", category: "Mains", type: "Veg", popular: true, image: IMG("cafe-bakery", "scene.jpg"), dietaryTags: ["vegetarian", "gluten_free"] },
  { item: "Caesar salad", description: "Little gem, anchovy dressing, croutons.", price: "420", category: "Salads", type: "Non-Veg", image: IMG("garden-outdoor", "scene.jpg") },
  { item: "Tiramisù della casa", description: "Mascarpone, espresso, cocoa.", price: "360", category: "Dessert", type: "Veg", popular: true, image: IMG("cafe-bakery", "dish.jpg"), dietaryTags: ["vegetarian", "egg"] },
  { item: "Panna cotta", description: "Vanilla bean, berry compote.", price: "320", category: "Dessert", type: "Veg", image: null, dietaryTags: ["vegetarian", "gluten_free"] },
  { item: "Affogato", description: "Vanilla gelato drowned in espresso.", price: "280", category: "Dessert", type: "Veg", image: IMG("colorful-brunch", "dish.jpg") },
  { item: "Fresh lime soda", description: "Sweet, salted or mixed.", price: "160", category: "Drinks", type: "Veg", image: null, dietaryTags: ["vegan"] },
  { item: "Negroni", description: "Gin, Campari, sweet vermouth.", price: "650", category: "Drinks", type: "Non-Veg", image: IMG("cocktail-bar", "dish.jpg") },
  { item: "Espresso", description: "", price: "180", category: "Coffee", type: "Veg", image: null, dietaryTags: ["vegan"] },
  { item: "Cappuccino", description: "Double shot, silky milk.", price: "240", category: "Coffee", type: "Veg", image: IMG("cafe-bakery", "hero.jpg") },
];

const LIGHT = {
  menu_primary_color: "#8C3B2A",
  menu_secondary_color: "#FFFFFF",
  menu_accent_color: "#FAF7F2",
  menu_text_primary_color: "#1F1A17",
  menu_text_secondary_color: "#5C534C",
  menu_accent_text_color: "#FFFFFF",
  menu_border_color: "#E5DDD3",
  menu_footer_bg_color: "#F1EBE3",
  menu_section_bg_color: "#FFFFFF",
  menu_font_family: '"Cormorant Garamond","Playfair Display",Georgia,serif',
  menu_card_style: "rounded-2xl",
};

const DARK = {
  menu_primary_color: "#C8A165",
  menu_secondary_color: "#1E1713",
  menu_accent_color: "#17120F",
  menu_text_primary_color: "#F5EFE6",
  menu_text_secondary_color: "#BFB3A3",
  menu_accent_text_color: "#17120F",
  menu_border_color: "#3A2E27",
  menu_footer_bg_color: "#0E0B09",
  menu_section_bg_color: "#221A16",
  menu_font_family: '"Cormorant Garamond","Playfair Display",Georgia,serif',
  menu_card_style: "rounded-2xl",
};

type Extra = { attributes?: Record<string, Record<string, unknown>>; priceOptions?: Array<{ label: string; price: string }> };

/** A pub: beer on tap with sizes, wine by glass and bottle, cocktails, food. */
const PUB_ITEMS: Array<Item & Extra> = [
  { item: "House lager", description: "Crisp, clean and cold.", price: "220", category: "On tap", type: "Veg", popular: true, image: IMG("cocktail-bar", "scene.jpg"), attributes: { beer: { style: "Lager", brewery: "Bombay Brewing Co.", abv: 4.8, serve: "tap" } }, priceOptions: [{ label: "Half", price: "220" }, { label: "Pint", price: "380" }] },
  { item: "Hazy IPA", description: "Mango, pine, soft bitterness.", price: "260", category: "On tap", type: "Veg", attributes: { beer: { style: "IPA", brewery: "Gateway", abv: 6.2, ibu: 45, serve: "tap" } }, priceOptions: [{ label: "Half", price: "260" }, { label: "Pint", price: "450" }] },
  { item: "Irish stout", description: "Roast coffee and dark chocolate.", price: "280", category: "On tap", type: "Veg", attributes: { beer: { style: "Stout", abv: 4.2, serve: "tap" } }, priceOptions: [{ label: "Half", price: "280" }, { label: "Pint", price: "480" }] },
  { item: "Belgian wit", description: "Orange peel and coriander.", price: "340", category: "Bottles and cans", type: "Veg", attributes: { beer: { style: "Witbier", brewery: "Hoegaarden", abv: 4.9, serve: "bottle" } } },
  { item: "Sula Rasa Shiraz", description: "Ripe plum, pepper, oak.", price: "450", category: "Wine", type: "Veg", attributes: { wine: { colour: "red", grape: "Shiraz", region: "Nashik", country: "India", vintage: 2021, abv: 14 } }, priceOptions: [{ label: "Glass", price: "450" }, { label: "Bottle", price: "2400" }] },
  { item: "Sauvignon blanc", description: "Gooseberry and lime.", price: "420", category: "Wine", type: "Veg", attributes: { wine: { colour: "white", grape: "Sauvignon blanc", region: "Marlborough", country: "New Zealand", vintage: 2023, abv: 12.5 } }, priceOptions: [{ label: "Glass", price: "420" }, { label: "Bottle", price: "2200" }] },
  { item: "Old fashioned", description: "Bourbon, bitters, orange.", price: "650", category: "Cocktails", type: "Veg", popular: true, image: IMG("cocktail-bar", "dish.jpg"), attributes: { spirits: { baseSpirit: "whisky", abv: 32, glass: "Rocks" } } },
  { item: "Garden gimlet", description: "Gin, lime cordial, basil.", price: "580", category: "Cocktails", type: "Veg", attributes: { spirits: { baseSpirit: "gin", abv: 24 } } },
  { item: "Fish and chips", description: "Beer-battered, mushy peas, tartare.", price: "520", category: "Pub grub", type: "Non-Veg", image: IMG("seafood-coastal", "dish.jpg") },
  { item: "Loaded nachos", description: "Cheese, jalapeño, sour cream.", price: "380", category: "Pub grub", type: "Veg", dietaryTags: ["vegetarian"] },
];

/** A wine shop: bottles with region, vintage, maker and stock. */
const SHOP_ITEMS: Array<Item & Extra> = [
  { item: "Barolo DOCG 2018", description: "Tar and roses; decant an hour.", price: "6400", category: "Reds", type: "Veg", image: IMG("fine-dining", "scene.jpg"), attributes: { wine: { colour: "red", grape: "Nebbiolo", region: "Piedmont", country: "Italy", vintage: 2018, abv: 14 }, product: { brand: "Fontanafredda", size: "750 ml", inStock: true } } },
  { item: "Rioja Reserva 2017", description: "Vanilla, cherry, soft tannins.", price: "3200", category: "Reds", type: "Veg", attributes: { wine: { colour: "red", grape: "Tempranillo", region: "Rioja", country: "Spain", vintage: 2017, abv: 13.5 }, product: { brand: "Marqués de Riscal", size: "750 ml", inStock: true } } },
  { item: "Sula Dindori Shiraz", description: "Indian classic, smoky plum.", price: "1450", category: "Reds", type: "Veg", popular: true, attributes: { wine: { colour: "red", grape: "Shiraz", region: "Nashik", country: "India", vintage: 2020, abv: 14 }, product: { brand: "Sula", size: "750 ml", inStock: false } } },
  { item: "Chablis 2022", description: "Flint, lemon, oyster shell.", price: "3900", category: "Whites", type: "Veg", attributes: { wine: { colour: "white", grape: "Chardonnay", region: "Burgundy", country: "France", vintage: 2022, abv: 12.5 }, product: { brand: "William Fèvre", size: "750 ml", inStock: true } } },
  { item: "Prosecco Superiore", description: "Pear and white flowers.", price: "2100", category: "Sparkling", type: "Veg", attributes: { wine: { colour: "sparkling", grape: "Glera", region: "Veneto", country: "Italy", abv: 11 }, product: { brand: "Bisol", size: "750 ml", unitPrice: "₹280 per 100 ml", inStock: true } } },
];

/** Owner colour columns cleared, so a chosen skin shows its own palette. */
const NO_OWNER_COLOURS = Object.fromEntries(Object.keys(LIGHT).map((k) => [k, ""]));

export function menuSample(structure: string, dark: boolean, theme: string, opts: { skin?: string; business?: string } = {}): RawPublicSiteData {
  const items: Array<Item & Extra> = opts.business === "pub" ? PUB_ITEMS : opts.business === "wine-shop" ? SHOP_ITEMS : ITEMS;
  const name = opts.business === "pub" ? "The Copper Tap" : opts.business === "wine-shop" ? "Cellar Door" : "Casa Nonna";
  return {
    user_id: 1,
    settings: {
      public_slug: "lab",
      logo_url: IMG("pasta-italian", "dish.jpg"),
      banner_url: IMG("fine-dining", "hero.jpg"),
      menu_structure: structure,
      menu_theme: theme,
      menubtn_status: 1,
      paybtn_status: 1,
      reviewbtn_status: 1,
      hero_tagline: "Wood-fired, slow-cooked, made with love",
      ...(dark ? DARK : LIGHT),
      ...(opts.skin ? { ...NO_OWNER_COLOURS, menu_font_family: "", skin_id: opts.skin } : {}),
      ...(opts.business ? { business_type: opts.business } : {}),
      // The menu mapper reads the currency from settings.
      currency: { symbol: "₹", code: "INR" },
    },
    business: { business_name: name, phone: "+91 98765 43210", address: "12 Market Street, Bandra West, Mumbai" },
    payment: { payment_link: "https://pay.example.com", payment_type: "url" },
    review: { review_link: "https://g.page/r/example" },
    gallery: [],
    offers: [],
    menuItems: items.map((it, i) => ({
      attributes: it.attributes ?? {},
      priceOptions: it.priceOptions ?? [],
      id: i + 1,
      item: it.item,
      description: it.description,
      price: it.price,
      category: it.category,
      type: it.type,
      popular: Boolean(it.popular),
      availability: true,
      image_url: it.image ?? null,
      images: [],
      videos: [],
      dietaryTags: it.dietaryTags ?? [],
      allergens: it.allergens ?? [],
      spiceLevel: it.spiceLevel ?? null,
      calories: it.calories ?? null,
    })) as unknown as RawPublicSiteData["menuItems"],
    currency: { symbol: "₹", code: "INR" },
  };
}
