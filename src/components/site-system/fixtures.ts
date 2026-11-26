import type { RawPublicSiteData } from '@/types/public/templates/rawPublicSiteData.types';
import type { Menu } from '@/types';

/**
 * Sample guest-site payloads for the content-contract tests
 * (docs/site-system/PLAN.md §3, step 4): every layout must show every value
 * in FULL and must not leave empty blocks for SPARSE. The business-type
 * fixtures exercise attribute sets and price options.
 *
 * Images are data-free placeholders so tests never touch the network.
 */

const IMG = (n: number) => `https://example.test/photo-${n}.jpg`;

type Item = Omit<Menu, 'image_url'> & { image_url: string | null };

function item(id: number, name: string, category: string, price: string, extra: Partial<Item> = {}): Item {
  return {
    id: String(id), item: name, description: `${name}, made to order.`, price, category, type: 'Veg',
    popular: false, availability: true, image_url: IMG(id), images: [], videos: [],
    dietaryTags: [], allergens: [], spiceLevel: null, calories: null, attributes: {}, priceOptions: [],
    ...extra,
  };
}

function base(businessName: string, settings: Record<string, unknown>, menuItems: Item[]): RawPublicSiteData {
  return {
    user_id: '1',
    settings: { id: '1', public_slug: 'fixture', landing_theme: 'serif-elegance', menu_theme: 'serif-elegance', timezone: 'Asia/Kolkata', ...settings },
    business: { business_name: businessName },
    payment: null,
    review: null,
    gallery: [],
    offers: [],
    menuItems: menuItems as unknown as Menu[],
    faqs: [],
    googleReviews: [],
    currency: { code: 'INR', symbol: '₹' },
    awards: [],
    team: [],
    events: [],
  };
}

/** Every field an owner can fill, filled. Distinct strings so tests can look each one up. */
export const FULL_SITE: RawPublicSiteData = {
  ...base(
    'Fixture Royal Kitchen',
    {
      hero_tagline: 'Fixture tagline: a royal table',
      theme_badge: 'Fixture badge',
      theme_marquee: 'Fixture marquee words',
      announcement_enabled: 1,
      announcement_text: 'Fixture announcement',
      story_headline: 'Fixture story headline',
      story_body: 'Fixture story body about the kitchen.',
      stats: [{ label: 'Fixture stat label', value: '1987' }],
      menubtn_status: 1,
      paybtn_status: 1,
      reviewbtn_status: 1,
      logo_url: IMG(100),
      banner_url: IMG(101),
      amenities: [{ id: 'wifi' }, { id: 'parking', note: 'Fixture parking note' }],
      business_type: 'north-indian',
    },
    [
      item(1, 'Fixture Butter Chicken', 'Curries', '420.00', { popular: true, type: 'Non-Veg', spiceLevel: 2, allergens: ['milk'] }),
      item(2, 'Fixture Garlic Naan', 'Breads', '80.00', { popular: true }),
      item(3, 'Fixture Dal Makhani', 'Curries', '320.00', { dietaryTags: ['vegetarian'] }),
      item(4, 'Fixture Chicken Biryani', 'Biryani', '380.00', { priceOptions: [{ label: 'Half', price: '380.00' }, { label: 'Full', price: '620.00' }] }),
    ],
  ),
  business: {
    business_name: 'Fixture Royal Kitchen',
    phone: '+91 90000 00001',
    email: 'fixture@example.test',
    whatsapp_number: '+91 90000 00002',
    address: 'Fixture Street 12, Fixture City',
    location_url: 'https://maps.example.test/fixture',
    website_url: 'https://fixture.example.test',
    business_hours: 'Mon–Sun 12:00–23:00',
    availability: [
      { day: 'Monday', startTime: '12:00', endTime: '23:00' },
      { day: 'Tuesday' },
      { day: 'Saturday', startTime: '11:00', endTime: '23:59' },
    ],
    social_links: [{ platform: 'instagram', url: 'https://instagram.com/fixture' }],
    industry_group: 'food_beverage',
  },
  payment: { payment_type: 'url', payment_link: 'https://pay.example.test/fixture' },
  review: { review_link: 'https://review.example.test/fixture' },
  gallery: [{ id: '1', image_url: IMG(201) }, { id: '2', image_url: IMG(202) }, { id: '3', image_url: IMG(203) }, { id: '4', image_url: IMG(204) }],
  offers: [{ id: '1', title: 'Fixture offer title', description: 'Fixture offer description', offer_value: '20%', image_url: IMG(301) }],
  faqs: [{ id: '1', question: 'Fixture question?', answer: 'Fixture answer.' }],
  googleReviews: [{ id: '1', authorName: 'Fixture Reviewer', authorPhotoUrl: null, rating: 5, text: 'Fixture review text.', relativePublishDescription: 'a week ago' }],
  awards: [{ id: '1', title: 'Fixture award title', publisher: 'Fixture publisher', year: 2025, url: null, logoUrl: null }],
  team: [{ id: '1', name: 'Fixture Chef Name', role: 'Fixture head chef', bio: 'Fixture chef bio.', photoUrl: IMG(401) }],
  events: [{ id: '1', title: 'Fixture event title', description: 'Fixture event description.', startsAt: '2099-01-01T19:00:00.000Z', endsAt: null, imageUrl: null, linkUrl: null }],
};

/** Only a name. Layouts must render no empty boxes and a footer with content. */
export const SPARSE_SITE: RawPublicSiteData = base('Fixture Sparse Cafe', {}, []);

export const PUB_SITE = base('Fixture Pub', { business_type: 'pub' }, [
  item(1, 'Fixture House Lager', 'On tap', '220.00', {
    attributes: { beer: { style: 'Lager', abv: 4.8, serve: 'tap' } },
    priceOptions: [{ label: 'Half', price: '220.00' }, { label: 'Pint', price: '380.00' }],
  }),
  item(2, 'Fixture Fish and Chips', 'Pub grub', '520.00', { type: 'Non-Veg' }),
]);

export const WINE_SHOP_SITE = base('Fixture Cellar', { business_type: 'wine-shop' }, [
  item(1, 'Fixture Barolo 2018', 'Reds', '6400.00', {
    attributes: { wine: { colour: 'red', grape: 'Nebbiolo', region: 'Piedmont', vintage: 2018, abv: 14 }, product: { inStock: true } },
  }),
]);

export const CHEESE_DELI_SITE = base('Fixture Deli', { business_type: 'cheese-deli' }, [
  item(1, 'Fixture Aged Comté', 'Hard cheese', '450.00', {
    attributes: { cheese: { milk: 'cow', texture: 'hard', age: '24 months', origin: 'Jura' } },
    priceOptions: [{ label: '100g', price: '450.00' }, { label: '250g', price: '1050.00' }],
  }),
]);

const SUSHI_BAR_SITE = base('Fixture Sushi', { business_type: 'sushi-bar' }, [
  item(1, 'Fixture Salmon Nigiri', 'Nigiri', '360.00', { type: 'Non-Veg', attributes: { japanese: { pieces: 2, preparation: 'raw', fish: 'Salmon' } } }),
]);

export const CAFE_SITE = base('Fixture Cafe', { business_type: 'cafe' }, [
  item(1, 'Fixture Flat White', 'Coffee', '220.00', {
    attributes: { coffee: { origin: 'Chikmagalur', roast: 'medium' } },
    priceOptions: [{ label: 'Small', price: '220.00' }, { label: 'Regular', price: '260.00' }],
  }),
  item(2, 'Fixture Croissant', 'Bakes', '180.00', { attributes: { bakery: { freshDaily: true } } }),
]);

export const BUSINESS_FIXTURES = { pub: PUB_SITE, 'wine-shop': WINE_SHOP_SITE, 'cheese-deli': CHEESE_DELI_SITE, 'sushi-bar': SUSHI_BAR_SITE, cafe: CAFE_SITE } as const;
