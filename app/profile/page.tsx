'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Loader2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSession, updateUser, signOut } from '@/lib/auth-client';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await getSession();
        if (!session?.data?.user) {
          router.push('/signin');
          return;
        }
        setUser({
          name: session.data.user.name,
          email: session.data.user.email,
        });
        setName(session.data.user.name || '');
      } catch {
        router.push('/signin');
      } finally {
        setFetching(false);
      }
    }
    loadUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('নাম লিখুন');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateUser({ name: name.trim() });

      if (error) {
        toast.error(error.message || 'আপডেট ব্যর্থ হয়েছে');
        setLoading(false);
        return;
      }

      toast.success('তথ্য আপডেট সফল!');
      setUser((prev) => (prev ? { ...prev, name: name.trim() } : prev));
      setLoading(false);
      router.refresh();
    } catch {
      toast.error('কিছু ভুল হয়েছে, আবার চেষ্টা করুন');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success('সাইন আউট সফল');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('সাইন আউট ব্যর্থ হয়েছে');
      setSigningOut(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="h-5 w-32 bg-slate-100 rounded mb-2 animate-pulse" />
              <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          আমার প্রোফাইল
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          আপনার অ্যাকাউন্টের তথ্য দেখুন
        </p>
      </div>

      {/* User card with sign out */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center shrink-0 shadow-inner">
            <UserIcon className="w-7 h-7 text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {user.name}
            </h2>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            সাইন আউট
          </button>
        </div>
      </div>

      {/* Update info form — matches Figma */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-5">তথ্য</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 hover:border-slate-300"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-green-600/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                আপডেট হচ্ছে...
              </>
            ) : (
              'আপডেট'
            )}
          </button>
        </form>
      </div>

      {/* Mobile sign out button */}
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="sm:hidden w-full mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50"
      >
        {signingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        সাইন আউট
      </button>
    </div>
  );
}