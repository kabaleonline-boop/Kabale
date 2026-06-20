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

/**
 * Adds a new product to a store, automatically generating its URL slug
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

    await setDoc(newProductDocRef, completeProduct);
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
