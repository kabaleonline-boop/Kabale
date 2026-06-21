// src/components/ValuePropsGrid.tsx
export default function ValuePropsGrid() {
  const values = [
    {
      image: "https://res.cloudinary.com/dmdml16he/image/upload/v1782047022/IMG-20230722-WA0036_hki2ja.jpg",
      text: "Pay on Delivery. Inspect your items first before paying the rider."
    },
    {
      image: "https://images.unsplash.com/photo-1607273685680-6bd976c5a5ce?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRlbGl2ZXJ5JTIwbWFufGVufDB8fDB8fHww",
      text: "Same-day delivery within Kabale Municipality. Get it when you need it."
    },
    {
      image: "https://res.cloudinary.com/dmdml16he/image/upload/v1782047022/kabale-town_vtlgux.jpg",
      text: "100% Verified local sellers guaranteeing authentic products."
    },
    {
      image: "https://res.cloudinary.com/dmdml16he/image/upload/v1782047022/Depositphotos_187253254_xl-2015-scaled-e1581999495557_vmot2w.jpg",
      text: "Secure returns and instant refunds if items don't match the description."
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      {/* Widened to max-w-7xl so the 4 columns have enough room on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Changed to md:grid-cols-4 so they all sit on a single line on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 md:gap-6">
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
