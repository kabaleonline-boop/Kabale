// src/services/storeService.ts
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { StoreConfig } from '@/types';

/**
 * Fetches a store's layout configuration by its URL slug/ID
 */
export async function getStoreConfig(storeSlug: string): Promise<StoreConfig | null> {
  try {
    const docRef = doc(db, 'stores', storeSlug.toLowerCase().trim());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as StoreConfig;
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
