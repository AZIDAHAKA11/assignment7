import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: text */}
        <div>
          <p className="text-xs font-bold text-green-700 uppercase tracking-[0.2em]">
            আজকের বাজার
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
            প্রয়োজনীয় পণ্যের দাম{' '}
            <span className="text-green-700">এক নজরে</span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
            চাল, ডাল, সবজি, মাছ, মাংস, তেল সহ প্রতিদিনের প্রয়োজনীয় সব
            পণ্যের আজকের বাজার দর — বাজারভিত্তিক তুলনা সহ।
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#সব-পণ্য"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              সব পণ্য দেখুন
              <ArrowDown className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: hero image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-square rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-6">
            <img
              src="/bazar-hero.png"
              alt="বাজার দর"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}