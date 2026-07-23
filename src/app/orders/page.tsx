'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: { name: string; image: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PAID: { label: 'Paid', color: 'text-green-600 bg-green-50 border-green-200', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  PENDING: { label: 'Pending', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
  PREPARING: { label: 'Preparing', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <Package className="w-3.5 h-3.5" /> },
  DELIVERED: { label: 'Delivered', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => { setOrders(data.orders || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">My Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Hello, {session?.user?.name || session?.user?.email}</p>
          </div>
          <Link href="/menu" className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-sm">
            Order Again
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto" />
            <h3 className="text-xl font-black text-gray-600">No orders yet</h3>
            <p className="text-gray-400 text-sm">Place your first order and it'll appear here.</p>
            <Link href="/menu" className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wider">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => {
              const sc = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Order</p>
                      <p className="font-mono font-bold text-gray-900 text-sm">#{order.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1.5 border text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap mb-3">
                      {order.orderItems.slice(0, 4).map((oi) => (
                        <div key={oi.id} className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <img src={oi.menuItem.image} alt={oi.menuItem.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.orderItems.length > 4 && (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {order.orderItems.map((oi) => (
                        <span key={oi.id} className="text-xs text-gray-500">
                          {oi.menuItem.name} ×{oi.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{order.orderItems.reduce((s, oi) => s + oi.quantity, 0)} items</span>
                    <span className="font-black text-red-600 text-base">${order.total.toFixed(2)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
