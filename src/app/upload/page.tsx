// src/app/upload/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const { profile, loading: authLoading, openAuthModal } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Phones & Tablets'); 
  const [stock, setStock] = useState('10');
  const [phone, setPhone] = useState('');

  // Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Auto-submit after successful modal sign-in
  useEffect(() => {
    const ownerId = profile?.uid || (profile as any)?.id;
    if (pendingSubmit && ownerId) {
      setPendingSubmit(false);
      executePublish(ownerId);
    }
  }, [profile, pendingSubmit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images per product.');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      alert('Upload service is temporarily unavailable.');
      return;
    }

    setUploadingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of files) {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'kabale_products';
        const paramsToSign = { folder, timestamp };

        const signRes = await fetch('/api/cloudinary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paramsToSign }),
        });

        if (!signRes.ok) throw new Error('Failed to sign image request.');
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
        }
      }

      setImages((prev) => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Network error uploading images.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const applyQuickTemplate = () => {
    if (!title) {
      alert("Please enter a Product Title first!");
      return;
    }
    setDescription(
      `Original ${title} available for sale in Kabale.\n\nKey Highlights:\n- Quality assured & tested\n- Fair price\n- Fast pick-up or delivery within Kabale\n\nContact via Call or WhatsApp for quick purchase.`
    );
  };

  // Perform Firestore & Algolia submission
  const executePublish = async (ownerId: string) => {
    setLoading(true);
    try {
      await createProduct({
        title,
        price: Number(price),
        description,
        category,
        ownerId,
        ownerName: profile?.displayName || 'Kabale Resident',
        ownerPhone: phone,
        images, 
        stock: Number(stock), 
      });

      alert('Product published successfully!');
      router.push('/'); 
    } catch (error: any) {
      console.error("Publishing Error:", error);
      alert(error?.message || 'Failed to publish the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    const ownerId = profile?.uid || (profile as any)?.id;

    // Trigger AuthModal if user is not signed in
    if (!ownerId) {
      setPendingSubmit(true);
      if (typeof openAuthModal === 'function') {
        openAuthModal();
      } else {
        alert('Please sign in to publish your item.');
      }
      return;
    }

    executePublish(ownerId);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              📦 Post Product
            </h1>
            <p className="text-slate-500 mt-1">List items directly to the Kabale Online feed.</p>
          </div>
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-slate-200">
            &larr; Cancel
          </Link>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm">
          <form onSubmit={handleUploadSubmit} className="space-y-6">

            {/* Image Uploader */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Product Imagery (Max 5)</label>
              <div className="flex flex-wrap gap-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-28 h-28 rounded-2xl border border-slate-200 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="w-28 h-28 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-slate-100 transition cursor-pointer text-slate-500">
                    {uploadingImages ? (
                      <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-2xl">+</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Upload</span>
                      </>
                    )}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-900 mb-2">Product Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 focus:bg-white focus:outline-none" 
                  placeholder="e.g., iPhone 15 Pro Max - 256GB" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Price (UGX)</label>
                <input 
                  type="number" 
                  required 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 focus:bg-white focus:outline-none" 
                  placeholder="3500000" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  required 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 focus:bg-white focus:outline-none" 
                  min="1" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">WhatsApp / Contact Phone</label>
                <input 
                  type="text" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 focus:bg-white focus:outline-none" 
                  placeholder="0770000000" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 appearance-none focus:bg-white focus:outline-none"
                >
                  <option value="Phones & Tablets">📱 Phones & Tablets</option>
                  <option value="Computing">💻 Computing</option>
                  <option value="Home Appliances">📺 Home Appliances</option>
                  <option value="Hardware & Tools">🔨 Hardware & Tools</option>
                  <option value="Fashion">👕 Fashion</option>
                  <option value="Home & Daily Items">🧼 Home & Daily Items</option>
                  <option value="Food & Vegetables">🥬 Food & Vegetables</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-900">Description</label>
                  <button
                    type="button"
                    onClick={applyQuickTemplate}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  >
                    📝 Auto Template
                  </button>
                </div>
                <textarea 
                  required 
                  rows={4} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 resize-none focus:bg-white focus:outline-none" 
                  placeholder="Detail specifications, features, and condition..." 
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 flex gap-4">
              <button 
                type="submit" 
                disabled={loading || uploadingImages} 
                className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition disabled:opacity-50"
              >
                {loading 
                  ? 'Publishing...' 
                  : pendingSubmit 
                  ? 'Please Sign In to Complete Post' 
                  : 'Publish Item'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
