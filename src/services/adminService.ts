// src/services/adminService.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, getCountFromServer } from 'firebase/firestore';
import { StoreConfig, Product, UserProfile } from '@/types';

// 🚨 Replaced the old algolia import with our new secure Server Action
import { removeProductFromSearch } from '@/services/algoliaServer';

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

/**
 * Fetches all stores registered on the platform for admin review
 */
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

/**
 * Toggles the verification status of a specific store
 */
export async function toggleStoreVerification(storeId: string, currentStatus: boolean): Promise<void> {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, { verified: !currentStatus });
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
    console.error('Error fetching products:', error);
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

    // 2. Delete securely from Algolia using the Backend Server Action
    await removeProductFromSearch(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Fetches all registered users on the platform
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Updates a user's role (e.g., from 'buyer' to 'seller' or 'admin')
 */
export async function updateUserRole(uid: string, newRole: 'buyer' | 'seller' | 'admin'): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role: newRole });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}
