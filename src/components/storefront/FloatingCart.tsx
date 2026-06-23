'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingCart({ storeSlug }: { storeSlug: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const checkCart = () => {
      // 1. Perfectly connected to the specific multi-vendor store cart
      const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`) || '[]');
      
      // Calculate total quantity of items (not just unique products)
      const totalItems = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCount(totalItems);
    };

    // Initial check on load
    checkCart();

    // 2. Connected to the rest of the app: Listens for the AddToCart & Checkout events!
    window.addEventListener('cartUpdated', checkCart);
    return () => window.removeEventListener('cartUpdated', checkCart);
  }, [storeSlug]);

  if (count === 0) return null;

  return (
    <Link 
      href={`/checkout/${storeSlug}`}
      className="fixed bottom-6 right-6 z-50 transition-all duration-500 transform animate-in zoom-in hover:scale-105 active:scale-95"
    >
      {/* 🚨 NEW: Light Blue Circular Background */}
      <div className="relative p-3.5 bg-sky-100 rounded-full shadow-xl border border-sky-200 backdrop-blur-sm">
        
        {/* Cart SVG - Colored to match the light blue theme */}
        <svg className="w-7 h-7 text-sky-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        {/* Notification Badge - Positioned slightly outside the circle */}
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-white">
          {count}
        </span>
      </div>
    </Link>
  );
}