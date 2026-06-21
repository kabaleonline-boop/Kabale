// src/app/category/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductsByCategory } from '@/services/productService';
import { Product } from '@/types';

// 🚨 Import our new reusable 1st Class UI component
import ProductCard from '@/components/ProductCard';

// This translates the URL slug back into the exact string stored in Firebase
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

  // Look up the category details. If someone types a random URL, fallback safely.
  const category = categoryData[slug] || { dbName: slug, icon: '📦', description: 'Explore items in this category.' };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const results = await getProductsByCategory(category.dbName);
        setProducts(results);
      } catch (error) {
        console.error("Failed to load category products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category.dbName]);

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

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 max-w-2xl mx-auto">
            <p className="text-5xl mb-4">🛒</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No products found yet</h2>
            <p className="text-slate-500">Sellers are currently stocking up this category. Check back soon!</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* 🚨 Clean, modular mapping using the imported ProductCard */}
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
