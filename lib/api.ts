import { unstable_noStore as noStore } from 'next/cache';
import type { Product, Category } from './types';

const API_BASE = 'https://api.abcz.workers.dev/api/bazardor';
const FETCH_OPTIONS = { cache: 'no-store' as const };

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  noStore();
  const url = categorySlug
    ? `${API_BASE}/products?category=${categorySlug}`
    : `${API_BASE}/products`;
  const res = await fetch(url, FETCH_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  const raw = Array.isArray(data) ? data : data.products ?? data.data ?? [];
  return raw.map(normalizeProduct);
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  noStore();
  try {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`, FETCH_OPTIONS);
    if (res.ok) {
      const data = await res.json();
      const raw = data.product ?? data.data ?? data;
      if (raw && (raw.id || raw.slug)) {
        return normalizeProduct(raw);
      }
    }
  } catch {}
  try {
    const all = await getProducts();
    const found = all.find(
      (p) => p.slug === idOrSlug || String(p.id) === idOrSlug
    );
    return found ?? null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  noStore();
  const res = await fetch(`${API_BASE}/categories`, FETCH_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  const raw = Array.isArray(data) ? data : data.categories ?? data.data ?? [];
  return raw.map(normalizeCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  noStore();
  try {
    const res = await fetch(`${API_BASE}/categories/${slug}`, FETCH_OPTIONS);
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.category ?? data.data ?? data;
    return normalizeCategory(raw);
  } catch {
    return null;
  }
}

function normalizeProduct(raw: any): Product {
  const changeObj =
    raw.change && typeof raw.change === 'object' ? raw.change : null;
  return {
    id: Number(raw.id ?? 0),
    slug: String(raw.slug ?? ''),
    nameBn: String(raw.nameBn ?? raw.name ?? ''),
    categorySlug: String(raw.category ?? raw.categorySlug ?? ''),
    categoryNameBn: String(raw.categoryNameBn ?? raw.categoryName ?? ''),
    categoryIcon: safeEmoji(String(raw.categoryIcon ?? '🏷️')),
    unit: String(raw.unit ?? 'kg'),
    emoji: safeEmoji(String(raw.image ?? raw.emoji ?? '🛒')),
    today: num(raw.today ?? 0),
    yesterday: num(raw.yesterday ?? 0),
    lastWeek: num(raw.lastWeek ?? 0),
    lastMonth: num(raw.lastMonth ?? 0),
    change: (changeObj?.dir ??
      (typeof raw.change === 'string' ? raw.change : 'flat')) as Product['change'],
    pct: num(changeObj?.pct ?? raw.pct ?? 0),
    markets: Array.isArray(raw.markets)
      ? raw.markets.map((m: any) => ({
          market: String(m.market ?? ''),
          division: String(m.division ?? ''),
          min: num(m.min ?? 0),
          max: num(m.max ?? 0),
        }))
      : [],
  };
}

function normalizeCategory(raw: any): Category {
  return {
    slug: String(raw.slug ?? ''),
    nameBn: String(raw.nameBn ?? raw.name ?? ''),
    icon: safeEmoji(String(raw.icon ?? raw.categoryIcon ?? '🏷️')),
    count: raw.count ?? raw.productCount ?? undefined,
  };
}

function num(v: any): number {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Fallback emoji map for older Windows 10 systems that don't support Unicode 13+ emojis.
 */
function safeEmoji(emoji: string): string {
  const fallback: Record<string, string> = {
    '🫘': '🥜', // beans -> peanut
    '🫚': '🧄', // ginger -> garlic
    '🫙': '🥫', // jar -> canned food
    '🫛': '🫛', // pea pod (keep — may or may not render)
    '🫒': '🫒', // olive
  };
  return fallback[emoji] ?? emoji;
}