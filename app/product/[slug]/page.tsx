import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import { getProduct } from '@/lib/api';
import {
  toBengaliNumber,
  formatChange,
  formatUnit,
} from '@/lib/bengali';
import { auth } from '@/lib/auth';

async function ProductContent({ slug }: { slug: string }) {
  // Auth check — protected route
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect('/signin');
  }

  const product = await getProduct(slug);
  if (!product) notFound();

  const change = formatChange(product.pct);
  const changeColorClass =
    change.color === 'up'
      ? 'text-red-600 bg-red-50 border-red-200'
      : change.color === 'down'
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-slate-500 bg-slate-100 border-slate-200';

  const markets = product.markets ?? [];
  const allPrices = markets.flatMap((m) => [m.min, m.max]).filter((n) => n > 0);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.today;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : product.today;
  const avgPrice =
    allPrices.length > 0
      ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length)
      : product.today;

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* LEFT: Emoji */}
        <div>
          <div className="aspect-square bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[10rem] sm:text-[14rem] shadow-sm">
            {product.emoji}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-200">
              <span>{product.categoryIcon}</span>
              {product.categoryNameBn}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {product.nameBn}
          </h1>

          <p className="mt-3 text-slate-600 leading-relaxed">
            আজকের বাজারে এই পণ্যের সর্বনিম্ন, সর্বোচ্চ ও গড় দর — বাজারভিত্তিক
            তুলনা সহ। দর প্রতিদিন বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500">
              {formatUnit(product.unit)}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg border ${changeColorClass}`}
            >
              {change.color === 'up' && <TrendingUp className="w-4 h-4" />}
              {change.color === 'down' && <TrendingDown className="w-4 h-4" />}
              {change.arrow} {change.text}
            </span>
          </div>

          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              আজকের দাম
            </div>
            <div className="mt-1 text-4xl font-bold text-slate-900">
              {toBengaliNumber(product.today)}
              <span className="text-lg font-medium text-slate-500 ml-1">
                টাকা
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <SummaryCard label="সর্বনিম্ন" value={minPrice} />
              <SummaryCard label="সর্বোচ্চ" value={maxPrice} />
              <SummaryCard label="গড়" value={avgPrice} />
            </div>
          </div>

          <button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition">
            <ShoppingCart className="w-4 h-4" />
            বাজার তালিকায় যোগ করুন
          </button>
        </div>
      </div>

      {markets.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            দেশের বিভিন্ন বাজারে এই পণ্যের সর্বনিম্ন ও সর্বোচ্চ দর
          </p>

          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                    বাজার
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                    বিভাগ
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                    সর্বনিম্ন
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                    সর্বোচ্চ
                  </th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {m.market}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{m.division}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {toBengaliNumber(m.min)}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        টাকা
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {toBengaliNumber(m.max)}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        টাকা
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
      <div>
        <div className="h-6 w-24 bg-slate-200 rounded mb-4 animate-pulse" />
        <div className="h-10 w-3/4 bg-slate-200 rounded mb-4 animate-pulse" />
        <div className="h-4 w-full bg-slate-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-200 rounded mb-6 animate-pulse" />
        <div className="h-32 w-full bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        সব পণ্য
      </Link>

      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent slug={slug} />
      </Suspense>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-slate-800">
        {toBengaliNumber(value)}
      </div>
      <div className="text-[10px] text-slate-400">টাকা</div>
    </div>
  );
}