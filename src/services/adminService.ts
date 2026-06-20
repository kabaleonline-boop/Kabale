// src/services/adminService.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { StoreConfig, Product } from '@/types';
import { productsIndex } from '@/lib/algolia';

/**
 * Fetches all stores registered on the platform for admin review
 */
export async function getAllStores(): Promise<StoreConfig[]> {
  try {
    const storesRef = collection(db, 'stores');
    const q = query(storesRef);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as StoreConfig[];
  } catch (error) {
    console.error('Error fetching all stores:', error);
    return [];
  }
}

/**
 * Toggles the verification status of a specific store
 */
export async function toggleStoreVerification(storeId: string, currentStatus: boolean): Promise<void> {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      verified: !currentStatus
    });
  } catch (error) {
    console.error('Error updating store verification:', error);
    throw error;
  }
}

/**
 * Fetches every single product on the platform for moderation
 */
export async function getAllPlatformProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

/**
 * Force-deletes a product from both Firestore and the Algolia Search Index
 */
export async function deletePlatformProduct(productId: string): Promise<void> {
  try {
    // 1. Delete the source of truth from Firebase
    await deleteDoc(doc(db, 'products', productId));
    
    // 2. Delete from Algolia so buyers don't see dead search results
    await productsIndex.deleteObject(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
