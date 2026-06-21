// src/services/algoliaServer.ts
'use server';

import algoliasearch from 'algoliasearch';

// This initializes Algolia safely on the Vercel backend using your Admin Key
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string
);

const productsIndex = client.initIndex('products');

export async function syncProductToSearch(algoliaData: any) {
  try {
    await productsIndex.saveObject(algoliaData);
    console.log("✅ Successfully synced to Algolia Search!");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Algolia Sync Error:", error.message);
    // We return the error instead of throwing it so the frontend doesn't crash
    return { success: false, error: error.message };
  }
}

export async function removeProductFromSearch(productId: string) {
  try {
    await productsIndex.deleteObject(productId);
    console.log(`✅ Successfully deleted ${productId} from Algolia Search!`);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Algolia Delete Error:", error.message);
    return { success: false, error: error.message };
  }
}
