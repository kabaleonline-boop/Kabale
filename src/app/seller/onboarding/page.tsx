// src/app/seller/onboarding/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveStoreConfig } from '@/services/storeService';

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [description, setDescription] = useState('');

  // Protect route
  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'seller')) {
      router.push('/');
    }
  }, [profile, authLoading, router]);

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const storeSlug = profile?.displayName?.toLowerCase().replace(/\s+/g, '-') || 'my-shop';
      
      // Save the 3 core fields, plus a sleek default theme so their store works instantly
      await saveStoreConfig(storeSlug, {
        storeName,
        whatsappNumber,
        description,
        ownerId: profile?.uid,
        verified: false,
        theme: {
          primaryColor: '#059669',
          accentColor: '#dc2626',
          layoutMode: 'bento-grid',
          fontFamily: 'Inter',
        }
      });
      
      // Send them to their new control center
      router.push('/seller/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to set up your store. Please try again.');
      setSaving(false);
    }
  };

  if (authLoading || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
          🏪
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Set up your store</h2>
        <p className="mt-2 text-slate-500">Enter a few details to open your doors to the Kabale region.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleCompleteSetup}>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Store Name</label>
              <input 
                type="text" 
                required 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                placeholder="e.g., Kigezi Electronics" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">WhatsApp Number</label>
              <input 
                type="text" 
                required 
                value={whatsappNumber} 
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" 
                placeholder="e.g., +256 700 000 000" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Store Description</label>
              <textarea 
                required 
                rows={3}
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none" 
                placeholder="What do you sell? Delivery policies? Make it sound good..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {saving ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Open My Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
