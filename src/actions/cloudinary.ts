// src/actions/cloudinary.ts
'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure the server-side SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'kabale_products'; // Keeps your Cloudinary dashboard organized

  // Generate the cryptographic signature using your secret key
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: folder,
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return {
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}
