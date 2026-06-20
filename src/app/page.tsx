// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-50 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Now serving the Kigezi Region
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              The Digital Mall <br />
              <span className="text-emerald-600">in Your Pocket.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Shop top electronics, hardware, and fashion from trusted local stores. Pay securely with cash or mobile money when the rider arrives at your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#explore" className="bg-slate-900 text-white font-bold py-4 px-8 rounded-full hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                Start Shopping
              </Link>
              <Link href="/sell" className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-700 transition">
                Open a Free Store
              </Link>
            </div>
          </div>
          
          {/* Hero Visual Mockup */}
          <div className="hidden lg:flex justify-center relative">
            <div className="w-80 h-[500px] bg-slate-900 rounded-[3rem] border-[8px] border-white shadow-2xl overflow-hidden relative z-20">
              <div className="absolute top-0 left-0 w-full h-16 bg-emerald-600 flex items-center px-6">
                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                <div className="ml-3 h-4 w-24 bg-white/30 rounded-full"></div>
              </div>
              <div className="mt-20 px-4 grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-slate-800 rounded-xl aspect-square p-2 flex flex-col justify-end">
                     <div className="h-2 w-1/2 bg-slate-600 rounded mb-1"></div>
                     <div className="h-3 w-3/4 bg-slate-500 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
            </div>
            {/* Decorative background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 blur-3xl rounded-full z-10"></div>
          </div>
        </div>
      </section>

      {/* 2. KABALE OFFICIAL STORE PROMO */}
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
             {/* Abstract Premium Item Cards */}
             <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-full aspect-square bg-slate-700 rounded-xl mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div className="h-3 w-3/4 bg-slate-600 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-emerald-500/50 rounded"></div>
             </div>
             <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 backdrop-blur-sm mt-8">
                <div className="w-full aspect-square bg-slate-700 rounded-xl mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="h-3 w-3/4 bg-slate-600 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-emerald-500/50 rounded"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE CATEGORIES */}
      <section id="explore" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Phones & Tablets', icon: '📱', color: 'bg-blue-100 text-blue-700' },
              { name: 'Computing', icon: '💻', color: 'bg-purple-100 text-purple-700' },
              { name: 'Home Appliances', icon: '📺', color: 'bg-orange-100 text-orange-700' },
              { name: 'Hardware & Tools', icon: '🔨', color: 'bg-slate-200 text-slate-700' },
              { name: 'Fashion', icon: '👕', color: 'bg-pink-100 text-pink-700' },
              { name: 'Groceries', icon: '🛒', color: 'bg-green-100 text-green-700' },
              { name: 'Beauty', icon: '✨', color: 'bg-rose-100 text-rose-700' },
              { name: 'Auto Parts', icon: '🚗', color: 'bg-zinc-200 text-zinc-700' },
            ].map((cat, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition cursor-pointer group flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-800">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUE PROPOSITION / TRUST */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pay on Delivery</h3>
              <p className="text-slate-500">Inspect your items first. Only pay the rider when you are 100% satisfied.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Local Delivery</h3>
              <p className="text-slate-500">Same-day delivery within Kabale Municipality. Get it when you need it.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Sellers</h3>
              <p className="text-slate-500">Every shop is vetted by our team to guarantee authentic products and fair pricing.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
