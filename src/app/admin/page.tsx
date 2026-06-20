// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPlatformStats } from '@/services/adminService';
import Link from 'next/link';

export default function AdminHomePage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getPlatformStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-slate-200 h-64 rounded-3xl w-full"></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
        <p className="text-slate-500 mt-1">Live data from the Kabale Online database.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">👥</span>
            Total Registered Users
          </div>
          <div className="text-4xl font-black text-slate-900">{stats.totalUsers.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm mb-4">
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">🏪</span>
            Active Storefronts
          </div>
          <div className="text-4xl font-black text-slate-900">{stats.totalStores.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm mb-4">
            <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg">📦</span>
            Products Cataloged
          </div>
          <div className="text-4xl font-black text-slate-900">{stats.totalProducts.toLocaleString()}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/official" className="p-4 bg-emerald-600 text-white rounded-2xl shadow-sm hover:bg-emerald-500 transition group relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-2xl mb-2 block">⭐</span>
            <h3 className="font-bold">Add to Official Store</h3>
            <p className="text-xs text-emerald-100 mt-1">Upload premium inventory</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform"></div>
        </Link>
        
        <Link href="/admin/broadcast" className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition">
          <span className="text-2xl mb-2 block">📢</span>
          <h3 className="font-bold text-slate-900">Email Broadcast</h3>
          <p className="text-xs text-slate-500 mt-1">Send updates to all users</p>
        </Link>
        
        <Link href="/admin/stores" className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition">
          <span className="text-2xl mb-2 block">🏅</span>
          <h3 className="font-bold text-slate-900">Verify Stores</h3>
          <p className="text-xs text-slate-500 mt-1">Review pending badges</p>
        </Link>

        <Link href="/admin/products" className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition">
          <span className="text-2xl mb-2 block">🛡️</span>
          <h3 className="font-bold text-slate-900">Moderate Content</h3>
          <p className="text-xs text-slate-500 mt-1">Remove bad listings</p>
        </Link>
      </div>

    </div>
  );
}
