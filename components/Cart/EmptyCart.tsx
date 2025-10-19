'use client';

import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="text-gray-400 text-8xl mb-6">🛒</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/categories"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Categories
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}