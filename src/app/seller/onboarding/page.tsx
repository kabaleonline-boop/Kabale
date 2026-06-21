// src/app/seller/onboarding/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveStoreConfig } from '@/services/storeService';
import { doc, updateDoc } from 'firebase/firestore'; // 🚨 Added Firebase imports
import { db } from '@/lib/firebase';

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState(''); // 🚨 New State for URL Slug
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [description, setDescription] = useState('');

  // Auto-fill the slug to make it easy for them
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    if (!storeSlug || storeSlug === name.slice(0, -1).toLowerCase().replace(/\s+/g, '-')) {
      setStoreSlug(name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'seller')) {
      router.push('/');
    }
  }, [profile, authLoading, router]);

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up the slug just in case they typed weird characters
      const cleanSlug = storeSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      
      // 1. Save the Store Configuration
      await saveStoreConfig(cleanSlug, {
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

      // 2. 🚨 IMPORTANT: Save this slug to the User's Profile globally!
      if (profile?.uid) {
        await updateDoc(doc(db, 'users', profile.uid), { 
          storeSlug: cleanSlug 
        });
      }
      
      // Use window.location.href instead of router.push to force AuthContext to reload the new storeSlug!
      window.location.href = '/seller/dashboard';
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
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">🏪</div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Set up your store</h2>
        <p className="mt-2 text-slate-500">Enter a few details to open your doors to the Kabale region.</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleCompleteSetup}>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Store Name</label>
              <input type="text" required value={storeName} onChange={handleNameChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" placeholder="e.g., Kigezi Electronics" />
            </div>

            {/* 🚨 New URL Slug Field */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Store URL (Username)</label>
              <div className="flex bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
                <span className="flex items-center pl-5 pr-1 text-slate-400 font-medium">kabaleonline.com/s/</span>
                <input type="text" required value={storeSlug} onChange={(e) => setStoreSlug(e.target.value)} className="w-full py-4 pr-5 bg-transparent border-none focus:outline-none font-bold text-slate-900" placeholder="kigezi-electronics" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">WhatsApp Number</label>
              <input type="text" required value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900" placeholder="e.g., +256 700 000 000" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Store Description</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none" placeholder="What do you sell? Delivery policies? Make it sound good..." />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Open My Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
