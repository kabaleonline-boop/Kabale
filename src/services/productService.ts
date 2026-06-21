// src/services/productService.ts
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { Product } from '@/types';
import { generateSlug } from '@/lib/utils';
import { productsIndex } from '@/lib/algolia';

/**
 * Adds a new product to a store, automatically generating its URL slug
 * and syncing the lightweight data to Algolia for instant search.
 */
export async function createProduct(productData: any): Promise<string> {
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

    // 1. Save to Firebase (Source of Truth) - This is the priority!
    await setDoc(newProductDocRef, completeProduct);

    // 2. Sync lightweight search data to Algolia
    // Wrapped in a separate try/catch so Algolia failure doesn't crash your Firebase save
    try {
      await productsIndex.saveObject({
        objectID: completeProduct.id, 
        title: completeProduct.title,
        price: completeProduct.price,
        image: completeProduct.images[0] || null,
        storeId: completeProduct.storeId,
        slug: completeProduct.slug,
        globalCategory: completeProduct.globalCategory,
      } as any);
    } catch (algoliaError) {
      console.error('Algolia sync failed, but Firebase save succeeded:', algoliaError);
      // We do NOT throw here, so the user still sees "Added to Official Store!"
    }

    return slug;
  } catch (error) {
    console.error('Error creating product in Firebase:', error);
    throw error;
  }
}

/**
 * Fetches a single item using the store and product slugs
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

/**
 * Fetches a global feed of all products across all stores
 */
export async function getGlobalProductsFeed(
  lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  pageSize: number = 12
) {
  try {
    const productsRef = collection(db, 'products');

    let q = query(
      productsRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastVisibleDoc) {
      q = query(
        productsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleDoc),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { products, lastDoc };
  } catch (error) {
    console.error('Error fetching global feed:', error);
    return { products: [], lastDoc: null };
  }
}
