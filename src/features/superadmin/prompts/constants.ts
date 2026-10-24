import { PiNotebookBold, PiImagesBold, PiVideoCameraBold } from 'react-icons/pi';

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
];

export const RECOMMENDED_MODELS = [
  'Ideogram 2.0 (Typography & Posters)',
  'Midjourney v6 (Photorealistic Food)',
  'Flux.1 Dev (Clean Food Plating)',
  'DALL-E 3 (OpenAI Prompt Fidelity)',
  'Google Gemini / Imagen (Natural Lighting)',
  'Grok Imagine Video / Kling AI (Cinematic Reels)',
  'Runway Gen-3 Alpha (Slow-Motion Orbit)',
];

export const STYLE_PRESETS = [
  'Commercial Food Photography',
  'Studio Lighting with Rim Glow',
  'Dramatic Culinary Sizzler',
  'Hero Commercial Shot',
  'Dynamic Action Plating',
  'Luxury Fine Dining',
  'Slow Motion Cinematic Video',
  'Festive Commercial Poster',
  'Dark & Moody Rustic Bokeh',
];
