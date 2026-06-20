// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderItem } from '@/types';

// The state structure: { "macro-hardware": [item1, item2], "john-electronics": [item3] }
type CartState = Record<string, OrderItem[]>;

interface CartContextType {
  carts: CartState;
  addToCart: (storeSlug: string, item: OrderItem) => void;
  removeFromCart: (storeSlug: string, productId: string) => void;
  clearCart: (storeSlug: string) => void;
  getCartTotal: (storeSlug: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [carts, setCarts] = useState<CartState>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from Local Storage on mount
  useEffect(() => {
    const savedCarts = localStorage.getItem('kabale_carts');
    if (savedCarts) {
      try {
        setCarts(JSON.parse(savedCarts));
      } catch (e) {
        console.error('Failed to parse carts from local storage');
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to Local Storage whenever carts change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('kabale_carts', JSON.stringify(carts));
    }
  }, [carts, isInitialized]);

  const addToCart = (storeSlug: string, item: OrderItem) => {
    setCarts((prev) => {
      const storeCart = prev[storeSlug] || [];
      const existingItemIndex = storeCart.findIndex((i) => i.productId === item.productId);

      let newStoreCart;
      if (existingItemIndex >= 0) {
        // Increase quantity if item already exists
        newStoreCart = [...storeCart];
        newStoreCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        newStoreCart = [...storeCart, item];
      }

      return { ...prev, [storeSlug]: newStoreCart };
    });
  };

  const removeFromCart = (storeSlug: string, productId: string) => {
    setCarts((prev) => {
      const storeCart = prev[storeSlug] || [];
      return {
        ...prev,
        [storeSlug]: storeCart.filter((item) => item.productId !== productId),
      };
    });
  };

  const clearCart = (storeSlug: string) => {
    setCarts((prev) => {
      const newCarts = { ...prev };
      delete newCarts[storeSlug];
      return newCarts;
    });
  };

  const getCartTotal = (storeSlug: string) => {
    const storeCart = carts[storeSlug] || [];
    return storeCart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ carts, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
