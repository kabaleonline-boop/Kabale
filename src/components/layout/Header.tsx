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
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Hide the header completely on Super Admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Safe store slug check
  const storeSlug = (profile as any)?.storeSlug;

  // Reusable, uniform link component for the mobile drawer
  const MobileLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const active = isActive(href);
    return (
      <Link 
        href={href} 
        onClick={() => setIsMobileMenuOpen(false)} 
        className={`block px-6 py-4 border-b border-slate-100 transition-colors ${
          active ? 'text-emerald-600 font-black' : 'text-slate-700 font-semibold hover:text-emerald-600'
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 gap-4">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-black tracking-tight text-slate-900">
              KABALE <span className="text-emerald-600">ONLINE</span>
            </span>
          </Link>

          {/* Center: Search Bar (Hidden on small mobile) */}
          <div className="hidden md:block flex-1 max-w-2xl px-4">
            <GlobalSearch />
          </div>

          {/* Right: Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Desktop Explore Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsExploreDropdownOpen(!isExploreDropdownOpen);
                  setIsUserDropdownOpen(false);
                }}
                className={`text-sm font-semibold transition flex items-center gap-1 ${isExploreDropdownOpen ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
              >
                Explore
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isExploreDropdownOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                  <Link href="/products" onClick={() => setIsExploreDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600">All Products</Link>
                  <Link href="/stores" onClick={() => setIsExploreDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600">Store Directory</Link>
                  <Link href="/s/kabale-official" onClick={() => setIsExploreDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600">Official Store</Link>
                  <hr className="my-1 border-slate-100" />
                  <Link href="/about" onClick={() => setIsExploreDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-500 hover:bg-slate-50">About Us</Link>
                  <Link href="/policy" onClick={() => setIsExploreDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-500 hover:bg-slate-50">Policies</Link>
                </div>
              )}
            </div>

            {/* Only show Create Store on Desktop if they are a buyer or guest */}
            {(!profile || profile.role !== 'seller') && (
              <Link href="/sell" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition">
                Create Store
              </Link>
            )}

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
            ) : profile ? (
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                    setIsExploreDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {profile.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{profile.displayName?.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Desktop User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                    {/* Logged in as indicator */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs text-slate-500">Logged in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{profile.displayName}</p>
                    </div>

                    {/* Both Buyers and Sellers see My Orders */}
                    <Link href="/buyer/orders" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 mt-1">My Orders</Link>

                    {/* ONLY Sellers see the Store Management Links */}
                    {profile.role === 'seller' && (
                      <>
                        <hr className="my-2 border-slate-100" />
                        <Link href="/seller/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50">Seller Dashboard</Link>
                        {storeSlug && (
                          <Link href={`/s/${storeSlug}`} onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50">View My Storefront</Link>
                        )}
                      </>
                    )}

                    {/* ONLY Admins see the Command Center */}
                    {profile.role === 'admin' && (
                      <Link href="/admin" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-purple-600 font-semibold hover:bg-purple-50">Admin Command Center</Link>
                    )}

                    <hr className="my-2 border-slate-100" />
                    <button onClick={() => { logout(); setIsUserDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Sign Out</button>
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
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <GlobalSearch />
        </div>
      </div>

      {/* Slide-in Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex justify-end">
          {/* Glass Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="relative w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <span className="text-xl font-black tracking-tight text-slate-900">
                KABALE <span className="text-emerald-600">ONLINE</span>
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-slate-900 bg-white hover:bg-slate-200 rounded-full shadow-sm border border-slate-200 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Uniform Drawer Links */}
            <div className="flex flex-col flex-grow overflow-y-auto pb-4">
              
              <MobileLink href="/products">All Products</MobileLink>
              <MobileLink href="/s/kabale-official">Official Store</MobileLink>
              <MobileLink href="/stores">Stores Directory</MobileLink>
              <MobileLink href="/about">About Us</MobileLink>
              <MobileLink href="/policy">Policies</MobileLink>

              {loading ? (
                 <div className="flex justify-center py-6">
                   <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
              ) : !profile ? (
                <MobileLink href="/sell">Create a Store</MobileLink>
              ) : (
                <>
                  <MobileLink href="/buyer/orders">My Orders</MobileLink>
                  
                  {/* Buyers see "Create a Store", Sellers see Seller Dashboard tools */}
                  {profile.role === 'seller' ? (
                    <>
                      <MobileLink href="/seller/dashboard">Seller Dashboard</MobileLink>
                      {storeSlug && <MobileLink href={`/s/${storeSlug}`}>View My Storefront</MobileLink>}
                    </>
                  ) : (
                    <MobileLink href="/sell">Create a Store</MobileLink>
                  )}

                  {/* ONLY Admins see the Command Center */}
                  {profile.role === 'admin' && (
                    <MobileLink href="/admin">Admin Command Center</MobileLink>
                  )}
                </>
              )}
            </div>

            {/* Footer Area: Login or Sign Out */}
            <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
              {!loading && !profile ? (
                <button 
                  onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                  Login / Sign Up
                </button>
              ) : !loading && profile ? (
                <div>
                  <p className="text-sm text-slate-500 mb-3 text-center">
                    Logged in as <span className="font-bold text-slate-900">{profile.displayName}</span>
                  </p>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full bg-red-50 border border-red-100 text-red-600 font-bold py-4 rounded-xl active:scale-[0.98] transition-transform"
                  >
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
