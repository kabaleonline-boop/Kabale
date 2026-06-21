// src/lib/algolia.ts
import algoliasearch from 'algoliasearch';

// 🚨 IMPORTANT: This file is now ONLY for the frontend Search Bar.
// It uses the public Search Key, NEVER the Admin Key.
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);
