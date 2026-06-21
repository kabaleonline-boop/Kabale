// src/app/admin/official/page.tsx
'use client';

import { useState } from 'react';
import { createProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // 🚨 1. Import Auth Context

export default function AdminOfficialStorePage() {
  const router = useRouter();
  const { profile } = useAuth(); // 🚨 2. Grab the current user's profile
  
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Phones & Tablets');
  
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      alert('Cloudinary config is missing!');
      return;
    }

    setUploadingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'kabale_products';
        
        const paramsToSign = {
          folder,
          timestamp, 
        };

        const signRes = await fetch('/api/cloudinary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paramsToSign }),
        });
        
        if (!signRes.ok) throw new Error('Failed to get signature');
        const { signature } = await signRes.json();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('folder', folder);
        formData.append('timestamp', String(timestamp)); 
        formData.append('signature', signature);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        const finalUrl = uploadData.secure_url || uploadData.url;
        
        if (finalUrl) {
          newImageUrls.push(finalUrl);
        } else {
          console.error("Cloudinary rejected:", uploadData);
          alert(`Upload failed: ${uploadData.error?.message || 'Check console'}`);
        }
      }

      if (newImageUrls.length > 0) {
        setImages((prev) => [...prev, ...newImageUrls]);
      }
    } catch (error) {
      console.error('Upload crash:', error);
      alert('Failed to upload images.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert('Please upload an image.');
    setLoading(true);

    try {
      // Safely extract the owner ID
      const ownerId = (profile as any)?.id || (profile as any)?.uid;

      if (!ownerId) {
        alert("Authentication error: Could not verify your user ID.");
        setLoading(false);
        return;
      }

      await createProduct({
        title,
        price: Number(price),
        description,
        storeCategory: category,
        globalCategory: category,
        storeId: 'kabale-official',
        ownerId: ownerId, // 🚨 3. Pass the ownerId to satisfy Firebase rules!
        images: images, 
        stock: 100, 
      });
      alert('Added to Official Store!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error("FIREBASE CRASH:", error);
      const errorDetails = error?.message || JSON.stringify(error) || "Unknown Error";
      alert(`FIREBASE ERROR:\n\n${errorDetails}`);
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
        <p className="text-slate-500 text-sm">Upload premium inventory directly to Kabale Official.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Product Images (Max 5)</label>
              <div className="flex flex-wrap gap-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      Remove
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer text-slate-500 hover:text-emerald-600">
                    {uploadingImages ? (
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg><span className="text-xs font-semibold">Upload</span></>
                    )}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                  </label>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition" placeholder="e.g., iPhone 15 Pro Max - 256GB" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (UGX)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition" placeholder="e.g., 4500000" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Global Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition">
                <option>Phones & Tablets</option>
                <option>Computing</option>
                <option>Home Appliances</option>
                <option>Hardware & Tools</option>
                <option>Fashion</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Description</label>
              <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 transition resize-none" placeholder="Detail the specifications..." />
            </div>
          </div>
          <hr className="border-slate-100" />
          <button type="submit" disabled={loading || uploadingImages} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
            {loading ? 'Publishing...' : 'Publish to Official Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
