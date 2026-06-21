// src/app/admin/official/page.tsx
'use client';

import { useState } from 'react';
import { createProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 

export default function AdminOfficialStorePage() {
  const router = useRouter();
  const { profile } = useAuth(); 
  
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
        const paramsToSign = { folder, timestamp };

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
          alert(`Upload failed: ${uploadData.error?.message || 'Check console'}`);
        }
      }
      setImages((prev) => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error('Upload crash:', error);
      alert('Failed to upload images.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert('Please upload an image.');
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      alert("Next.js keys missing! Redeploy without Build Cache.");
      setLoading(false);
      return;
    }

    try {
      const ownerId = (profile as any)?.id || (profile as any)?.uid;
      if (!ownerId) {
        alert("Authentication error: Could not verify your user ID.");
        setLoading(false);
        return;
      }

      // 🚨 CRITICAL: If this fails, it is because of Algolia inside createProduct.
      // Try commenting out the Algolia call inside your service file if it fails.
      await createProduct({
        title,
        price: Number(price),
        description,
        storeCategory: category,
        globalCategory: category,
        storeId: 'kabale-official',
        ownerId: ownerId, 
        images: images, 
        stock: 100, 
      } as any); 

      alert('Added to Official Store!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error("DEBUG ERROR:", error);
      alert(error?.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-black mb-6">Official Store Manager</h1>
      <form onSubmit={handleUpload} className="space-y-6">
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2" required />
        <button type="submit" disabled={loading} className="bg-black text-white p-3 w-full">
          {loading ? 'Publishing...' : 'Publish to Official Store'}
        </button>
      </form>
    </div>
  );
}
