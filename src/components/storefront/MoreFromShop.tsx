import Link from 'next/link';
import { getProductsByStore } from '@/services/productService';

export default async function MoreFromShop({ storeSlug, currentProductId, accentColor }: { storeSlug: string, currentProductId: string, accentColor: string }) {
  const allProducts = await getProductsByStore(storeSlug);
  const otherProducts = allProducts.filter(p => p.id !== currentProductId).slice(0, 4);

  if (otherProducts.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 mt-16 mb-20">
      <h2 className="text-2xl font-black text-slate-900 mb-6">More from this shop</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {otherProducts.map(product => (
          <Link href={`/s/${storeSlug}/p/${product.slug}`} key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="aspect-square bg-slate-50 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0] || '/placeholder.png'} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2">{product.title}</h3>
              <p className="font-black text-sm" style={{ color: accentColor }}>UGX {product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
