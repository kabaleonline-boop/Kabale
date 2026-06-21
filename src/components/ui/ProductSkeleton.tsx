// src/components/ui/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full aspect-square bg-slate-200"></div>
      
      {/* Content Placeholder */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        <div className="pt-2">
          <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
