'use client';

import { useState } from 'react';
import { ProductWithCategory } from '@/types';

interface ProductImagesProps {
  product: ProductWithCategory;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.images.length > 0 ? product.images : ['/uploads/products/placeholder.jpg'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${
          product.stock > 10 ? 'text-green-600' : 
          product.stock > 0 ? 'text-orange-600' : 'text-red-600'
        }`}>
          {product.stock > 10 ? 'In Stock' : 
           product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
        </span>
        <span className="text-gray-500">SKU: {product.sku}</span>
      </div>
    </div>
  );
}