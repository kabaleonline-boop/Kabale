// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-black tracking-tight text-white">
                KABALE <span className="text-emerald-500">ONLINE</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm">
              The premier digital mall for the Kigezi region. Connecting trusted local businesses with thousands of daily shoppers. Fast, secure, and built for our community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/s/kabale-official" className="hover:text-emerald-400 transition">Official Store</Link></li>
              <li><Link href="/sell" className="hover:text-emerald-400 transition">Sell with Us</Link></li>
              <li><Link href="/buyer/orders" className="hover:text-emerald-400 transition">Track Order</Link></li>
              <li><button className="hover:text-emerald-400 transition">Help Center</button></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal & Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-emerald-400 transition">Terms of Service</button></li>
              <li><button className="hover:text-emerald-400 transition">Privacy Policy</button></li>
              <li><button className="hover:text-emerald-400 transition">Return Policy</button></li>
              <li className="pt-2 text-emerald-500 font-semibold">support@kabaleonline.com</li>
            </ul>
          </div>

        </div>
        
        <hr className="border-slate-800 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
          <p>&copy; {new Date().getFullYear()} Kabale Online. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built for Kigezi</span>
            <span>Kabale Municipality</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
