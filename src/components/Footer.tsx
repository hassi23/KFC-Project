'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Share2, MessageCircle, Rss } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Burgers', href: '/menu?category=Burgers' },
    { name: 'Buckets', href: '/menu?category=Buckets' },
    { name: 'Rolls', href: '/menu?category=Rolls' },
    { name: 'Sides', href: '/menu?category=Sides' },
    { name: 'Beverages', href: '/menu?category=Beverages' },
    { name: 'Deals', href: '/menu?category=Deals' },
  ];

  const support = [
    { name: 'Store Locator', href: '/locations' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const company = [
    { name: 'Our Story', href: '/about' },
    { name: 'Careers', href: '/about#careers' },
    { name: 'Nutrition Info', href: '/about#nutrition' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-red-700">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={38} />
            <span className="text-white font-black text-lg tracking-wider uppercase">
              KFC
            </span>
          </Link>
          <p className="text-sm text-gray-450 leading-relaxed">
            Sizzling hot, crunchiest fried chicken, made fresh everyday with our secret blend of herbs and spices. Satisfy your cravings today!
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Share2 className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Rss className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Our Menu
          </h4>
          <ul className="space-y-2 text-sm">
            {categories.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-red-500 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            About Us
          </h4>
          <ul className="space-y-2 text-sm">
            {company.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-red-500 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
            {support.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-red-500 transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="bg-gray-950 py-6 border-t border-gray-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} KFC Chicken. All rights reserved. Designed for fried chicken lovers.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-400">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
