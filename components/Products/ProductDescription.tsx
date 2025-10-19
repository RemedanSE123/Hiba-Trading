'use client';

import { useState } from 'react';
import { ProductWithCategory } from '@/types';

interface ProductDescriptionProps {
  product: ProductWithCategory;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', name: 'Description' },
    { id: 'features', name: 'Features' },
    { id: 'specifications', name: 'Specifications' },
    { id: 'reviews', name: `Reviews (${product.reviews.length})` },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>
        );
      
      case 'features':
        return (
          <div className="space-y-3">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        );
      
      case 'specifications':
        return (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">SKU</span>
              <span className="text-gray-900 font-medium">{product.sku}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Category</span>
              <span className="text-gray-900 font-medium">{product.category.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Weight</span>
              <span className="text-gray-900 font-medium">
                {product.weight ? `${product.weight} kg` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Stock</span>
              <span className="text-gray-900 font-medium">{product.stock} units</span>
            </div>
          </div>
        );
      
      case 'reviews':
        return (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {review.user.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user.name || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span className="text-gray-600 text-sm">
                          {review.user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {review.user.name || 'Anonymous'}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {review.title && (
                        <h5 className="font-medium text-gray-900 mb-1">
                          {review.title}
                        </h5>
                      )}
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                      {review.isVerified && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}