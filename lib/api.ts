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

// ============================================================
// Category icon map — Windows 10 doesn't render Unicode 13+ emojis
// so we hardcode safe alternatives by category slug.
// ============================================================
const CATEGORY_ICONS: Record<string, string> = {
  chal: '\u{1F35A}',      // 🍚 rice
  dal: '\u{1F95C}',       // 🥜 peanuts
  tel: '\u{1F6E2}',       // 🛢 oil drum
  shobji: '\u{1F96C}',    // 🥬 leafy green
  mach: '\u{1F41F}',      // 🐟 fish
  mangsho: '\u{1F357}',   // 🍗 poultry leg
  'dim-dui': '\u{1F95B}', // 🥛 milk
  mosla: '\u{1F336}',     // 🌶 hot pepper
};

// ============================================================
// Product emoji fallbacks (for the same Windows 10 reason)
// ============================================================
const PRODUCT_EMOJI_FALLBACKS: Record<string, string> = {
  '\u{1FAD8}': '\u{1F95C}', // 🫘 beans -> 🥜 peanut
  '\u{1FADA}': '\u{1F9C4}', // 🫚 ginger -> 🧄 garlic
  '\u{1FAD9}': '\u{1F96B}', // 🫙 jar -> 🥫 canned food
};

function normalizeProduct(raw: any): Product {
  const changeObj =
    raw.change && typeof raw.change === 'object' ? raw.change : null;

  const rawEmoji = String(raw.image ?? raw.emoji ?? '\u{1F6D2}');
  const safeProductEmoji =
    PRODUCT_EMOJI_FALLBACKS[rawEmoji] ?? rawEmoji;

  const catSlug = String(raw.category ?? raw.categorySlug ?? '');
  const rawCatIcon = String(raw.categoryIcon ?? '\u{1F3F7}');
  const safeCatIcon = CATEGORY_ICONS[catSlug] ?? rawCatIcon;

  return {
    id: Number(raw.id ?? 0),
    slug: String(raw.slug ?? ''),
    nameBn: String(raw.nameBn ?? raw.name ?? ''),
    categorySlug: catSlug,
    categoryNameBn: String(raw.categoryNameBn ?? raw.categoryName ?? ''),
    categoryIcon: safeCatIcon,
    unit: String(raw.unit ?? 'kg'),
    emoji: safeProductEmoji,
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
  const slug = String(raw.slug ?? '');
  const rawIcon = String(raw.icon ?? raw.categoryIcon ?? '\u{1F3F7}');

  return {
    slug,
    nameBn: String(raw.nameBn ?? raw.name ?? ''),
    icon: CATEGORY_ICONS[slug] ?? rawIcon,
    count: raw.count ?? raw.productCount ?? undefined,
  };
}

function num(v: any): number {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}