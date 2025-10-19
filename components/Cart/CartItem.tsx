'use client';

import Link from 'next/link';
import { CartItemWithProduct } from '@/types';

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const mainImage = item.product.images[0] || '/uploads/products/placeholder.jpg';
  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mainImage}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link 
            href={`/products/${item.product.slug}`}
            className="hover:text-blue-600"
          >
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {item.product.name}
            </h3>
          </Link>
          
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {formatPrice(item.product.price)}
          </p>

          {/* Stock Status */}
          <p className={`text-sm mt-1 ${
            item.product.stock > 10 ? 'text-green-600' : 
            item.product.stock > 0 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {item.product.stock > 10 ? 'In Stock' : 
             item.product.stock > 0 ? `Only ${item.product.stock} left` : 'Out of Stock'}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-3 py-1 text-gray-900 font-medium min-w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  className="px-3 py-1 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}