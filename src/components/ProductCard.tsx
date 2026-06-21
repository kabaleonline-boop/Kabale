// src/components/ProductCard.tsx
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  storeId: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number; // Optional, for the strikethrough effect seen in reference
  image: string;
}

export default function ProductCard({ id, storeId, slug, title, price, originalPrice, image }: ProductCardProps) {
  return (
    <Link href={`/s/${storeId}/p/${slug}`} className="group block">
      {/* Edged image with no rounded corners */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Backgroundless text container */}
      <div className="mt-4">
        <h3 className="text-lg font-normal text-slate-900 tracking-tight">
          {title}
        </h3>
        
        <div className="mt-1 flex items-center gap-3">
          {originalPrice && (
            <span className="text-slate-400 line-through text-lg">
              UGX {originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-lg font-medium text-slate-900">
            UGX {price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
