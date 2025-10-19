'use client';

import Link from 'next/link';
import { ProductWithCategory } from '@/types';

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = product.images || [];
  const mainImage = images[0] || '/uploads/products/placeholder.jpg';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
          
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              Low Stock
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              Save {Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Category */}
          <p className="text-xs text-gray-500 mb-1 truncate">
            {product.category.name}
          </p>
          
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-xs text-gray-600">4.5</span>
              <span className="text-xs text-gray-400">(24)</span>
            </div>
            
            {/* Stock Info */}
            {product.stock > 0 && (
              <span className="text-xs text-gray-500">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}