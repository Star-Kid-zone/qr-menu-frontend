export interface Menu {
  id: string | number;
  business_id?: string | number;
  name?: string;
  item: string;
  description: string;
  price: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  /** Extra gallery photos beyond the cover `image_url`/`imageUrl` — stored as plain URL
   *  strings, though some legacy data may still hand back `{id, url}` objects. */
  images?: (string | { id: string | number; url: string })[];
  /** Extra promo videos for the item — plain URL strings. */
  videos?: string[];
  category: string;
  type: string;
  popular: boolean;
  availability: boolean;
  availability_time?: string;
  /** e.g. ['vegetarian', 'gluten_free'] — see constants/dietary.constants.ts */
  dietaryTags?: string[];
  allergens?: string[];
  /** 0 (not spicy) to 3 (hot); undefined/null = not specified */
  spiceLevel?: number | null;
  calories?: number | null;
  /** Business-type details, display only: { [setId]: { [field]: value } } — see site-system/attributes.ts */
  attributes?: Record<string, Record<string, unknown>>;
  /** Several prices for one item (e.g. Glass / Bottle). `price` is the lowest of them. */
  priceOptions?: Array<{ label: string; price: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface MenuStats {
  total: number;
  byCategory: Array<{ category: string; count: number }>;
  available: number;
  unavailable: number;
  popular: number;
}

export interface MenuImportRow {
  item: string;
  price: number;
  description: string;
  category: string;
  type: string;
  dietaryTags?: string[];
  allergens?: string[];
  spiceLevel?: number | null;
  calories?: number | null;
}

export interface MenuImportPreviewResult {
  valid: MenuImportRow[];
  errors: Array<{ row: number; message: string }>;
  totalRows: number;
}

export interface ScannedItem {
  item: string;
  price: string;
  description: string;
}

export interface ScanResponse {
  items: ScannedItem[];
  tokensUsed?: number;
  message?: string;
}

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

export type MenuViewMode = 'grid' | 'list';
