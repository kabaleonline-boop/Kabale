// src/app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllStores, toggleStoreVerification } from '@/services/adminService';
import { StoreConfig } from '@/types';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { profile, loading: authLoading } = useAuth();
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Security Check: Only fetch if user is an admin
      if (profile?.role === 'admin') {
        const fetchedStores = await getAllStores();
        setStores(fetchedStores);
      }
      setLoading(false);
    }
    
    if (!authLoading) loadData();
  }, [profile, authLoading]);

  const handleToggleVerification = async (storeId: string, currentStatus: boolean) => {
    try {
      await toggleStoreVerification(storeId, currentStatus);
      // Optimistically update the UI
      setStores(stores.map(store => 
        store.id === storeId ? { ...store, verified: !currentStatus } : store
      ));
    } catch (error) {
      alert('Failed to update verification status.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Strict Role Protection Guard
  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500">You do not have administrator privileges to view this area.</p>
        <Link href="/" className="mt-6 text-emerald-600 font-semibold hover:underline">
          Return to Mall Lobby
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Platform Command Center</h1>
          <p className="text-slate-500">Manage stores, moderate listings, and oversee verification.</p>
        </div>

        {/* High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Total Stores</div>
            <div className="text-3xl font-black text-slate-900">{stores.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Verified Partners</div>
            <div className="text-3xl font-black text-emerald-600">
              {stores.filter(s => s.verified).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Pending Review</div>
            <div className="text-3xl font-black text-amber-500">
              {stores.filter(s => !s.verified).length}
            </div>
          </div>
        </div>

        {/* Stores Moderation Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Store Verification Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Store Name</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No stores registered yet.
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {store.storeName}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        <Link href={`/s/${store.id}`} target="_blank" className="hover:text-emerald-600 hover:underline">
                          /s/{store.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {store.whatsappNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {store.verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleVerification(store.id, store.verified)}
                          className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition ${
                            store.verified 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {store.verified ? 'Revoke' : 'Approve Store'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
