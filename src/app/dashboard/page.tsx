// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UniversalDashboardPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  // Protect the route: Kick unauthenticated users back to the homepage
  useEffect(() => {
    if (!loading && !profile) {
      router.push('/');
    }
  }, [profile, loading, router]);

  // Show a smooth loading state while checking auth
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-3xl shadow-sm border-4 border-white">
            {profile.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {profile.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 font-medium mt-1 capitalize flex items-center gap-2">
              {profile.role} Account
              {profile.role === 'admin' && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Super Admin</span>}
              {profile.role === 'seller' && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Verified Seller</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 space-y-6">
        
        {/* =========================================
            ADMINISTRATOR SECTION (Only visible to Admins)
            ========================================= */}
        {profile.role === 'admin' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm shadow-purple-900/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-purple-600">🛡️</span> Super Admin Controls
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin" className="p-5 bg-purple-50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:bg-purple-100 transition group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">🎛️</div>
                <h3 className="font-bold text-purple-900">Command Center</h3>
                <p className="text-sm text-purple-700 mt-1">Platform stats & overview</p>
              </Link>
              <Link href="/admin/stores" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-sm transition">
                <div className="text-3xl mb-3">🏅</div>
                <h3 className="font-bold text-slate-900">Verify Stores</h3>
                <p className="text-sm text-slate-500 mt-1">Review pending storefronts</p>
              </Link>
              <Link href="/admin/official" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-sm transition">
                <div className="text-3xl mb-3">⭐</div>
                <h3 className="font-bold text-slate-900">Official Catalog</h3>
                <p className="text-sm text-slate-500 mt-1">Manage Kabale Official</p>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================
            SELLER SECTION (Only visible to Sellers)
            ========================================= */}
        {profile.role === 'seller' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm shadow-emerald-900/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-emerald-500">🏪</span> Store Management
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/seller/settings" className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100 transition group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">🎨</div>
                <h3 className="font-bold text-emerald-900">Storefront Layout</h3>
                <p className="text-sm text-emerald-700 mt-1">Customize your colors & link</p>
              </Link>
              <Link href="/seller/products/new" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="font-bold text-slate-900">Add Product</h3>
                <p className="text-sm text-slate-500 mt-1">Upload new inventory</p>
              </Link>
              <Link href="/seller/orders" className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-bold text-slate-900">Store Orders</h3>
                <p className="text-sm text-slate-500 mt-1">Manage customer purchases</p>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================
            BUYER SECTION (Visible to EVERYONE)
            ========================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <span>🛍️</span> My Shopping
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/buyer/orders" className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">🚚</div>
              <div>
                <h3 className="font-bold text-slate-900">Order History</h3>
                <p className="text-sm text-slate-500">Track your current packages</p>
              </div>
            </Link>
            <Link href="/products" className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-100 transition">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">🔍</div>
              <div>
                <h3 className="font-bold text-slate-900">Continue Shopping</h3>
                <p className="text-sm text-slate-500">Browse the global catalog</p>
              </div>
            </Link>
          </div>
        </div>

        {/* =========================================
            UPGRADE PROMPT (Only visible to normal Buyers)
            ========================================= */}
        {profile.role === 'buyer' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-lg text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2 mb-2">
                🚀 Start Selling on Kabale
              </h2>
              <p className="text-slate-400 text-sm max-w-md">
                Turn your account into a verified storefront. Get a custom link, manage inventory, and reach thousands of buyers.
              </p>
            </div>
            <Link href="/sell" className="shrink-0 bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">
              Open a Store
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
