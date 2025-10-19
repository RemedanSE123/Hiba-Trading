'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Address, CartItemWithProduct } from '@/types';

interface CheckoutFormProps {
  addresses: Address[];
  cartItems: CartItemWithProduct[];
  totals: {
    subtotal: number;
    shippingFee: number;
    taxAmount: number;
    total: number;
  };
}

export default function CheckoutForm({ addresses, cartItems, totals }: CheckoutFormProps) {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find(addr => addr.isDefault)?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: selectedAddress,
          paymentMethod,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to order confirmation page
        router.push(`/orders/${data.order.id}/confirm`);
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery & Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Address */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
          
          {addresses.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No addresses found. Please add a delivery address to continue.
              </p>
              <a
                href="/profile?tab=addresses"
                className="inline-block mt-2 bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
              >
                Add Address
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {address.fullName}
                      </span>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.streetAddress}
                      {address.unitNumber && `, ${address.unitNumber}`}
                      <br />
                      {address.suburb}, {address.city}
                      <br />
                      {address.province}, {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Bank Transfer</span>
                <p className="text-sm text-gray-600">
                  Pay via EFT. You'll receive banking details after order confirmation.
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Cash on Delivery</span>
                <p className="text-sm text-gray-600">
                  Pay with cash when your order is delivered.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Order Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special instructions for your order..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || addresses.length === 0}
          className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Placing Order...' : `Place Order - ${new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
          }).format(totals.total)}`}
        </button>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>🔒</span>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </form>
    </div>
  );
}