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

/**
 * Adds a new product to the unified catalog, automatically generating its URL slug
 * and triggering an API route to sync lightweight data to Algolia.
 */
export async function createProduct(productData: Omit<Product, 'id' | 'slug' | 'createdAt'>): Promise<string> {
  try {
    const productCollectionRef = collection(db, 'products');
    const newProductDocRef = doc(productCollectionRef); 
    const slug = generateSlug(productData.title);

    const completeProduct: Product = {
      ...productData,
      id: newProductDocRef.id,
      slug: slug,
      createdAt: new Date(),
    };

    // 1. Save to Firebase (Source of Truth)
    await setDoc(newProductDocRef, completeProduct);
    console.log(`Product saved to Firebase with ID: ${completeProduct.id}`);

    // 2. Call the Next.js API Route to handle Algolia Sync securely
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectID: completeProduct.id, 
          title: completeProduct.title,
          price: completeProduct.price,
          image: completeProduct.images[0] || null,
          slug: completeProduct.slug,
          category: completeProduct.category,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API Route reported a failure:", result);
      } else {
        console.log("API Route successfully handled the Algolia sync!");
      }

    } catch (apiError) {
      console.error('Failed to connect to the /api/products route:', apiError);
    }

    return slug;
  } catch (error) {
    console.error('Error creating product in Firebase:', error);
    throw error;
  }
}

/**
 * Fetches a single item using its unique product slug
 */
export async function getProductBySlug(productSlug: string): Promise<Product | null> {
  try {
    const q = query(
      collection(db, 'products'), 
      where('slug', '==', productSlug), 
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) return querySnapshot.docs[0].data() as Product;
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches a global feed of all products across the platform
 */
export async function getGlobalProductsFeed(lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize: number = 12) {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastVisibleDoc) {
      q = query(productsRef, orderBy('createdAt', 'desc'), startAfter(lastVisibleDoc), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    return { products, lastDoc };
  } catch (error) {
    return { products: [], lastDoc: null };
  }
}

/**
 * Fetches products by category with infinite scroll (pagination) support
 */
export async function getProductsByCategory(
  categoryName: string, 
  lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null, 
  pageSize: number = 12
) {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, where('category', '==', categoryName), limit(pageSize));

    if (lastVisibleDoc) {
      q = query(productsRef, where('category', '==', categoryName), startAfter(lastVisibleDoc), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { products, lastDoc };
  } catch (error) {
    console.error('Error fetching category products:', error);
    return { products: [], lastDoc: null };
  }
}
