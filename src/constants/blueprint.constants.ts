import type { MenuBlueprint, BlueprintContent } from '@/services/superadmin.service';

export const DEFAULT_BLUEPRINT_TEMPLATE_SLUG = 'harvest-bento';

export const EMPTY_BLUEPRINT_CONTENT: BlueprintContent = {
  amenities: [],
  awards: [],
  team: [],
  events: [],
};

export const DEFAULT_NEW_BLUEPRINT: MenuBlueprint = {
  id: '',
  name: '',
  tagline: '',
  categoryNames: ['Starters', 'Mains', 'Desserts', 'Beverages'],
  icon: 'utensils',
  badge: 'Custom',
  isCustom: true,
  site: { businessType: '', layout: '', skinId: '' },
  content: { amenities: [], awards: [], team: [], events: [] },
  theme: {
    landingTheme: DEFAULT_BLUEPRINT_TEMPLATE_SLUG,
    menuTheme: 'modern-compact',
    landingStructure: 'split',
    menuStructure: 'accordion',
    primaryColor: '#0F766E',
    secondaryColor: '#FFFFFF',
    accentColor: '#F8FAFC',
    textPrimaryColor: '#0F172A',
    textSecondaryColor: '#475569',
    accentTextColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    footerBgColor: '#0F172A',
    sectionBgColor: '#F1F5F9',
    fontFamily: '"Plus Jakarta Sans","Inter",sans-serif',
    cardStyle: 'rounded-2xl shadow-sm border',
    heroOverlay: 'linear-gradient(to bottom, rgba(15,23,42,0.6), rgba(15,118,110,0.4))',
    themeBadge: '★ Handcrafted Cuisine ★',
    themeMarquee: 'Locally Sourced · Fresh Daily · Artisanal Recipes',
    heroTagline: 'Exceptional dining crafted with heart and passion',
    announcementText: 'Welcome! Explore our seasonal favorites today.',
    announcementEnabled: true,
    bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1400&h=600',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=300&h=300',
  },
  story: {
    headline: 'Our Passion for Flavour',
    body: 'Born from a love of culinary excellence, every plate is prepared with fresh local ingredients and timeless kitchen craft.',
    stats: [
      { label: 'Years of Craft', value: '5+' },
      { label: 'Signature Dishes', value: '24' },
      { label: 'Happy Guests', value: '50k+' },
      { label: 'Guest Rating', value: '4.9★' },
    ],
  },
  business: {
    businessHours: 'Mon–Sun: 11:00 AM – 10:00 PM',
    availability: [
      { day: 'Monday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Tuesday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Wednesday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Thursday', startTime: '11:00 AM', endTime: '10:00 PM' },
      { day: 'Friday', startTime: '11:00 AM', endTime: '11:00 PM' },
      { day: 'Saturday', startTime: '10:00 AM', endTime: '11:00 PM' },
      { day: 'Sunday', startTime: '10:00 AM', endTime: '10:00 PM' },
    ],
  },
  items: [
    {
      item: 'Chef Signature Dish',
      price: '18.50',
      description: 'Slow-braised with organic herbs and served with seasonal garden vegetables.',
      category: 'Mains',
      type: 'Food',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500&h=350',
      popular: true,
      dietaryTags: ['Chef Special'],
      allergens: [],
      spiceLevel: 0,
      calories: 580,
    },
  ],
  offers: [
    {
      title: 'Welcome Special',
      description: 'Enjoy 15% off your entire first table order when ordering online.',
      discount: '15% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400&h=250',
      badgeText: '15% OFF',
    },
  ],
  gallery: [
    { imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800&h=800' },
    { imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800&h=800' },
    { imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800&h=800' },
    { imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800&h=800' },
  ],
  faqs: [
    { question: 'Do you take table reservations?', answer: 'Yes, reservations can be placed via phone or our online reservation portal.' },
    { question: 'Are vegetarian and vegan options available?', answer: 'Yes! We offer a variety of vegetarian, vegan, and gluten-sensitive selections.' },
  ],
};
