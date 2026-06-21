// src/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchClient } from '@/lib/algolia';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live recommendations from Algolia as the user types
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (query.trim().length > 1) {
        try {
          const index = searchClient.initIndex('products');
          const { hits } = await index.search(query, { hitsPerPage: 5 });
          setRecommendations(hits);
          setIsOpen(true);
        } catch (error) {
          console.error("Algolia search error:", error);
        }
      } else {
        setRecommendations([]);
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(fetchRecommendations, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRecommendationClick = (storeId: string, slug: string) => {
    setIsOpen(false);
    router.push(`/s/${storeId}/p/${slug}`); 
  };

  return (
    // WIDENED: w-[96%] makes it almost edge-to-edge on mobile. max-w-2xl keeps it wide but contained on desktop.
    <div className="relative w-[96%] md:w-full md:max-w-2xl mx-auto" ref={dropdownRef}>
      
      {/* SLIMMED: Fixed height using h-9 (36px) on mobile and h-10 (40px) on desktop to cut the vertical size in half */}
      <form onSubmit={handleSearchSubmit} className="flex items-center w-full h-9 md:h-10 bg-slate-50 border border-slate-200 rounded-full overflow-hidden transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 shadow-sm">
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          // h-full forces the input to respect the slim height of the parent form
          className="flex-1 px-4 h-full text-sm bg-transparent focus:outline-none"
          autoComplete="off"
        />

        {/* Text-based button that matches the slim height perfectly */}
        <button 
          type="submit"
          className="px-5 h-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Live Recommendations Dropdown */}
      {isOpen && recommendations.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 pt-2">Suggestions</h3>
            {recommendations.map((hit) => (
              <div 
                key={hit.objectID}
                onClick={() => handleRecommendationClick(hit.storeId, hit.slug)}
                className="flex items-center gap-3 p-2 md:p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                {hit.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hit.image} alt={hit.title} className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg border border-slate-100" />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg md:text-xl">📦</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{hit.title}</p>
                  <p className="text-[10px] md:text-xs text-slate-500 truncate">{hit.globalCategory}</p>
                </div>
                <div className="text-xs md:text-sm font-bold text-emerald-600">
                  UGX {hit.price?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSearchSubmit}
            className="w-full p-2 md:p-3 bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors text-center border-t border-slate-100"
          >
            See all results for &quot;{query}&quot; &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
