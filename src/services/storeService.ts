// src/services/storeService.ts
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  collection, 
  query, 
  increment 
} from 'firebase/firestore';
import { StoreConfig } from '@/types';

/**
 * Fetches a store's layout configuration by its URL slug/ID.
 * It manually injects the Document ID into the returned object as the store's unique slug.
 */
export async function getStoreConfig(storeSlug: string): Promise<StoreConfig | null> {
  try {
    // Sanitize input to match Document ID format
    const docRef = doc(db, 'stores', storeSlug.toLowerCase().trim());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 🚨 FIX: Manually combine the Document ID with the document data
      return { 
        id: docSnap.id, // This is your store slug (e.g., 'kabale-official')
        ...docSnap.data() 
      } as StoreConfig;
    }
    return null;
  } catch (error) {
    console.error('Error fetching store config:', error);
    throw error;
  }
}

/**
 * Initializes or updates a seller's customizable storefront configuration
 */
export async function saveStoreConfig(storeSlug: string, config: Partial<StoreConfig>): Promise<void> {
  try {
    const docRef = doc(db, 'stores', storeSlug.toLowerCase().trim());
    // Use merge: true to avoid wiping out layout properties if updating basic settings
    await setDoc(docRef, config, { merge: true });
  } catch (error) {
    console.error('Error saving store config:', error);
    throw error;
  }
}

/**
 * Fetches all active stores to display in the store directory.
 */
export async function getAllStores(): Promise<(StoreConfig & { id: string; views?: number })[]> {
  try {
    // Optionally, you can add where('verified', '==', true) if you only want approved stores
    const q = query(collection(db, 'stores'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (StoreConfig & { id: string; views?: number })[];
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return [];
  }
}

/**
 * Atomically increments the view count for a specific store.
 * We use increment(1) so that concurrent visits don't overwrite each other.
 */
export async function incrementStoreViews(storeId: string): Promise<void> {
  if (!storeId) return;
  
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      views: increment(1)
    });
  } catch (error) {
    // If the store document doesn't have a views field yet, or doesn't exist, it might throw.
    // We catch it silently so it doesn't break the user experience.
    console.error('Failed to increment store views:', error);
  }
}
