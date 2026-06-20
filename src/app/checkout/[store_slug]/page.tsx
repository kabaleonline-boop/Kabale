// src/app/checkout/[store_slug]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createPODOrder } from '@/services/orderService';

export default function CheckoutPage({ params }: { params: { store_slug: string } }) {
  const { profile } = useAuth();
  const { carts, getCartTotal, clearCart } = useCart();
  const router = useRouter();

  const storeCart = carts[params.store_slug] || [];
  const cartTotal = getCartTotal(params.store_slug);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return alert('Please log in to place an order.');
    if (storeCart.length === 0) return alert('Your cart is empty.');

    setLoading(true);
    try {
      const orderId = await createPODOrder({
        storeId: params.store_slug,
        buyerId: profile.uid,
        buyerName: profile.displayName || profile.email || 'Guest',
        buyerPhone: phone,
        deliveryAddress: address,
        items: storeCart,
        totalAmount: cartTotal,
        paymentMethod: 'POD',
      });

      // Clear the isolated cart after successful order
      clearCart(params.store_slug);
      alert(`Order placed successfully! Order ID: ${orderId}`);
      router.push(`/buyer/orders`);
    } catch (err) {
      alert('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (storeCart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Cart is Empty</h2>
          <p className="text-slate-500 mb-6">You have no items from this store in your cart.</p>
          <button onClick={() => router.back()} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Checkout Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Pay on Delivery Checkout</h1>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Active Phone Number</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                placeholder="07..."
              />
              <p className="text-xs text-slate-500 mt-1">The delivery rider will call this number.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Delivery Address / Location</label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-emerald-600"
                placeholder="e.g., Kabale University, Main Gate..."
              />
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-sm mb-6">
              <span className="font-bold block mb-1">Payment Protocol</span>
              You will only pay cash or mobile money directly to the verified rider when your items arrive. Do not send money beforehand.
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Order & Request Rider'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {storeCart.map((item) => (
              <div key={item.productId} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-slate-400">
                    {item.quantity}x
                  </div>
                  <span className="text-slate-700 font-medium line-clamp-1">{item.title}</span>
                </div>
                <span className="font-semibold text-slate-900 text-right shrink-0 ml-2">
                  UGX {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <hr className="border-slate-300 mb-4" />
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-slate-800">Total to Pay</span>
            <span className="font-black text-emerald-600">UGX {cartTotal.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
