// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // 🚨 Adjust this path to match where your Firebase 'db' is initialized

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Replace with your actual production URL
  const baseUrl = 'https://kabaleonline.com';

  // 1. STATIC PAGES
  // Add all your public, non-database pages here
  const staticRoutes = ['', '/sell', '/products'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8, // Home page gets highest priority
  }));

  // 2. DYNAMIC STORE PAGES (/s/[storeSlug])
  let storePages: MetadataRoute.Sitemap = [];
  try {
    const storesSnapshot = await getDocs(collection(db, 'stores'));
    storePages = storesSnapshot.docs.map((doc) => {
      // Assuming the document ID is the storeSlug
      const storeSlug = doc.id; 
      
      return {
        url: `${baseUrl}/s/${storeSlug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9, // High priority for storefronts
      };
    });
  } catch (error) {
    console.error('Sitemap Error: Failed to fetch stores', error);
  }

  // 3. DYNAMIC PRODUCT PAGES (/s/[storeSlug]/p/[productSlug])
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    productPages = productsSnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Fallback to current date if you don't have an updatedAt timestamp
      const lastModified = data.updatedAt 
        ? new Date(data.updatedAt.toDate()) 
        : new Date();

      return {
        url: `${baseUrl}/s/${data.storeId}/p/${data.slug}`,
        lastModified: lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6, // Standard priority for individual items
      };
    });
  } catch (error) {
    console.error('Sitemap Error: Failed to fetch products', error);
  }

  // Combine and return all routes
  return [...staticRoutes, ...storePages, ...productPages];
}