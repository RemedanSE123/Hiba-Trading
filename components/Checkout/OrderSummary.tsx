'use client';

import { CartItemWithProduct } from '@/types';

interface OrderSummaryProps {
  cartItems: CartItemWithProduct[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
}

export default function OrderSummary({ 
  cartItems, 
  subtotal, 
  shippingFee, 
  taxAmount, 
  total 
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.product.images[0] || '/uploads/products/placeholder.jpg'}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                {item.product.name}
              </h4>
              <p className="text-gray-600 text-sm">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
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
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Estimate */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Delivery Estimate</h4>
        <p className="text-blue-800 text-sm">
          🚚 3-5 business days
        </p>
        <p className="text-blue-800 text-sm mt-1">
          📦 Free shipping on orders over R500
        </p>
      </div>

      {/* Return Policy */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Easy Returns</h4>
        <p className="text-green-800 text-sm">
          ↩️ 30-day return policy
        </p>
        <p className="text-green-800 text-sm mt-1">
          💬 24/7 Customer support
        </p>
      </div>
    </div>
  );
}