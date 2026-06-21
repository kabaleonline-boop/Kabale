// src/app/api/cloudinary/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Forces Next.js to read live environment variables on every request
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Safely grab keys, checking both NEXT_PUBLIC and standard names
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      console.error("Missing Cloudinary environment variables!");
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    // Define the folder here on the backend
    const folder = 'kabale_products';

    // Use the OFFICIAL Cloudinary SDK to generate the signature (100% foolproof)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      apiSecret
    );

    // Send everything the frontend needs, including the exact folder name
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
