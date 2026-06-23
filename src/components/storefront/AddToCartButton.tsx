'use client';

import { useState } from 'react';

interface Props {
  product: any;
  storeSlug: string;
  accentColor: string;
}

export default function AddToCartButton({ product, storeSlug, accentColor }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`) || '[]');
    
    // Check if the item is already in the cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + (product.quantity || 1);
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }
    
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
    
    // Fire event so the FloatingCart updates instantly
    window.dispatchEvent(new Event('cartUpdated'));

    // Trigger visual success state
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000); // Reverts back after 2 seconds
  };

  return (
    <button 
      onClick={addToCart}
      disabled={isAdded}
      style={{ backgroundColor: isAdded ? '#10b981' : accentColor }} // Turns Emerald Green when added
      className={`w-full text-white font-bold py-5 px-6 rounded-2xl shadow-lg transition-all duration-300 flex justify-center items-center gap-2 ${
        isAdded ? 'scale-[0.98] shadow-inner' : 'hover:opacity-90 active:scale-[0.99]'
      }`}
    >
      {isAdded ? (
        <>
          <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          Added to Cart
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
}