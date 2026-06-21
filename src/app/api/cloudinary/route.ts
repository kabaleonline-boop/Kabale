// src/app/api/cloudinary/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const folder = 'kabale_products';

    // .trim() prevents invisible spaces from breaking the security hash
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
    const apiKey = (process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY)?.trim();
    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME)?.trim();

    if (!apiSecret || !apiKey || !cloudName) {
      console.error("Missing Cloudinary environment variables!");
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    // THIS IS THE EXACT STRING FROM YOUR SCREENSHOT (Alphabetical order required)
    const stringToSign = `folder=${folder}&timestamp=${timestamp}`;

    // Hash the exact string + API Secret
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + apiSecret)
      .digest('hex');

    return NextResponse.json({
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
