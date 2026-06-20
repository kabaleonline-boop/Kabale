// src/components/storefront/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  storeSlug: string;
  accentColor: string;
}

export default function AddToCartButton({ product, storeSlug, accentColor }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(storeSlug, {
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
  };

  return (
    <button 
      onClick={handleAdd}
      style={{ backgroundColor: accentColor }}
      className="w-full text-white font-bold py-3.5 px-6 rounded-xl shadow-sm hover:opacity-90 transition active:scale-95 flex items-center justify-center gap-2"
    >
      {added ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
