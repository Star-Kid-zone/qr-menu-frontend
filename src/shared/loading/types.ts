export type LoadingScreenTheme =
  | 'circular'
  | 'restaurant-flame'
  | 'restaurant-steam'
  | 'restaurant-plate'
  | 'restaurant-bento'
  | 'restaurant-pizza'
  | 'restaurant-burger'
  | 'restaurant-sushi'
  | 'restaurant-bakery'
  | 'restaurant-noodle'
  | 'restaurant-grill'
  | 'restaurant-cocktail'
  | 'restaurant-tandoor'
  | 'restaurant-bubble-tea'
  | 'restaurant-seafood'
  | 'restaurant-dessert'
  | 'restaurant-curry'
  | 'restaurant-asian'
  | 'restaurant-mediterranean'
  | 'universal-orbit'
  | 'universal-wave'
  | 'universal-grid'
  | 'universal-pulse'
  | 'retail-bag'
  | 'wellness-leaf'
  | 'tech-orbit'
  | 'hospitality-bell'
  | 'salon-mirror'
  | 'clinic-cross';

export interface LoadingScreenOption {
  value: LoadingScreenTheme;
  label: string;
  group: string;
  description: string;
  accent: string;
}
