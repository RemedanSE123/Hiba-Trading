'use client';

import { useState } from 'react';
import { OrderWithDetails } from '@/types';

interface PaymentInstructionsProps {
  order: OrderWithDetails;
}

export default function PaymentInstructions({ order }: PaymentInstructionsProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('paymentProof', file);
      formData.append('orderId', order.id);

      const response = await fetch('/api/orders/payment-proof', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Payment proof uploaded successfully! We will verify your payment shortly.');
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to upload payment proof');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload payment proof');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Instructions</h2>
      
      <div className="space-y-4">
        {/* Banking Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Banking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Bank:</span>
              <span className="text-blue-900 font-medium">First National Bank (FNB)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Account Name:</span>
              <span className="text-blue-900 font-medium">SA E-Commerce Store</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Account Number:</span>
              <span className="text-blue-900 font-medium">6278 9632 1458</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Branch Code:</span>
              <span className="text-blue-900 font-medium">250655</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Reference:</span>
              <span className="text-blue-900 font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Amount:</span>
              <span className="text-blue-900 font-medium">
                {new Intl.NumberFormat('en-ZA', {
                  style: 'currency',
                  currency: 'ZAR',
                }).format(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Alternative Banks */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Alternative Banks</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Standard Bank:</strong> Acc: 220 987 654, Branch: 051001</p>
            <p><strong>Capitec:</strong> Acc: 156 3254 9876, Branch: 470010</p>
            <p><strong>Nedbank:</strong> Acc: 1236 5874 96, Branch: 198765</p>
          </div>
        </div>

        {/* Upload Proof of Payment */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-3">Upload Proof of Payment</h3>
          <p className="text-orange-800 text-sm mb-3">
            After making the payment, please upload a screenshot or photo of your payment confirmation.
          </p>
          
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="bg-orange-600 text-white py-2 px-4 rounded text-center cursor-pointer hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? 'Uploading...' : 'Choose File'}
              </div>
            </label>
            <span className="text-sm text-gray-600">
              JPEG, PNG (Max 5MB)
            </span>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• Use your order number as payment reference</li>
            <li>• Payments may take 24-48 hours to reflect</li>
            <li>• Orders will be processed after payment verification</li>
            <li>• Contact support if you have any issues: support@hiba.co.za</li>
          </ul>
        </div>
      </div>
    </div>
  );
}