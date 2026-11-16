import type { AttributeSetId, BusinessFamily, BusinessTerms, BusinessTypeDefinition } from '../types';

/**
 * The 37 business types (docs/site-system/PLAN.md §2.1). A type changes what
 * the site *says* and *shows* — words, icons, item fields, which sections
 * start visible — never its colours (resolveSiteLook rule 1).
 *
 * Copy is sentence case and written for guests. Recommendations point at
 * layout keys, flagship skin ids and menu structure keys from the plan.
 */

const FAMILY_TERMS: Record<BusinessFamily, BusinessTerms> = {
  restaurants: {
    catalogLabel: 'Menu', itemSingular: 'Dish', itemPlural: 'Dishes',
    featuredSectionLabel: 'Signature dishes', popularSectionLabel: 'Most ordered',
    ctaLabel: 'See the menu', curatedListTitle: "Chef's picks",
  },
  'quick-casual': {
    catalogLabel: 'Menu', itemSingular: 'Item', itemPlural: 'Items',
    featuredSectionLabel: 'Fan favourites', popularSectionLabel: 'Most ordered',
    ctaLabel: 'See the menu', curatedListTitle: 'Combos and deals',
  },
  'cafes-sweets': {
    catalogLabel: 'Menu', itemSingular: 'Item', itemPlural: 'Items',
    featuredSectionLabel: 'House favourites', popularSectionLabel: 'Most ordered',
    ctaLabel: 'See the menu', curatedListTitle: 'Fresh today',
  },
  'bars-lounges': {
    catalogLabel: 'Menu', itemSingular: 'Drink', itemPlural: 'Drinks',
    featuredSectionLabel: 'House favourites', popularSectionLabel: 'Most ordered',
    ctaLabel: 'See the drinks', curatedListTitle: 'This week behind the bar',
  },
  shops: {
    catalogLabel: 'Collection', itemSingular: 'Product', itemPlural: 'Products',
    featuredSectionLabel: 'Featured', popularSectionLabel: 'Best sellers',
    ctaLabel: 'Browse the collection', curatedListTitle: 'Our picks',
  },
  other: {
    catalogLabel: 'Menu', itemSingular: 'Item', itemPlural: 'Items',
    featuredSectionLabel: 'Featured', popularSectionLabel: 'Most popular',
    ctaLabel: 'See the menu', curatedListTitle: 'Our picks',
  },
};

const FAMILY_DEFAULT_ICON: Record<BusinessFamily, string> = {
  restaurants: 'plate-fork', 'quick-casual': 'burger', 'cafes-sweets': 'coffee',
  'bars-lounges': 'coupe', shops: 'shopping-bag', other: 'plate-fork',
};

/** Wine colour words, used only by wine-led types (see categoryIcons.ts). */
const WINE_RULES = [
  { match: ['reds', 'red wine', 'whites', 'white wine', 'rose', 'rosé', 'orange wine', 'dessert wine'], icon: 'wine-glass' },
  { match: ['by the bottle', 'bottles', 'cellar'], icon: 'wine-bottle' },
];

interface Input {
  id: string;
  family: BusinessFamily;
  label: string;
  description: string;
  sets: AttributeSetId[];
  terms?: Partial<BusinessTerms>;
  prices?: string[][];
  icons?: BusinessTypeDefinition['categoryIcons'];
  icon?: string;
  copy: [tagline: string, badge: string, marquee: string];
  layouts: [string, string, string];
  skins: [string, string, string];
  menu: string;
  badges?: BusinessTypeDefinition['badges'];
  alcohol?: 18 | 21;
}

function bt(i: Input): BusinessTypeDefinition {
  return {
    id: i.id,
    family: i.family,
    label: i.label,
    description: i.description,
    terms: { ...FAMILY_TERMS[i.family], ...i.terms },
    attributeSets: i.sets,
    priceOptionPresets: i.prices ?? [],
    categoryIcons: i.icons ?? [],
    defaultIcon: i.icon ?? FAMILY_DEFAULT_ICON[i.family],
    copy: { tagline: i.copy[0], badge: i.copy[1], marquee: i.copy[2] },
    recommended: { layouts: i.layouts, skins: i.skins, menuStructure: i.menu },
    badges: i.badges ?? [],
    ...(i.alcohol ? { alcohol: { ageNotice: i.alcohol } } : {}),
  };
}

const INDIAN_BADGES: BusinessTypeDefinition['badges'] = ['veg-marks', 'pure-veg', 'jain'];

export const BUSINESS_TYPES: readonly BusinessTypeDefinition[] = [
  // ------------------------------------------------------------ restaurants (17)
  bt({
    id: 'italian-trattoria', family: 'restaurants', label: 'Italian trattoria',
    description: 'Pasta, wood-fired plates and a wine list.', sets: ['food', 'wine'],
    terms: { curatedListTitle: 'From the nonna’s kitchen' }, prices: [['Glass', 'Bottle']], icons: WINE_RULES, icon: 'pasta',
    copy: ['Fresh pasta, slow sauces, good wine', 'Family recipes', 'Handmade pasta · Wood-fired · Wine by the glass'],
    layouts: ['atelier-editorial', 'grand-hall', 'magazine'], skins: ['farmhouse', 'broadsheet', 'royal-velvet'], menu: 'bill-of-fare',
  }),
  bt({
    id: 'pizzeria', family: 'restaurants', label: 'Pizzeria',
    description: 'Pizza by the pie or slice, with sides and drinks.', sets: ['food', 'beer'],
    terms: { itemSingular: 'Pizza', itemPlural: 'Pizzas', curatedListTitle: 'Pizza of the week' }, prices: [['Regular', 'Medium', 'Large']], icon: 'pizza',
    copy: ['Hot from the oven', 'Wood-fired', 'Fresh dough every morning'],
    layouts: ['ember', 'tabs', 'magazine'], skins: ['block-party', 'farmhouse', 'diner-print'], menu: 'grill-board',
  }),
  bt({
    id: 'sushi-bar', family: 'restaurants', label: 'Sushi bar',
    description: 'Nigiri, maki and omakase at the counter.', sets: ['food', 'japanese'],
    terms: { featuredSectionLabel: 'From the counter', curatedListTitle: "Chef's omakase" }, icon: 'sushi',
    copy: ['Cut to order, served at the counter', 'Omakase', 'Nigiri · Sashimi · Hand rolls'],
    layouts: ['tatami', 'horizontal-split', 'noir-salon'], skins: ['ivory-atelier', 'after-hours', 'fresh-grid'], menu: 'bento-box',
  }),
  bt({
    id: 'japanese', family: 'restaurants', label: 'Japanese',
    description: 'Ramen, izakaya plates and grilled skewers.', sets: ['food', 'japanese', 'spirits'],
    terms: { curatedListTitle: 'Izakaya specials' }, icon: 'ramen',
    copy: ['Slow broth, quick hands', 'Izakaya', 'Ramen · Yakitori · Sake'],
    layouts: ['tatami', 'horizontal-split', 'noir-salon'], skins: ['ivory-atelier', 'orbit', 'after-hours'], menu: 'bento-box',
  }),
  bt({
    id: 'chinese', family: 'restaurants', label: 'Chinese',
    description: 'Wok dishes, dim sum and noodles.', sets: ['food'],
    terms: { curatedListTitle: 'From the wok' }, icon: 'noodles',
    copy: ['Fire in the wok, flavour in every bite', 'Wok-fired', 'Dim sum · Noodles · Wok classics'],
    layouts: ['bazaar', 'ember', 'cards'], skins: ['royal-velvet', 'block-party', 'after-hours'], menu: 'market-stalls',
  }),
  bt({
    id: 'thai-pan-asian', family: 'restaurants', label: 'Thai and Pan-Asian',
    description: 'Curries, stir-fries and street-style bowls.', sets: ['food'],
    icon: 'curry',
    copy: ['Bright, hot and fragrant', 'Pan-Asian', 'Curries · Stir-fries · Bowls'],
    layouts: ['conservatory', 'bazaar', 'dashboard'], skins: ['glasshouse', 'block-party', 'fresh-grid'], menu: 'garden-cards',
  }),
  bt({
    id: 'north-indian', family: 'restaurants', label: 'North Indian',
    description: 'Tandoor, curries and breads.', sets: ['food'],
    terms: { curatedListTitle: 'From the tandoor' }, prices: [['Half', 'Full']], icon: 'curry', badges: INDIAN_BADGES,
    copy: ['Slow-cooked, tandoor-kissed', 'Tandoor kitchen', 'Tandoor · Curries · Fresh naan'],
    layouts: ['grand-hall', 'bazaar', 'split'], skins: ['royal-velvet', 'farmhouse', 'diner-print'], menu: 'bill-of-fare',
  }),
  bt({
    id: 'south-indian', family: 'restaurants', label: 'South Indian',
    description: 'Dosa, idli, meals and filter coffee.', sets: ['food', 'coffee'],
    terms: { curatedListTitle: 'Today’s meals' }, icon: 'dosa', badges: INDIAN_BADGES,
    copy: ['Crisp dosa, strong filter coffee', 'Pure veg', 'Dosa · Idli · Meals · Filter coffee'],
    layouts: ['conservatory', 'bazaar', 'sidebar-right'], skins: ['glasshouse', 'farmhouse', 'fresh-grid'], menu: 'garden-cards',
  }),
  bt({
    id: 'biryani-house', family: 'restaurants', label: 'Biryani house',
    description: 'Dum biryani by the plate or handi.', sets: ['food'],
    terms: { itemSingular: 'Biryani', itemPlural: 'Biryanis', curatedListTitle: 'Today’s handi' }, prices: [['Half', 'Full', 'Family']], icon: 'biryani', badges: ['veg-marks'],
    copy: ['Sealed, slow-cooked, served hot', 'Dum biryani', 'Dum biryani · Kebabs · Raita'],
    layouts: ['ember', 'grand-hall', 'bazaar'], skins: ['royal-velvet', 'farmhouse', 'diner-print'], menu: 'grill-board',
  }),
  bt({
    id: 'arabian-mandi', family: 'restaurants', label: 'Arabian mandi and grill',
    description: 'Mandi, kabsa and mixed grills, served to share.', sets: ['food', 'grill'],
    terms: { curatedListTitle: 'Platters to share' }, prices: [['Quarter', 'Half', 'Full']], icon: 'grill', badges: ['halal'],
    copy: ['Slow-smoked mandi, made to share', 'Halal', 'Mandi · Kabsa · Mixed grill'],
    layouts: ['grand-hall', 'bazaar', 'ember'], skins: ['royal-velvet', 'farmhouse', 'diner-print'], menu: 'market-stalls',
  }),
  bt({
    id: 'lebanese-mezze', family: 'restaurants', label: 'Lebanese and mezze',
    description: 'Mezze, grills and fresh breads.', sets: ['food', 'grill'],
    terms: { curatedListTitle: 'Mezze to share' }, icon: 'hummus', badges: ['halal'],
    copy: ['Mezze for the table', 'From Beirut', 'Hummus · Grills · Fresh bread'],
    layouts: ['bazaar', 'conservatory', 'grand-hall'], skins: ['glasshouse', 'farmhouse', 'royal-velvet'], menu: 'market-stalls',
  }),
  bt({
    id: 'turkish-grill', family: 'restaurants', label: 'Turkish grill',
    description: 'Kebabs, pide and charcoal grills.', sets: ['food', 'grill'],
    terms: { curatedListTitle: 'From the ocakbaşı' }, icon: 'kebab', badges: ['halal'],
    copy: ['Charcoal, smoke and fresh pide', 'Ocakbaşı grill', 'Kebabs · Pide · Meze'],
    layouts: ['ember', 'bazaar', 'grand-hall'], skins: ['farmhouse', 'diner-print', 'royal-velvet'], menu: 'grill-board',
  }),
  bt({
    id: 'mexican', family: 'restaurants', label: 'Mexican',
    description: 'Tacos, burritos and margaritas.', sets: ['food', 'beer', 'spirits'],
    terms: { curatedListTitle: 'Taco of the week' }, icon: 'taco', alcohol: 18,
    copy: ['Hand-pressed tortillas, every time', 'Taquería', 'Tacos · Burritos · Margaritas'],
    layouts: ['tabs', 'bazaar', 'midnight-diner'], skins: ['block-party', 'farmhouse', 'after-hours'], menu: 'market-stalls',
  }),
  bt({
    id: 'steakhouse', family: 'restaurants', label: 'Steakhouse',
    description: 'Prime cuts, sides and a serious wine list.', sets: ['food', 'grill', 'wine'],
    terms: { featuredSectionLabel: 'The cuts', curatedListTitle: 'From the dry-ager' }, prices: [['250g', '350g', '500g']], icons: WINE_RULES, icon: 'steak', alcohol: 18,
    copy: ['Aged, seared and rested', 'Prime cuts', 'Dry-aged · Charcoal grill · Fine wine'],
    layouts: ['noir-salon', 'supper-club', 'ember'], skins: ['after-hours', 'royal-velvet', 'ivory-atelier'], menu: 'grill-board',
  }),
  bt({
    id: 'seafood', family: 'restaurants', label: 'Seafood',
    description: 'The day’s catch, grilled, fried or raw.', sets: ['food', 'wine'],
    terms: { featuredSectionLabel: 'Today’s catch', curatedListTitle: 'Market fish' }, icons: WINE_RULES, icon: 'fish',
    copy: ['Today’s catch, simply cooked', 'Fresh from the boats', 'Grilled · Fried · Raw bar'],
    layouts: ['pier', 'atelier-editorial', 'horizontal-split'], skins: ['fresh-grid', 'ivory-atelier', 'orbit'], menu: 'catch-board',
  }),
  bt({
    id: 'burger-joint', family: 'restaurants', label: 'Burger joint',
    description: 'Smash burgers, fries and shakes.', sets: ['food', 'beer'],
    terms: { itemSingular: 'Burger', itemPlural: 'Burgers', curatedListTitle: 'Burger of the month' }, icon: 'burger',
    copy: ['Smashed, stacked, no shortcuts', 'Smash burgers', 'Burgers · Fries · Shakes'],
    layouts: ['midnight-diner', 'tabs', 'ember'], skins: ['block-party', 'diner-print', 'after-hours'], menu: 'jukebox',
  }),
  bt({
    id: 'fine-dining', family: 'restaurants', label: 'Fine dining',
    description: 'Tasting menus and a cellar list.', sets: ['food', 'wine'],
    terms: { catalogLabel: 'Menus', featuredSectionLabel: 'The tasting menu', curatedListTitle: 'Cellar selection' }, prices: [['Glass', 'Bottle']], icons: WINE_RULES, icon: 'plate-fork', alcohol: 18,
    copy: ['An evening, course by course', 'Tasting menu', 'Seasonal · Seven courses · Wine pairing'],
    layouts: ['grand-hall', 'supper-club', 'noir-salon'], skins: ['royal-velvet', 'ivory-atelier', 'after-hours'], menu: 'bill-of-fare',
  }),

  // ---------------------------------------------------------- quick and casual (4)
  bt({
    id: 'street-food', family: 'quick-casual', label: 'Street food and food truck',
    description: 'A short menu, cooked fast.', sets: ['food'],
    icon: 'samosa',
    copy: ['Fast, hot and full of flavour', 'Find the truck', 'Street food · Made to order'],
    layouts: ['tabs', 'compact', 'midnight-diner'], skins: ['block-party', 'arcade', 'diner-print'], menu: 'jukebox',
  }),
  bt({
    id: 'shawarma-wraps', family: 'quick-casual', label: 'Shawarma and wraps',
    description: 'Shawarma, wraps and plates.', sets: ['food'],
    icon: 'shawarma', badges: ['halal'],
    copy: ['Off the spit, into the wrap', 'Halal', 'Shawarma · Wraps · Plates'],
    layouts: ['tabs', 'ember', 'compact'], skins: ['block-party', 'farmhouse', 'diner-print'], menu: 'grill-board',
  }),
  bt({
    id: 'healthy-vegan', family: 'quick-casual', label: 'Healthy and vegan',
    description: 'Bowls, salads and plant-based plates.', sets: ['food'],
    terms: { curatedListTitle: 'Bowl of the week' }, icon: 'salad', badges: ['pure-veg'],
    copy: ['Plants, done properly', 'Plant-based', 'Bowls · Salads · Cold-pressed'],
    layouts: ['conservatory', 'horizontal-split', 'dashboard'], skins: ['glasshouse', 'fresh-grid', 'soft-clay'], menu: 'garden-cards',
  }),
  bt({
    id: 'fast-food', family: 'quick-casual', label: 'Fast food',
    description: 'Burgers, fried chicken and combos.', sets: ['food'],
    icon: 'fries',
    copy: ['Hot, quick and filling', 'Open late', 'Burgers · Chicken · Combos'],
    layouts: ['tabs', 'midnight-diner', 'compact'], skins: ['block-party', 'arcade', 'after-hours'], menu: 'jukebox',
  }),

  // ------------------------------------------------------------- cafés and sweets (6)
  bt({
    id: 'cafe', family: 'cafes-sweets', label: 'Café and coffee shop',
    description: 'Coffee, brunch and bakes.', sets: ['food', 'coffee', 'bakery'],
    terms: { curatedListTitle: 'On the counter today' }, prices: [['Small', 'Regular', 'Large']], icon: 'coffee',
    copy: ['Good coffee, slow mornings', 'Roasted in small batches', 'Coffee · Brunch · Fresh bakes'],
    layouts: ['sidebar-right', 'conservatory', 'atelier-editorial'], skins: ['farmhouse', 'ivory-atelier', 'soft-clay'], menu: 'garden-cards',
  }),
  bt({
    id: 'bakery-patisserie', family: 'cafes-sweets', label: 'Bakery and patisserie',
    description: 'Breads, viennoiserie and cakes.', sets: ['bakery', 'coffee'],
    terms: { featuredSectionLabel: 'From the oven', curatedListTitle: 'Baked this morning' }, icon: 'croissant',
    icons: [{ match: ['bread', 'loaf', 'sourdough', 'baguette'], icon: 'bread' }],
    copy: ['Baked before sunrise', 'Butter, flour, patience', 'Sourdough · Croissants · Cakes'],
    layouts: ['sidebar-right', 'atelier-editorial', 'conservatory'], skins: ['ivory-atelier', 'farmhouse', 'soft-clay'], menu: 'shop-shelf',
  }),
  bt({
    id: 'desserts-ice-cream', family: 'cafes-sweets', label: 'Desserts and ice cream',
    description: 'Ice cream, waffles and sweet plates.', sets: ['bakery', 'food'],
    terms: { curatedListTitle: 'Flavour of the week' }, prices: [['Single', 'Double', 'Triple']], icon: 'ice-cream',
    copy: ['Made fresh, scooped generously', 'Small batch', 'Gelato · Waffles · Sundaes'],
    layouts: ['tabs', 'sidebar-right', 'dashboard'], skins: ['soft-clay', 'block-party', 'arcade'], menu: 'garden-cards',
  }),
  bt({
    id: 'juice-bar', family: 'cafes-sweets', label: 'Juice and smoothie bar',
    description: 'Fresh juices, smoothies and bowls.', sets: ['food'],
    terms: { itemSingular: 'Drink', itemPlural: 'Drinks', curatedListTitle: 'Blend of the week' }, prices: [['Regular', 'Large']], icon: 'juice', badges: ['pure-veg'],
    copy: ['Pressed and blended to order', 'Fresh fruit only', 'Juices · Smoothies · Bowls'],
    layouts: ['conservatory', 'tabs', 'compact'], skins: ['glasshouse', 'block-party', 'soft-clay'], menu: 'garden-cards',
  }),
  bt({
    id: 'chai-tea-house', family: 'cafes-sweets', label: 'Chai and tea house',
    description: 'Chai, karak and snacks.', sets: ['coffee', 'bakery'],
    terms: { curatedListTitle: 'With your chai' }, prices: [['Cutting', 'Full']], icon: 'chai', badges: ['veg-marks'],
    copy: ['A strong cup, any time', 'Brewed on the stove', 'Chai · Karak · Snacks'],
    layouts: ['sidebar-right', 'bazaar', 'compact'], skins: ['farmhouse', 'diner-print', 'block-party'], menu: 'market-stalls',
  }),
  bt({
    id: 'indian-sweets', family: 'cafes-sweets', label: 'Indian sweet shop',
    description: 'Mithai, namkeen and gift boxes.', sets: ['bakery', 'hamper'],
    terms: { catalogLabel: 'Sweets', itemSingular: 'Sweet', itemPlural: 'Sweets', curatedListTitle: 'Festival boxes' }, prices: [['250g', '500g', '1kg']], icon: 'mithai-box', badges: INDIAN_BADGES,
    copy: ['Made in pure ghee, every day', 'Family recipes', 'Mithai · Namkeen · Gift boxes'],
    layouts: ['grand-hall', 'bazaar', 'split'], skins: ['royal-velvet', 'farmhouse', 'diner-print'], menu: 'shop-shelf',
  }),

  // ------------------------------------------------------------- bars and lounges (5)
  bt({
    id: 'pub', family: 'bars-lounges', label: 'Pub',
    description: 'Beer on tap, pub food and sport on the screens.', sets: ['beer', 'spirits', 'wine', 'food'],
    terms: { featuredSectionLabel: 'On tap', curatedListTitle: 'On tap this week' }, prices: [['Half', 'Pint']], icons: WINE_RULES, icon: 'pint', alcohol: 18,
    copy: ['Cold pints, warm welcome', 'Your local', 'On tap · Pub grub · Live sport'],
    layouts: ['midnight-diner', 'cards', 'ember'], skins: ['diner-print', 'after-hours', 'farmhouse'], menu: 'drinks-list',
  }),
  bt({
    id: 'cocktail-bar', family: 'bars-lounges', label: 'Cocktail bar',
    description: 'Signature cocktails and classics.', sets: ['spirits', 'wine', 'food'],
    terms: { featuredSectionLabel: 'Signature cocktails', curatedListTitle: 'New on the list' }, prices: [['Single', 'Double']], icons: WINE_RULES, icon: 'coupe', alcohol: 18,
    copy: ['Stirred, shaken, never rushed', 'Signature cocktails', 'Signatures · Classics · Zero-proof'],
    layouts: ['noir-salon', 'supper-club', 'midnight-diner'], skins: ['after-hours', 'royal-velvet', 'orbit'], menu: 'drinks-list',
  }),
  bt({
    id: 'wine-bar', family: 'bars-lounges', label: 'Wine bar',
    description: 'Wines by the glass, cheese and small plates.', sets: ['wine', 'cheese', 'food'],
    terms: { featuredSectionLabel: 'By the glass', curatedListTitle: 'Sommelier picks' }, prices: [['Glass', 'Bottle'], ['125ml', '175ml', '250ml']], icons: WINE_RULES, icon: 'wine-glass', alcohol: 18,
    copy: ['A glass, a plate, good company', 'Natural and classic wines', 'By the glass · Cheese · Small plates'],
    layouts: ['atelier-editorial', 'supper-club', 'noir-salon'], skins: ['ivory-atelier', 'royal-velvet', 'broadsheet'], menu: 'drinks-list',
  }),
  bt({
    id: 'brewery-taproom', family: 'bars-lounges', label: 'Brewery and taproom',
    description: 'House beers on tap and food from the kitchen.', sets: ['beer', 'food'],
    terms: { featuredSectionLabel: 'Brewed here', curatedListTitle: 'Fresh from the tanks' }, prices: [['Taster', 'Half', 'Pint']], icon: 'draught-tap', alcohol: 18,
    copy: ['Brewed here, poured fresh', 'Taproom', 'House beers · Guest taps · Kitchen'],
    layouts: ['ember', 'cards', 'midnight-diner'], skins: ['diner-print', 'farmhouse', 'after-hours'], menu: 'drinks-list',
  }),
  bt({
    id: 'shisha-lounge', family: 'bars-lounges', label: 'Shisha lounge',
    description: 'Shisha, mocktails and late-night bites.', sets: ['shisha', 'coffee', 'food'],
    terms: { itemSingular: 'Item', itemPlural: 'Items', featuredSectionLabel: 'House blends', curatedListTitle: 'Flavour of the week' }, icon: 'shisha', alcohol: 18,
    copy: ['Slow evenings, good company', 'Open late', 'Shisha · Mocktails · Late bites'],
    layouts: ['noir-salon', 'bazaar', 'midnight-diner'], skins: ['after-hours', 'royal-velvet', 'orbit'], menu: 'drinks-list',
  }),

  // ------------------------------------------------------------------- shops (4)
  bt({
    id: 'wine-shop', family: 'shops', label: 'Wine and liquor shop',
    description: 'Wines, spirits and beers to take home.', sets: ['wine', 'spirits', 'beer', 'product'],
    terms: { itemSingular: 'Bottle', itemPlural: 'Bottles', featuredSectionLabel: 'In the cellar', curatedListTitle: 'Staff picks' }, icons: WINE_RULES, icon: 'wine-bottle', alcohol: 18,
    copy: ['Bottles worth opening', 'Hand-picked cellar', 'Wine · Spirits · Craft beer'],
    layouts: ['atelier-editorial', 'supper-club', 'horizontal-split'], skins: ['ivory-atelier', 'royal-velvet', 'broadsheet'], menu: 'shop-shelf',
  }),
  bt({
    id: 'cheese-deli', family: 'shops', label: 'Cheese and deli',
    description: 'Cheeses, charcuterie and pantry goods.', sets: ['cheese', 'product', 'wine'],
    terms: { featuredSectionLabel: 'On the counter', curatedListTitle: 'Cheese of the month' }, prices: [['100g', '250g', '500g']], icon: 'cheese-wedge',
    copy: ['Cut to order at the counter', 'Aged and cured', 'Cheese · Charcuterie · Pantry'],
    layouts: ['atelier-editorial', 'sidebar-right', 'conservatory'], skins: ['farmhouse', 'ivory-atelier', 'broadsheet'], menu: 'shop-shelf',
  }),
  bt({
    id: 'chocolatier', family: 'shops', label: 'Chocolatier',
    description: 'Bonbons, bars and gift boxes.', sets: ['bakery', 'product', 'hamper'],
    terms: { featuredSectionLabel: 'The collection', curatedListTitle: 'Seasonal collection' }, prices: [['Box of 4', 'Box of 9', 'Box of 16']], icon: 'chocolate',
    copy: ['Made by hand, bean to bar', 'Handmade', 'Bonbons · Bars · Gift boxes'],
    layouts: ['grand-hall', 'atelier-editorial', 'supper-club'], skins: ['royal-velvet', 'ivory-atelier', 'soft-clay'], menu: 'shop-shelf',
  }),
  bt({
    id: 'gourmet-hampers', family: 'shops', label: 'Gourmet and gift hampers',
    description: 'Curated hampers and gourmet gifts.', sets: ['hamper', 'product'],
    terms: { itemSingular: 'Hamper', itemPlural: 'Hampers', featuredSectionLabel: 'Signature hampers', curatedListTitle: 'For the season' }, icon: 'hamper',
    copy: ['Gifts that get opened first', 'Curated by hand', 'Hampers · Gourmet gifts · Corporate'],
    layouts: ['grand-hall', 'atelier-editorial', 'bazaar'], skins: ['royal-velvet', 'ivory-atelier', 'farmhouse'], menu: 'shop-shelf',
  }),

  // ------------------------------------------------------------------- other (1)
  bt({
    id: 'generic', family: 'other', label: 'Something else',
    description: 'A general look that suits any business.', sets: ['food'],
    copy: ['', '', ''],
    layouts: ['horizontal-split', 'atelier-editorial', 'compact'], skins: ['fresh-grid', 'ivory-atelier', 'broadsheet'], menu: 'list',
  }),
];
