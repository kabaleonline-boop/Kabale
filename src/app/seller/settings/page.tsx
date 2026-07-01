// src/app/seller/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStoreConfig, saveStoreConfig } from '@/services/storeService';
import { StoreConfig, StoreTheme } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SellerSettingsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [theme, setTheme] = useState<StoreTheme>({
    primaryColor: '#0f172a', 
    accentColor: '#10b981',  
    layoutMode: 'bento-grid',
    fontFamily: 'Inter',
  });

  // 🚨 FIX 1: If they are an admin, default them to the official store so it never gets confused
  const storeSlug = profile?.role === 'admin' 
    ? ((profile as any)?.storeSlug || 'kabale-official') 
    : (profile as any)?.storeSlug;

  // Protect route and redirect to onboarding if missing slug
  useEffect(() => {
    if (!authLoading && profile) {
      if (profile.role !== 'seller' && profile.role !== 'admin') {
        router.push('/');
      } else if (profile.role === 'seller' && !storeSlug) {
        router.push('/seller/onboarding');
      }
    }
  }, [profile, authLoading, storeSlug, router]);

  // Load existing data
  useEffect(() => {
    async function loadStore() {
      if (!storeSlug) {
        setLoading(false);
        return; 
      }

      try {
        const config = await getStoreConfig(storeSlug);
        if (config) {
          setStoreName(config.storeName);
          setWhatsappNumber(config.whatsappNumber || '');
          setDescription(config.description || '');
          setLogoUrl(config.logoUrl || null);
          if (config.theme) setTheme(config.theme);
        }
      } catch (err) {
        console.error('Failed to load store configuration', err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) loadStore();
  }, [authLoading, storeSlug]);

  // 🚨 Exact Logic from Admin Upload applied to Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      console.error('Environment Error: Cloudinary configuration is missing.');
      alert('Upload service is temporarily unavailable. Please check your configuration.');
      return;
    }

    setUploadingLogo(true);

    try {
      const file = files[0]; // Only need the first file for a logo
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = 'kabale_stores'; 
      const paramsToSign = { folder, timestamp };

      // 1. Get secure signature from backend
      const signRes = await fetch('/api/cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
      });

      if (!signRes.ok) throw new Error('Failed to securely sign the image upload request.');
      const { signature } = await signRes.json();

      // 2. Upload directly to Cloudinary
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
        setLogoUrl(finalUrl);
      } else {
        console.error("Cloudinary rejection details:", uploadData);
        alert(`Failed to process image: ${uploadData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Image upload crash:', error);
      alert('A network error occurred while uploading your image. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSlug) {
      alert('Authentication Error: Missing store URL slug.');
      return;
    }

    setSaving(true);
    try {
      // 🚨 FIX 2: Create a perfectly clean payload so Firebase doesn't crash on 'undefined'
      const payload: any = {
        storeName,
        whatsappNumber,
        description,
        theme,
        ownerId: profile?.uid,
        verified: profile?.role === 'admin', // Admins are automatically verified
      };

      // Only attach logoUrl if it has a value
      if (logoUrl) {
        payload.logoUrl = logoUrl;
      }

      await saveStoreConfig(storeSlug, payload);
      alert('Storefront customization saved successfully!');
    } catch (err: any) {
      console.error('Save error detailed:', err);
      // 🚨 FIX 3: Actually show the exact Firebase error message if it fails
      alert(`Error updating configuration:\n\n${err.message || 'Unknown Firebase Error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Dynamic gradient style for live preview
  const gradientStyle = {
    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Control Panel Form */}
        <form onSubmit={handleSave} className="lg:col-span-5 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Settings</h1>
              <p className="text-sm text-slate-500 mt-1">Tailor your public storefront matching your brand.</p>
            </div>
            <Link href="/seller/dashboard" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-full">
              &larr; Dashboard
            </Link>
          </div>

          <hr className="border-slate-100" />

          {/* Image Uploader for Logo */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-4">Store Logo / Profile Image</label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden shadow-sm flex-shrink-0 bg-slate-50">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl">🏪</div>
                )}
              </div>

              <div className="flex-1">
                <label className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition cursor-pointer">
                  {uploadingLogo ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Image'
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
                <p className="text-xs text-slate-400 mt-2">Recommended: Square image, max 2MB.</p>
                {logoUrl && (
                  <button type="button" onClick={() => setLogoUrl(null)} className="text-xs text-red-500 font-bold mt-2 hover:underline">
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Core Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Display Name</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">WhatsApp Number</label>
              <input 
                type="text" 
                value={whatsappNumber} 
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
                placeholder="e.g. 0770000000"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Store Description</label>
              <textarea 
                rows={3}
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Theme Controls */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800">Branding & Gradient Colors</h3>
            <p className="text-xs text-slate-500">Pick two colors to create your store&apos;s custom header gradient.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Base Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={theme.primaryColor} 
                    onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shadow-sm"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-700 uppercase">{theme.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Highlight Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={theme.accentColor} 
                    onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white shadow-sm"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-700 uppercase">{theme.accentColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 mt-4">Desktop Layout Architecture</label>
              <select 
                value={theme.layoutMode} 
                onChange={(e) => setTheme({...theme, layoutMode: e.target.value as any})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
              >
                <option value="bento-grid">Modern Bento Structural Matrix</option>
                <option value="list">Dense Linear Item Catalog</option>
                <option value="compact">Minimalist High-Volume Grid</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving || uploadingLogo}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {saving ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Save & Publish Live'}
          </button>
        </form>

        {/* Right Side: Virtual Phone Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Sandbox Preview</h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full">Mobile View</span>
          </div>

          <div className="border border-slate-200 shadow-2xl rounded-[3rem] p-4 bg-slate-900 max-w-sm mx-auto aspect-[9/19] overflow-hidden relative">
            <div className="bg-slate-50 w-full h-full rounded-[2.5rem] overflow-y-auto flex flex-col font-sans text-xs pb-10">

              {/* Dynamic Gradient Header */}
              <div 
                className="pt-10 pb-6 px-5 text-white transition-all duration-300 rounded-t-[2.5rem] relative" 
                style={gradientStyle}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full border-2 border-white/30 object-cover bg-white" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">🏪</div>
                    )}
                    <span className="font-bold tracking-tight text-base truncate max-w-[120px]">{storeName || 'My Store'}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-sm">🛒</div>
                </div>
              </div>

              <div className="p-4 flex-1 space-y-4 -mt-4 relative z-20">
                <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] space-y-2 text-center">
                  <div className="h-2 w-12 bg-slate-200 rounded mx-auto mb-3"></div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{description || 'Store description will appear here...'}</p>
                </div>

                {theme.layoutMode === 'bento-grid' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 h-28 bg-white rounded-2xl p-3 flex flex-col justify-between shadow-sm">
                      <span className="font-bold text-xs" style={{ color: theme.primaryColor }}>Featured</span>
                      <div className="h-6 w-6 rounded-full" style={{ background: gradientStyle.background }}></div>
                    </div>
                    <div className="h-28 bg-white rounded-2xl p-2 shadow-sm">
                      <div className="w-full h-10 bg-slate-50 rounded-xl"></div>
                    </div>
                    <div className="h-20 bg-white rounded-2xl p-3 col-span-3 shadow-sm">
                      <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                )}
                
                {theme.layoutMode === 'list' && (
                   <div className="space-y-2">
                     {[1, 2, 3].map((i) => (
                       <div key={i} className="bg-white p-3 rounded-2xl flex gap-3 items-center shadow-sm">
                         <div className="w-12 h-12 bg-slate-50 rounded-xl shrink-0"></div>
                         <div className="flex-1 space-y-2">
                           <div className="h-2.5 w-2/3 bg-slate-200 rounded"></div>
                           <div className="h-2 w-1/3 bg-slate-100 rounded"></div>
                         </div>
                         <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.accentColor }}></div>
                       </div>
                     ))}
                   </div>
                 )}

                 {theme.layoutMode === 'compact' && (
                   <div className="grid grid-cols-2 gap-2">
                     {[1, 2, 4].map((i) => (
                       <div key={i} className="bg-white p-3 rounded-2xl space-y-3 text-center shadow-sm">
                         <div className="w-full aspect-square bg-slate-50 rounded-xl"></div>
                         <div className="h-2 w-2/3 bg-slate-200 rounded mx-auto"></div>
                         <div className="h-3 w-1/2 rounded mx-auto" style={{ backgroundColor: theme.primaryColor }}></div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>
            {/* iPhone style home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}