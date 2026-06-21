// src/app/s/[storeId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// 🚨 Import our new incrementStoreViews function
import { getStoreConfig, incrementStoreViews } from '@/services/storeService';
import { getProductsByStore } from '@/services/productService';
import { StoreConfig, Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function StorefrontPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Store Data
  useEffect(() => {
    async function loadStoreData() {
      try {
        const storeConfig = await getStoreConfig(storeId);
        setConfig(storeConfig || null);

        const storeProducts = await getProductsByStore(storeId);
        setProducts(storeProducts);
      } catch (error) {
        console.error("Error loading store:", error);
      } finally {
        setLoading(false);
      }
    }

    if (storeId) loadStoreData();
  }, [storeId]);

  // 2. 🚨 Record the View (Anti-Spam logic)
  useEffect(() => {
    if (!storeId) return;

    // We create a unique key for this specific store
    const viewKey = `viewed_store_${storeId}`;

    // If sessionStorage doesn't have this key, it means this is their first time viewing it this session
    if (!sessionStorage.getItem(viewKey)) {
      // Tell Firebase to add +1 to the views
      incrementStoreViews(storeId);
      
      // Save to sessionStorage so if they refresh the page, we don't count them again!
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [storeId]);

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

  const waLink = config.whatsappNumber 
    ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}` 
    : '#';

  return (
    <div className="min-h-screen bg-white">
      
      {/* Store Header */}
      <div 
        className="py-16 md:py-20 px-4 transition-colors duration-500" 
        style={{ backgroundColor: config.theme?.primaryColor || '#0f172a' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-6 overflow-hidden">
            <span style={{ color: config.theme?.primaryColor || '#0f172a' }}>🛍️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            {config.storeName}
          </h1>
          {config.description && (
            <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
              {config.description}
            </p>
          )}

          {config.whatsappNumber && (
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Contact Seller
            </a>
          )}
        </div>
      </div>

      {/* Store Products */}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                storeId={product.storeId}
                slug={product.slug}
                title={product.title}
                price={product.price}
                image={product.images && product.images[0] ? product.images[0] : ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
