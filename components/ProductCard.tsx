import Link from 'next/link';
import { toBengaliNumber, formatChange, formatUnit } from '@/lib/bengali';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const change = formatChange(product.pct);
  const changeColorClass =
    change.color === 'up'
      ? 'text-red-600 bg-red-50'
      : change.color === 'down'
      ? 'text-green-600 bg-green-50'
      : 'text-slate-500 bg-slate-100';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-green-400 hover:shadow-md transition-all"
    >
      {/* Emoji / Image area */}
      <div className="aspect-square bg-slate-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
        {product.emoji}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.nameBn}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {formatUnit(product.unit)}
        </p>

        {/* Price row */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">
              আজকের দাম
            </div>
            <div className="text-lg font-bold text-slate-900">
              {toBengaliNumber(product.today)}{' '}
              <span className="text-sm font-medium text-slate-500">টাকা</span>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${changeColorClass}`}
          >
            {change.arrow} {change.text}
          </span>
        </div>
      </div>
    </Link>
  );
}