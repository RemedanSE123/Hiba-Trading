'use client';

import Link from 'next/link';
import { CartItemWithProduct } from '@/types';

interface CartSummaryProps {
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  cartItems: CartItemWithProduct[];
}

export default function CartSummary({ 
  subtotal, 
  shippingFee, 
  taxAmount, 
  total,
  cartItems 
}: CartSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const hasOutOfStockItems = cartItems.some(item => item.product.stock === 0);
  const hasLowStockItems = cartItems.some(item => item.product.stock > 0 && item.product.stock < item.quantity);

  const handleCheckout = () => {
    if (hasOutOfStockItems) {
      alert('Please remove out-of-stock items before proceeding to checkout.');
      return;
    }
    if (hasLowStockItems) {
      alert('Some items in your cart have limited stock. Please adjust quantities before checkout.');
      return;
    }
    window.location.href = '/checkout';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Summary Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (VAT 15%)</span>
          <span className="text-gray-900">{formatPrice(taxAmount)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Notice */}
      {shippingFee === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-800 text-sm">
            🎉 Free shipping on orders over R500!
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">
            Add {formatPrice(500 - subtotal)} more for free shipping!
          </p>
        </div>
      )}

      {/* Warnings */}
      {hasOutOfStockItems && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">
            ⚠️ Some items are out of stock. Please remove them to proceed.
          </p>
        </div>
      )}

      {hasLowStockItems && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <p className="text-orange-800 text-sm">
            ⚠️ Some items have limited stock. Please adjust quantities.
          </p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={hasOutOfStockItems || cartItems.length === 0}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
      >
        Proceed to Checkout
      </button>

      {/* Continue Shopping */}
      <Link
        href="/categories"
        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
      >
        Continue Shopping
      </Link>

      {/* Security Badge */}
      <div className="text-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>🔒</span>
          <span>Secure checkout</span>
        </div>
      </div>
    </div>
  );
}