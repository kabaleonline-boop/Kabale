// src/components/CategoriesList.tsx
import Link from 'next/link';

export default function CategoriesList() {
  const categories = [
    { 
      name: 'Phones & Tablets', 
      slug: 'phones-tablets', 
      examples: 'iPhones, Samsungs, iPads, Accessories', 
      color: 'bg-blue-100 text-blue-600', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /> 
    },
    { 
      name: 'Computing', 
      slug: 'computing', 
      examples: 'Laptops, Monitors, Printers, Drives', 
      color: 'bg-purple-100 text-purple-600', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /> 
    },
    { 
      name: 'Home Appliances', 
      slug: 'home-appliances', 
      examples: 'TVs, Blenders, Fridges, Microwaves', 
      color: 'bg-orange-100 text-orange-600', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" /> 
    },
    { 
      name: 'Fashion', 
      slug: 'fashion', 
      examples: 'Sneakers, Watches, Bags, Apparel', 
      color: 'bg-pink-100 text-pink-600', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /> 
    },
    { 
      name: 'Home & Daily Items', 
      slug: 'home-daily-items', 
      examples: 'Cleaning Supplies, Toiletries, Utensils', 
      color: 'bg-teal-100 text-teal-600', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /> 
    },
    { 
      name: 'Food & Vegetables', 
      slug: 'food-vegetables', 
      examples: 'Fresh Produce, Snacks, Drinks, Groceries', 
      color: 'bg-green-100 text-green-600', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /> 
    },
  ];

  return (
    <section id="explore" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Shop by Category</h2>

        {/* Changed lg:grid-cols-4 to lg:grid-cols-3 so the 6 items form a perfect 2x3 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <Link 
              href={`/category/${cat.slug}`} 
              key={idx} 
              className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow group flex items-center gap-4 w-full"
            >
              <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${cat.color}`}>
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  {cat.icon}
                </svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-slate-900 truncate">{cat.name}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{cat.examples}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
