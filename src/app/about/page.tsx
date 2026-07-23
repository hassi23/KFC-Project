import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 border-b pb-4 mb-6 uppercase tracking-tight">
          About KFC
        </h1>
        <div className="prose prose-red text-gray-600 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            Founded with a passion for the crunchiest, most flavorful fried chicken, KFC has been serving communities since 2026.
          </p>
          <p>
            Our secret is in our preparation: fresh chicken, hand-breaded daily by our cooks, double-dipped for maximum crispiness, and seasoned with our signature blend of herbs and spices. We don't believe in shortcuts, and we strive for royalty-grade taste in every bite.
          </p>
        </div>
      </div>

      <div id="careers" className="border-t border-gray-200 pt-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 uppercase">Careers</h2>
        <p className="text-gray-600">
          Want to join the Royal Crew? We are always looking for energetic, hard-working cooks, cashiers, and store managers. We offer competitive pay, flexible hours, and great growth opportunities.
        </p>
        <p className="text-sm font-semibold text-red-600">
          Send your resume to careers@kfc-demo.com to apply!
        </p>
      </div>

      <div id="nutrition" className="border-t border-gray-200 pt-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 uppercase">Nutrition & Quality</h2>
        <p className="text-gray-600">
          We use 100% farm-raised chicken, cholesterol-free vegetable oils, and fresh ingredients. We are committed to transparency in our nutrition and allergen profiles. You can request detailed allergen sheets at any of our store registers.
        </p>
      </div>
    </div>
  );
}
