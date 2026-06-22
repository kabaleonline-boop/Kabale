// src/components/HeroSection.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-slate-50 overflow-hidden border-b border-slate-200">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Kabale Town <br />
            <span className="text-emerald-600">in your pocket.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Shop from trusted local shops and get what you need delivered to you. Pay safely with cash on delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
            <Link href="/products" className="bg-slate-900 text-white font-bold py-4 px-8 rounded-full hover:bg-slate-800 transition shadow-lg shadow-slate-200 text-center">
              Start Shopping
            </Link>
            <Link href="/sell" className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-700 transition text-center">
              Open a Free Store
            </Link>
          </div>

          <div className="text-center lg:text-left mt-2">
            <span className="inline-block text-emerald-600 underline font-semibold text-sm decoration-2 underline-offset-4">
              Now serving the Kigezi Region
            </span>
          </div>

        </div>

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 blur-3xl rounded-full z-10"></div>
        </div>
      </div>
    </section>
  );
}
