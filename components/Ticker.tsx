'use client';

import { toBengaliNumber, formatChange, shortUnit } from '@/lib/bengali';
import type { Product } from '@/lib/types';

interface TickerProps {
  products: Product[];
}

export default function Ticker({ products }: TickerProps) {
  if (products.length === 0) return null;

  // Duplicate for seamless infinite loop
  const items = [...products, ...products];

  return (
    <div className="bg-slate-900 text-white text-xs overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {items.map((p, i) => {
          const change = formatChange(p.pct);
          const colorClass =
            change.color === 'up'
              ? 'text-red-400'
              : change.color === 'down'
              ? 'text-green-400'
              : 'text-slate-400';

          return (
            <span
              key={`${p.id}-${i}`}
              className="inline-flex items-center gap-1.5 px-4 border-r border-slate-700"
            >
              <span className="text-base">{p.emoji}</span>
              <span className="font-medium">{p.nameBn}</span>
              <span className="text-slate-300">
                {toBengaliNumber(p.today)} টাকা/{shortUnit(p.unit)}
              </span>
              <span className={`font-semibold ${colorClass}`}>
                {change.arrow} {change.text}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}