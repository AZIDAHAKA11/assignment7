export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categorySlug: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string; // "kg" | "litter" | "dozen" | "pcs"
  emoji: string; // emoji image
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: 'up' | 'down' | 'flat';
  pct: number;
  markets: MarketPrice[];
}

export interface Category {
  slug: string;
  nameBn: string;
  icon: string;
  count?: number;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc';