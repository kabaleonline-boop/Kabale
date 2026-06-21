// src/components/ShopByStore.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllStores } from '@/services/storeService';
import { StoreConfig } from '@/types';

type StoreWithId = StoreConfig & { id: string };

export default function ShopByStore() {
  const [stores, setStores] = useState<StoreWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const allStores = await getAllStores();
        
        // Find official store to ensure it's included in the homepage preview
        const official = allStores.find(s => s.id === 'kabale-official');
        const others = allStores.filter(s => s.id !== 'kabale-official');
        
        // Sort others by views (if views don't exist yet, it falls back safely to 0)
        others.sort((a, b) => ((b as any).views || 0) - ((a as any).views || 0));
        
        // Take official + top 3 others for the homepage preview
        const preview = official ? [official, ...others.slice(0, 3)] : others.slice(0, 4);
        setStores(preview);
      } catch (error) {
        console.error("Error loading stores:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  if (loading) return null; // Fail silently on the homepage so it doesn't block the UI
  if (stores.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shop by Store</h2>
            <p className="text-slate-500 mt-1">Discover top-rated sellers in the Kigezi region.</p>
          </div>
          <Link href="/stores" className="hidden sm:inline-flex text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            View All Stores &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stores.map((store) => (
            <Link 
              key={store.id} 
              href={`/s/${store.id}`}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-500/30 hover:shadow-lg transition-all group flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white shadow-inner shrink-0"
                  style={{ backgroundColor: store.theme?.primaryColor || '#0f172a' }}
                >
                  {store.storeName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                    {store.storeName}
                  </h3>
                  {store.id === 'kabale-official' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-sm mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Official
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mt-auto">
                {store.description || 'Discover amazing products from this verified local seller.'}
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 sm:hidden">
          <Link href="/stores" className="block w-full text-center bg-slate-100 text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
            View All Stores
          </Link>
        </div>

      </div>
    </section>
  );
}
