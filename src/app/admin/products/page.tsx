// src/app/admin/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllPlatformProducts, deletePlatformProduct } from '@/services/adminService';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const data = await getAllPlatformProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleDelete = async (productId: string, title: string) => {
    if (!window.confirm(`DANGER: Permanently delete "${title}" from Firebase AND Algolia?`)) return;
    
    setDeletingId(productId);
    try {
      await deletePlatformProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-200 h-64 rounded-3xl w-full"></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Global Product Catalog</h1>
        <p className="text-slate-500 text-sm">Moderate all items listed across the entire Digital Mall.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Price (UGX)</th>
                <th className="px-6 py-4">Store ID</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No products found.</td></tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {product.images?.[0] ? (
                           <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        ) : (
                           <span className="flex items-center justify-center w-full h-full text-[10px] text-slate-400">No Img</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 max-w-[200px] truncate">{product.title}</div>
                        <Link href={`/s/${product.storeId}/p/${product.slug}`} target="_blank" className="text-xs text-emerald-600 hover:underline">View live listing</Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">{product.storeId}</span></td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {product.createdAt ? new Date((product.createdAt as any).seconds * 1000 || product.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => alert('Quick Edit modal coming in Phase 4. For now, instruct the seller to edit via their dashboard.')}
                      className="px-3 py-1.5 rounded-lg font-semibold text-xs transition bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id, product.title)}
                      className="px-3 py-1.5 rounded-lg font-semibold text-xs transition bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === product.id ? 'Deleting...' : 'Force Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
