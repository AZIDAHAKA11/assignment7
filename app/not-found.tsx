import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-green-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-slate-500 mb-8">
          আপনি যে পেজটি খুঁজছেন সেটি এখানে নেই। হয়তো ভুল লিংকে গিয়েছেন।
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-green-600/20 active:scale-95"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}