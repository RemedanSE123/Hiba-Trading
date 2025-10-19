'use client';

import { OrderWithDetails } from '@/types';

interface OrderConfirmationProps {
  order: OrderWithDetails;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_VERIFIED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 px-6 py-8 text-center">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-green-700">
          Thank you for your order. We've sent a confirmation email.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-lg font-semibold text-gray-900">
            Order #: {order.orderNumber}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6 space-y-6">
        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product.images[0] || '/uploads/products/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.total)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                {order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (VAT 15%)</span>
              <span className="text-gray-900">{formatPrice(order.taxAmount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {order.deliveryAddress}
            </pre>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
          <p className="text-gray-700 capitalize">
            {order.paymentMethod?.replace('_', ' ') || 'Not specified'}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• We'll notify you when your order ships</li>
            <li>• Estimated delivery: 3-5 business days</li>
            {order.paymentMethod === 'bank_transfer' && (
              <li>• Please complete your payment to process the order</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}