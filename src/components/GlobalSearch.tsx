// src/components/GlobalSearch.tsx
'use client';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import Link from 'next/link';
import Image from 'next/image';

// Initialize the search client with the PUBLIC key
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

// Custom UI for each individual search result
function Hit({ hit }: any) {
  return (
    <Link href={`/s/${hit.storeId}/p/${hit.slug}`} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition group">
      <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
        {hit.image ? (
          <Image src={hit.image} alt={hit.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">No Img</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition">
          {hit.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-black text-slate-900">UGX {hit.price.toLocaleString()}</span>
          <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full truncate max-w-[100px]">
            Store: {hit.storeId}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GlobalSearch() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <InstantSearch searchClient={searchClient} indexName="products">
        {/* Limit results to top 5 to keep the dropdown clean */}
        <Configure hitsPerPage={5} /> 
        
        <div className="relative z-50">
          <SearchBox 
            placeholder="Search for phones, cement, shoes across Kabale..."
            classNames={{
              root: 'relative w-full',
              form: 'relative flex items-center',
              input: 'w-full px-4 py-3 pl-12 bg-white border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-800 shadow-sm transition',
              submitIcon: 'absolute left-4 w-5 h-5 text-emerald-600',
              resetIcon: 'hidden', // Hide default reset to keep UI clean
            }}
          />
          
          <div className="absolute top-full left-0 right-0 mt-2">
            {/* The Hits component automatically hides when the query is empty if configured, 
                but we use CSS/Custom logic to wrap it cleanly */}
            <div className="[&_.ais-Hits-list]:flex [&_.ais-Hits-list]:flex-col [&_.ais-Hits-list]:gap-2">
              <Hits hitComponent={Hit} />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
