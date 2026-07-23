'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Plus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { MenuItem } from '@prisma/client';

interface MenuClientProps {
  menuItems: MenuItem[];
  categories: string[];
}

export function MenuClient({ menuItems, categories }: MenuClientProps) {
  const searchParams = useSearchParams();
  const { addItem, items } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Pre-select category from URL query
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams, categories]);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const getCartQty = (id: string) => items.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Our Menu</h1>
          <p className="text-white/75 mt-2 text-base md:text-lg">Fresh, hand-breaded, made to order.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Filter Row */}
        <div className="flex flex-col md:flex-row gap-5 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition text-sm shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items count */}
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-6">
          Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-5xl mb-4">🍗</div>
              <h3 className="font-bold text-gray-700 text-xl">No items found</h3>
              <p className="text-gray-400 text-sm mt-1">Try a different category or clear your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-4 text-red-600 font-bold text-sm underline cursor-pointer"
              >
                Show all items
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((item, i) => {
                const cartQty = getCartQty(item.id);
                const justAdded = addedId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-red-100 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      {cartQty > 0 && (
                        <span className="absolute top-2 right-2 bg-gray-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                          ×{cartQty} in cart
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-gray-900 text-sm leading-snug">{item.name}</h3>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed flex-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-red-600 font-black text-lg">${item.price.toFixed(2)}</span>
                        <button
                          id={`add-to-cart-${item.id}`}
                          onClick={() => handleAddToCart(item)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all cursor-pointer ${
                            justAdded
                              ? 'bg-green-500 text-white scale-95'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {justAdded ? (
                            <>✓ Added</>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
