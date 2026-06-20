// src/app/seller/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStoreOrders, updateOrderStatus } from '@/services/orderService';
import { Order } from '@/types';
import Link from 'next/link';

export default function SellerOrdersPage() {
  const { profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive the store slug exactly as we did in the settings panel
  const storeSlug = profile?.displayName?.toLowerCase().replace(/\s+/g, '-') || 'my-shop';

  useEffect(() => {
    async function fetchOrders() {
      if (!profile) return;
      const fetchedOrders = await getStoreOrders(storeSlug);
      setOrders(fetchedOrders);
      setLoading(false);
    }
    
    if (!authLoading) fetchOrders();
  }, [profile, authLoading, storeSlug]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optimistic UI update
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      alert('Failed to update order status.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper to render the correct badge color based on status
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Handed to Rider': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
            <p className="text-slate-500 text-sm">Process incoming Pay on Delivery orders.</p>
          </div>
          <Link href="/seller/settings" className="text-sm font-semibold text-emerald-600 hover:underline">
            Store Settings
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">No Orders Yet</h3>
            <p className="text-slate-500">When buyers place orders from your store, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                
                {/* Header: Status and Total */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="text-xs text-slate-400 mt-2 font-mono">ID: {order.id.slice(0, 8)}...</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">UGX {order.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 font-semibold">{order.paymentMethod}</div>
                  </div>
                </div>

                <hr className="border-slate-100 mb-4" />

                {/* Buyer Details */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 text-sm">
                  <div className="font-bold text-slate-800 mb-1">{order.buyerName}</div>
                  <div className="text-emerald-700 font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <a href={`tel:${order.buyerPhone}`}>{order.buyerPhone}</a>
                  </div>
                  <div className="text-slate-600 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <div className="text-slate-700">
                        <span className="font-bold mr-2">{item.quantity}x</span> 
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 overflow-x-auto pb-2 scrollbar-hide">
                  {order.status === 'Pending' && (
                    <>
                      <button onClick={() => handleStatusChange(order.id, 'Accepted')} className="flex-1 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-xl text-sm whitespace-nowrap">
                        Accept Order
                      </button>
                      <button onClick={() => handleStatusChange(order.id, 'Rejected')} className="bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-xl text-sm whitespace-nowrap">
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === 'Accepted' && (
                    <button onClick={() => handleStatusChange(order.id, 'Handed to Rider')} className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl text-sm">
                      Mark as Handed to Rider
                    </button>
                  )}
                  {order.status === 'Handed to Rider' && (
                    <>
                      <button onClick={() => handleStatusChange(order.id, 'Delivered')} className="flex-1 bg-slate-900 text-white font-semibold py-2 px-4 rounded-xl text-sm">
                        Confirm Delivered
                      </button>
                      <button onClick={() => handleStatusChange(order.id, 'Rejected')} className="bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-xl text-sm">
                        Rejected at Door
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
