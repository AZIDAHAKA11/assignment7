# বাজার দর (BazarDor)

বাংলাদেশের দৈনন্দিন বাজারের পণ্যের দাম এক জায়গায় — চাল, ডাল, সবজি, মাছ, মাংস, তেল সহ সব প্রয়োজনীয় পণ্যের আজকের দর, বাজারভিত্তিক তুলনা সহ।

## Technologies Used

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- BetterAuth (Email/Password authentication)
- SQLite (better-sqlite3) — for user sessions
- React Hot Toast — notifications
- Lucide Icons

##  Key Features

1. আজকের বাজার দর হোম পেজ — Top 6 price risers (▲), top 6 fallers (▼), এবং সম্পূর্ণ পণ্যের গ্রিড, প্রতিটাতে আজকের দাম + change badge (Bengali numerals এ)।
2. ক্যাটাগরি ব্রাউজিং + সর্টিং— চাল, ডাল, সবজি, মাছ ইত্যাদি ক্যাটাগরি অনুযায়ী পণ্য দেখা যায়, সাথে sort dropdown (ডিফল্ট / দাম: কম থেকে বেশি / দাম: বেশি থেকে কম)।
3. বিস্তারিত পণ্য পেজ — বড় emoji, category tag, সর্বনিম্ন/সর্বোচ্চ/গড় দাম summary, এবং বাজারভিত্তিক দামের টেবিল (প্রতিটি জেলার বাজারে min/max দর)।
4. BetterAuth দিয়ে Authentication — Email/Password সাইন-আপ ও সাইন-ইন, session management, protected routes (product detail page login ছাড়া দেখা যায় না)।
5. আমার প্রোফাইল + তথ্য আপডেট — User নিজের নাম পরিবর্তন করতে পারে, live update database এ save হয়, toast notification সহ।

##  Design Highlights

- Figma-match UI — সবুজ primary theme (#16a34a), বাংলা typography (Hind Siliguri font)
- Live price ticker — Navbar এর নিচে infinite scrolling marquee, hover করলে pause হয়
- Fully responsive — Mobile, tablet, desktop সব size এ perfect
- Bengali numerals — সব সংখ্যা বাংলা তে (১, ২, ৩...)
- Loading skeletons — Data fetch এর সময় সুন্দর placeholder
- Custom 404 page— বাংলা তে friendly error message
