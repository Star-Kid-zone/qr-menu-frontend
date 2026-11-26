/**
 * Canonical dietary tag / allergen vocabulary — shared by the admin
 * add/edit-menu forms (which write these values) and the guest-facing menu
 * filter pills + badges (which read them), so the two never drift apart.
 */
export const DIETARY_TAG_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🟢' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'gluten_free', label: 'Gluten-Free', emoji: '🌾' },
  { value: 'dairy_free', label: 'Dairy-Free', emoji: '🥛' },
  { value: 'jain', label: 'Jain', emoji: '🙏' },
  { value: 'egg', label: 'Contains Egg', emoji: '🥚' },
] as const;

export const ALLERGEN_OPTIONS = [
  { value: 'nuts', label: 'Nuts' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'soy', label: 'Soy' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'egg', label: 'Egg' },
] as const;

export const SPICE_LEVELS = [
  { value: 0, label: 'Not spicy', chilies: 0 },
  { value: 1, label: 'Mild', chilies: 1 },
  { value: 2, label: 'Medium', chilies: 2 },
  { value: 3, label: 'Hot', chilies: 3 },
] as const;

export function dietaryTagLabel(value: string): string {
  return DIETARY_TAG_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function allergenLabel(value: string): string {
  return ALLERGEN_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export const DIET_SCHEMA_MAP: Record<string, string> = {
  vegetarian: 'https://schema.org/VegetarianDiet',
  vegan: 'https://schema.org/VeganDiet',
  gluten_free: 'https://schema.org/GlutenFreeDiet',
  halal: 'https://schema.org/HalalDiet',
};
