// src/types/index.ts

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: any;
}

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  layoutMode: 'bento-grid' | 'list' | 'compact';
  fontFamily: string;
}

export interface StoreNavigation {
  label: string;
  target: string;
}

export interface LayoutBlock {
  type: 'hero-banner' | 'featured-categories' | 'product-strip';
  props: Record<string, any>;
}

export interface StoreConfig {
  id: string; // matches store_slug
  storeName: string;
  ownerId: string;
  verified: boolean;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappNumber?: string;
  storePolicies?: string;
  theme: StoreTheme;
  navigation: StoreNavigation[];
  homepageLayout: LayoutBlock[];
}

export interface Product {
  id: string;
  storeId: string; // associated store_slug
  title: string;
  slug: string; // URL-friendly format
  description: string;
  price: number;
  images: string[];
  globalCategory: string;
  storeCategory: string;
  stock: number;
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
  storeId: string;
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
