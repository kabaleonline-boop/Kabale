// src/app/api/cloudinary/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 🚨 CRITICAL FIX: Forces Next.js to read live environment variables on every single request
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    
    // Support both NEXT_PUBLIC and standard naming conventions
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      console.error("Missing Cloudinary environment variables in Vercel!");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Cloudinary requires exactly this format: sha1(params + api_secret)
    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    return NextResponse.json({
      timestamp,
      signature,
      apiKey,
      cloudName,
    });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
