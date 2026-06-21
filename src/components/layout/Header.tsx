// src/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GlobalSearch from '@/components/GlobalSearch';

export default function Header() {
  const { profile, loading, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  // 1. Hide the header completely on Super Admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reduced header height from h-16 to h-14 for a slimmer look */}
        <div className="flex justify-between items-center h-14 gap-4">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-black tracking-tight text-slate-900">
              KABALE <span className="text-emerald-600">ONLINE</span>
            </span>
          </Link>

          {/* Center: Algolia Search Bar (Hidden on small mobile, visible on tablet+) */}
          <div className="hidden md:block flex-1 max-w-2xl px-4">
            <GlobalSearch />
          </div>

          {/* Right: Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/sell" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition">
              Sell on Kabale
            </Link>

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
            ) : profile ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{profile.displayName?.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Desktop Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                    <Link href="/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 border-b border-slate-100">🎛️ Go to Dashboard</Link>
                    <Link href="/buyer/orders" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 mt-1">My Orders</Link>
                    
                    {profile.role === 'seller' && (
                      <>
                        <Link href="/seller/settings" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50">Store Layout</Link>
                        <Link href="/seller/products/new" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50">Add Product</Link>
                      </>
                    )}
                    
                    {profile.role === 'admin' && (
                      <Link href="/admin" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-purple-600 font-semibold hover:bg-purple-50">Admin Command</Link>
                    )}
                    
                    <hr className="my-1 border-slate-100" />
                    <button onClick={() => { logout(); setIsUserDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={openAuthModal}
                className="bg-slate-900 text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-slate-800 transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small screens below header) */}
        <div className="md:hidden pb-3">
          <GlobalSearch />
        </div>
      </div>

      {/* Slide-in Glass Hamburger Menu (Mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex justify-end">
          {/* Glass Backdrop (Click to close) */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer (Leaves space on the left) */}
          <div className="relative w-[80%] max-w-sm h-full bg-white/95 backdrop-blur-md shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="font-black text-slate-900 tracking-wider text-sm">MENU</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex flex-col flex-grow p-6 overflow-y-auto">
              {loading ? (
                 <div className="flex justify-center py-10">
                   <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
              ) : !profile ? (
                /* GUEST VIEW */
                <div className="flex flex-col gap-4 mt-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <p className="text-slate-600 text-center font-medium leading-relaxed px-4">
                    Login to access the improved menu, track orders, and open a store.
                  </p>
                  <button 
                    onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                    className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : (
                /* LOGGED IN VIEW */
                <div className="flex flex-col h-full">
                  {/* User Badge */}
                  <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl">
                      {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{profile.displayName}</p>
                      <p className="text-sm text-slate-500 capitalize">{profile.role} Account</p>
                    </div>
                  </div>

                  {/* Universal Dashboard Link */}
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-800 font-bold bg-white border-2 border-slate-100 hover:border-emerald-500 hover:text-emerald-700 shadow-sm transition mb-6"
                  >
                    <span className="text-2xl">🎛️</span> Go to Dashboard
                  </Link>

                  {/* Standard Links */}
                  <div className="space-y-2">
                    <Link href="/buyer/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition">
                      My Orders
                    </Link>
                    <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition">
                      Sell on Kabale Online
                    </Link>
                    
                    {profile.role === 'admin' && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 mt-4 rounded-xl text-purple-700 bg-purple-50 font-bold border border-purple-100 transition">
                        Admin Command Center
                      </Link>
                    )}
                  </div>

                  {/* Logout pinned to bottom */}
                  <div className="mt-auto pt-8">
                    <button 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
