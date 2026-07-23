import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 border-b pb-4 mb-6 uppercase tracking-tight">
        Terms of Service
      </h1>
      <div className="prose prose-red text-gray-600 space-y-6">
        <p className="font-semibold text-gray-800">
          Last Updated: July 2026
        </p>
        <p>
          Welcome to KFC! These Terms of Service ("Terms") govern your use of our website, ordering platform, and other services. By visiting or ordering from our site, you agree to these Terms.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">1. Ordering and Payments</h2>
        <p>
          By placing an order, you agree to pay the prices listed, including applicable taxes, delivery charges, and packaging fees. All payments are processed through secure gateways, and you authorize us to charge your selected payment method.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">2. Account Responsibility</h2>
        <p>
          If you create an account, you are responsible for maintaining the confidentiality of your credentials. You agree to notify us immediately of any unauthorized access.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">3. Delivery and Pickups</h2>
        <p>
          We strive to meet estimated delivery and pickup times, but traffic, weather, and operational factors may cause delays. KFC is not liable for delayed orders but will work to resolve issues reasonably.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">4. Intellectual Property</h2>
        <p>
          All trademarks, designs, text, and graphics on this platform are owned by or licensed to KFC. You may not copy, reuse, or modify any assets without prior written consent.
        </p>
      </div>
    </div>
  );
}
