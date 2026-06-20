// src/app/admin/stores/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllStores, toggleStoreVerification } from '@/services/adminService';
import { StoreConfig } from '@/types';
import Link from 'next/link';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      const data = await getAllStores();
      setStores(data);
      setLoading(false);
    }
    loadStores();
  }, []);

  const handleToggle = async (storeId: string, currentStatus: boolean) => {
    try {
      await toggleStoreVerification(storeId, currentStatus);
      setStores(stores.map(store => store.id === storeId ? { ...store, verified: !currentStatus } : store));
    } catch (error) {
      alert('Failed to update verification status.');
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-200 h-64 rounded-3xl w-full"></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Storefronts & Badges</h1>
        <p className="text-slate-500 text-sm">Manage verification badges to build buyer trust.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Store Details</th>
                <th className="px-6 py-4">Theme</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stores.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No stores found.</td></tr>
              )}
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{store.storeName}</div>
                    <Link href={`/s/${store.id}`} target="_blank" className="text-xs text-emerald-600 hover:underline">/s/{store.id}</Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: store.theme.primaryColor }}></div>
                      <span className="text-xs text-slate-500 uppercase">{store.theme.layoutMode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{store.whatsappNumber || 'Not provided'}</td>
                  <td className="px-6 py-4">
                    {store.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Verified Partner
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggle(store.id, store.verified)}
                      className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition ${store.verified ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >
                      {store.verified ? 'Revoke Badge' : 'Approve Badge'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
