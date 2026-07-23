import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 border-b pb-4 mb-6 uppercase tracking-tight">
        Privacy Policy
      </h1>
      <div className="prose prose-red text-gray-600 space-y-6">
        <p className="font-semibold text-gray-800">
          Last Updated: July 2026
        </p>
        <p>
          At KFC, we value your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website and ordering platform.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">1. Information We Collect</h2>
        <p>
          We collect information you provide directly, including your name, email address, physical delivery address, phone number, and payment information. We also automatically gather diagnostic device data and cookies for platform stability.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">2. How We Use Your Information</h2>
        <p>
          We use your data to process and deliver orders, manage your account, communicate order updates, and send marketing communications (if you opt-in).
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">3. Sharing Information</h2>
        <p>
          We do not sell your personal data. We share your information only with third-party service providers (like Stripe for payments and email dispatch systems) to fulfill your orders.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">4. Security</h2>
        <p>
          We utilize standard secure sockets layer (SSL) encryption to safeguard transactions. However, no electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </div>
    </div>
  );
}
