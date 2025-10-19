'use client';

import { useState } from 'react';
import { CartItemWithProduct } from '@/types';
import CartItem from './CartItem';

interface CartItemsProps {
  cartItems: CartItemWithProduct[];
}

export default function CartItems({ cartItems }: CartItemsProps) {
  const [items, setItems] = useState(cartItems);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        setItems(prev => prev.map(item => 
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId }),
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== cartItemId));
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      alert('Failed to remove item from cart');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
}