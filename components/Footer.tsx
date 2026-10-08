export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img
            src="/logo-icon.png"
            alt="বাজার দর"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <div className="leading-tight">
            <div className="text-base font-bold text-white">বাজার দর</div>
            <div className="text-[10px] text-slate-400">
              প্রয়োজনীয় পণ্যের দাম এক নজরে
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center sm:text-right max-w-md">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}