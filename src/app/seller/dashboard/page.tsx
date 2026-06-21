// src/app/seller/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SellerDashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  // Simple auth check: Just make sure they are logged in! No complicated role restrictions.
  useEffect(() => {
    if (!loading && !profile) {
      router.push('/');
    }
  }, [profile, loading, router]);

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Seller Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Welcome back, {profile.displayName || 'Seller'}. Manage your business below.</p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              Store is Live
            </span>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Orders */}
          <Link href="/seller/orders" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11h-1.5V6a2 2 0 00-2-2H8.5a2 2 0 00-2 2v5H5a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2zM8.5 6h7v5h-7V6zm10.5 10H5v-3h14v3z" /></svg>
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">📦</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Manage Orders</h3>
            <p className="text-slate-500 text-sm relative z-10">Process new deliveries, update rider statuses, and track revenue.</p>
          </Link>

          {/* Products */}
          <Link href="/seller/products/new" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            </div>
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">🏷️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Add Products</h3>
            <p className="text-slate-500 text-sm relative z-10">Upload new inventory, set pricing, and list items to your storefront.</p>
          </Link>

          {/* Settings / Customize */}
          <Link href="/seller/settings" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14zm-1-7h2v4h-2v-4zm0-4h2v2h-2V8z"/></svg>
            </div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 relative z-10">🎨</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Store Settings</h3>
            <p className="text-slate-500 text-sm relative z-10">Customize your theme colors, layout, and update store descriptions.</p>
          </Link>

        </div>
      </div>
    </div>
  );
}
