import { Suspense } from 'react';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { Hind_Siliguri, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';
import Footer from '@/components/Footer';
import { getCategories, getProducts } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Category, Product } from '@/lib/types';

const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'বাজার দর — আজকের বাজার',
  description:
    'প্রয়োজনীয় পণ্যের দাম এক নজরে — চাল, ডাল, সবজি, মাছ, মাংস, তেল, চিনি সহ সবকিছুর আজকের দর।',
};

async function NavbarWithData() {
  let categories: Category[] = [];
  let user: { name: string; email: string } | null = null;

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user) {
      user = {
        name: session.user.name,
        email: session.user.email,
      };
    }
  } catch {
    user = null;
  }

  return <Navbar categories={categories} user={user} />;
}

async function TickerWithData() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }
  return <Ticker products={products.slice(0, 15)} />;
}

function NavbarFallback() {
  return <div className="bg-white border-b border-slate-200 h-24" />;
}

function TickerFallback() {
  return <div className="bg-slate-900 h-8" />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hind.variable} ${inter.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <Suspense fallback={<NavbarFallback />}>
          <NavbarWithData />
        </Suspense>
        <Suspense fallback={<TickerFallback />}>
          <TickerWithData />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: '#ffffff' },
            },
          }}
        />
      </body>
    </html>
  );
}