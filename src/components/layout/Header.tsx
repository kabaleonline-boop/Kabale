// src/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import GlobalSearch from '@/components/GlobalSearch';

export default function Header() {
  const { profile, loading, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                    <Link href="/buyer/orders" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Orders</Link>
                    {profile.role === 'seller' && (
                      <>
                        <Link href="/seller/settings" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50">Store Layout</Link>
                        <Link href="/seller/products/new" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50">Add Product</Link>
                        <Link href="/seller/orders" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50">Store Orders</Link>
                      </>
                    )}
                    {profile.role === 'admin' && (
                      <Link href="/admin/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-purple-600 font-semibold hover:bg-purple-50">Admin Command</Link>
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on small screens below header) */}
        <div className="md:hidden pb-3">
          <GlobalSearch />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1">
          <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">
            Sell on Kabale Online
          </Link>
          
          {profile ? (
            <>
              <Link href="/buyer/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">My Orders</Link>
              {profile.role === 'seller' && (
                <div className="pl-4 border-l-2 border-emerald-100 my-2 space-y-1">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Seller Menu</p>
                  <Link href="/seller/settings" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Store Settings</Link>
                  <Link href="/seller/products/new" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Add Product</Link>
                  <Link href="/seller/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Store Orders</Link>
                </div>
              )}
              {profile.role === 'admin' && (
                <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-purple-600 hover:bg-purple-50">Admin Command Center</Link>
              )}
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
             <button 
              onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
              className="block w-full text-center mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl"
            >
              Sign In / Create Account
            </button>
          )}
        </div>
      )}
    </header>
  );
}
