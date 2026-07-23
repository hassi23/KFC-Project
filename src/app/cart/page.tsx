'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
          <Link href="/menu" className="flex items-center gap-1 hover:text-red-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Your Cart</span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase">Your cart is empty</h2>
            <p className="text-gray-500">Add some delicious items from our menu!</p>
            <Link
              href="/menu"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full transition-all shadow-md uppercase tracking-wider text-sm"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </h1>
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-red-600 font-black text-sm mt-0.5">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 text-gray-600 rounded-l-lg transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-4 font-black text-gray-800 text-sm min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 text-gray-600 rounded-r-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-gray-900 text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-black text-gray-900 text-lg uppercase tracking-tight mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-4 mt-4 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-red-600 text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-md uppercase tracking-wider text-sm"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/menu"
                  className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3 rounded-xl transition-all text-sm"
                >
                  Add More Items
                </Link>

                {/* Security note */}
                <p className="text-center text-xs text-gray-400 mt-4">
                  🔒 Secured checkout via Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
