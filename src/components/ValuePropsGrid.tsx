// src/components/ValuePropsGrid.tsx
export default function ValuePropsGrid() {
  const values = [
    {
      image: "https://images.unsplash.com/photo-1617865243831-7722d3e4298a?q=80&w=600&auto=format&fit=crop",
      text: "Pay on Delivery. Inspect your items first before paying the rider."
    },
    {
      image: "https://images.unsplash.com/photo-1508344928928-7137b2f6022e?q=80&w=600&auto=format&fit=crop",
      text: "Same-day delivery within Kabale Municipality. Get it when you need it."
    },
    {
      image: "https://images.unsplash.com/photo-1556740749-887f6717defa?q=80&w=600&auto=format&fit=crop",
      text: "100% Verified local sellers guaranteeing authentic products."
    },
    {
      image: "https://images.unsplash.com/photo-1580828369019-22345e69e019?q=80&w=600&auto=format&fit=crop",
      text: "Secure returns and instant refunds if items don't match the description."
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:gap-x-6">
          {values.map((val, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={val.image} 
                alt="Value prop" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-3 md:p-5">
                <p className="text-white font-semibold text-xs md:text-sm line-clamp-3 leading-snug">
                  {val.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
