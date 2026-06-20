// src/lib/algolia.ts
import algoliasearch from 'algoliasearch';

// We only initialize this on the server side using the Admin API Key
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string
);

// This targets an index named "products". Algolia will create it automatically if it doesn't exist.
export const productsIndex = client.initIndex('products');
