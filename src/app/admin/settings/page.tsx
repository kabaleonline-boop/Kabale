// src/app/admin/settings/page.tsx
'use client';

import Link from 'next/link';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Global Settings</h1>
        <p className="text-slate-500 text-sm">Configure platform-wide rules, fees, and maintenance states.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Platform Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Platform Configuration</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Platform Commission Fee (%)</label>
              <input 
                type="number" 
                disabled 
                value="0" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium" 
              />
              <p className="text-xs text-emerald-600 font-semibold mt-2">Locked to 0% for Launch Phase.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Global Maintenance Mode</label>
              <select 
                disabled 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
              >
                <option>Disabled (Live)</option>
                <option>Enabled (Offline)</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">Takes the entire marketplace offline for system updates.</p>
            </div>

            <hr className="border-slate-100" />

            <button 
              disabled 
              className="w-full bg-slate-200 text-slate-400 font-bold py-3.5 rounded-xl cursor-not-allowed"
            >
              Save Settings
            </button>
          </div>
        </div>
        
        <div className="space-y-8">
          
          {/* Kabale Official Store Shortcut */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span>⭐</span> Kabale Official Store
            </h3>
            <p className="text-sm text-emerald-100/70 mb-6 leading-relaxed">
              Manage the featured inventory on the homepage directly through the Official Store upload panel.
            </p>
            <Link 
              href="/admin/official" 
              className="inline-block bg-white text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-emerald-50 transition text-sm shadow-sm"
            >
              Go to Official Uploads
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-6 sm:p-8 rounded-2xl border border-red-100">
            <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-600/80 mb-6">Operations that affect the global database and search indexes.</p>
            <button 
              onClick={() => alert('Search re-indexing is currently handled automatically on upload. Manual sync requires Algolia Admin permissions.')}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-sm text-sm"
            >
              Force Re-index Algolia Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
