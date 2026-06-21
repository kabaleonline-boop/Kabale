// src/components/OfficialStorePromo.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductsByStore } from '@/services/productService';
import { Product } from '@/types';

export default function OfficialStorePromo() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsByStore('kabale-official')
      .then(res => setProducts(res.slice(0, 2)))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="bg-slate-950 text-white py-16 border-y-4 border-emerald-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 blur-[100px] rounded-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <h2 className="text-2xl font-black tracking-tight">KABALE OFFICIAL STORE</h2>
          </div>
          <p className="text-slate-400 text-lg mb-6 max-w-2xl">
            Shop directly from our premium fulfillment center. Guaranteed genuine products, 24-hour delivery, and direct warranties. The ultimate peace of mind.
          </p>
          <Link href="/s/kabale-official" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition">
            Shop Official Catalog
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {[0, 1].map((index) => {
            const product = products[index];
            return (
              <div key={index} className={`bg-slate-800/50 border border-slate-700 rounded-2xl p-4 backdrop-blur-sm ${index === 1 ? 'mt-8' : ''}`}>
                <div className="w-full aspect-square bg-slate-700 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                  {product?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt="product" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div className="bg-slate-600 rounded mb-2 px-2 py-1 truncate">
                  <span className="text-white text-xs font-semibold">{product ? product.title : '\u00A0'}</span>
                </div>
                <div className="bg-emerald-500/50 rounded px-2 py-1 truncate w-4/5">
                  <span className="text-emerald-100 text-xs font-bold">{product ? `UGX ${product.price.toLocaleString()}` : '\u00A0'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
