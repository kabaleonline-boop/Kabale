'use client';

import { useState } from 'react';
import { createProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
  
  // AI Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Fallback seamlessly so anyone can use it without breaking the database
  const storeSlug = (profile as any)?.storeSlug || profile?.uid || 'default-store';

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
      console.error('Environment Error: Cloudinary configuration is missing.');
      alert('Upload service is temporarily unavailable. Please check your configuration.');
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

        if (!signRes.ok) throw new Error('Failed to securely sign the image upload request.');
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
          console.error("Cloudinary rejection details:", uploadData);
          alert(`Failed to process image: ${uploadData.error?.message || 'Unknown error'}`);
        }
      }

      setImages((prev) => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('A network error occurred while uploading your images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // The AI Description Generator Function
  const generateAIDescription = async () => {
    if (!title) {
      alert("Please enter a Product Title first so the AI knows what to write about!");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category })
      });

      if (!response.ok) throw new Error('AI generation failed');
      
      const data = await response.json();
      if (data.description) {
        setDescription(data.description);
      } else {
        throw new Error('No description returned');
      }
    } catch (error) {
      console.error(error);
      alert("The AI is currently busy or unavailable. Please try again or write the description manually.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }

    setLoading(true);

    try {
      // 🚨 FIX: Extract the ownerId from the profile
      const ownerId = profile?.uid || (profile as any)?.id;

      if (!ownerId) {
        alert("Authentication Error: We could not verify your session.");
        setLoading(false);
        return;
      }

      await createProduct({
        title,
        price: Number(price),
        description,
        storeCategory: category,
        globalCategory: category,
        storeId: storeSlug, 
        ownerId: ownerId, // 🚨 FIX: Added the ownerId so Firestore allows the write!
        images: images, 
        stock: Number(stock), 
      });

      alert('Product published successfully!');
      router.push('/seller/dashboard'); 
    } catch (error: any) {
      console.error("Publishing Error:", error);
      alert(error?.message || 'Failed to publish the product to your storefront.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="text-4xl">📦</span> Add Product
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Upload inventory directly to your digital storefront.</p>
          </div>
          <Link href="/seller/dashboard" className="hidden sm:inline-flex text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            &larr; Dashboard
          </Link>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <form onSubmit={handleUpload} className="space-y-8">

            {/* Image Uploader */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-4">Product Imagery (Max 5)</label>
              <div className="flex flex-wrap gap-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 transition-all cursor-pointer text-slate-500 hover:text-emerald-600 group">
                    {uploadingImages ? (
                      <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Upload</span>
                      </>
                    )}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium">Use high-quality, square images. The first image will be your storefront cover.</p>
            </div>

            <hr className="border-slate-100" />

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-900 mb-2">Product Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
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
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
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
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                  min="1" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-900 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1.25rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
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
                  <label className="block text-sm font-bold text-slate-900">Product Description</label>
                  <button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={isGeneratingAI || !title}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      !title 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> 
                        Writing...
                      </>
                    ) : (
                      <>✨ Auto-Write</>
                    )}
                  </button>
                </div>
                <textarea 
                  required 
                  rows={5} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-medium text-slate-900 placeholder:text-slate-400" 
                  placeholder="Detail the specifications, features, and warranty information... or use AI!" 
                />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/seller/dashboard" 
                className="w-full sm:w-auto text-center bg-slate-100 text-slate-900 font-bold py-5 px-8 rounded-2xl hover:bg-slate-200 transition-all duration-200"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={loading || uploadingImages || isGeneratingAI} 
                className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : 'Publish Product to Store'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
