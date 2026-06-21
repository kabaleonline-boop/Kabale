// src/app/stores/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllStores } from '@/services/storeService';
import { StoreConfig } from '@/types';

type StoreWithId = StoreConfig & { id: string; views?: number };

export default function AllStoresPage() {
  const [stores, setStores] = useState<StoreWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllStores() {
      try {
        const data = await getAllStores();

        // 1. Extract the official store
        const officialStore = data.find(s => s.id === 'kabale-official');
        
        // 2. Extract everyone else and sort them by views (descending)
        const otherStores = data
          .filter(s => s.id !== 'kabale-official')
          .sort((a, b) => (b.views || 0) - (a.views || 0));

        // 3. Recombine: Official pinned to the top, followed by the sorted rest
        const sortedStores = officialStore ? [officialStore, ...otherStores] : otherStores;

        setStores(sortedStores);
      } catch (error) {
        console.error("Failed to fetch stores directory:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllStores();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Store Directory
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Shop directly from verified local businesses, premium brands, and the official Kabale fulfillment center.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏪</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Stores Found</h2>
            <p className="text-slate-500">Local sellers are still setting up their shops.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const isOfficial = store.id === 'kabale-official';
              
              return (
                <Link 
                  key={store.id} 
                  href={`/s/${store.id}`}
                  className={`bg-white rounded-[2rem] p-6 sm:p-8 border hover:shadow-xl transition-all duration-300 group ${
                    isOfficial ? 'border-emerald-500 shadow-sm ring-1 ring-emerald-500/20' : 'border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-inner shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: store.theme?.primaryColor || '#0f172a' }}
                    >
                      {store.storeName.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 overflow-hidden pt-1">
                      <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                        {store.storeName}
                      </h3>
                      
                      {isOfficial ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Verified Official Partner
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                           Verified Local Store
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-3 mt-5 leading-relaxed">
                    {store.description || 'Explore our catalog of premium products with instant local delivery.'}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm font-semibold">
                    <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                      {/* Placeholder for product count, or display views if you want to expose them publicly */}
                      Visit Storefront
                    </span>
                    <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
