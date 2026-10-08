import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  // Top risers: change = "up", sort by pct descending, top 6
  const risers = products
    .filter((p) => p.change === 'up')
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);

  // Top fallers: change = "down", sort by pct ascending (most negative first), top 6
  const fallers = products
    .filter((p) => p.change === 'down')
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 6);

  // Fallback if not enough up/down products
  const risersFinal = risers.length > 0 ? risers : products.slice(0, 6);
  const fallersFinal =
    fallers.length > 0
      ? fallers
      : [...products].sort((a, b) => a.pct - b.pct).slice(0, 6);

  return (
    <>
      <Hero />

      <ProductSection
        id="দাম-বেড়েছে"
        title="আজ দাম বেড়েছে"
        badge={{ text: '▲', color: 'up' }}
        products={risersFinal}
      />

      <ProductSection
        id="দাম-কমেছে"
        title="আজ দাম কমেছে"
        badge={{ text: '▼', color: 'down' }}
        products={fallersFinal}
      />

      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle="প্রতিদিনের প্রয়োজনীয় সব পণ্যের আজকের দর"
        products={products}
      />
    </>
  );
}