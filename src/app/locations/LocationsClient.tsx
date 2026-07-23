'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Search } from 'lucide-react';
import type { Store } from '@prisma/client';

const StoreMap = dynamic(() => import('./StoreMap').then((m) => m.StoreMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm font-medium">
      Loading map…
    </div>
  ),
});

interface LocationsClientProps {
  stores: Store[];
  cities: string[];
}

export function LocationsClient({ stores, cities }: LocationsClientProps) {
  const [activeCity, setActiveCity] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return stores.filter((store) => {
      const matchesCity = activeCity === 'All' || store.city === activeCity;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        store.city.toLowerCase().includes(q) ||
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q);
      return matchesCity && matchesSearch;
    });
  }, [stores, activeCity, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Store Locations</h1>
          <p className="text-white/75 mt-2 text-base md:text-lg">Find a KFC near you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Filter Row */}
        <div className="flex flex-col md:flex-row gap-5 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, store name, or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition text-sm shadow-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCity === city
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-6">
          Showing {filtered.length} location{filtered.length !== 1 ? 's' : ''}
          {activeCity !== 'All' ? ` in ${activeCity}` : ''}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Store List */}
          <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100"
                >
                  <div className="text-4xl mb-3">📍</div>
                  <h3 className="font-bold text-gray-700">No locations found</h3>
                  <p className="text-gray-400 text-sm mt-1">Try a different city or clear your search.</p>
                  <button
                    onClick={() => { setSearch(''); setActiveCity('All'); }}
                    className="mt-4 text-red-600 font-bold text-sm underline cursor-pointer"
                  >
                    Show all locations
                  </button>
                </motion.div>
              ) : (
                filtered.map((store, i) => (
                  <motion.button
                    key={store.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedStoreId(store.id)}
                    className={`w-full text-left bg-white rounded-2xl p-5 border transition-all cursor-pointer ${
                      selectedStoreId === store.id
                        ? 'border-red-400 shadow-md ring-2 ring-red-100'
                        : 'border-gray-100 hover:border-red-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 text-sm">{store.name}</h3>
                        <p className="text-gray-500 text-xs mt-1">{store.address}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {store.hours}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <StoreMap stores={filtered} activeStoreId={selectedStoreId} />
          </div>
        </div>
      </div>
    </div>
  );
}
