'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User as UserIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSession, updateUser } from '@/lib/auth-client';

export default function UpdateInfoPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load current user name on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const session = await getSession();
        if (session?.data?.user) {
          setName(session.data.user.name || '');
        }
      } catch {
        // ignore
      } finally {
        setFetching(false);
      }
    }
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('নাম লিখুন');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || 'আপডেট ব্যর্থ হয়েছে');
        setLoading(false);
        return;
      }

      toast.success('তথ্য আপডেট সফল!');
      router.push('/profile');
      router.refresh();
    } catch {
      toast.error('কিছু ভুল হয়েছে, আবার চেষ্টা করুন');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        প্রোফাইলে ফিরে যান
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        তথ্য আপডেট করুন
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        আপনার নাম পরিবর্তন করুন
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                নাম
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  আপডেট হচ্ছে...
                </>
              ) : (
                'তথ্য আপডেট করুন'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}