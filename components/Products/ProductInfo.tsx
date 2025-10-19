'use client';

import { ProductWithCategory } from '@/types';

interface ProductInfoProps {
  product: ProductWithCategory;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <a 
          href={`/categories/${product.category.slug}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {product.category.name}
        </a>
      </div>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${
                star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {averageRating.toFixed(1)} ({product.reviews.length} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.comparePrice!)}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
              Save {discountPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Features */}
      {product.features.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Key Features:</h3>
          <ul className="space-y-1">
            {product.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shipping Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm text-blue-800">
          <span>🚚</span>
          <span>Free shipping on orders over R500</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-blue-800 mt-1">
          <span>↩️</span>
          <span>30-day return policy</span>
        </div>
      </div>
    </div>
  );
}