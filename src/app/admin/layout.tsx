// src/app/admin/layout.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Restricted Area</h1>
        <p className="text-slate-500">Super Admin clearance required.</p>
        <Link href="/" className="mt-6 text-emerald-600 font-semibold hover:underline">Return to Lobby</Link>
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Stores & Badges', href: '/admin/stores', icon: '🏪' },
    { name: 'Product Catalog', href: '/admin/products', icon: '📦' },
    { name: 'User Management', href: '/admin/users', icon: '👥' },
    { name: 'Official Store Upload', href: '/admin/official', icon: '⭐' },
    { name: 'Trusted Partners', href: '/admin/partners', icon: '🤝' },
    { name: 'Email Broadcast', href: '/admin/broadcast', icon: '📢' },
    { name: 'Global Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between p-4 sticky top-0 z-50">
        <span className="font-bold tracking-widest text-sm uppercase">Admin Panel</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 text-slate-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 md:min-h-screen border-r border-slate-800`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-white font-black text-xl tracking-tight">KABALE<span className="text-emerald-500">ONLINE</span></h2>
          <p className="text-xs text-slate-500 font-mono mt-1">SUPER ADMIN SUITE</p>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
