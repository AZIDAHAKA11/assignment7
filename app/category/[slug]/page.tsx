import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProducts, getCategory } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import CategorySort from '@/components/CategorySort';
import type { Product } from '@/lib/types';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  // Fetch category info + products
  const [category, productsRaw] = await Promise.all([
    getCategory(slug).catch(() => null),
    getProducts(slug).catch(() => [] as Product[]),
  ]);

  // If API returned no products AND we can't find category → 404
  if (productsRaw.length === 0 && !category) {
    notFound();
  }

  // Sort products
  const products = [...productsRaw];
  if (sort === 'price-asc') {
    products.sort((a, b) => a.today - b.today);
  } else if (sort === 'price-desc') {
    products.sort((a, b) => b.today - a.today);
  }

  const categoryName = category?.nameBn ?? slug;
  const categoryIcon = category?.icon ?? '🏷️';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        হোম
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
            {categoryIcon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {categoryName}
            </h1>
            <p className="text-sm text-slate-500">
              মোট {products.length} টি পণ্য
            </p>
          </div>
        </div>

        {/* Sort dropdown (client component) */}
        {products.length > 0 && <CategorySort currentSort={sort ?? 'default'} />}
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-800">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            এই মুহূর্তে এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি। অন্য ক্যাটাগরি
            থেকে দেখুন বা হোম পেজে ফিরে যান।
          </p>
          <Link
            href="/"
            className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}