'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function HomeAllProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortKey>('default');

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.today - b.today;
    if (sort === 'price-desc') return b.today - a.today;
    if (sort === 'name') return a.nameBn.localeCompare(b.nameBn, 'bn');
    return 0; // default — keep original order
  });

  return (
    <section id="সব-পণ্য" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            সব পণ্য
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            প্রতিদিনের প্রয়োজনীয় সব পণ্যের আজকের দর ({products.length} টি)
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer font-medium shadow-sm hover:border-slate-300 transition-all"
          >
            <option value="default">সাজান: ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
            <option value="name">নাম অনুযায়ী</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}