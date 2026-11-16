import type { BusinessTypeDefinition } from '../types';

/**
 * Menu category name → icon (docs/site-system/PLAN.md §2.7).
 *
 * Categories are free text, so they are matched by keyword in English, Hindi
 * and Arabic. Order matters: specific rules come before general ones
 * ("ice cream" before "cream", "sparkling" before "wine", "mithai" before
 * "sweet"). A business type's own rules are checked first, then this table,
 * then the type's default icon. An owner's explicit choice for a category
 * (stored in the site document) always wins and is applied by the caller.
 */
export type CategoryIconRule = { match: string[]; icon: string };

export const GENERIC_CATEGORY_ICONS: readonly CategoryIconRule[] = [
  // drinks first: "wine pairing", "beer battered" are rare; "drinks" categories are common
  { match: ['sparkling', 'champagne', 'prosecco', 'cava', 'bubbly'], icon: 'flute' },
  { match: ['martini'], icon: 'martini' },
  { match: ['mocktail', 'virgin', 'lemonade', 'mojito', 'cooler', 'मॉकटेल', 'موهيتو'], icon: 'highball' },
  { match: ['cocktail', 'कॉकटेल', 'كوكتيل'], icon: 'coupe' },
  { match: ['whisky', 'whiskey', 'scotch', 'bourbon', 'व्हिस्की'], icon: 'tumbler' },
  { match: ['gin'], icon: 'balloon' },
  { match: ['shot', 'shooter'], icon: 'shot' },
  { match: ['spirit', 'rum', 'vodka', 'tequila', 'liquor', 'liqueur', 'brandy', 'cognac'], icon: 'spirits-bottle' },
  { match: ['draught', 'draft', 'on tap', 'tap'], icon: 'draught-tap' },
  { match: ['bottled beer', 'bottle beer', 'craft beer'], icon: 'beer-bottle' },
  { match: ['beer', 'ale', 'lager', 'stout', 'ipa', 'pilsner', 'cider', 'बीयर', 'بيرة'], icon: 'pint' },
  // Colour words ("reds", "whites", "rosé") live in the wine business types only:
  // generically "Red curry" or "Rose milk" must not become wine.
  { match: ['wine', 'vino', 'वाइन', 'نبيذ'], icon: 'wine-glass' },
  { match: ['sake'], icon: 'sake' },
  { match: ['shisha', 'hookah', 'sheesha', 'nargile', 'शीशा', 'شيشة', 'أرجيلة'], icon: 'shisha' },
  { match: ['chai', 'masala tea', 'karak', 'चाय', 'كرك'], icon: 'chai' },
  { match: ['tea', 'चाय', 'شاي'], icon: 'teapot' },
  { match: ['latte', 'takeaway', 'to go'], icon: 'takeaway-cup' },
  { match: ['coffee', 'espresso', 'cappuccino', 'americano', 'filter coffee', 'कॉफी', 'कॉफ़ी', 'قهوة'], icon: 'coffee' },
  { match: ['smoothie', 'shake', 'milkshake', 'lassi', 'frappe', 'लस्सी', 'शेक', 'ميلك شيك'], icon: 'smoothie' },
  { match: ['juice', 'fresh press', 'जूस', 'عصير'], icon: 'juice' },
  { match: ['soft drink', 'soda', 'cola', 'beverage', 'drinks', 'drink', 'पेय', 'مشروبات'], icon: 'can' },

  // shop
  { match: ['cheese board', 'charcuterie', 'salami', 'cured', 'deli', 'cold cuts'], icon: 'charcuterie' },
  { match: ['aged cheese', 'wheel'], icon: 'cheese-wheel' },
  { match: ['cheese', 'fromage', 'queso', 'جبن'], icon: 'cheese-wedge' },
  { match: ['chocolate', 'cacao', 'cocoa', 'praline', 'truffle', 'bonbon', 'चॉकलेट', 'شوكولاتة'], icon: 'chocolate' },
  { match: ['mithai', 'barfi', 'burfi', 'ladoo', 'laddu', 'halwa', 'peda', 'rasgulla', 'gulab jamun', 'मिठाई', 'लड्डू', 'बर्फी'], icon: 'mithai-box' },
  { match: ['hamper', 'basket', 'gift box', 'gift set', 'हैम्पर'], icon: 'hamper' },
  { match: ['gift', 'उपहार', 'هدية'], icon: 'gift-box' },
  { match: ['jam', 'preserve', 'honey', 'pickle', 'achaar', 'chutney', 'अचार', 'عسل'], icon: 'jar' },
  { match: ['olive oil', 'oil', 'olives', 'زيت'], icon: 'olive-oil' },
  { match: ['dates', 'tamr', 'खजूर', 'تمر'], icon: 'dates' },
  { match: ['spice', 'masala blend', 'मसाले', 'بهارات'], icon: 'mortar' },

  // food — specific dishes first
  { match: ['ice cream', 'gelato', 'kulfi', 'sundae', 'sorbet', 'आइसक्रीम', 'कुल्फी', 'آيس كريم', 'بوظة'], icon: 'ice-cream' },
  { match: ['cupcake', 'muffin'], icon: 'cupcake' },
  { match: ['cake', 'pastry', 'pastries', 'gateau', 'cheesecake', 'केक', 'كيك', 'كعك'], icon: 'cake-slice' },
  { match: ['pie', 'tart', 'quiche'], icon: 'pie' },
  { match: ['croissant', 'viennoiserie'], icon: 'croissant' },
  { match: ['waffle'], icon: 'waffle' },
  { match: ['pancake', 'crepe', 'crêpe', 'फीला'], icon: 'pancakes' },
  { match: ['breakfast', 'brunch', 'eggs', 'नाश्ता', 'فطور', 'إفطار'], icon: 'breakfast' },
  // "Breads" on a restaurant menu means flatbreads (naan rule); bakeries map it to the loaf themselves.
  { match: ['loaf', 'sourdough', 'bakery', 'बेकरी', 'مخبز'], icon: 'bread' },
  { match: ['biryani', 'biriyani', 'pulao', 'pilaf', 'बिरयानी', 'برياني', 'كبسة', 'kabsa'], icon: 'biryani' },
  { match: ['thali', 'meals', 'थाली'], icon: 'thali' },
  { match: ['dosa', 'uttapam', 'idli', 'vada', 'डोसा', 'इडली'], icon: 'dosa' },
  { match: ['naan', 'roti', 'paratha', 'kulcha', 'chapati', 'pita', 'bread', 'नान', 'रोटी', 'पराठा', 'خبز'], icon: 'naan' },
  { match: ['samosa', 'pakora', 'bhaji', 'fritter', 'समोसा', 'पकौड़ा', 'سمبوسة'], icon: 'samosa' },
  { match: ['shawarma', 'doner', 'döner', 'gyro', 'शवरमा', 'شاورما'], icon: 'shawarma' },
  { match: ['kebab', 'kabab', 'tikka', 'seekh', 'shish', 'skewer', 'कबाब', 'कबाब', 'كباب', 'تكا'], icon: 'kebab' },
  { match: ['mandi', 'grill', 'bbq', 'barbecue', 'tandoor', 'mixed grill', 'तंदूर', 'مندي', 'مشويات', 'مشاوي'], icon: 'grill' },
  { match: ['steak', 'ribeye', 'sirloin', 'tenderloin', 'wagyu', 'ستيك'], icon: 'steak' },
  { match: ['chicken', 'wings', 'poultry', 'चिकन', 'دجاج'], icon: 'drumstick' },
  { match: ['prawn', 'shrimp', 'lobster', 'crab', 'jhinga', 'झींगा', 'روبيان', 'جمبري'], icon: 'crustaceans' },
  { match: ['nigiri', 'sashimi'], icon: 'nigiri' },
  { match: ['sushi', 'maki', 'uramaki', 'temaki', 'roll set'], icon: 'sushi' },
  { match: ['ramen', 'udon', 'soba', 'pho'], icon: 'ramen' },
  { match: ['bento'], icon: 'bento' },
  { match: ['dumpling', 'momo', 'dim sum', 'gyoza', 'bao', 'मोमो'], icon: 'dumplings' },
  { match: ['noodle', 'chow mein', 'hakka', 'pad thai', 'नूडल्स', 'نودلز'], icon: 'noodles' },
  { match: ['fish', 'seafood', 'catch', 'मछली', 'سمك', 'بحري', 'مأكولات بحرية'], icon: 'fish' },
  { match: ['taco', 'nacho', 'quesadilla', 'burrito'], icon: 'taco' },
  { match: ['pizza', 'पिज़्ज़ा', 'पिज्जा', 'بيتزا'], icon: 'pizza' },
  { match: ['pasta', 'spaghetti', 'penne', 'linguine', 'risotto', 'lasagne', 'lasagna', 'पास्ता', 'باستا'], icon: 'pasta' },
  { match: ['burger', 'बर्गर', 'برجر', 'برغر'], icon: 'burger' },
  { match: ['hot dog', 'hotdog'], icon: 'hotdog' },
  { match: ['fries', 'sides', 'side', 'चिप्स', 'بطاطس'], icon: 'fries' },
  { match: ['sandwich', 'sub', 'toastie', 'panini', 'सैंडविच', 'ساندويتش', 'سندويش'], icon: 'sandwich' },
  { match: ['wrap', 'roll', 'kathi', 'frankie', 'रोल', 'رول', 'لفائف'], icon: 'wrap' },
  { match: ['hummus', 'mezze', 'meze', 'dip', 'dips', 'حمص', 'مزة'], icon: 'hummus' },
  { match: ['curry', 'gravy', 'masala', 'korma', 'करी', 'كاري'], icon: 'curry' },
  { match: ['rice', 'fried rice', 'चावल', 'أرز', 'رز'], icon: 'rice-bowl' },
  { match: ['soup', 'shorba', 'broth', 'सूप', 'शोरबा', 'شوربة'], icon: 'soup' },
  { match: ['salad', 'सलाद', 'سلطة', 'سلطات'], icon: 'salad' },
  { match: ['kids', 'children', 'junior', 'बच्चों', 'أطفال'], icon: 'lollipop' },
  { match: ['dessert', 'sweet', 'मिठाई', 'मीठा', 'حلويات', 'حلى'], icon: 'cupcake' },
  { match: ['starter', 'appetizer', 'appetiser', 'small plate', 'snack', 'chaat', 'tapas', 'स्टार्टर', 'मुकबलात', 'مقبلات'], icon: 'plate-fork' },
  { match: ['main', 'mains', 'entree', 'entrée', 'मुख्य', 'أطباق رئيسية'], icon: 'plate-fork' },
];

const LATIN = /^[\p{Script=Latin}\d\s'’&-]+$/u;

/** Lowercase, accents removed, Arabic diacritics removed, spaces collapsed. */
export function normaliseCategory(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ْٰـ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Latin keywords match whole words (an optional plural "s"/"es"); other scripts match anywhere. */
function matches(name: string, keyword: string): boolean {
  const k = normaliseCategory(keyword);
  if (!k) return false;
  if (LATIN.test(k)) return new RegExp(`(^|[^\\p{L}])${escapeRe(k)}(e?s)?($|[^\\p{L}])`, 'u').test(name);
  return name.includes(k);
}

function firstMatch(rules: readonly CategoryIconRule[], name: string): string | null {
  for (const rule of rules) if (rule.match.some((k) => matches(name, k))) return rule.icon;
  return null;
}

/** The icon for a menu category in a business type: type rules → generic table → type default. */
/**
 * The icon guests see for a category: the owner's choice (from the Sections
 * panel) when there is one, else keyword matching for the business type.
 */
export function iconForCategory(
  category: string,
  look: { business: Pick<BusinessTypeDefinition, 'categoryIcons' | 'defaultIcon'>; categoryIcons?: Readonly<Record<string, string>> },
): string {
  return look.categoryIcons?.[category.trim().toLowerCase()] || categoryIcon(category, look.business);
}

export function categoryIcon(category: string, business: Pick<BusinessTypeDefinition, 'categoryIcons' | 'defaultIcon'>): string {
  const name = normaliseCategory(category);
  if (!name) return business.defaultIcon;
  return firstMatch(business.categoryIcons, name) ?? firstMatch(GENERIC_CATEGORY_ICONS, name) ?? business.defaultIcon;
}
