// src/app/s/[storeSlug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getStoreConfig, incrementStoreViews } from '@/services/storeService';
import { getProductsByStore } from '@/services/productService';
import { StoreConfig, Product } from '@/types';

export default function StorefrontPage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const { profile } = useAuth();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoreData() {
      try {
        const storeConfig = await getStoreConfig(storeSlug);
        setConfig(storeConfig || null);

        const storeProducts = await getProductsByStore(storeSlug);
        setProducts(storeProducts);
      } catch (error) {
        console.error("Error loading store:", error);
      } finally {
        setLoading(false);
      }
    }

    if (storeSlug) loadStoreData();
  }, [storeSlug]);

  useEffect(() => {
    if (!storeSlug) return;
    const viewKey = `viewed_store_${storeSlug}`;
    if (!sessionStorage.getItem(viewKey)) {
      incrementStoreViews(storeSlug);
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Store Not Found</h1>
        <p className="text-slate-500">This store might be unavailable or the link is incorrect.</p>
      </div>
    );
  }

  const isOwner = profile && (
    (profile as any).storeSlug === storeSlug || profile.uid === config.ownerId
  );

  const waLink = config.whatsappNumber 
    ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}` 
    : '#';

  const gradientStyle = {
    background: `linear-gradient(135deg, ${config.theme?.primaryColor || '#0f172a'}, ${config.theme?.accentColor || '#10b981'})`
  };

  const layoutMode = config.theme?.layoutMode || 'bento-grid';

  return (
    <div className="min-h-screen bg-white">
      
      {/* STORE OWNER BANNER */}
      {isOwner && (
        <div className="bg-slate-100 py-3 px-4 text-center border-b border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1.5">
            <div className="flex flex-row items-center justify-center gap-3">
              <span className="font-bold text-slate-800 text-sm">Welcome to your public storefront.</span>
              <Link 
                href="/seller/dashboard" 
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-full font-bold transition text-xs shadow-sm"
              >
                Go to Dashboard
              </Link>
            </div>
            <span className="text-slate-500 text-xs font-medium">
              (This banner is only visible to you because you own this store)
            </span>
          </div>
        </div>
      )}

      {/* Store Header */}
      <div className="py-16 md:py-20 px-4 transition-all duration-500 relative overflow-hidden" style={gradientStyle}>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-6 overflow-hidden border-4 border-white/20">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.logoUrl} alt={config.storeName} className="w-full h-full object-cover" />
            ) : (
              <span style={{ color: config.theme?.primaryColor || '#0f172a' }}>🛍️</span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
            {config.storeName}
          </h1>
          
          {config.description && (
            <p className="text-white/90 max-w-2xl mx-auto text-lg leading-relaxed mb-8 drop-shadow-sm font-medium">
              {config.description}
            </p>
          )}

          {config.whatsappNumber && (
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-xl"
            >
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Contact Seller
            </a>
          )}
        </div>
      </div>

      {/* Store Products Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">All Products</h2>
          <span className="text-slate-500 font-medium">{products.length} items</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 max-w-2xl mx-auto">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No products listed yet</h2>
            <p className="text-slate-500">This store is currently setting up their inventory.</p>
          </div>
        ) : (
          <div className="w-full">
            
            {/* 1. BENTO GRID MODE */}
            {layoutMode === 'bento-grid' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, index) => {
                  const isFeatured = index === 0; // The very first item gets the large featured slot
                  return (
                    <Link
                      href={`/p/${product.slug}`}
                      key={product.id}
                      className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group ${isFeatured ? 'col-span-2 row-span-2' : ''}`}
                    >
                      <div className={`${isFeatured ? 'aspect-[4/3] md:aspect-square' : 'aspect-square'} bg-slate-50 overflow-hidden relative`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.images[0] || ''} alt={product.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500" />
                        {isFeatured && (
                          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 text-xs font-black rounded-full text-slate-900 shadow-sm uppercase tracking-wider">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <h3 className={`font-bold text-slate-900 ${isFeatured ? 'text-lg sm:text-xl line-clamp-2' : 'text-sm line-clamp-2'}`}>
                          {product.title}
                        </h3>
                        <p className={`${isFeatured ? 'text-xl sm:text-2xl mt-4' : 'text-sm mt-2'} font-black`} style={{ color: config.theme?.accentColor || '#10b981' }}>
                          UGX {product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 2. LIST MODE */}
            {layoutMode === 'list' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Link
                    href={`/p/${product.slug}`}
                    key={product.id}
                    className="flex gap-4 p-3 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group items-center"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images[0] || ''} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 py-2 pr-4">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 mb-2 leading-snug">
                        {product.title}
                      </h3>
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="font-black text-sm" style={{ color: config.theme?.accentColor || '#10b981' }}>
                          UGX {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 3. COMPACT MODE */}
            {layoutMode === 'compact' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {products.map((product) => (
                  <Link
                    href={`/p/${product.slug}`}
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    <div className="aspect-square bg-slate-50 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images[0] || ''} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3 text-center bg-slate-50/50">
                      <h3 className="text-xs font-bold text-slate-700 truncate mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm font-black" style={{ color: config.theme?.accentColor || '#10b981' }}>
                        UGX {product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
