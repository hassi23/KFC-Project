'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from './CartDrawer';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export function Navbar() {
  const { data: session } = useSession();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const navLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Deals', href: '/menu?category=Deals' },
    { label: 'Locations', href: '/locations' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={44} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-red-700 font-black text-xl tracking-wider leading-none uppercase">
                KFC
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Fried Chicken
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* Auth section */}
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 text-gray-700 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition-colors"
                >
                  <User className="w-4 h-4 text-red-600" />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-full transition-all text-xs uppercase tracking-wider"
              >
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 transition-all cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[10px] font-black w-5.5 h-5.5 flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Cart Icon (Mobile) */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[10px] font-black w-5.5 h-5.5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-3 pb-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-red-600 font-bold text-sm uppercase tracking-wider py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
                  {session ? (
                    <>
                      <div className="text-sm font-semibold text-gray-600">
                        Hello, {session.user?.name || session.user?.email}
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-gray-700 hover:text-red-600 font-bold text-sm uppercase tracking-wider py-1"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="text-left text-gray-500 hover:text-red-600 font-bold text-sm uppercase tracking-wider py-1 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-full text-xs uppercase tracking-wider"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
