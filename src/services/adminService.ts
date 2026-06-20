// src/services/adminService.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, getCountFromServer } from 'firebase/firestore';
import { StoreConfig, Product } from '@/types';
import { productsIndex } from '@/lib/algolia';

/**
 * Highly efficient query to get total counts without downloading document data
 */
export async function getPlatformStats() {
  try {
    const [usersSnap, storesSnap, productsSnap] = await Promise.all([
      getCountFromServer(collection(db, 'users')),
      getCountFromServer(collection(db, 'stores')),
      getCountFromServer(collection(db, 'products'))
    ]);

    return {
      totalUsers: usersSnap.data().count,
      totalStores: storesSnap.data().count,
      totalProducts: productsSnap.data().count,
    };
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return { totalUsers: 0, totalStores: 0, totalProducts: 0 };
  }
}

export async function getAllStores(): Promise<StoreConfig[]> {
  try {
    const storesRef = collection(db, 'stores');
    const q = query(storesRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as StoreConfig[];
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

export async function toggleStoreVerification(storeId: string, currentStatus: boolean): Promise<void> {
  const storeRef = doc(db, 'stores', storeId);
  await updateDoc(storeRef, { verified: !currentStatus });
}

export async function getAllPlatformProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function deletePlatformProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
  await productsIndex.deleteObject(productId);
}
