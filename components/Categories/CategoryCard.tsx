'use client';

import Link from 'next/link';
import { Category } from '@prisma/client';

interface CategoryCardProps {
  category: Category & { productCount?: number };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group">
      <div className="text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3 group-hover:shadow-md transition-all duration-200 group-hover:border-blue-300">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:bg-blue-200 transition-colors">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-10 h-10 object-cover"
              />
            ) : (
              <span>📦</span>
            )}
          </div>
          
          {/* Product Count Badge */}
          {category.productCount !== undefined && category.productCount > 0 && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {category.productCount}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 mb-1">
            {category.name}
          </h3>
          {category.productCount !== undefined && (
            <p className="text-xs text-gray-500">
              {category.productCount} product{category.productCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}