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
  
  // Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Secure Cloudinary Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Enforce 5 images max
    if (images.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images.');
      return;
    }

    setUploadingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        // 1. Fetch secure signature with anti-caching enabled
        const signRes = await fetch('/api/cloudinary', { cache: 'no-store' }); 
        const signData = await signRes.json();

        // 2. Prepare payload (NOTICE: No folder appended here!)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp);
        formData.append('signature', signData.signature);

        // 3. Upload directly to Cloudinary
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        console.log("CLOUDINARY RESPONSE:", uploadData); // <-- This will tell us if it fails

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
      alert('Failed to upload some images. Please try again.');
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
      alert('Please upload at least one image.');
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        title,
        price: Number(price),
        description,
        storeCategory: category,
        globalCategory: category,
        storeId: 'kabale-official', // Hardcoded to the Official Store
        images: images, 
        stock: 100, 
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
            
            {/* Real Image Uploader */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Product Images (Max 5)</label>
              
              <div className="flex flex-wrap gap-4">
                {/* Previews */}
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {images.length < 5 && (
                  <label className="w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer text-slate-500 hover:text-emerald-600">
                    {uploadingImages ? (
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        <span className="text-xs font-semibold">Upload</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">First image will be the cover. Supported formats: JPG, PNG, WEBP.</p>
            </div>

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
          </div>

          <hr className="border-slate-100" />

          <button 
            type="submit" 
            disabled={loading || uploadingImages}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? 'Publishing...' : 'Publish to Official Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
