'use client';

import Link from 'next/link';
import { OrderWithDetails } from '@/types';

interface OrderCardProps {
  order: OrderWithDetails;
}

export default function OrderCard({ order }: OrderCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'PAYMENT_VERIFIED':
        return '✅';
      case 'PROCESSING':
        return '📦';
      case 'SHIPPED':
        return '🚚';
      case 'DELIVERED':
        return '🎉';
      case 'CANCELLED':
        return '❌';
      default:
        return '📋';
    }
  };

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href={`/orders/${order.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <span className="text-2xl">{getStatusIcon(order.status)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt)} • {totalItems} item{totalItems !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="flex items-center space-x-2 mb-3">
              {order.orderItems.slice(0, 3).map((item, index) => (
                <div key={item.id} className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.product.images[0] || '/uploads/products/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600">
                  +{order.orderItems.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Status and Total */}
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ')}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tracking Number:</span>
              <span className="font-medium text-gray-900">{order.trackingNumber}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-3">
          <Link
            href={`/orders/${order.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          
          {order.status === 'PENDING' && order.paymentMethod === 'bank_transfer' && (
            <Link
              href={`/orders/${order.id}/confirm`}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded text-center text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Upload Payment
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
}