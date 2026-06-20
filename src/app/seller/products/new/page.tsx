// src/app/seller/products/new/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createProduct } from '@/services/productService';
import ImageUploader from '@/components/seller/ImageUploader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const { profile } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Default slug fallback for safety
  const storeSlug = profile?.displayName?.toLowerCase().replace(/\s+/g, '-') || 'my-shop';

  const handleUploadSuccess = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert('Please upload at least one image.');
    
    setSaving(true);
    try {
      await createProduct({
        storeId: storeSlug,
        title,
        description,
        price: Number(price),
        images,
        globalCategory: 'Uncategorized', // MVP Default
        storeCategory: 'Main',           // MVP Default
        stock: 1,
      });
      
      alert('Product created successfully!');
      router.push('/seller/products'); // Redirect to inventory table
    } catch (err) {
      alert('Error creating product. Check the console.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Gallery Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Product Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <Image src={url} alt={`Upload ${index}`} fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {/* Only allow up to 4 images to save Vercel/Cloudinary costs for MVP */}
              {images.length < 4 && (
                 <ImageUploader onUploadSuccess={handleUploadSuccess} />
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Details Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                placeholder="e.g. Samsung 43-inch Smart TV"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (UGX)</label>
              <input 
                type="number" 
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                placeholder="e.g. 1200000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                placeholder="Condition, specs, warranty details..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish Product to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
