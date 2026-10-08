import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

interface ProductSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  badge?: { text: string; color: 'up' | 'down' | 'neutral' };
  products: Product[];
}

export default function ProductSection({
  id,
  title,
  subtitle,
  badge,
  products,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  const badgeColorClass =
    badge?.color === 'up'
      ? 'bg-red-100 text-red-700'
      : badge?.color === 'down'
      ? 'bg-green-100 text-green-700'
      : 'bg-slate-100 text-slate-600';

  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-10 scroll-mt-32">
      <div className="flex items-baseline justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            {title}
            {badge && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md ${badgeColorClass}`}
              >
                {badge.text}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}