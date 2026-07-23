'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { CreditCard, MapPin, Loader2, ShoppingBag, Lock } from 'lucide-react';
import Link from 'next/link';

interface AddressForm {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CardForm {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

interface CheckoutClientProps {
  stripeConfigured: boolean;
}

export function CheckoutClient({ stripeConfigured }: CheckoutClientProps) {
  const router = useRouter();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState<AddressForm>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  const [card, setCard] = useState<CardForm>({ number: '', expiry: '', cvc: '', name: '' });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (field: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleCardChange = (field: keyof CardForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (field === 'number') value = formatCardNumber(value);
    if (field === 'expiry') value = formatExpiry(value);
    if (field === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      if (stripeConfigured) {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, address }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Checkout failed. Please try again.');
          setLoading(false);
          return;
        }

        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe
        }
      } else {
        // Mock payment mode — no real Stripe keys configured.
        // Validates card fields are filled (any values accepted), then creates a real order directly.
        if (card.number.replace(/\s/g, '').length < 12 || card.expiry.length < 4 || card.cvc.length < 3) {
          setError('Please fill in all card details.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/checkout/mock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, address }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Checkout failed. Please try again.');
          setLoading(false);
          return;
        }

        router.push(`/checkout/success?order_id=${data.orderId}`);
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-black text-gray-700">Your cart is empty</h2>
          <Link href="/menu" className="bg-red-600 text-white font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wider inline-block">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Delivery Address */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <h2 className="font-black text-gray-900 text-lg uppercase tracking-wide">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={handleChange('street')}
                      placeholder="123 Main St, Apt 4"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={handleChange('city')}
                      placeholder="New York"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={handleChange('state')}
                      placeholder="NY"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={handleChange('postalCode')}
                      placeholder="10001"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={handleChange('country')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {stripeConfigured ? (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold text-blue-800 mb-0.5">Secure Payment via Stripe</p>
                    <p className="text-blue-600">You&apos;ll be redirected to Stripe&apos;s secure checkout. Use test card <code className="bg-blue-100 px-1 rounded font-mono text-xs">4242 4242 4242 4242</code> with any future expiry and any 3-digit CVC.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                    <CreditCard className="w-5 h-5 text-red-600" />
                    <h2 className="font-black text-gray-900 text-lg uppercase tracking-wide">Payment Details</h2>
                    <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full uppercase tracking-wider">
                      Test Mode
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    No real payment gateway is connected yet — enter any card details below to simulate a successful payment. No charge will occur.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={card.name}
                        onChange={handleCardChange('name')}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.number}
                        onChange={handleCardChange('number')}
                        placeholder="4242 4242 4242 4242"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.expiry}
                        onChange={handleCardChange('expiry')}
                        placeholder="12/29"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        CVC *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.cvc}
                        onChange={handleCardChange('cvc')}
                        placeholder="123"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-4">
                    <Lock className="w-3 h-3" />
                    Any card number, expiry, and CVC will work — this is a local test-mode simulation.
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-black text-gray-900 text-lg uppercase tracking-tight mb-5 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">
                        {item.name} <span className="text-gray-400">×{item.quantity}</span>
                      </span>
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
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
                  <div className="flex justify-between font-black text-gray-900 text-base pt-3 mt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-red-600 text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-black py-4 rounded-xl transition-all shadow-md uppercase tracking-wider text-sm cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Pay ${total.toFixed(2)}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
