// src/app/seller/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStoreConfig, saveStoreConfig } from '@/services/storeService';
import { StoreConfig, StoreTheme } from '@/types';

export default function SellerSettingsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [theme, setTheme] = useState<StoreTheme>({
    primaryColor: '#059669', // Default Emerald
    accentColor: '#dc2626',  // Default Red
    layoutMode: 'bento-grid',
    fontFamily: 'Inter',
  });

  // Use the profile UID or an explicitly assigned slug for the store
  const storeSlug = profile?.displayName?.toLowerCase().replace(/\s+/g, '-') || 'my-shop';

  useEffect(() => {
    async function loadStore() {
      if (!profile?.uid) return;
      try {
        const config = await getStoreConfig(storeSlug);
        if (config) {
          setStoreName(config.storeName);
          setWhatsappNumber(config.whatsappNumber || '');
          setTheme(config.theme);
        }
      } catch (err) {
        console.error('Failed to load store configuration', err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) loadStore();
  }, [profile, authLoading, storeSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveStoreConfig(storeSlug, {
        storeName,
        whatsappNumber,
        theme,
        ownerId: profile?.uid,
        verified: false, // Remains false until admin verification step
      });
      alert('Storefront customization saved successfully!');
    } catch (err) {
      alert('Error updating configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Control Panel Form */}
        <form onSubmit={handleSave} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Customize Storefront</h1>
            <p className="text-sm text-slate-500">Tailor your public storefront matching your brand assets.</p>
          </div>

          <hr className="border-slate-100" />

          {/* Core Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Store Display Name</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600 text-sm"
                placeholder="e.g., Macro Hardware"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp Business Number</label>
              <input 
                type="text" 
                value={whatsappNumber} 
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600 text-sm"
                placeholder="e.g., 256700000000"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Theme & Visual Layout Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Branding Styles</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={theme.primaryColor} 
                    onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                    className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                  />
                  <span className="text-xs font-mono">{theme.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={theme.accentColor} 
                    onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                    className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                  />
                  <span className="text-xs font-mono">{theme.accentColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Desktop Layout Architecture</label>
              <select 
                value={theme.layoutMode} 
                onChange={(e) => setTheme({...theme, layoutMode: e.target.value as any})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-emerald-600 text-sm"
              >
                <option value="bento-grid">Modern Bento Structural Matrix</option>
                <option value="list">Dense Linear Item Catalog</option>
                <option value="compact">Minimalist High-Volume Grid</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-slate-950 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-slate-800 transition disabled:opacity-50"
          >
            {saving ? 'Publishing Changes...' : 'Save & Publish Live'}
          </button>
        </form>

        {/* Right Side: Dynamic Interactive Preview Container */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Real-Time Sandbox Preview</h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Mobile Optimized View</span>
          </div>

          {/* Virtual Phone Container */}
          <div className="border border-slate-200 shadow-2xl rounded-[2.5rem] p-3 bg-slate-950 max-w-sm mx-auto aspect-[9/19] overflow-hidden">
            <div className="bg-white w-full h-full rounded-[2rem] overflow-y-auto flex flex-col font-sans text-xs">
              
              {/* Virtual App Header bar painted with Dynamic Color Variables */}
              <div 
                className="p-4 flex items-center justify-between text-white transition-colors duration-300"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <span className="font-bold tracking-tight text-sm">{storeName || 'My Storefront Blueprint'}</span>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">🛒</div>
              </div>

              {/* Layout Content Body Preview */}
              <div className="p-4 flex-1 space-y-4 bg-slate-50">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-1">
                  <div className="h-2 w-12 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-300 rounded"></div>
                </div>

                {/* Conditional Rendering mimicking selected theme layout architecture */}
                {theme.layoutMode === 'bento-grid' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 h-24 bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between">
                      <span className="font-bold text-[10px]" style={{ color: theme.primaryColor }}>Featured Promo</span>
                      <div className="h-5 w-5 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                    </div>
                    <div className="h-24 bg-white border border-slate-100 rounded-xl p-2">
                      <div className="w-full h-8 bg-slate-100 rounded"></div>
                    </div>
                    <div className="h-16 bg-white border border-slate-100 rounded-xl p-2 col-span-3">
                      <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                )}

                {theme.layoutMode === 'list' && (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-2 border border-slate-100 rounded-xl flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-2.5 w-2/3 bg-slate-200 rounded"></div>
                          <div className="h-2 w-1/3 bg-slate-100 rounded"></div>
                        </div>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                      </div>
                    ))}
                  </div>
                )}

                {theme.layoutMode === 'compact' && (
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 4].map((i) => (
                      <div key={i} className="bg-white p-2 border border-slate-100 rounded-xl space-y-2 text-center">
                        <div className="w-full aspect-square bg-slate-100 rounded-lg"></div>
                        <div className="h-2 w-2/3 bg-slate-200 rounded mx-auto"></div>
                        <div className="h-3 w-1/2 rounded mx-auto" style={{ backgroundColor: theme.primaryColor }}></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
