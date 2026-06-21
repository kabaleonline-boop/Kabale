// src/app/products/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getGlobalProductsFeed } from '@/services/productService';
import { Product } from '@/types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import ProductCard from '@/components/storefront/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

export default function GlobalProductsFeedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Initial Load
  useEffect(() => {
    async function loadInitialFeed() {
      const { products: initialProducts, lastDoc: initialLastDoc } = await getGlobalProductsFeed(null, 12);
      setProducts(initialProducts);
      setLastDoc(initialLastDoc);
      if (initialProducts.length < 12) setHasMore(false);
      setLoading(false);
    }
    loadInitialFeed();
  }, []);

  // Infinite Scroll Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore || loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      // If the last element is visible and we have more data to fetch
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, loading, hasMore]);

  const fetchMoreProducts = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);

    const { products: newProducts, lastDoc: newLastDoc } = await getGlobalProductsFeed(lastDoc, 12);
    
    setProducts(prev => [...prev, ...newProducts]);
    setLastDoc(newLastDoc);
    
    // If we fetched fewer items than the page size, we hit the end of the database
    if (newProducts.length < 12) setHasMore(false);
    
    setLoadingMore(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Feed</h1>
        <p className="text-slate-500 mt-1">Discover the latest arrivals from all verified stores.</p>
      </div>

      {/* Initial Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-lg">No products have been listed yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product, index) => {
              // Attach the observer to the very last product card in the current array
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductElementRef} key={product.id}>
                    <ProductCard product={product} storeSlug={product.storeId} />
                  </div>
                );
              } else {
                return (
                  <div key={product.id}>
                    <ProductCard product={product} storeSlug={product.storeId} />
                  </div>
                );
              }
            })}
          </div>

          {/* Loading More Indicator Skeletons */}
          {loadingMore && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <ProductSkeleton key={`loading-${i}`} />)}
            </div>
          )}

          {/* End of Feed Message */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-10 text-slate-400 font-medium">
              You&apos;ve reached the end of the catalog.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
