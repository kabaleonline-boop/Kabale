// src/services/orderService.ts
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { Order } from '@/types';

/**
 * Submits a new Pay on Delivery order to the database
 */
export async function createPODOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const ordersCollectionRef = collection(db, 'orders');
    const newOrderDocRef = doc(ordersCollectionRef);

    const completeOrder: Order = {
      ...orderData,
      id: newOrderDocRef.id,
      status: 'Pending', // Awaits seller acceptance
      createdAt: new Date(),
    };

    await setDoc(newOrderDocRef, completeOrder);
    return newOrderDocRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Fetches all orders for a specific store
 */
export async function getStoreOrders(storeSlug: string): Promise<Order[]> {
  try {
    const ordersCollectionRef = collection(db, 'orders');
    // Querying strictly by storeId to maintain tenant isolation
    const q = query(
      ordersCollectionRef,
      where('storeId', '==', storeSlug)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => doc.data() as Order);
    
    // Client-side sort by newest first. 
    // This avoids forcing you to set up complex Firestore composite indexes during the MVP.
    return orders.sort((a, b) => {
      // Safely handle both Firestore Timestamps and standard JS Date objects
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
      return timeB - timeA; // Descending (Newest first)
    });
  } catch (error) {
    console.error('Error fetching store orders:', error);
    return [];
  }
}

/**
 * Updates the fulfillment status of an order
 */
export async function updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<void> {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status: newStatus
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
