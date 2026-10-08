export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-4 animate-pulse" />
          <div className="h-12 w-full bg-slate-200 rounded mb-3 animate-pulse" />
          <div className="h-12 w-3/4 bg-slate-200 rounded mb-6 animate-pulse" />
          <div className="h-5 w-full bg-slate-200 rounded mb-2 animate-pulse" />
          <div className="h-5 w-2/3 bg-slate-200 rounded mb-6 animate-pulse" />
          <div className="h-12 w-40 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}