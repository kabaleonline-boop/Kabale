'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getStoreConfig } from '@/services/storeService';
import { StoreConfig } from '@/types';

export default function CheckoutPage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [store, setStore] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the exact cart for THIS specific store
    const localCart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`) || '[]');
    setCartItems(localCart);

    // 2. Fetch the store details for the WhatsApp number
    async function fetchStore() {
      const storeData = await getStoreConfig(storeSlug);
      setStore(storeData || null);
      setLoading(false);
    }
    fetchStore();
  }, [storeSlug]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated')); // Update floating icon
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated')); // Update floating icon
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Generate the formatted WhatsApp Order Message
  let checkoutLink = '#';
  if (store?.whatsappNumber && cartItems.length > 0) {
    let cleanNum = store.whatsappNumber.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '256' + cleanNum.substring(1);
    else if (!cleanNum.startsWith('256')) cleanNum = '256' + cleanNum;

    let orderText = `*NEW ORDER FOR ${store.storeName.toUpperCase()}*\n\n`;
    cartItems.forEach((item, index) => {
      orderText += `${index + 1}. ${item.title} (x${item.quantity || 1})\n   UGX ${(item.price * (item.quantity || 1)).toLocaleString()}\n`;
    });
    orderText += `\n*TOTAL: UGX ${totalAmount.toLocaleString()}*\n\nPlease confirm my order!`;

    checkoutLink = `https://wa.me/${cleanNum}?text=${encodeURIComponent(orderText)}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h1>
          <Link href={`/s/${storeSlug}`} className="text-sm font-bold text-slate-500 hover:text-slate-900 bg-slate-200/50 px-4 py-2 rounded-full transition">
            Keep Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-slate-100">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything from {store?.storeName || 'this store'} yet.</p>
            <Link href={`/s/${storeSlug}`} className="inline-block bg-slate-900 text-white font-bold px-8 py-3 rounded-full hover:bg-slate-800 transition">
              Return to Store
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Cart Items List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border-b border-slate-50 last:border-0 items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.images[0] || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm font-black text-slate-500 mt-1">UGX {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-slate-100 rounded-xl p-1">
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:bg-white rounded-lg transition">-</button>
                      <span className="w-8 text-center font-bold text-slate-900 text-sm">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:bg-white rounded-lg transition">+</button>
                    </div>
                    
                    {/* Delete Button */}
                    <button onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <span className="text-slate-500 font-bold">Total Amount</span>
                <span className="text-2xl font-black text-slate-900">UGX {totalAmount.toLocaleString()}</span>
              </div>
              
              <a 
                href={checkoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-5 px-6 rounded-2xl shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] transition-all active:scale-[0.99] text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Complete Order via WhatsApp
              </a>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium">You will pay safely with Cash on Delivery</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}