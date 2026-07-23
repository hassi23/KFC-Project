'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ArrowRight, Star, Flame, Shield, Clock, Gift, Smartphone, MapPin, ClipboardList, Truck, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { MenuItem } from '@prisma/client';

interface HomeClientProps {
  featuredItems: MenuItem[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const testimonials = [
  { name: 'Amara J.', text: 'The 8-piece bucket never disappoints. Ordering online is fast and the tracking actually works!', rating: 5 },
  { name: 'Marcus T.', text: 'Best spicy burger I have had from any delivery app. The app remembers my order too.', rating: 5 },
  { name: 'Priya S.', text: 'Family Feast Box fed all four of us and had leftovers. Great value for the price.', rating: 4 },
];

export function HomeClient({ featuredItems }: HomeClientProps) {
  const { addItem } = useCartStore();
  const [orderMode, setOrderMode] = useState<'delivery' | 'pickup'>('delivery');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-orange-900 text-white min-h-[92vh] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Text side */}
          <div className="space-y-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Legendary Crispy Chicken Since 2026</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex bg-white/10 backdrop-blur border border-white/20 rounded-full p-1 mx-auto md:mx-0"
            >
              {(['delivery', 'pickup'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setOrderMode(mode)}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    orderMode === mode ? 'bg-amber-400 text-gray-900' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {mode === 'delivery' ? <Truck className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  {mode === 'delivery' ? 'Delivery' : 'Pickup'}
                </button>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter uppercase"
            >
              Taste the{' '}
              <span className="relative">
                <span className="text-amber-400">Crown</span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-amber-400/40 rounded-full" />
              </span>
              <br />of Crispy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed mx-auto md:mx-0"
            >
              Hand-breaded, double-dipped, fried to golden perfection. Our secret 11-spice blend has been passed down and perfected for maximum crunch and flavor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link
                href={`/menu?mode=${orderMode}`}
                className="group inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black px-8 py-4 rounded-full transition-all shadow-lg shadow-amber-400/25 uppercase tracking-wider text-sm"
              >
                Order {orderMode === 'delivery' ? 'Delivery' : 'for Pickup'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/menu?category=Deals"
                className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white/80 text-white font-bold px-8 py-4 rounded-full transition-all backdrop-blur-sm uppercase tracking-wider text-sm"
              >
                View Deals
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 justify-center md:justify-start pt-4"
            >
              {[
                { value: '11', label: 'Spices' },
                { value: '6+', label: 'Locations' },
                { value: '50K+', label: 'Fans' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-amber-400">{stat.value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider font-bold">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex justify-center items-center relative"
          >
            <div className="relative w-[480px] h-[480px]">
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-600/30 blur-2xl animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=700&q=80"
                alt="KFC Fried Chicken Bucket"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/10"
              />
              {/* Badge overlay */}
              <div className="absolute bottom-6 left-6 z-20 bg-red-600 text-white rounded-2xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider">Fan Favorite</div>
                    <div className="text-[10px] text-white/70">8-Piece Bucket</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY KFC ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />,
                title: 'Perfectly Crispy',
                desc: 'Double-dipped batter with our 11-spice blend for that iconic crunch.',
              },
              {
                icon: <Clock className="w-6 h-6 text-red-600" />,
                title: 'Always Fresh',
                desc: 'Chicken is hand-breaded fresh every morning — never frozen.',
              },
              {
                icon: <Shield className="w-6 h-6 text-green-600" />,
                title: 'Quality Guaranteed',
                desc: '100% farm-raised chicken with no artificial preservatives.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 items-start p-6 rounded-2xl border border-gray-100 hover:border-red-100 hover:shadow-md transition-all bg-gray-50/50"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED ITEMS ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-red-600 font-bold uppercase tracking-widest text-sm mb-2">⭐ Fan Favorites</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Featured Items
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Our most-loved menu items, hand-picked for taste and value. Add them to your cart now.
            </p>
          </motion.div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-red-100 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-gray-900 text-base leading-snug">{item.name}</h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed flex-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-red-600 font-black text-xl">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() =>
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })
                      }
                      className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-sm uppercase tracking-wider cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 bg-gray-900 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full transition-all shadow-md uppercase tracking-wider text-sm"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Easy As 1-2-3</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ClipboardList className="w-6 h-6" />, step: '01', title: 'Browse & Choose', desc: 'Explore our full menu, filter by category, and pick your favorites.' },
              { icon: <ShoppingBag className="w-6 h-6" />, step: '02', title: 'Add to Cart', desc: 'Customize your order, review your cart, and check out securely.' },
              { icon: <Truck className="w-6 h-6" />, step: '03', title: 'Track & Enjoy', desc: 'Get real-time order status and enjoy hot, crispy chicken delivered fast.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-amber-400">
                  {s.icon}
                </div>
                <div className="text-xs font-black text-red-500 tracking-widest">STEP {s.step}</div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REWARDS ── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-red-700 to-red-900 text-white overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-2xl bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-xl">
            <Gift className="w-10 h-10 text-red-800" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Join KFC Rewards</h2>
            <p className="text-white/80 mt-2 max-w-lg">
              Earn points on every order, unlock free menu items, and get access to member-only deals. Sign up free — it takes less than a minute.
            </p>
          </div>
          <Link
            href="/auth/signin"
            className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-gray-900 font-black px-8 py-4 rounded-full transition-all shadow-lg uppercase tracking-wider text-sm"
          >
            Join Free
          </Link>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black uppercase tracking-tight"
          >
            Family Feast Box — Just $19.99!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/90 text-lg"
          >
            6 pieces of crispy chicken + 4 tenders + large fries + hot gravy. Feed the whole crew.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <Link
              href="/menu?category=Buckets"
              className="inline-flex items-center gap-2 bg-white text-orange-700 font-black px-8 py-3.5 rounded-full hover:bg-orange-50 transition-all shadow-lg uppercase tracking-wider text-sm mt-2"
            >
              Order the Family Feast
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600 font-bold uppercase tracking-widest text-sm mb-2">⭐ What Fans Say</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-10">
            Real Reviews
          </h2>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonials[testimonialIndex].rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed italic">
                  &ldquo;{testimonials[testimonialIndex].text}&rdquo;
                </p>
                <p className="text-gray-400 font-bold text-sm mt-4 uppercase tracking-wider">
                  — {testimonials[testimonialIndex].name}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === testimonialIndex ? 'bg-red-600 w-6' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── APP DOWNLOAD ── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 rounded-2xl bg-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Order Faster With the App</h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Save your favorite orders, track delivery live, and get app-exclusive deals. Available on the web today — mobile apps coming soon.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/menu"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-all text-center"
            >
              Order on Web
            </Link>
            <Link
              href="/locations"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-wider transition-all text-center"
            >
              Find a Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
