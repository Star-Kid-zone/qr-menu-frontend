import { PiNotebookBold, PiImagesBold, PiVideoCameraBold } from 'react-icons/pi';

export const SAMPLE_DECODER_CONTEXTS = [
  {
    title: '🍛 South Indian Festival',
    text: 'South Indian festival offer poster. Extract bold Tamil typography (Noto Sans Tamil) and English subtitles, festival discount badge (FLAT 25% OFF), and authentic banana leaf meal presentation.',
  },
  {
    title: '🍗 Weekend Biryani Special',
    text: 'Weekend Biryani special flyer. Focus on rich royal color palette (dark brown, amber/gold), prominent price badge (₹299), Dum cooking tagline, and weekend limited-time offer sticker.',
  },
  {
    title: '🍷 Luxury Fine Dining',
    text: 'Modern fine-dining chef special menu card. Minimalist aesthetic, high-contrast Playfair Display serif fonts, muted gold accents, and multi-course tasting menu layout.',
  },
  {
    title: '🍔 Fast Food Combo',
    text: 'High-energy fast-food combo promotion. Punchy condensed display typography (Bebas Neue/Anton), bright yellow/crimson palette, Buy 1 Get 1 Free sticker, and QR order badge.',
  },
  {
    title: '☕ Cafe & Desserts',
    text: 'Cozy cafe and artisanal dessert promo. Casual script font highlights (Caveat/Pacifico), pastel background, happy hour timings (4 PM - 7 PM), and signature beverage spotlight.',
  },
  {
    title: '🌙 Midnight Delivery Deal',
    text: 'Late-night delivery promotional banner. Dark neon theme with electric violet/cyan accents, bold discount code tag (LATEBITE), and fast 30-min delivery guarantee line.',
  },
] as const;

export const AUTOMATION_SCRIPTS = [
  {
    id: 'chatgpt-attach.js',
    name: 'ChatGPT (GPT-4o / DALL-E 3)',
    host: 'chatgpt.com',
    desc: 'High realism, prompt fidelity & appetizing food lighting',
    badge: 'OpenAI',
  },
  {
    id: 'ideogram-attach.js',
    name: 'Ideogram AI (Poster Typography)',
    host: 'ideogram.ai',
    desc: 'World-class restaurant lettering, offers & typography hierarchy',
    badge: 'Typography',
  },
  {
    id: 'gemini-attach.js',
    name: 'Google Gemini Web App',
    host: 'gemini.google.com',
    desc: 'Fast generation with crisp food details and authentic plating',
    badge: 'Google',
  },
  {
    id: 'leonardo-attach.js',
    name: 'Leonardo AI',
    host: 'leonardo.ai',
    desc: 'Artistic culinary atmosphere & cinematic food photography',
    badge: 'Artistic',
  },
  {
    id: 'meta-attach.js',
    name: 'Meta Imagine AI',
    host: 'imagine.meta.com',
    desc: 'Instant vibrant social media graphic styles & bold colors',
    badge: 'Meta',
  },
  {
    id: 'bing-attach.js',
    name: 'Bing / Copilot Designer',
    host: 'copilot.microsoft.com',
    desc: 'Photorealistic food textures & authentic bokeh depth of field',
    badge: 'Microsoft',
  },
] as const;

export const PRESET_IMAGE_PROMPTS = [
  'Hyperrealistic Hyderabadi Dum Biryani in traditional clay pot with fresh mint garnish, warm ambient lighting, 4k food photography',
  'Artisanal Italian sourdough pizza with bubbling mozzarella, fresh basil and charred crust on rustic wooden board',
  'South Indian crispy masala dosa served with trio of colorful chutneys and hot sambar in brass bowls, steam rising',
  'Decadent chocolate lava cake with molten center, vanilla bean ice cream scoop and raspberry coulis drip, luxury restaurant',
  'Vibrant fresh sushi platter with salmon nigiri and spicy tuna rolls, slate board, minimalist modern aesthetic',
] as const;

export const MEDIA_TYPE_TABS = [
  { id: 'all', label: 'All Prompts' },
  { id: 'image', label: 'Photo Prompts', icon: PiImagesBold },
  { id: 'video', label: 'Reel Prompts', icon: PiVideoCameraBold },
  { id: 'poster', label: 'Poster Prompts', icon: PiNotebookBold },
];

export const PRESET_CATEGORIES = [
  'Biryani & Rice',
  'South Indian & Breakfast',
  'Tandoor & Grills',
  'Burgers & Fast Food',
  'Pizza & Italian',
  'Desserts & Bakery',
  'Beverages & Mocktails',
  'Festivals & Special Offers',
  'Fine Dining & Chef Specials',
  'General',
] as const;

export const RECOMMENDED_MODELS = [
  'Ideogram 2.0 (Typography & Posters)',
  'Midjourney v6 (Photorealistic Food)',
  'Flux.1 Dev (Clean Food Plating)',
  'DALL-E 3 (OpenAI Prompt Fidelity)',
  'Google Gemini / Imagen (Natural Lighting)',
  'Grok Imagine Video / Kling AI (Cinematic Reels)',
  'Runway Gen-3 Alpha (Slow-Motion Orbit)',
] as const;

export const VAULT_TYPE_LABELS: Record<string, string> = {
  image: 'Image',
  video: 'Reel',
  poster_spec: 'Poster layout',
};

export const VAULT_TARGET_OPTIONS = [
  { value: 'all', label: 'All restaurants' },
  { value: 'industry', label: 'By industry' },
  { value: 'selected_tenants', label: 'Specific restaurants' },
] as const;

export const DEFAULT_PROMPT_FORM = {
  title: '',
  prompt: '',
  negativePrompt: '',
  category: 'Biryani & Rice',
  mediaType: 'image' as const,
  aspectRatio: '1:1',
  recommendedModel: 'Ideogram 2.0 (Typography & Posters)',
  stylePreset: 'Commercial Food Photography',
  referenceImages: [] as string[],
  tags: [] as string[],
  cameraNotes: '',
  isFavorite: false,
};
