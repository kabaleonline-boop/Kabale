// src/app/policy/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Policies & Terms | Kabale Online',
  description: 'Our rules, return policies, and terms of service.',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Policies & Terms
          </h1>
          <p className="text-lg text-slate-500">
            Everything you need to know about shopping and selling safely on Kabale Online.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="text-emerald-500">1.</span> Pay on Delivery Policy
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>To ensure 100% trust and security for our buyers, Kabale Online operates primarily on a <strong>Pay on Delivery (PoD)</strong> model.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Buyers have the right to inspect the physical item before handing over Cash or Mobile Money to the delivery rider.</li>
                <li>If the item does not match the description or is damaged, the buyer may reject the delivery on the spot at no cost.</li>
                <li>Once payment is handed over and the rider departs, the transaction is considered complete, subject only to the Return Policy below.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="text-emerald-500">2.</span> Returns & Refunds
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>Because items are inspected upon delivery, returns are strictly limited to mechanical failures or factory defects discovered shortly after purchase.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Electronics & Appliances:</strong> Must be reported within 48 hours of delivery if a factory defect is discovered.</li>
                <li><strong>Fashion & Apparel:</strong> Cannot be returned once accepted by the buyer, due to hygiene and sizing validation happening at the point of delivery.</li>
                <li><strong>Perishables (Food & Groceries):</strong> Strictly non-returnable once the delivery is accepted.</li>
                <li>All approved refunds will be processed directly by the respective Seller. Kabale Online acts as a mediator in disputes but does not hold the funds.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="text-emerald-500">3.</span> Seller Guidelines
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>Sellers on Kabale Online must adhere to strict quality standards to maintain their storefronts.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Sellers must ensure all uploaded images accurately represent the exact item being sold.</li>
                <li>Listing counterfeit goods, illegal substances, or fraudulent services will result in immediate and permanent store deletion.</li>
                <li>Sellers must have items ready for rider pickup within 30 minutes of accepting an order to guarantee fast delivery times.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="text-emerald-500">4.</span> Privacy Data
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>
                Your privacy is important to us. Kabale Online collects only the necessary information (Name, Phone Number, and Delivery Location) required to successfully route your orders. 
              </p>
              <p>
                Your phone number is shared with your specific Seller and Delivery Rider solely for the purpose of completing your current order. We do not sell your personal data to third-party marketing agencies.
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-4">
              Have a dispute or need clarification? We are here to help.
            </p>
            <a href="mailto:support@kabaleonline.com" className="inline-flex items-center justify-center font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 py-3 px-6 rounded-xl transition-colors">
              Contact Support
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
