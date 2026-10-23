// src/types/index.ts

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'buyer' | 'admin';
  createdAt: any;
}

export interface Product {
  id: string;
  title: string;
  slug: string; // URL-friendly format
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  ownerId: string;
  ownerName?: string;
  ownerPhone?: string;
  createdAt: any;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'POD' | 'MoMo';
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Handed to Rider' | 'Delivered';
  createdAt: any;
}
