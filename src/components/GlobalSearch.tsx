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
          // Fetch top 5 results for the dropdown
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

    // Tiny delay to prevent spamming the Algolia API on every single keystroke
    const timeoutId = setTimeout(fetchRecommendations, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    // Route to the new results page
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRecommendationClick = (storeId: string, slug: string) => {
    setIsOpen(false);
    // Route directly to the product page
    router.push(`/${storeId}/${slug}`); 
  };

  return (
    // "max-w-md" drastically reduces the size compared to a full-width bar
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-full overflow-hidden transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 shadow-sm">
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands..."
          className="flex-1 px-5 py-3 bg-transparent text-sm focus:outline-none"
          autoComplete="off"
        />

        {/* The text button replacing the SVG icon */}
        <button 
          type="submit"
          className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
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
                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
              >
                {hit.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hit.image} alt={hit.title} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{hit.title}</p>
                  <p className="text-xs text-slate-500 truncate">{hit.globalCategory}</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">
                  UGX {hit.price?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleSearchSubmit}
            className="w-full p-3 bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors text-center border-t border-slate-100"
          >
            See all results for &quot;{query}&quot; &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
