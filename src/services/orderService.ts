// src/services/orderService.ts
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
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
