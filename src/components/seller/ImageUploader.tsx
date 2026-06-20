// src/components/seller/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { getCloudinarySignature } from '@/actions/cloudinary';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Get the secure signature from our Next.js backend
      const { timestamp, signature, folder, apiKey, cloudName } = await getCloudinarySignature();

      // 2. Prepare the payload for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey as string);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      // 3. Post directly to Cloudinary (Bypassing Vercel's bandwidth limits)
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      // Pass the secure URL back up to the parent form
      onUploadSuccess(data.secure_url);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-8 h-8 mb-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> product image</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/jpeg, image/png, image/webp" 
          onChange={handleFileChange} 
          disabled={uploading}
        />
      </label>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
