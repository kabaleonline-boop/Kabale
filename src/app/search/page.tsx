// src/app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchClient } from '@/lib/algolia';
import Link from 'next/link';
import { Suspense } from 'react';

// Wrapped in a separate component to safely use useSearchParams() with Next.js
function SearchResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullResults = async () => {
      if (!q) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const index = searchClient.initIndex('products');
        // Fetch up to 20 hits for the main search results page
        const { hits } = await index.search(q, { hitsPerPage: 20 });
        setResults(hits);
      } catch (error) {
        console.error("Algolia search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullResults();
  }, [q]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">
          Search Results for <span className="text-emerald-600">&quot;{q}&quot;</span>
        </h1>
        <p className="text-slate-500 mt-1">{results.length} items found</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No products found</h2>
          <p className="text-slate-500">Try checking your spelling or using more general terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            // 🚨 Updated URL structure to perfectly match your store architecture
            <Link href={`/s/${product.storeId}/p/${product.slug}`} key={product.objectID}>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
                </div>
                
                {/* Flex-grow ensures buttons/prices align perfectly even if titles are different lengths */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {product.globalCategory}
                  </p>
                  <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <div className="mt-auto pt-2">
                    <p className="text-lg font-black text-emerald-600">
                      UGX {product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// The main default export with the Suspense boundary required by Next.js
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
