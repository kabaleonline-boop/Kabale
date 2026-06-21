// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import algoliasearch from 'algoliasearch';

// Initialize Algolia securely on the server
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string
);

const productsIndex = client.initIndex('products');

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(`[API ROUTE] Attempting to sync product ${data.objectID} to Algolia...`);

    // Save to Algolia
    await productsIndex.saveObject(data);

    console.log(`[API ROUTE] ✅ SUCCESS: Product ${data.objectID} synced to Algolia!`);
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error("[API ROUTE] ❌ ALGOLIA ERROR:", error.message || error);
    return NextResponse.json({ error: 'Algolia save failed', details: error.message }, { status: 500 });
  }
}
