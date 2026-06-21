// src/app/seller/products/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AddProductPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Phones & Tablets');
  const [stock, setStock] = useState('10');

  // Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'seller')) {
      router.push('/dashboard');
    }
  }, [profile, authLoading, router]);

  // Secure Cloudinary Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images per product.');
      return;
    }

    setUploadingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        // 1. Fetch secure signature with anti-caching
        const signRes = await fetch('/api/cloudinary', { cache: 'no-store' }); 

        if (!signRes.ok) throw new Error('Failed to securely sign the image upload request.');
        const signData = await signRes.json();

        // 2. Prepare payload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp);
        formData.append('signature', signData.signature);
        formData.append('folder', signData.folder);

        // 3. Upload directly to Cloudinary
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        // 4. Safely extract the URL
        const finalUrl = uploadData.secure_url || uploadData.url;

        if (finalUrl) {
          newImageUrls.push(finalUrl);
        } else {
          console.error("Cloudinary rejected the image:", uploadData);
          alert(`Image upload failed: ${uploadData.error?.message || 'Check console'}`);
        }
      }

      // 5. Add successful uploads to state
      if (newImageUrls.length > 0) {
        setImages((prev) => [...prev, ...newImageUrls]);
      }
    } catch (error) {
      console.error('Image upload crash:', error);
      alert('A network error occurred while uploading your images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }

    // Bypass TypeScript strictness to reliably extract the store ID
    const p = profile as any;
    const storeId = p?.storeSlug || p?.id || p?.uid;

    if (!storeId) {
      alert('Store configuration error. Please contact support.');
      return;
    }

    setLoading(true);

    try {
      // Hands off to productService: saves to Firebase first, 
      // then seamlessly triggers our new Next.js API Route to sync with Algolia
      await createProduct({
        title,
        price: Number(price),
        description,
        storeCategory: category,
        globalCategory: category,
        storeId: storeId, 
        images: images, 
        stock: Number(stock), 
      });

      alert('Product published successfully!');
      router.push('/seller/settings'); 
    } catch (error: any) {
      console.error("Publishing Error:", error);
      alert(error?.message || 'Failed to publish the product to your storefront.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !profile) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <span className="text-emerald-500">📦</span> Add New Product
        </h1>
        <p className="text-slate-500 mt-2">Upload inventory directly to your digital storefront.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleUpload} className="space-y-8">

          {/* Image Uploader */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-4">Product Imagery</label>
            <div className="flex flex-wrap gap-4">
              {images.map((url, idx) => (
                <div key={idx} className="relative w-28 h-28 rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/60 text-white text-sm font-medium opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="w-28 h-28 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer text-slate-500 hover:text-emerald-600">
                  {uploadingImages ? (
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs font-semibold">Upload Photo</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                </label>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-3">Upload up to 5 high-quality images. The first image will be the cover.</p>
          </div>

          <hr className="border-slate-100" />

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Product Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                placeholder="e.g., Samsung Galaxy S24" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Price (UGX)</label>
              <input 
                type="number" 
                required 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                placeholder="0" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Stock Quantity</label>
              <input 
                type="number" 
                required 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                min="1" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option>Phones & Tablets</option>
                <option>Computing</option>
                <option>Home Appliances</option>
                <option>Hardware & Tools</option>
                <option>Fashion</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Product Description</label>
              <textarea 
                required 
                rows={5} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none" 
                placeholder="Provide detailed specifications, warranty info, and features..." 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || uploadingImages} 
              className="w-full bg-emerald-600 text-white font-semibold py-4 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : 'Publish Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
