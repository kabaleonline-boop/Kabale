// src/components/storefront/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  storeSlug: string;
}

export default function ProductCard({ product, storeSlug }: ProductCardProps) {
  // Use the first uploaded image, or a generic placeholder if missing
  const coverImage = product.images?.[0] || '/placeholder.png';

  return (
    <Link href={`/s/${storeSlug}/p/${product.slug}`} className="block group h-full">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square bg-slate-50 w-full overflow-hidden">
          <Image 
            src={coverImage} 
            alt={product.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">
            {product.title}
          </h3>
          <div className="mt-auto flex items-end justify-between pt-3">
            <span className="font-black text-lg" style={{ color: 'var(--primary)' }}>
              UGX {product.price.toLocaleString()}
            </span>
            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
              style={{ backgroundColor: 'var(--accent)' }}
              aria-label="Add to cart"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
