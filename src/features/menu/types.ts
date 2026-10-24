export interface MenuItem {
  id: string;
  name?: string;
  item: string;
  category: string;
  price: number;
  availability: boolean;
  imageUrl?: string;
  type?: string;
  popular?: boolean;
  description?: string;
  dietaryTags?: string[];
  allergens?: string[];
  spiceLevel?: number | null;
  calories?: number | null;
}

export type MenuViewMode = "grid" | "list";
