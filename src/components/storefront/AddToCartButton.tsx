'use client';

interface Props {
  product: any;
  storeSlug: string;
  accentColor: string;
}

export default function AddToCartButton({ product, storeSlug, accentColor }: Props) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`) || '[]');
    
    // Check if the item is already in the cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Increase quantity if it already exists
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + (product.quantity || 1);
    } else {
      // Add new item with default or provided quantity
      cart.push({ ...product, quantity: product.quantity || 1 });
    }
    
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
    
    // 🚨 Fire event so the FloatingCart updates instantly!
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <button 
      onClick={addToCart}
      style={{ backgroundColor: accentColor }}
      className="w-full text-white font-bold py-5 px-6 rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-[0.99] flex justify-center items-center gap-2"
    >
      Add to Cart
    </button>
  );
}