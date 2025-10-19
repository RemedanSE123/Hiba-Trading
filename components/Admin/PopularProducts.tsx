'use client';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  salesCount: number;
  category: {
    name: string;
  };
}

interface PopularProductsProps {
  products: Product[];
}

export default function PopularProducts({ products }: PopularProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Popular Products
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Best selling items
          </p>
        </div>
        <span className="text-2xl">🔥</span>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-100 text-yellow-800' :
              index === 1 ? 'bg-gray-100 text-gray-800' :
              index === 2 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              #{index + 1}
            </div>

            {/* Product Image */}
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.images[0] || '/uploads/products/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {product.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.category.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {product.salesCount} sales
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            {/* Sales Trend */}
            <div className="text-right">
              <div className="flex items-center justify-end space-x-1 text-green-600 dark:text-green-400">
                <span>↑</span>
                <span className="text-sm font-medium">
                  {Math.round((Math.random() * 50) + 10)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
          View All Products
        </button>
      </div>
    </div>
  );
}