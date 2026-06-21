// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { productsIndex } from '@/lib/algolia';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Save to Algolia using the server-side Admin Key
    await productsIndex.saveObject({
      objectID: data.id,
      ...data,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Algolia save failed' }, { status: 500 });
  }
}
