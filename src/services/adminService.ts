// src/services/adminService.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { StoreConfig } from '@/types';

/**
 * Fetches all stores registered on the platform for admin review
 */
export async function getAllStores(): Promise<StoreConfig[]> {
  try {
    const storesRef = collection(db, 'stores');
    const q = query(storesRef); // You can add orderBy('createdAt', 'desc') if you add timestamps to stores
    
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
