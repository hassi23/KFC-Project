'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Order {
  id: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    menuItem: { name: string; image: string };
  }>;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  } | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId && !orderId) {
      setError('No order reference found.');
      setLoading(false);
      return;
    }

    const confirmOrder = async () => {
      try {
        const res = orderId
          ? await fetch(`/api/order/${orderId}`)
          : await fetch(`/api/order/confirm?session_id=${sessionId}`);
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
        setOrder(data.order);
        clearCart(); // Clear cart on success
      } catch {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Processing your order…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-black text-gray-800">Order Processing Issue</h2>
          <p className="text-gray-500 text-sm">{error || 'Could not retrieve order details.'}</p>
          <Link href="/menu" className="bg-red-600 text-white font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wider inline-block">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const estimatedTime = new Date(Date.now() + 35 * 60 * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-500 mt-2">Thank you! Your crispy feast is on its way.</p>
        </motion.div>

        {/* Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Order ID banner */}
          <div className="bg-red-700 text-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-bold mb-0.5">Order ID</p>
                <p className="font-mono font-bold text-sm">{order.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-xs font-bold">Est. {estimatedTime}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Items */}
            <div>
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-red-600" /> Items Ordered
              </h3>
              <div className="space-y-3">
                {order.orderItems.map((oi) => (
                  <div key={oi.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={oi.menuItem.image} alt={oi.menuItem.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{oi.menuItem.name}</p>
                      <p className="text-gray-400 text-xs">×{oi.quantity} — ${oi.price.toFixed(2)} each</p>
                    </div>
                    <span className="font-black text-gray-800 text-sm">
                      ${(oi.price * oi.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span><span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-100 mt-2">
                <span>Total Paid</span>
                <span className="text-red-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery address */}
            {order.address && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Delivery To</p>
                <p className="text-sm text-gray-700 font-medium">
                  {order.address.street}, {order.address.city}, {order.address.state} {order.address.postalCode}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mt-8"
        >
          <Link
            href="/orders"
            className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm uppercase tracking-wider"
          >
            View Order History
          </Link>
          <Link
            href="/menu"
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all text-sm uppercase tracking-wider shadow-md"
          >
            Order Again <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
