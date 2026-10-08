'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function CategorySort({
  currentSort,
}: {
  currentSort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 focus:outline-none focus:border-green-500 cursor-pointer font-medium"
      >
        <option value="default">সাজান: ডিফল্ট</option>
        <option value="price-asc">দাম: কম থেকে বেশি</option>
        <option value="price-desc">দাম: বেশি থেকে কম</option>
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
    </div>
  );
}