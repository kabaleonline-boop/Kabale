// src/app/admin/official/page.tsx
'use client';

import { useState } from 'react';
import { createProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';

export default function AdminOfficialStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Phones & Tablets');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({
        title,
        price: Number(price),
        description,
        storeCategory: category,
        globalCategory: category,
        storeId: 'kabale-official', // Hardcoded to the Official Store
        images: [imageUrl],
        stock: 100, // Fixed: Added the required 'stock' property
      });

      alert('Item added to Kabale Official Store successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      alert('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span className="text-emerald-500">⭐</span> Official Store Manager
        </h1>
        <p className="text-slate-500 text-sm">Upload premium inventory that appears directly in the Kabale Official section on the homepage.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition" 
                placeholder="e.g., iPhone 15 Pro Max - 256GB" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (UGX)</label>
              <input 
                type="number" 
                required 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition" 
                placeholder="e.g., 4500000" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Global Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition"
              >
                <option>Phones & Tablets</option>
                <option>Computing</option>
                <option>Home Appliances</option>
                <option>Hardware & Tools</option>
                <option>Fashion</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Description</label>
              <textarea 
                required 
                rows={4}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition resize-none" 
                placeholder="Detail the specifications, warranty info, and features..." 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cloudinary Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  required 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition" 
                  placeholder="https://res.cloudinary.com/..." 
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Paste the direct URL from your Cloudinary media library.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Publishing...' : 'Publish to Official Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
