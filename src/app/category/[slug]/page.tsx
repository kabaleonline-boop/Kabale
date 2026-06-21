// src/app/category/[slug]/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { getProductsByCategory } from '@/services/productService';
import { Product } from '@/types';

// 🚨 Importing our minimalist 1st Class UI Card and the loading Skeletons
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

const categoryData: Record<string, { dbName: string; icon: string; description: string }> = {
  'phones-tablets': { dbName: 'Phones & Tablets', icon: '📱', description: 'The latest smartphones, tablets, and premium accessories.' },
  'computing': { dbName: 'Computing', icon: '💻', description: 'Laptops, desktops, monitors, and professional networking gear.' },
  'home-appliances': { dbName: 'Home Appliances', icon: '📺', description: 'TVs, refrigerators, microwaves, and daily home essentials.' },
  'hardware-tools': { dbName: 'Hardware & Tools', icon: '🔨', description: 'Construction materials, power tools, and essential hardware.' },
  'fashion': { dbName: 'Fashion', icon: '👕', description: 'Apparel, sneakers, bags, and premium lifestyle accessories.' },
  'home-daily-items': { dbName: 'Home & Daily Items', icon: '🧼', description: 'Everyday essentials, cleaning supplies, and personal care products.' },
  'food-vegetables': { dbName: 'Food & Vegetables', icon: '🥬', description: 'Fresh farm produce, packed foods, snacks, and daily groceries.' },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = categoryData[slug] || { dbName: slug, icon: '📦', description: 'Explore items in this category.' };

  // Infinite Scroll State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Initial Load
  useEffect(() => {
    async function loadInitialFeed() {
      setLoading(true);
      const { products: initialProducts, lastDoc: initialLastDoc } = await getProductsByCategory(category.dbName, null, 12);
      setProducts(initialProducts);
      setLastDoc(initialLastDoc);
      if (initialProducts.length < 12) setHasMore(false);
      setLoading(false);
    }
    loadInitialFeed();
  }, [category.dbName]);

  // Infinite Scroll Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore || loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts();
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, loading, hasMore, category.dbName, lastDoc]);

  const fetchMoreProducts = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);

    const { products: newProducts, lastDoc: newLastDoc } = await getProductsByCategory(category.dbName, lastDoc, 12);

    setProducts(prev => [...prev, ...newProducts]);
    setLastDoc(newLastDoc);

    if (newProducts.length < 12) setHasMore(false);

    setLoadingMore(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-4xl mb-6">
            {category.icon}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {category.dbName}
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            {category.description}
          </p>
        </div>
      </div>

      {/* Main Feed Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Initial Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 max-w-2xl mx-auto">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No products found yet</h2>
            <p className="text-slate-500 mb-6">Sellers are currently stocking up this category. Check back soon!</p>
            <Link href="/" className="inline-block px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-x-6 md:gap-y-10">
              {products.map((product, index) => {
                const isLastElement = products.length === index + 1;
                
                return (
                  <div ref={isLastElement ? lastProductElementRef : null} key={product.id}>
                    <ProductCard 
                      id={product.id}
                      storeId={product.storeId}
                      slug={product.slug}
                      title={product.title}
                      price={product.price}
                      image={product.images && product.images[0] ? product.images[0] : ''}
                    />
                  </div>
                );
              })}
            </div>

            {/* Loading More Indicator Skeletons */}
            {loadingMore && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(5)].map((_, i) => <ProductSkeleton key={`loading-${i}`} />)}
              </div>
            )}

            {/* End of Feed Message */}
            {!hasMore && products.length > 0 && (
              <div className="text-center py-10 text-slate-400 font-medium">
                You&apos;ve reached the end of the {category.dbName} catalog.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
