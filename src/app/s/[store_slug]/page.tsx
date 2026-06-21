// src/app/s/[store_slug]/page.tsx
import { notFound } from 'next/navigation';
import { getStoreConfig } from '@/services/storeService';
import { getProductsByStore } from '@/services/productService';
import ProductCard from '@/components/storefront/ProductCard';

// Force dynamic rendering to ensure fresh inventory and layout data
export const dynamic = 'force-dynamic';

export default async function StorefrontPage({ params }: { params: { store_slug: string } }) {
  // 1. Fetch Store Config & Products concurrently
  const [config, products] = await Promise.all([
    getStoreConfig(params.store_slug),
    getProductsByStore(params.store_slug)
  ]);

  // If the store doesn't exist, Next.js handles the 404 cleanly
  if (!config) {
    notFound();
  }

  const { theme, storeName, whatsappNumber, id } = config;
  
  // Safe fallbacks to prevent crashes if a database field is missing
  const displayStoreName = storeName || 'Storefront';
  const safeTheme = theme || { primaryColor: '#0f172a', accentColor: '#334155', layoutMode: 'bento-grid', fontFamily: 'Inter' };

  return (
    <div 
      className="min-h-screen bg-slate-50 dynamic-rendering-viewport pb-20"
      style={{ 
        '--primary': safeTheme.primaryColor, 
        '--accent': safeTheme.accentColor,
        fontFamily: safeTheme.fontFamily 
      } as React.CSSProperties}
    >
      {/* Dynamic Store Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: 'var(--primary)' }}>
              {displayStoreName.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-bold text-slate-900 text-lg tracking-tight flex items-center gap-2">
              {displayStoreName}
              {id === 'kabale-official' && (
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider">
                  OFFICIAL
                </span>
              )}
            </h1>
          </div>
          
          {whatsappNumber && (
            <a 
              href={`https://wa.me/${whatsappNumber}?text=Hi, I am looking at your store on Kabale Online.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Chat
            </a>
          )}
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Latest Arrivals</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">This store hasn&apos;t uploaded any products yet.</p>
          </div>
        ) : (
          <div className="w-full">
            {/* RESPONSIVE LAYOUT ENGINE */}
            {safeTheme.layoutMode === 'bento-grid' && (
               <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4 md:pb-0 scrollbar-hide">
                 {products.map((product) => (
                   <div key={product.id} className="snap-center shrink-0 w-[80vw] md:w-auto md:shrink">
                     <ProductCard product={product} storeSlug={params.store_slug} />
                   </div>
                 ))}
               </div>
            )}

            {/* Linear List Mode */}
            {safeTheme.layoutMode === 'list' && (
              <div className="flex flex-col gap-4">
                 {products.map((product) => (
                   <div key={product.id} className="w-full md:w-2/3 lg:w-1/2 mx-auto">
                     <ProductCard product={product} storeSlug={params.store_slug} />
                   </div>
                 ))}
              </div>
            )}

            {/* Compact Grid Mode */}
            {safeTheme.layoutMode === 'compact' && (
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3">
                 {products.map((product) => (
                   <ProductCard key={product.id} product={product} storeSlug={params.store_slug} />
                 ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
