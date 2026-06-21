// src/app/api/cloudinary/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    // 1. Safely grab the secret
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!apiSecret) {
      console.error("Missing CLOUDINARY_API_SECRET in Vercel!");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Mathematically sign exactly what the frontend asked us to sign
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    // 3. Return just the signature
    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
