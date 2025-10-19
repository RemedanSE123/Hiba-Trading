'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductWithCategory } from '@/types';

interface ProductActionsProps {
  product: ProductWithCategory;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to sign in
      window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href);
      return;
    }

    setIsAddingToCart(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (response.ok) {
        // Show success message
        alert('Product added to cart!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      alert('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href);
      return;
    }

    // Add to cart and redirect to checkout
    await handleAddToCart();
    window.location.href = '/cart';
  };

  const canAddToCart = product.stock > 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            disabled={quantity <= 1}
            className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
          >
            -
          </button>
          <span className="px-4 py-2 text-gray-900 font-medium min-w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
            disabled={quantity >= product.stock}
            className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {product.stock} available
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleAddToCart}
          disabled={!canAddToCart || isAddingToCart}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={!canAddToCart}
          className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Buy Now
        </button>
      </div>

      {/* Additional Actions */}
      <div className="flex space-x-4 pt-4 border-t border-gray-200">
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-700">
          <span>❤️</span>
          <span>Add to Wishlist</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-700">
          <span>📤</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}