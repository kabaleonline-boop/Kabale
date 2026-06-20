// src/services/productService.ts
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import { Product } from '@/types';
import { generateSlug } from '@/lib/utils';
import { productsIndex } from '@/lib/algolia';

/**
 * Adds a new product to a store, automatically generating its URL slug
 * and syncing the lightweight data to Algolia for instant search.
 */
export async function createProduct(productData: Omit<Product, 'id' | 'slug' | 'createdAt'>): Promise<string> {
  try {
    const productCollectionRef = collection(db, 'products');
    const newProductDocRef = doc(productCollectionRef); // Autogenerate unique document ID
    const slug = generateSlug(productData.title);

    const completeProduct: Product = {
      ...productData,
      id: newProductDocRef.id,
      slug: slug,
      createdAt: new Date(),
    };

    // 1. Save to Firebase (Source of Truth)
    await setDoc(newProductDocRef, completeProduct);

    // 2. Sync lightweight search data to Algolia
    // We only send what is needed for the search card to keep Algolia pricing low
    await productsIndex.saveObject({
      objectID: completeProduct.id, // Algolia requires an 'objectID' field
      title: completeProduct.title,
      price: completeProduct.price,
      image: completeProduct.images[0] || null,
      storeId: completeProduct.storeId,
      slug: completeProduct.slug,
      globalCategory: completeProduct.globalCategory,
    });

    return slug;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Fetches a single item using the store and product slugs for clean URL resolution
 */
export async function getProductBySlug(storeSlug: string, productSlug: string): Promise<Product | null> {
  try {
    const q = query(
      collection(db, 'products'),
      where('storeId', '==', storeSlug),
      where('slug', '==', productSlug),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}

/**
 * Fetches the entire public catalog for a specific store slug
 */
export async function getProductsByStore(storeSlug: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      where('storeId', '==', storeSlug)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Product);
  } catch (error) {
    console.error('Error fetching store products:', error);
    return [];
  }
}
