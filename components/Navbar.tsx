'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  LogIn,
  UserPlus,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBengaliDate } from '@/lib/bengali';
import { signOut } from '@/lib/auth-client';
import type { Category } from '@/lib/types';

interface NavbarProps {
  categories: Category[];
  user: { name: string; email: string } | null;
}

export default function Navbar({ categories, user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dateText = getBengaliDate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('সাইন আউট সফল');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('সাইন আউট ব্যর্থ হয়েছে');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top row: logo + auth */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo-icon.png"
            alt="বাজার দর"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <div className="leading-tight">
            <div className="text-lg font-bold text-green-700">বাজার দর</div>
            <div className="text-[10px] text-slate-500">{dateText}</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile trigger button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-green-700 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
              >
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-green-700" />
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {user.email}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      আমার প্রোফাইল
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-green-700 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
              >
                <LogIn className="w-4 h-4" />
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md transition"
              >
                <UserPlus className="w-4 h-4" />
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Category links row */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto py-2">
            <Link
              href="/"
              className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                pathname === '/'
                  ? 'bg-green-100 text-green-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              হোম
            </Link>
            {categories.map((cat) => {
              const href = `/category/${cat.slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                    active
                      ? 'bg-green-100 text-green-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}