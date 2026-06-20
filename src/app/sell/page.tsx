// src/app/sell/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SellLandingPage() {
  const { profile, loading, openAuthModal } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const router = useRouter();

  // The engine that converts a regular user into a seller
  const handleCreateStore = async () => {
    if (!profile) return;
    
    setUpgrading(true);
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { role: 'seller' });
      
      // Use window.location.href to force a hard reload. 
      // This guarantees the AuthContext refreshes the role to 'seller' immediately.
      window.location.href = '/seller/settings';
    } catch (error) {
      console.error('Error upgrading account:', error);
      alert('Something went wrong. Please try again.');
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Pitch */}
      <section className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-emerald-500/20 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-emerald-500/30">
            Open for Business in Kabale
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
            Take Your Shop <span className="text-emerald-500">Online.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Stop relying solely on foot traffic. Open a customizable digital storefront, list your products, and let our riders handle the delivery. You just focus on selling.
          </p>
          
          {loading ? (
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : !profile ? (
            <button 
              onClick={openAuthModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-full text-lg transition shadow-xl shadow-emerald-900/50"
            >
              Sign In to Open a Store
            </button>
          ) : profile.role === 'seller' || profile.role === 'admin' ? (
            <button 
              onClick={() => router.push('/seller/settings')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-full text-lg transition shadow-xl shadow-emerald-900/50"
            >
              Go to My Dashboard
            </button>
          ) : (
            <button 
              onClick={handleCreateStore}
              disabled={upgrading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-black py-4 px-10 rounded-full text-lg transition shadow-xl shadow-emerald-900/50"
            >
              {upgrading ? 'Setting up your shop...' : 'Create My Free Store Now'}
            </button>
          )}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Why Sell on Kabale Online?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Store URL</h3>
              <p className="text-slate-600 leading-relaxed">
                Get a dedicated, branded link (e.g., <span className="font-mono text-sm bg-slate-100 px-1 rounded">kabaleonline.com/s/your-shop</span>) to share on WhatsApp and Facebook.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Keep 100% of Revenue</h3>
              <p className="text-slate-600 leading-relaxed">
                For our early launch phase, there are zero commission fees. You get paid directly by the buyer or rider in full via Cash or Mobile Money.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">We Handle Visibility</h3>
              <p className="text-slate-600 leading-relaxed">
                Every product you upload is instantly searchable on the main Kabale Online homepage. Reach buyers who are looking for exactly what you sell.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
