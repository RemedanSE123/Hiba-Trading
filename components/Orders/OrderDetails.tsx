'use client';

import { OrderWithDetails } from '@/types';

interface OrderDetailsProps {
  order: OrderWithDetails;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getStatusSteps = () => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', description: 'Your order has been received' },
      { status: 'PAYMENT_VERIFIED', label: 'Payment Verified', description: 'Payment has been confirmed' },
      { status: 'PROCESSING', label: 'Processing', description: 'Preparing your order' },
      { status: 'SHIPPED', label: 'Shipped', description: 'Your order is on the way' },
      { status: 'DELIVERED', label: 'Delivered', description: 'Order delivered successfully' },
    ];

    const currentIndex = steps.findIndex(step => step.status === order.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-600 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
        <div className="space-y-4">
          {statusSteps.map((step, index) => (
            <div key={step.status} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed 
                  ? 'bg-green-600 text-white' 
                  : step.current
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                <p className="text-sm text-gray-600">{step.description}</p>
                
                {/* Show dates for completed steps */}
                {step.status === 'PENDING' && order.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                )}
                {step.status === 'PAYMENT_VERIFIED' && order.paidAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.paidAt)}
                  </p>
                )}
                {step.status === 'SHIPPED' && order.shippedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.shippedAt)}
                  </p>
                )}
                {step.status === 'DELIVERED' && order.deliveredAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.deliveredAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images[0] || '/uploads/products/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice(item.total)}</p>
                <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (VAT 15%)</span>
            <span className="text-gray-900">{formatPrice(order.taxAmount)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {order.deliveryAddress}
          </pre>
        </div>
        {order.trackingNumber && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Tracking Number:</p>
            <p className="font-medium text-gray-900">{order.trackingNumber}</p>
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="text-gray-900 capitalize">
              {order.paymentMethod?.replace('_', ' ') || 'Not specified'}
            </span>
          </div>
          {order.paymentProof && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Payment Proof:</p>
              <a
                href={order.paymentProof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                View Uploaded Proof
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
          <p className="text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Support Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 text-sm">
          If you have any questions about your order, please contact our customer support team.
        </p>
        <div className="mt-3 space-y-1 text-sm text-blue-800">
          <p>📧 Email: support@hiba.co.za</p>
          <p>📞 Phone: +27 11 123 4567</p>
          <p>🕒 Hours: Mon-Fri, 8:00-17:00</p>
        </div>
      </div>
    </div>
  );
}