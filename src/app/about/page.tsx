// src/app/about/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Kabale Online',
  description: 'Learn more about Kabale Online, the premier digital marketplace for the Kigezi region.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
            🌍
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            About Kabale Online
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Empowering the Kigezi region by bringing local businesses to your fingertips.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Kabale Online was built with a single goal: to modernize how the Kigezi region shops and sells. We bridge the gap between incredible local businesses and consumers who crave convenience, speed, and trust. Whether you are looking for fresh groceries, premium electronics, or daily essentials, we bring the best of Kabale town directly to your door.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-3">🤝</div>
                <h3 className="font-bold text-slate-900 text-lg">100% Local Sellers</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every store on our platform is a verified local business. When you buy on Kabale Online, you are supporting the local economy.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-3">🛵</div>
                <h3 className="font-bold text-slate-900 text-lg">Instant Delivery</h3>
                <p className="text-slate-600 leading-relaxed">
                  No more waiting days for packages from Kampala. Our dedicated rider network ensures your items arrive within hours, not days.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-3">🛡️</div>
                <h3 className="font-bold text-slate-900 text-lg">Pay on Delivery</h3>
                <p className="text-slate-600 leading-relaxed">
                  Zero risk. You only pay when the rider arrives and you have verified that the product matches your exact expectations.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl mb-3">🏪</div>
                <h3 className="font-bold text-slate-900 text-lg">Free Digital Storefronts</h3>
                <p className="text-slate-600 leading-relaxed">
                  We give sellers the tools they need to succeed online, providing free, customizable digital storefronts to reach thousands of new customers.
                </p>
              </div>

            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="text-center bg-slate-50 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to join the movement?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Link href="/" className="w-full sm:w-auto bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl hover:bg-slate-800 transition-colors">
                Start Shopping
              </Link>
              <Link href="/sell" className="w-full sm:w-auto bg-emerald-100 text-emerald-700 font-bold py-4 px-8 rounded-2xl hover:bg-emerald-200 transition-colors">
                Become a Seller
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
